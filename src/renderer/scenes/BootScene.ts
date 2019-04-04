import * as Phaser from "phaser";
import WebFont from "webfontloader";
import { keys } from "../utils/constants";

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: keys.SCENE_BOOT });
  }

  preload() {
    this.load.on("complete", () => {
      this.scene.start(keys.SCENE_NEW_GAME);
    });

    this.load.image(keys.TILES_DUNGEON, this.remoteUrl("world.png"));

    this.load.tilemapTiledJSON(
      keys.MAP_DUNGEON,
      this.localUrl("tiled/dungeon.json"),
    );

    this.load.spritesheet(keys.SPRITES_DUNGEON, this.remoteUrl("world.png"), {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(
      keys.SPRITES_MONSTERS,
      this.remoteUrl("monsters.png"),
      { frameWidth: 16, frameHeight: 16 },
    );

    this.load.spritesheet(
      keys.SPRITES_INTERFACE,
      this.remoteUrl("interface.png"),
      { frameWidth: 16, frameHeight: 16 },
    );

    this.load.spritesheet(keys.SPRITES_ITEMS, this.remoteUrl("items.png"), {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet(
      keys.SPRITES_PORTRAITS,
      this.remoteUrl("portraits.png"),
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    WebFont.load({
      custom: {
        families: ["Skullboy", "Magic Book"],
        urls: [this.localUrl("fonts/fonts.css")],
      },
    });
  }

  public create(): void {}

  private localUrl(filepath: string): string {
    return `http://localhost:3000/${filepath}`;
  }

  private remoteUrl(filename: string): string {
    return `https://s3.amazonaws.com/blackguard/${filename}`;
  }
}

export default BootScene;
