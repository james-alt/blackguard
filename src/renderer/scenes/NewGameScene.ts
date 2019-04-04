import * as Phaser from "phaser";
import generateFantasyName from "fantasy-names";
import { keys, API_URL } from "../utils/constants";

class NewGameScene extends Phaser.Scene {
  public playerSpriteIndex: number = 0;
  public playerName: string = "New Player";
  public portraitImage: Phaser.GameObjects.Sprite | undefined;
  public nameText: Phaser.GameObjects.Text | undefined;
  public dungeonId: string = "";

  constructor() {
    super({ key: keys.SCENE_NEW_GAME });
    this.generatePlayer();
  }

  public preload() {
    this.load.spritesheet(
      keys.SPRITES_PORTRAITS,
      "https://s3.amazonaws.com/blackguard/portraits.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
  }

  public create(): void {
    this.nameText = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2 - 160,
      "NEW GAME",
      {
        fontFamily: "Skullboy",
        fontSize: 48,
      },
    );
    this.nameText.x = window.innerWidth / 2 - this.nameText.width / 2;

    this.portraitImage = this.add
      .sprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        keys.SPRITES_PORTRAITS,
        this.playerSpriteIndex,
      )
      .setScale(4)
      .setInteractive();
    this.portraitImage.on("pointerup", () => this.generatePlayer());

    this.nameText = this.add.text(
      window.innerWidth / 2,
      window.innerHeight / 2 + 128,
      this.playerName,
      {
        fontFamily: "Magic Book",
        fontSize: 32,
      },
    );

    this.input.keyboard.on("keydown-P", () => this.startGame());
  }

  public getPlayerSelections() {
    return { name: this.playerName, spriteIndex: this.playerSpriteIndex };
  }

  public getDungeonId() {
    return this.dungeonId;
  }

  public update(): void {
    if (this.portraitImage) this.portraitImage.setFrame(this.playerSpriteIndex);
    if (this.nameText) {
      this.nameText.setText(this.playerName);
      this.nameText.x = window.innerWidth / 2 - this.nameText.width / 2;
    }
  }

  private generatePlayer(): void {
    this.playerSpriteIndex = Math.floor(Math.random() * 119);
    this.playerName = generateFantasyName("dungeon_and_dragons")[0];
  }

  private async startGame() {
    const query = `
      mutation {
        createDungeon(player: {
          name: "${this.playerName}",
          spriteIndex: ${this.playerSpriteIndex}
        }) {
          id
        }
      }
    `;

    fetch(API_URL, { method: "POST", body: query })
      .then(res => res.json())
      .then(json => {
        this.dungeonId = json.data.createDungeon.id;
        this.scene.start(keys.SCENE_DUNGEON);
        this.scene.start(keys.SCENE_MENU);
      })
      .catch(error => console.log(error));
  }
}

export default NewGameScene;
