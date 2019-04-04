declare namespace Blackguard {
  interface TiledObject {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    properties: { [key: number]: { name: string; value: number | string } };
  }

  interface Sprite {
    x: number;
    y: number;
    scene: Phaser.Scene;
    texture?: string;
    frame?: number;
  }

  interface Item {
    name: string;
    type: string;
    description: string;
    spriteIndex: number;
    effects?: { [key: string]: number }[];
  }

  interface Weapon extends Item {
    damageDice: string;
  }

  interface Armor extends Item {
    armorClass: number;
  }
}

declare module "tmx-parser";
declare module "fantasy-names";
