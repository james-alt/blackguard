import * as Phaser from "phaser";
import { keys } from "../utils/constants";

export interface ButtonProps {
  scene: Phaser.Scene;
  x: number;
  y: number;
  frame?: number;
  eventName: string;
  eventData?: object;
}

class Button extends Phaser.GameObjects.Sprite {
  constructor(params: ButtonProps) {
    const { scene, x, y, frame, eventName, eventData } = params;

    super(scene, x, y, keys.SPRITES_INTERFACE, frame);

    this.displayOriginX = 0;
    this.displayOriginY = 0;
    this.scene.add.existing(this);

    this.setInteractive();

    this.on("pointerdown", () => this.scene.events.emit(eventName, eventData));
  }
}

export default Button;
