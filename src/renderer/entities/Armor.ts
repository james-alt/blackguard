import Item from "./Item";

class Armor extends Item {
  public armorClass: string;

  constructor(params: Blackguard.Weapon) {
    super(params);
    this.armorClass = params.damageDice;
  }
}

export default Armor;
