import {
  DICE_MAX,
  DICE_MIN,
} from '../constants/gameConstants';

export const rollDice = (): number => {
  return (
    Math.floor(
      Math.random() * (DICE_MAX - DICE_MIN + 1),
    ) + DICE_MIN
  );
};

export const isSix = (value: number): boolean => {
  return value === 6;
};

export const isThreeConsecutiveSixes = (history: number[]): boolean => {
  if (history.length < 3) return false;
  const lastThree = history.slice(-3);
  return lastThree.every(v => v === 6);
};