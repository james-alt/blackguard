const DICE_REGEXP = /(\d+)d(\d+)/;

export function roll(dice: string, modifier: number = 0): number {
  const match = dice.match(DICE_REGEXP);

  if (!match) return 0;

  const num = parseInt(match[1]);
  const max = parseInt(match[2]);

  let result = 0;
  for (let i = 0; i < num; i++) {
    const roll = Math.floor(Math.random() * max) + 1;
    result = result + roll;
  }

  return result + modifier;
}
