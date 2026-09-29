import {
  GameState,
  PlayerColor,
  Token,
} from '../types/game';

import { createInitialGame } from './createInitialGame';
import { rollDice as rollDiceUtil } from './dice';
import {
  getCurrentPlayer,
  getNextPlayerIndex,
} from './playerLogic';
import {
  canMoveToken,
  moveToken,
} from './movementLogic';
import { killOpponentTokens, detectCapture, isSafePosition } from './collisionLogic';
import { getBoardPosition } from './boardLogic';

/**
 * Roll dice for current player.
 */
export const rollCurrentPlayerDice = (
  game: GameState,
): GameState => {
  const diceValue = rollDiceUtil();

  const rolledGame: GameState = {
    ...game,
    diceValue,
    status: 'playing',
    diceRolled: true,
  };

  // Check whether any token can move.
  const movableTokens = getMovableTokens(rolledGame);

  // No token can move. Automatically change turn.
  if (movableTokens.length === 0) {
    return changeTurn(rolledGame);
  }

  return rolledGame;
};

/**
 * Alias for rollCurrentPlayerDice.
 */
export const rollDice = (game: GameState): GameState => {
  return rollCurrentPlayerDice(game);
};

/**
 * Get all tokens of current player that can move with current dice value.
 */
export const getMovableTokens = (
  game: GameState,
): Token[] => {
  const currentPlayer = getCurrentPlayer(game);
  const diceValue = game.diceValue;

  if (diceValue === null) {
    return [];
  }

  return currentPlayer.tokens.filter(token =>
    canMoveToken(token, diceValue),
  );
};

/**
 * Move selected token of current player.
 */
export const moveCurrentPlayerToken = (
  game: GameState,
  tokenId: string,
): GameState => {
  const diceValue = game.diceValue;

  if (diceValue === null) {
    return game;
  }

  const currentPlayerIndex = game.currentPlayerIndex;
  const currentPlayer = game.players[currentPlayerIndex];

  const selectedToken = currentPlayer.tokens.find(
    token => token.id === tokenId,
  );

  if (!selectedToken || !canMoveToken(selectedToken, diceValue)) {
    return game;
  }

  const updatedToken = moveToken(selectedToken, diceValue);

  const updatedTokens = currentPlayer.tokens.map(token =>
    token.id === tokenId ? updatedToken : token,
  );

  const updatedPlayer = {
    ...currentPlayer,
    tokens: updatedTokens,
  };

  const updatedPlayers = game.players.map((player, index) =>
    index === currentPlayerIndex ? updatedPlayer : player,
  );

  const gameAfterMove: GameState = {
    ...game,
    players: updatedPlayers,
  };

  // Check collision / capture
  const gameAfterCollision = killOpponentTokens(
    gameAfterMove,
    currentPlayerIndex,
    updatedToken,
  );

  const winner = getWinner(gameAfterCollision);

  if (winner !== null) {
    return {
      ...gameAfterCollision,
      status: 'finished',
      winner,
      isGameOver: true,
      diceValue: null,
    };
  }

  return finishTurn(gameAfterCollision, diceValue);
};

/**
 * Alias for moveCurrentPlayerToken.
 */
export const selectToken = (
  game: GameState,
  tokenId: string,
): GameState => {
  return moveCurrentPlayerToken(game, tokenId);
};

/**
 * Check whether player gets an extra turn.
 */
export const shouldGetExtraTurn = (
  diceValue: number | null,
): boolean => {
  return diceValue === 6;
};

/**
 * Change turn to next player.
 */
export const changeTurn = (
  game: GameState,
): GameState => {
  return {
    ...game,
    currentPlayerIndex: getNextPlayerIndex(
      game.currentPlayerIndex,
      game.players.length,
    ),
    diceValue: null,
    diceRolled: false,
    turnCount: (game.turnCount || 0) + 1,
  };
};

/**
 * Alias for changeTurn.
 */
export const endTurn = (game: GameState): GameState => {
  return changeTurn(game);
};

/**
 * Finish current player's turn.
 */
export const finishTurn = (
  game: GameState,
  diceValue: number,
): GameState => {
  if (shouldGetExtraTurn(diceValue)) {
    return {
      ...game,
      diceValue: null,
      diceRolled: false,
    };
  }

  return changeTurn(game);
};

/**
 * Check whether all tokens of a player are finished.
 */
export const isPlayerWinner = (
  tokens: Token[],
): boolean => {
  return tokens.every(
    token => token.status === 'finished',
  );
};

/**
 * Alias for checking winner in game state.
 */
export const checkWinCondition = (game: GameState): PlayerColor | null => {
  return getWinner(game);
};

/**
 * Find winner from all players.
 */
export const getWinner = (
  game: GameState,
): PlayerColor | null => {
  for (const player of game.players) {
    if (isPlayerWinner(player.tokens)) {
      return player.color;
    }
  }

  return null;
};

/**
 * Check whether current player has at least one movable token.
 */
export const hasMovableTokens = (
  game: GameState,
): boolean => {
  return getMovableTokens(game).length > 0;
};

/**
 * AI logic for bot players. Selects the best token to move.
 */
export const aiChooseMove = (state: GameState): Token | null => {
  const movableTokens = getMovableTokens(state);
  if (movableTokens.length === 0 || state.diceValue === null) {
    return null;
  }

  const diceVal = state.diceValue;

  // 1. Capture opponent token
  for (const token of movableTokens) {
    const projected = moveToken(token, diceVal);
    const { captured } = detectCapture(state, projected);
    if (captured) {
      return token;
    }
  }

  // 2. Token reaching finish
  for (const token of movableTokens) {
    if (token.position + diceVal === 57) {
      return token;
    }
  }

  // 3. Move token out of home base if 6
  if (diceVal === 6) {
    const homeToken = movableTokens.find(t => t.position === -1);
    if (homeToken) {
      return homeToken;
    }
  }

  // 4. Move to safe position
  for (const token of movableTokens) {
    const projected = moveToken(token, diceVal);
    const boardPos = getBoardPosition(projected.player, projected.position);
    if (boardPos !== null && isSafePosition(boardPos)) {
      return token;
    }
  }

  // 5. Move token furthest along path
  const sortedByPos = [...movableTokens].sort((a, b) => b.position - a.position);
  return sortedByPos[0];
};

/**
 * Reset the complete game.
 */
export const resetGame = (): GameState => {
  return createInitialGame();
};
