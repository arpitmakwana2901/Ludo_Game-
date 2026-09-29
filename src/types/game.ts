export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type TokenStatus = 'home' | 'active' | 'finished';

export type GameMode = 'local' | 'bot';

export interface Token {
  id: string;
  player: PlayerColor;
  playerId?: string;
  position: number;
  status: TokenStatus;
  isSafe?: boolean;
  cellIndex?: number;
}

export interface Player {
  id: string;
  color: PlayerColor;
  name: string;
  tokens: Token[];
  isBot?: boolean;
  isActive?: boolean;
  hasFinished?: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  diceRolled?: boolean;
  consecutiveSixes?: number;
  status: 'waiting' | 'playing' | 'finished';
  winner: PlayerColor | null;
  isGameOver?: boolean;
  turnCount?: number;
  gameMode?: GameMode;
}

export interface DiceRoll {
  value: number;
  timestamp: number;
}
