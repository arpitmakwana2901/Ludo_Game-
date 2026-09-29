import { createInitialGame } from './createInitialGame';

import {
  rollCurrentPlayerDice,
  getMovableTokens,
  moveCurrentPlayerToken,
} from './gameLogic';

const testGame = () => {
  // Create new game.
  let game = createInitialGame();

  console.log('Initial Game:');
  console.log(game);

  // Roll dice.
  game = rollCurrentPlayerDice(game);

  console.log('Dice Value:', game.diceValue);

  // Get movable tokens.
  const movableTokens = getMovableTokens(game);

  console.log('Movable Tokens:', movableTokens);

  // If token can move, move first token.
  if (movableTokens.length > 0) {
    const selectedToken = movableTokens[0];

    game = moveCurrentPlayerToken(
      game,
      selectedToken.id,
    );

    console.log('After Token Move:');
    console.log(game);
  }

  console.log(
    'Current Player:',
    game.players[game.currentPlayerIndex].color,
  );
};

testGame();