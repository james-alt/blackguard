export function dungeonString(dungeon: any): string {
  const data = [] as string[][];

  for (let y = 0; y < dungeon.height; y++) {
    data[y] = [];
    for (let x = 0; x < dungeon.width; x++) {
      data[y][x] = ".";
    }
  }

  dungeon.getCorridors().forEach((corridor: any) => {
    const { _startX, _startY, _endX, _endY } = corridor;

    const width =
      _startX === _endX
        ? 1
        : _startX < _endX
        ? _endX - _startX
        : _startX - _endX;
    const height =
      _startY === _endY
        ? 1
        : _startY < _endY
        ? _endY - _startY
        : _startY - _endY;

    for (let y = _startY; y < height; y++) {
      data[y] = [];
      for (let x = _startX; x < width; x++) {
        data[y][x] = " ";
      }
    }
  });
  dungeon.getRooms().forEach((room: any) => {
    const { _x1, _y1, _x2, _y2 } = room;
    const width = _x2 - _x1;
    const height = _y2 - _y1;

    for (let y = _y1; y < height; y++) {
      data[y] = [];
      for (let x = _x1; x < width; x++) {
        data[y][x] = " ";
      }
    }
  });

  let out: string = "";

  data.map(row => {
    row.map(col => (out = out + col));
    out = out + "\n";
  });

  return out;
}
