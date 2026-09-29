import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/Button';
import { COLORS } from '../constants/colors';
import { PlayerColor } from '../types/game';
import { loadStats, saveStats } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const getPlayerColorHex = (color: PlayerColor) => {
  switch (color) {
    case 'red':
      return COLORS.red;
    case 'green':
      return COLORS.green;
    case 'yellow':
      return COLORS.yellow;
    case 'blue':
      return COLORS.blue;
    default:
      return COLORS.primary;
  }
};

export const ResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { winner, winnerName } = route.params;
  const themeColor = getPlayerColorHex(winner);

  // Update cumulative game stats in storage
  useEffect(() => {
    loadStats().then(currentStats => {
      const updatedStats = {
        ...currentStats,
        gamesPlayed: currentStats.gamesPlayed + 1,
        gamesWon: currentStats.gamesWon + 1,
        redWins: winner === 'red' ? currentStats.redWins + 1 : currentStats.redWins,
        greenWins: winner === 'green' ? currentStats.greenWins + 1 : currentStats.greenWins,
        yellowWins: winner === 'yellow' ? currentStats.yellowWins + 1 : currentStats.yellowWins,
        blueWins: winner === 'blue' ? currentStats.blueWins + 1 : currentStats.blueWins,
      };
      saveStats(updatedStats);
    });
  }, [winner]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Trophy / Celebration Icon */}
        <View style={[styles.trophyContainer, { borderColor: themeColor }]}>
          <Text style={styles.trophyIcon}>🏆</Text>
        </View>

        <Text style={styles.congratsText}>VICTORY!</Text>

        <View style={[styles.winnerBadge, { backgroundColor: themeColor }]}>
          <Text style={styles.winnerText}>{winnerName}</Text>
        </View>

        <Text style={styles.subtitle}>
          has conquered the board and won the match!
        </Text>

        {/* Confetti / Stars Decoration */}
        <View style={styles.decorationRow}>
          <Text style={styles.starText}>⭐</Text>
          <Text style={styles.starText}>🎉</Text>
          <Text style={styles.starText}>✨</Text>
          <Text style={styles.starText}>🎉</Text>
          <Text style={styles.starText}>⭐</Text>
        </View>
      </View>

      {/* Navigation Actions */}
      <View style={styles.buttonGroup}>
        <Button
          title="PLAY AGAIN"
          size="lg"
          variant="primary"
          onPress={() => navigation.replace('PlayerSetup')}
          style={styles.actionButton}
        />

        <Button
          title="MAIN MENU"
          size="md"
          variant="ghost"
          onPress={() => navigation.replace('Home')}
          style={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  trophyContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 24,
  },
  trophyIcon: {
    fontSize: 64,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  winnerBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  winnerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  decorationRow: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 16,
  },
  starText: {
    fontSize: 28,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    marginVertical: 6,
  },
});

export default ResultScreen;
