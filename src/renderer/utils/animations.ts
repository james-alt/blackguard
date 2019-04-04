import * as Phaser from "phaser";
import { keys, ANIM_FRAMERATE } from "./constants";

function loadAnimations(scene: Phaser.Scene): void {
  createAnimations(scene, "PLAYER", 0);
  createAnimations(scene, "SKELETON", 128);
  createAnimations(scene, "SKELETON_GUARD", 132);
  createAnimations(scene, "SPIRIT", 196);
  createAnimations(scene, "LICH", 140);
  createAnimations(scene, "GOBLIN", 96);
  createAnimations(scene, "GOBLIN_MAGE", 100);
  createAnimations(scene, "GOBLIN_GUARD", 104);
  createAnimations(scene, "DRACULA", 160);
  createAnimations(scene, "WATER_ELEMENTAL", 204);
  createAnimations(scene, "BEHOLDER", 168);
  createAnimations(scene, "FAERIE", 200);
}

function createAnimations(
  scene: Phaser.Scene,
  name: string,
  start: number,
): void {
  let frame = start;
  createAnimation(scene, keys[`ANIM_${name}_EAST`], [frame, frame + 16]);
  frame++;
  createAnimation(scene, keys[`ANIM_${name}_SOUTH`], [frame, frame + 16]);
  frame++;
  createAnimation(scene, keys[`ANIM_${name}_NORTH`], [frame, frame + 16]);
  frame++;
  createAnimation(scene, keys[`ANIM_${name}_WEST`], [frame, frame + 16]);
}

function createAnimation(
  scene: Phaser.Scene,
  key: string,
  frames: number[],
): void {
  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers(keys.SPRITES_MONSTERS, { frames }),
    repeat: -1,
    frameRate: ANIM_FRAMERATE,
  });
}

export default loadAnimations;
