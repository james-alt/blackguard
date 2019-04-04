class Item {
  public name: string;
  public description: string;
  public effect?: { [key: string]: number } | null;

  constructor(params: Blackguard.Item) {
    this.name = params.name;
    this.description = params.description;
    this.effect = params.effects ? params.effects[0] : null;
  }
}

export default Item;
