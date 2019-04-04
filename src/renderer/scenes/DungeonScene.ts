import * as Phaser from "phaser";
import * as ROT from "rot-js";
import QRCode from "qrcode";
import Entity from "../entities/Entity";
import Actor from "../entities/Actor";
import Monster from "../entities/Monster";
import Player from "../entities/Player";
import Door from "../entities/Door";
import Chest from "../entities/Chest";
import loadAnimations from "../utils/animations";
import { keys, types } from "../utils/constants";

export interface TiledObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  properties: { name: string; value: string }[];
}

// type item = Blackguard.Item | Blackguard.Weapon | Blackguard.Armor;

export interface Dungeon extends Phaser.Scene {
  engine: ROT.Engine;
  map: Phaser.Tilemaps.Tilemap | undefined;
  tileset: Phaser.Tilemaps.Tileset | undefined;
  layers: Phaser.Tilemaps.StaticTilemapLayer[];
  entities: Entity[];
  text: Phaser.GameObjects.Text | undefined;
  inventory: Phaser.Scene | undefined;
  player: Player | undefined;
  newGame: any;
}

class DungeonScene extends Phaser.Scene {
  public engine: ROT.Engine;
  public map: Phaser.Tilemaps.Tilemap | undefined;
  public tileset: Phaser.Tilemaps.Tileset | undefined;
  public layers: Phaser.Tilemaps.StaticTilemapLayer[];
  public entities: Entity[];
  public text: Phaser.GameObjects.Text | undefined;
  public inventory: Phaser.Scene | undefined;
  public player: Player | undefined;
  public newGame: any;

  constructor() {
    super({ key: keys.SCENE_DUNGEON });

    const scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();

    this.layers = [];
    this.entities = [];
  }

  public create(): void {
    this.newGame = this.scene.get(keys.SCENE_NEW_GAME);

    QRCode.toDataURL(
      `https://create.activategame.dev/${this.newGame.dungeonId}/item`,
      { width: 288 },
      (err, url) => {
        if (err) throw err;
        const img = document.getElementById("qr-code") as HTMLImageElement;
        img.src = url;
      },
    );

    loadAnimations(this);
    const map = this.createMap();
    const player = this.addPlayer();
    const camera = this.cameras.main;

    this.inventory = this.scene.get(keys.SCENE_INVENTORY);

    camera
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .setBackgroundColor(0x222222)
      .setSize(window.innerWidth - 288, window.innerHeight)
      .setZoom(3);
    if (player) camera.startFollow(player);

    const minimap = this.cameras
      .add(window.innerWidth - 288, 0, 288, 260)
      .setZoom(0.2)
      .setBackgroundColor(0x111111);
    if (player) minimap.startFollow(player);
  }

  public update(): void {
    this.entities.forEach(entity => entity.update());

    if (this.text) {
      const text = this.items.map(item => item.name).join("\n");
      this.text.text = `Items:\n${text}`;
    }
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  public removeEntity(entityToRemove: Entity): void {
    this.entities = this.entities.filter(entity => entity !== entityToRemove);
  }

  public revealRoom(id: string): void {
    if (!this.map || !this.tileset) return;
    this.layers.push(this.map.createStaticLayer(id, this.tileset, 0, 0));
  }

  public fight(attacker: Actor, defender: Actor): void {
    attacker.attack(defender);
    defender.attack(attacker);
  }

  public getPlayer(): Player | undefined {
    return this.player;
  }

  private createMap(): Phaser.Tilemaps.Tilemap {
    this.map = this.make.tilemap({ key: keys.MAP_DUNGEON });
    this.tileset = this.map.addTilesetImage("world", keys.TILES_DUNGEON);
    this.layers.push(this.map.createStaticLayer("map", this.tileset, 0, 0));
    this.layers.push(this.map.createStaticLayer("props", this.tileset, 0, 0));
    this.createDoors();
    this.createChests();
    this.createMonsters();

    return this.map;
  }

  private createDoors(): void {
    if (!this || !this.map) return;

    const layer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer("doors");

    layer.objects.forEach(obj => {
      const door = (obj as any) as TiledObject;

      let toRoom = "";
      for (let prop of door.properties) {
        if (prop.name === "to") {
          toRoom = prop.value;
          break;
        }
      }

      this.entities.push(
        new Door({
          x: door.x,
          y: door.y - 16,
          dungeon: this,
          toRoom,
        }),
      );
    });
  }

  private createChests(): void {
    if (!this || !this.map) return;

    const layer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer(
      "chests",
    );

    layer.objects.forEach(obj => {
      const { x, y } = (obj as any) as TiledObject;
      this.entities.push(new Chest({ x: x, y: y, dungeon: this }));
    });
  }

  private createMonsters(): void {
    if (!this || !this.map) return;

    const layer: Phaser.Tilemaps.ObjectLayer = this.map.getObjectLayer(
      "monsters",
    );

    layer.objects.forEach(obj => {
      const monsterObj = obj as any;

      let sprite = "";
      for (let prop of monsterObj.properties) {
        if (prop.name === "name") {
          sprite = prop.value.toUpperCase();
          break;
        }
      }

      const monster = new Monster({
        x: monsterObj.x,
        y: monsterObj.y,
        dungeon: this,
        texture: keys.SPRITES_MONSTERS,
        frame: monsterObj.spriteIndex,
        type: types.MONSTER,
        name: "monster",
        sprite,
        blocking: true,
      });
      this.addEntity(monster);
      this.engine._scheduler.add(monster, true);
    });
  }

  private addPlayer(): Player | void {
    if (!this.map) return;

    const playerStart = (this.map.getObjectLayer("playerStart")
      .objects[0] as any) as { x: number; y: number };

    const player = new Player({
      x: playerStart.x,
      y: playerStart.y,
      dungeon: this,
      name: this.newGame.playerName,
    });
    this.engine._scheduler.add(player, true);
    this.addEntity(player);
    this.player = player;

    return player;
  }
}

export default DungeonScene;
