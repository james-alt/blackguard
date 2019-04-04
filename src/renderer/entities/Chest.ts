import Entity, { EntityParams } from "./Entity";
import { types, API_URL } from "../utils/constants";

class Chest extends Entity {
  public opened = false;

  constructor(params: EntityParams) {
    super(params);
    this.name = "chest";
    this.dungeon = params.dungeon;
    this.blocking = true;
    this.type = types.CHEST;

    this.setFrame(194);
  }

  public async open() {
    const { dungeon } = this;

    if (!dungeon || !dungeon.player) return;

    const {
      data: { discoverItem: item },
    } = await this.discoverItem();

    if (!item) {
      return console.log("It seems to be magically sealed…");
    }

    const { player } = dungeon;

    console.log(`You found ${item.name}!`, item);

    switch (item.type) {
      case "artifact":
        player.artifact = item;
        break;

      case "weapon":
        player.weapon = item as Blackguard.Weapon;
        break;

      case "armor":
        player.armor = item as Blackguard.Armor;
        break;

      default:
        break;
    }

    this.setFrame(196);
  }

  private async discoverItem() {
    const query = `
      mutation {
        discoverItem(dungeonId: "${this.dungeon.newGame.dungeonId}") {
          name
          type
          spriteIndex
          description
          damageDice
          armorClass
          discovered
          effects {
            property
            modifier
          }
        }
      }
    `;

    const res = await fetch(API_URL, { method: "POST", body: query });

    if (!res.ok) throw new Error(res.statusText);

    return await res.json();
  }
}

export default Chest;
