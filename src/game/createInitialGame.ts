import {
  HOME_POSITION,
} from '../constants/gameConstants';

import {
  GameState,
  Player,
  PlayerColor,
  Token,
} from '../types/game';

const PLAYER_COLORS: PlayerColor[] = [
  'red',
  'green',
  'yellow',
  'blue',
];

const createTokens = (color: PlayerColor): Token[] => {
  return Array.from({ length: 4 }, (_, index) => ({
    id: `${color.charAt(0).toUpperCase()}${index + 1}`,
    player: color,
    playerId: color,
    position: HOME_POSITION,
    status: 'home',
    isSafe: false,
    cellIndex: HOME_POSITION,
  }));
};

const createPlayer = (color: PlayerColor, name?: string, isBot: boolean = false): Player => {
  return {
    id: color,
    color,
    name: name || `${color.charAt(0).toUpperCase()}${color.slice(1)} Player`,
    tokens: createTokens(color),
    isBot,
    isActive: true,
    hasFinished: false,
  };
};

export interface PlayerConfig {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
}

export const createInitialGame = (playerConfigs?: PlayerConfig[]): GameState => {
  let players: Player[];

  if (playerConfigs && playerConfigs.length > 0) {
    players = playerConfigs.map(cfg => createPlayer(cfg.color, cfg.name, cfg.isBot));
  } else {
    players = PLAYER_COLORS.map(color => createPlayer(color));
  }

  return {
    players,
    currentPlayerIndex: 0,
    diceValue: null,
    diceRolled: false,
    consecutiveSixes: 0,
    status: 'waiting',
    winner: null,
    isGameOver: false,
    turnCount: 0,
    gameMode: playerConfigs?.some(p => p.isBot) ? 'bot' : 'local',
  };
};
