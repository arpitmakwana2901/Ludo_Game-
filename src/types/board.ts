import { PlayerColor } from './game';

export type BoardCellType =
  | 'normal'
  | 'path'
  | 'home'
  | 'safe'
  | 'start'
  | 'homeColumn';

export interface BoardCell {
  position: number;
  type: BoardCellType;
  owner?: PlayerColor;
  index?: number;
  x?: number;
  y?: number;
  color?: string;
}