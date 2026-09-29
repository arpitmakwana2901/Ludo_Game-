import {
  HOME_POSITION,
  SAFE_POSITIONS,
} from '../constants/gameConstants';

import {
  GameState,
  Player,
  Token,
} from '../types/game';

import { getBoardPosition } from './boardLogic';

export const isSafePosition = (
  boardPosition: number,
): boolean => {
  return SAFE_POSITIONS.includes(boardPosition);
};

export const getOpponentTokensAtPosition = (
  game: GameState,
  currentPlayerIndex: number,
  boardPosition: number,
): Token[] => {
  const opponentTokens: Token[] = [];

  game.players.forEach((player, playerIndex) => {
    // Skip current player's tokens.
    if (playerIndex === currentPlayerIndex) {
      return;
    }

    player.tokens.forEach(token => {
      const tokenBoardPosition = getBoardPosition(
        player.color,
        token.position,
      );

      if (
        tokenBoardPosition === boardPosition &&
        token.status === 'active'
      ) {
        opponentTokens.push(token);
      }
    });
  });

  return opponentTokens;
};

export const killOpponentTokens = (
  game: GameState,
  currentPlayerIndex: number,
  movedToken: Token,
): GameState => {
  const boardPosition = getBoardPosition(
    movedToken.player,
    movedToken.position,
  );

  // Token is not on common board.
  if (boardPosition === null) {
    return game;
  }

  // Safe position cannot kill.
  if (isSafePosition(boardPosition)) {
    return game;
  }

  const opponentTokens =
    getOpponentTokensAtPosition(
      game,
      currentPlayerIndex,
      boardPosition,
    );

  if (opponentTokens.length === 0) {
    return game;
  }

  const opponentTokenIds = new Set(
    opponentTokens.map(token => token.id),
  );

  const updatedPlayers: Player[] = game.players.map(
    (player): Player => {
      return {
        ...player,

        tokens: player.tokens.map(
          (token): Token => {
            if (opponentTokenIds.has(token.id)) {
              return sendTokenHome(token);
            }

            return token;
          },
        ),
      };
    },
  );

  return {
    ...game,
    players: updatedPlayers,
  };
};

/**
 * Resets token to home base status and position.
 */
export const sendTokenHome = (token: Token): Token => {
  return {
    ...token,
    position: HOME_POSITION,
    status: 'home',
    isSafe: false,
  };
};

/**
 * Detects whether movedToken captures any opponent token in current game state.
 */
export const detectCapture = (
  state: GameState,
  token: Token,
): { captured: boolean; capturedTokens: Token[] } => {
  const boardPosition = getBoardPosition(token.player, token.position);
  if (boardPosition === null || isSafePosition(boardPosition)) {
    return { captured: false, capturedTokens: [] };
  }

  const opponentTokens = getOpponentTokensAtPosition(
    state,
    state.currentPlayerIndex,
    boardPosition,
  );

  return {
    captured: opponentTokens.length > 0,
    capturedTokens: opponentTokens,
  };
};

/**
 * Checks if cellIndex is blocked (e.g., occupied by 2 or more opponent tokens).
 */
export const isBlocked = (
  state: GameState,
  cellIndex: number,
): boolean => {
  if (isSafePosition(cellIndex)) {
    return false;
  }

  const opponentTokens = getOpponentTokensAtPosition(
    state,
    state.currentPlayerIndex,
    cellIndex,
  );

  return opponentTokens.length >= 2;
};
