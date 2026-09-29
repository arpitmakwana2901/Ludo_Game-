export const APP_NAME = 'Ludo Champion';
export const APP_VERSION = '1.0.0';

export const SPLASH_DURATION = 2000;

export const STORAGE_KEYS = {
  SETTINGS: '@ludo_app_settings',
  STATS: '@ludo_app_stats',
  LAST_GAME: '@ludo_app_last_game',
} as const;

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  vibrationEnabled: true,
  animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
};

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  redWins: number;
  greenWins: number;
  yellowWins: number;
  blueWins: number;
}

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  redWins: 0,
  greenWins: 0,
  yellowWins: 0,
  blueWins: 0,
};
