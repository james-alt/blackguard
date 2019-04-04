import * as Phaser from "phaser";
import Button from "../ui/Button";
import { Dungeon } from "./DungeonScene";
import { keys } from "../utils/constants";

class MenuScene extends Phaser.Scene {
  private itemShown: string = "artifact";
  private dungeon: Dungeon | undefined;
  private menuTitle: Phaser.GameObjects.Text | undefined;
  private itemImage: Phaser.GameObjects.Sprite | undefined;
  private itemName: Phaser.GameObjects.Text | undefined;
  private itemDescription: Phaser.GameObjects.Text | undefined;
  private x: number = 0;

  constructor() {
    super({ key: keys.SCENE_MENU });
  }

  public create(): void {
    this.cameras.main
      .setZoom(3)
      .setSize(288, 288)
      .setBackgroundColor(0x444444)
      .setPosition(window.innerWidth - 288, 260)
      .setOrigin(0, 0);

    new Button({
      x: 0,
      y: 0,
      scene: this,
      frame: 99,
      eventName: "switchMenu",
      eventData: { name: "artifact" },
    });
    new Button({
      x: 16,
      y: 0,
      scene: this,
      frame: 97,
      eventName: "switchMenu",
      eventData: { name: "weapon" },
    });
    new Button({
      x: 32,
      y: 0,
      scene: this,
      frame: 98,
      eventName: "switchMenu",
      eventData: { name: "armor" },
    });
    new Button({
      x: 48,
      y: 0,
      scene: this,
      frame: 102,
      eventName: "null",
    });
    new Button({
      x: 64,
      y: 0,
      scene: this,
      frame: 101,
      eventName: "null",
    });
    new Button({
      x: 80,
      y: 0,
      scene: this,
      frame: 106,
      eventName: "null",
    });

    this.dungeon = this.scene.get(keys.SCENE_DUNGEON) as Dungeon;

    this.itemImage = this.add
      .sprite(4, 20, keys.SPRITES_ITEMS, -1)
      .setVisible(false)
      .setScale(1.5, 1.5)
      .setOrigin(0, 0);

    this.menuTitle = this.add
      .text(30, 26, "", {
        fontSize: 9,
        fontFamily: "Skullboy",
      })
      .setOrigin(0, 0)
      .setWordWrapWidth(70)
      .setResolution(3);

    this.itemName = this.add
      .text(8, 48, "", {
        fontSize: 6,
        fontFamily: "Magic Book",
      })
      .setOrigin(0, 0)
      .setWordWrapWidth(70)
      .setResolution(3);

    this.itemDescription = this.add
      .text(8, 59, "", {
        fontSize: 7,
        fontFamily: "Magic Book",
        color: "#ccc",
      })
      .setWordWrapWidth(70)
      .setOrigin(0, 0)
      .setResolution(3);

    this.events.addListener("switchMenu", (data: { name: string }) => {
      console.log(data);
      this.itemShown = data.name;
    });
  }

  public update(): void {
    if (
      !this.dungeon ||
      !this.menuTitle ||
      !this.itemName ||
      !this.itemImage ||
      !this.itemDescription ||
      !this.dungeon.player
    )
      return;

    const { player } = this.dungeon;

    switch (this.itemShown) {
      case "artifact":
        if (!player.artifact) break;
        if (this.x === 0) {
          console.log(player.artifact);
          this.x = 1;
        }
        this.menuTitle.text = "ARTIFACT";
        this.itemImage.setFrame(player.artifact.spriteIndex).setVisible(true);
        this.itemName.text = player.artifact.name;
        this.itemDescription.text = player.artifact.description;
        break;

      case "weapon":
        if (!player.weapon) break;
        this.menuTitle.text = "WEAPON";
        this.itemImage.setFrame(player.weapon.spriteIndex).setVisible(true);
        this.itemName.text = player.weapon.name;
        this.itemDescription.text = player.weapon.description;
        break;

      case "armor":
        if (!player.armor) break;
        this.menuTitle.text = "ARMOR";
        this.itemImage.setFrame(player.armor.spriteIndex).setVisible(true);
        this.itemName.text = player.armor.name;
        this.itemDescription.text = player.armor.description;
        break;

      default:
        break;
    }
  }
}

export default MenuScene;
