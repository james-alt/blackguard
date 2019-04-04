import Actor from "./Actor";

class Monster extends Actor {
  public act(): void {
    this.dungeon.engine.lock();

    // console.log(`It's the ${this.name}'s turn`);

    const key = Math.floor(Math.random() * Math.floor(5));
    switch (key) {
      case 0:
        this.moveNorth();
        break;
      case 1:
        this.moveSouth();
        break;
      case 2:
        this.moveEast();
        break;
      case 3:
        this.moveWest();
        break;
      case 4:
      default:
        break;
    }

    // this.dungeon.engine.unlock();
  }
}

export default Monster;
