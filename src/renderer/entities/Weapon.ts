import Item from "./Item";

class Weapon extends Item {
  public damageDice: string;

  constructor(params: Blackguard.Weapon) {
    super(params);
    this.damageDice = params.damageDice;
  }
}

export default Weapon;
