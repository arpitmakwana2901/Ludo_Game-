import {
  FINISHED_POSITION,
  HOME_POSITION,
} from '../constants/gameConstants';

import { GameState, Token } from '../types/game';

export const canMoveToken = (
  token: Token,
  diceValue: number,
): boolean => {
  // 1. Finished token cannot move.
  if (token.status === 'finished') {
    return false;
  }

  // 2. Token at home can come out only when dice is 6.
  if (token.position === HOME_POSITION) {
    return diceValue === 6;
  }

  // 3. Calculate new position.
  const newPosition = token.position + diceValue;

  // 4. Token cannot move beyond finish position.
  if (newPosition > FINISHED_POSITION) {
    return false;
  }

  // 5. All conditions passed.
  return true;
};

export const moveToken = (
  token: Token,
  diceValue: number,
): Token => {
  if (!canMoveToken(token, diceValue)) {
    return token;
  }

  // Home token enters the board at relative position 0.
  if (token.position === HOME_POSITION) {
    return {
      ...token,
      position: 0,
      status: 'active',
      isSafe: true,
    };
  }

  const newPosition = token.position + diceValue;

  // Token reaches the finish.
  if (newPosition === FINISHED_POSITION) {
    return {
      ...token,
      position: FINISHED_POSITION,
      status: 'finished',
      isSafe: true,
    };
  }

  return {
    ...token,
    position: newPosition,
    status: 'active',
  };
};

/**
 * Get all tokens of current player that can move with current dice value.
 */
export const getValidMoves = (
  state: GameState,
  diceValue: number,
): Token[] => {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (!currentPlayer || diceValue === null) {
    return [];
  }

  return currentPlayer.tokens.filter(token =>
    canMoveToken(token, diceValue),
  );
};

/**
 * Apply token movement and return updated GameState.
 */
export const applyMove = (
  state: GameState,
  move: { tokenId: string; diceValue: number } | string,
): GameState => {
  const tokenId = typeof move === 'string' ? move : move.tokenId;
  const diceValue = typeof move === 'string' ? state.diceValue : move.diceValue;

  if (diceValue === null) {
    return state;
  }

  const playerIdx = state.currentPlayerIndex;
  const player = state.players[playerIdx];
  const token = player.tokens.find(t => t.id === tokenId);

  if (!token || !canMoveToken(token, diceValue)) {
    return state;
  }

  const updatedToken = moveToken(token, diceValue);
  const updatedTokens = player.tokens.map(t =>
    t.id === tokenId ? updatedToken : t,
  );

  const updatedPlayer = {
    ...player,
    tokens: updatedTokens,
  };

  const updatedPlayers = state.players.map((p, idx) =>
    idx === playerIdx ? updatedPlayer : p,
  );

  return {
    ...state,
    players: updatedPlayers,
  };
};

/**
 * Grants bonus turn handling when a six is rolled.
 */
export const handleSixBonus = (state: GameState): GameState => {
  if (state.diceValue === 6) {
    return {
      ...state,
      diceValue: null,
      diceRolled: false,
    };
  }
  return state;
};