import Actor, { ActorParams } from "./Actor";
import Entity from "./Entity";
import Door from "./Door";
import Chest from "./Chest";
import { types } from "../utils/constants";

class Player extends Actor {
  public artifact: Blackguard.Item | null;
  public weapon: Blackguard.Weapon | null;
  public armor: Blackguard.Armor | null;

  constructor(params: ActorParams) {
    super(params);

    this.sprite = "PLAYER";
    this.type = types.PLAYER;
    this.onCollide = this.checkCollision;
    this.setDepth(1);
    this.enable();

    this.artifact = null;
    this.weapon = null;
    this.armor = null;
  }

  public enable(): void {
    this.scene.input.keyboard.addListener("keydown_UP", () => this.moveNorth());
    this.scene.input.keyboard.addListener("keydown_DOWN", () =>
      this.moveSouth(),
    );
    this.scene.input.keyboard.addListener("keydown_LEFT", () =>
      this.moveWest(),
    );
    this.scene.input.keyboard.addListener("keydown_RIGHT", () =>
      this.moveEast(),
    );
  }

  public disable(): void {
    this.scene.input.keyboard.removeListener("keydown_UP");
    this.scene.input.keyboard.removeListener("keydown_DOWN");
    this.scene.input.keyboard.removeListener("keydown_LEFT");
    this.scene.input.keyboard.removeListener("keydown_RIGHT");
  }

  public collect(): void {
    console.log("There’s nothing here…");
  }

  private checkCollision(other: Entity): void {
    switch (other.type) {
      case types.MONSTER:
        this.dungeon.fight(this, other as Actor);
        break;

      case types.DOOR:
        const door = other as Door;
        door.open();
        break;

      case types.CHEST:
        const chest = other as Chest;
        chest.open();
        break;

      default:
        break;
    }
  }
}

export default Player;
