import { GameState, Player, Token } from '../types/game';

export const getCurrentPlayer = (
  game: GameState,
): Player => {
  return game.players[game.currentPlayerIndex];
};

export const getNextPlayerIndex = (
  currentPlayerIndex: number,
  totalPlayers: number,
): number => {
  return (currentPlayerIndex + 1) % totalPlayers;
};

/**
 * Returns the next player in turn sequence.
 */
export const getNextPlayer = (state: GameState): Player => {
  const nextIdx = getNextPlayerIndex(
    state.currentPlayerIndex,
    state.players.length,
  );
  return state.players[nextIdx];
};

/**
 * Checks whether all 4 tokens of a player have finished.
 */
export const hasPlayerWon = (player: Player): boolean => {
  return player.tokens.every(token => token.status === 'finished');
};

/**
 * Gets active tokens (on track or home column) for a player.
 */
export const getActiveTokens = (player: Player): Token[] => {
  return player.tokens.filter(token => token.status === 'active');
};
