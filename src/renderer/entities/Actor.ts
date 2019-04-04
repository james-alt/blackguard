import Entity, { EntityParams } from "./Entity";
import { keys, facings } from "../utils/constants";
import { roll } from "../utils/dice";

export interface ActorParams extends EntityParams {
  facing?: string;
  currentHitpoints?: number;
  armorClass?: number;
  attackModifier?: number;
  damageDice?: string;
  damageModifier?: number;
  speed?: number;
  sprite?: string;
  onCollide?: (other: Entity) => void;
}

class Actor extends Entity {
  public facing: string;
  public maxHitpoints: number = 8;
  public currentHitpoints: number = 8;
  public armorClass: number = 10;
  public attackModifier: number = 0;
  public damageDice: string = "1d4";
  public damageModifier: number = 0;
  public speed: number = 1;
  public sprite: string = "SKELETON";
  public onCollide?: (other: Entity) => void;

  constructor(params: ActorParams) {
    super(params);

    const {
      facing,
      currentHitpoints,
      armorClass,
      attackModifier,
      damageDice,
      damageModifier,
      speed,
      sprite,
      onCollide,
    } = params;

    this.facing = facing ? facing : facings.SOUTH;
    this.onCollide = onCollide;
    this.blocking = true;

    if (currentHitpoints) this.currentHitpoints = currentHitpoints;
    if (armorClass) this.armorClass = armorClass;
    if (attackModifier) this.attackModifier = attackModifier;
    if (damageDice) this.damageDice = damageDice;
    if (damageModifier) this.damageModifier = damageModifier;
    if (speed) this.speed = speed;
    if (sprite) this.sprite = sprite;
  }

  public act(): void {
    this.dungeon.engine.lock();
  }

  public update(): void {
    const { facing, sprite } = this;

    switch (facing) {
      case facings.NORTH:
        this.anims.play(keys[`ANIM_${sprite}_NORTH`], true);
        break;
      case facings.EAST:
        this.anims.play(keys[`ANIM_${sprite}_EAST`], true);
        break;
      case facings.WEST:
        this.anims.play(keys[`ANIM_${sprite}_WEST`], true);
        break;
      case facings.SOUTH:
      default:
        this.anims.play(keys[`ANIM_${sprite}_SOUTH`], true);
        break;
    }
  }

  public moveNorth(): void {
    this.move(this.x, this.y - 16);
    this.facing = facings.NORTH;
  }

  public moveSouth(): void {
    this.move(this.x, this.y + 16);
    this.facing = facings.SOUTH;
  }

  public moveEast(): void {
    this.move(this.x + 16, this.y);
    this.facing = facings.EAST;
  }

  public moveWest(): void {
    this.move(this.x - 16, this.y);
    this.facing = facings.WEST;
  }

  public attack(other: Actor) {
    const { name, attackModifier, damageDice, damageModifier } = this;

    console.log(`The ${name} attacks the ${other.name}!`);

    const attackRoll = roll("1d20", attackModifier);

    if (attackRoll >= other.armorClass) {
      const damageRoll = roll(damageDice, damageModifier);
      console.log(
        `The ${name} rolls ${damageDice} with and does ${damageRoll} damage`,
      );
      other.takeDamage(damageRoll);
    } else {
      console.log(`The ${name} misses`);
    }
  }

  public takeDamage(amount: number): void {
    const { currentHitpoints } = this;
    this.currentHitpoints = currentHitpoints - amount;

    if (this.currentHitpoints <= 0 && this.name !== "player") this.kill();
  }

  public kill(): void {
    console.log(`The ${name} died`);
    this.dungeon.removeEntity(this);
    this.destroy();
  }

  private move(x: number, y: number): void {
    this.dungeon.engine.unlock();

    if (this.isBlocked(x, y)) return;
    if (!this.canTraverse(x, y)) return;

    this.x = x;
    this.y = y;
  }

  private isBlocked(x: number, y: number): boolean {
    let blocked = false;

    for (let other of this.dungeon.entities) {
      if (other.x === x && other.y === y) {
        if (this.onCollide) this.onCollide(other);
        blocked = other.blocking!;
        break;
      }
    }

    return blocked;
  }

  private canTraverse(x: number, y: number): boolean {
    let traversable = false;

    let layer = this.dungeon.layers[0];
    if (layer !== null && layer.hasTileAtWorldXY(x, y)) {
      const tile = layer.getTileAtWorldXY(x, y, true);
      if (
        [
          65,
          66,
          67,
          68,
          69,
          70,
          71,
          108,
          109,
          110,
          111,
          112,
          173,
          81,
          82,
          83,
          84,
          85,
          86,
          98,
          99,
          100,
          101,
          102,
          119,
          120,
          121,
          122,
          123,
          124,
        ].includes(tile.index)
      ) {
        traversable = true;
      }
    }
    layer = this.dungeon.layers[1];
    if (layer !== null && layer.hasTileAtWorldXY(x, y)) {
      traversable = false;
    }

    return traversable;
  }
}

export default Actor;
