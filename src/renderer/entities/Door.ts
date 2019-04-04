import Entity, { EntityParams } from "./Entity";
import { dungeonSprites } from "../utils/constants";
import { types } from "../utils/constants";

export interface DoorParams extends EntityParams {
  toRoom: string;
}

class Door extends Entity {
  public toRoom: string;

  constructor(params: DoorParams) {
    params.frame = dungeonSprites.DOOR_CLOSED;
    super(params);

    this.name = "door";
    this.blocking = true;
    this.type = types.DOOR;
    this.toRoom = params.toRoom;
  }

  public open(): void {
    this.setFrame(dungeonSprites.DOOR_OPEN);
    this.blocking = false;
  }
}

export default Door;
