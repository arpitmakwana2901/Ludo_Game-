import {
  BOARD_SIZE,
  HOME_POSITION,
  FINISHED_POSITION,
  START_POSITION,
  SAFE_POSITIONS,
} from '../constants/gameConstants';

import { PlayerColor, Token } from '../types/game';
import {
  PATH_GRID_COORDS,
  HOME_COLUMN_GRID_COORDS,
  HOME_BASE_GRID_COORDS,
} from './boardCells';

/**
 * Converts a player's relative token position
 * into the actual common board position.
 *
 * Returns:
 * - null  → Home / Final Path / Finished
 * - 0-51  → Common Board position
 */
export const getBoardPosition = (
  player: PlayerColor,
  relativePosition: number,
): number | null => {
  // Token is at Home.
  if (relativePosition === HOME_POSITION) {
    return null;
  }

  // Token has reached the finish.
  if (relativePosition === FINISHED_POSITION) {
    return null;
  }

  // Token is inside the player's Final/Home Path.
  // Final path is not part of the common 52-cell board.
  if (relativePosition >= BOARD_SIZE) {
    return null;
  }

  // Get the player's starting position.
  const startPosition = START_POSITION[player];

  // Convert relative position into actual board position.
  return (
    (startPosition + relativePosition) %
    BOARD_SIZE
  );
};

/**
 * Returns normalized (0..1) board coordinates { x, y } for any given token.
 */
export const getTokenCoordinates = (
  token: Token,
): { x: number; y: number } => {
  const { player, position } = token;

  // Home base
  if (position === HOME_POSITION) {
    const tokenNum = parseInt(token.id.replace(/[^0-9]/g, ''), 10) - 1;
    const idx = Math.max(0, Math.min(3, isNaN(tokenNum) ? 0 : tokenNum));
    const baseCoord = HOME_BASE_GRID_COORDS[player][idx];
    return {
      x: baseCoord.col / 15,
      y: baseCoord.row / 15,
    };
  }

  // Finished (Center)
  if (position === FINISHED_POSITION) {
    return {
      x: 7 / 15,
      y: 7 / 15,
    };
  }

  // Home column (52..56)
  if (position >= BOARD_SIZE && position < FINISHED_POSITION) {
    const homeIdx = position - BOARD_SIZE;
    const coord = HOME_COLUMN_GRID_COORDS[player][homeIdx] || { row: 7, col: 7 };
    return {
      x: coord.col / 15,
      y: coord.row / 15,
    };
  }

  // Common main path (0..51)
  const boardPos = getBoardPosition(player, position);
  if (boardPos !== null && PATH_GRID_COORDS[boardPos]) {
    const coord = PATH_GRID_COORDS[boardPos];
    return {
      x: coord.col / 15,
      y: coord.row / 15,
    };
  }

  // Fallback center
  return { x: 7 / 15, y: 7 / 15 };
};

/**
 * Gets full path of board cell positions for a given player.
 */
export const getPathForPlayer = (color: PlayerColor): number[] => {
  const start = START_POSITION[color];
  const path: number[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    path.push((start + i) % BOARD_SIZE);
  }
  return path;
};

/**
 * Get safe cells list.
 */
export const getSafeCells = (): number[] => {
  return [...SAFE_POSITIONS];
};

/**
 * Check if cell index is safe.
 */
export const isSafeCell = (index: number): boolean => {
  return SAFE_POSITIONS.includes(index);
};