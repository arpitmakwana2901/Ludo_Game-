import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GameHeader from '../components/GameHeader';
import LudoBoard from '../components/LudoBoard';
import Dice from '../components/Dice';
import PlayerCard from '../components/PlayerCard';
import { COLORS } from '../constants/colors';
import { GameState } from '../types/game';
import { createInitialGame } from '../game/createInitialGame';
import {
  getMovableTokens,
  moveCurrentPlayerToken,
  rollCurrentPlayerDice,
  aiChooseMove,
} from '../game/gameLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialPlayers = route.params?.players;
  const [game, setGame] = useState<GameState>(() =>
    createInitialGame(initialPlayers),
  );

  const currentPlayer = game.players[game.currentPlayerIndex];
  const movableTokens = getMovableTokens(game);

  // Navigate to ResultScreen when game finishes
  useEffect(() => {
    if (game.status === 'finished' && game.winner) {
      const winningPlayer = game.players.find(p => p.color === game.winner);
      const winnerName = winningPlayer ? winningPlayer.name : `${game.winner.toUpperCase()} Player`;
      
      const timer = setTimeout(() => {
        navigation.replace('Result', {
          winner: game.winner!,
          winnerName,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [game.status, game.winner, game.players, navigation]);

  // Roll Dice Handler
  const handleRollDice = useCallback(() => {
    if (game.status === 'finished' || game.diceValue !== null) {
      return;
    }

    const updatedGame = rollCurrentPlayerDice(game);
    setGame(updatedGame);
  }, [game]);

  // Token Press Handler
  const handleTokenPress = useCallback((tokenId: string) => {
    if (game.diceValue === null) {
      return;
    }

    const updatedGame = moveCurrentPlayerToken(game, tokenId);
    setGame(updatedGame);
  }, [game]);

  // Bot Auto-play Turn Automation Loop
  useEffect(() => {
    if (game.status === 'finished') return;

    if (currentPlayer && currentPlayer.isBot) {
      // Step A: Bot Rolls Dice
      if (game.diceValue === null) {
        const rollTimer = setTimeout(() => {
          handleRollDice();
        }, 700);
        return () => clearTimeout(rollTimer);
      }

      // Step B: Bot Selects Token Move
      if (game.diceValue !== null && movableTokens.length > 0) {
        const moveTimer = setTimeout(() => {
          const chosenToken = aiChooseMove(game);
          if (chosenToken) {
            handleTokenPress(chosenToken.id);
          }
        }, 800);
        return () => clearTimeout(moveTimer);
      }
    }
  }, [game, currentPlayer, movableTokens, handleRollDice, handleTokenPress]);

  const handleMenuPress = () => {
    Alert.alert(
      'Game Menu',
      'Choose an option:',
      [
        {
          text: 'Restart Game',
          style: 'destructive',
          onPress: () => setGame(createInitialGame(initialPlayers)),
        },
        {
          text: 'Exit to Home',
          style: 'cancel',
          onPress: () => navigation.navigate('Home'),
        },
        { text: 'Resume', style: 'default' },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <GameHeader
        currentPlayerName={currentPlayer.name}
        currentPlayerColor={currentPlayer.color}
        onBackPress={() => navigation.goBack()}
        onMenuPress={handleMenuPress}
      />

      {/* Players Summary Cards Row */}
      <View style={styles.playerCardsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {game.players.map((p, idx) => (
            <PlayerCard
              key={p.color}
              player={p}
              isCurrentTurn={idx === game.currentPlayerIndex}
              compact
            />
          ))}
        </ScrollView>
      </View>

      {/* Main Ludo Board Center */}
      <View style={styles.boardWrapper}>
        <LudoBoard
          tokens={game.players.flatMap(p => p.tokens)}
          movableTokenIds={movableTokens.map(t => t.id)}
          onTokenPress={handleTokenPress}
        />
      </View>

      {/* Game Instruction Hint */}
      <Text style={styles.instructionText}>
        {currentPlayer.isBot
          ? `${currentPlayer.name} is thinking... 🤖`
          : game.diceValue === null
          ? 'Tap the dice to roll'
          : movableTokens.length > 0
          ? 'Tap a glowing token to move'
          : 'No valid moves available'}
      </Text>

      {/* Bottom Controls Section: Dice & Info */}
      <View style={styles.bottomControls}>
        <Dice
          value={game.diceValue}
          disabled={
            game.status === 'finished' ||
            game.diceValue !== null ||
            Boolean(currentPlayer.isBot)
          }
          onPress={handleRollDice}
        />

        <View style={styles.infoBadge}>
          <Text style={styles.infoTitle}>DICE VALUE</Text>
          <Text style={styles.infoValue}>{game.diceValue ?? '-'}</Text>
        </View>

        <View style={styles.infoBadge}>
          <Text style={styles.infoTitle}>MOVABLE</Text>
          <Text style={styles.infoValue}>{movableTokens.length}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerCardsRow: {
    width: '100%',
    paddingHorizontal: 12,
    marginVertical: 6,
    maxHeight: 56,
  },
  boardWrapper: {
    width: '94%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 6,
    textAlign: 'center',
  },
  bottomControls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  infoBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minWidth: 85,
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});

export default GameScreen;
