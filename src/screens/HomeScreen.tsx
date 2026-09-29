import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/Button';
import { COLORS } from '../constants/colors';
import { loadStats } from '../utils/storage';
import { GameStats, DEFAULT_STATS } from '../constants/appConstants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadStats().then(setStats);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.diceLogo}>🎲</Text>
        <Text style={styles.title}>LUDO</Text>
        <Text style={styles.subtitle}>CHAMPION</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>PLAYER STATS</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>PLAYED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.gamesWon}</Text>
            <Text style={styles.statLabel}>WON</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {stats.gamesPlayed > 0
                ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%`
                : '0%'}
            </Text>
            <Text style={styles.statLabel}>WIN RATE</Text>
          </View>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="PLAY GAME"
          size="lg"
          variant="primary"
          onPress={() => navigation.navigate('PlayerSetup')}
          style={styles.menuButton}
        />

        <Button
          title="SETTINGS"
          size="md"
          variant="ghost"
          onPress={() => navigation.navigate('Settings')}
          style={styles.menuButton}
        />

        <Button
          title="ABOUT & RULES"
          size="md"
          variant="secondary"
          onPress={() => navigation.navigate('About')}
          style={styles.menuButton}
        />
      </View>

      <Text style={styles.footerText}>Ready to roll the dice!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  diceLogo: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 6,
    marginTop: -4,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 20,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.borderLight,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuButton: {
    width: '100%',
    marginVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

export default HomeScreen;
