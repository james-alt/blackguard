import * as Phaser from "phaser";
import { Dungeon } from "../scenes/DungeonScene";
import { keys } from "../utils/constants";

export interface EntityParams {
  x: number;
  y: number;
  dungeon: Dungeon;
  texture?: string;
  frame?: number;
  type?: string;
  name?: string;
  blocking?: boolean;
}

class Entity extends Phaser.GameObjects.Sprite {
  public dungeon: Dungeon;
  public type: string;
  public name: string;
  public blocking: boolean;

  constructor(params: EntityParams) {
    const { x, y, dungeon, frame, type, name, blocking } = params;
    const texture = params.texture ? params.texture : keys.SPRITES_DUNGEON;

    super(dungeon, x, y, texture, frame);

    this.dungeon = dungeon;
    this.displayOriginX = 0;
    this.displayOriginY = 0;
    this.scene.add.existing(this);

    this.type = type ? type : "generic";
    this.name = name ? name : "unknown";
    this.blocking = blocking ? blocking : false;

    this.setInteractive();
    this.on("pointerdown", () => console.log(this.name, this));
  }
}

export default Entity;
