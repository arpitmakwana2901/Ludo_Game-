import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/Button';
import { COLORS } from '../constants/colors';
import { PlayerColor } from '../types/game';
import { PlayerConfig } from '../game/createInitialGame';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerSetup'>;

const ALL_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

export const PlayerSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [numPlayers, setNumPlayers] = useState<number>(4);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>([
    { id: 'red', name: 'Red Player', color: 'red', isBot: false },
    { id: 'green', name: 'Green Player', color: 'green', isBot: true },
    { id: 'yellow', name: 'Yellow Player', color: 'yellow', isBot: true },
    { id: 'blue', name: 'Blue Player', color: 'blue', isBot: true },
  ]);

  const handleNumPlayersChange = (count: number) => {
    setNumPlayers(count);
    const newConfigs = ALL_COLORS.slice(0, count).map((color, index) => ({
      id: color,
      name: `${color.charAt(0).toUpperCase()}${color.slice(1)} Player`,
      color,
      isBot: index > 0, // Default player 1 human, others bot
    }));
    setPlayerConfigs(newConfigs);
  };

  const handleNameChange = (index: number, text: string) => {
    const updated = [...playerConfigs];
    updated[index].name = text;
    setPlayerConfigs(updated);
  };

  const handleBotToggle = (index: number, value: boolean) => {
    const updated = [...playerConfigs];
    updated[index].isBot = value;
    setPlayerConfigs(updated);
  };

  const handleStartGame = () => {
    navigation.navigate('Game', { players: playerConfigs });
  };

  const getThemeColor = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return COLORS.red;
      case 'green':
        return COLORS.green;
      case 'yellow':
        return COLORS.yellow;
      case 'blue':
        return COLORS.blue;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PLAYER SETUP</Text>
        <Text style={styles.subtitle}>Configure game participants</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Player Count Selector */}
        <Text style={styles.sectionLabel}>SELECT PLAYERS COUNT</Text>
        <View style={styles.countSelectorRow}>
          {[2, 3, 4].map(count => (
            <Button
              key={count}
              title={`${count} Players`}
              variant={numPlayers === count ? 'primary' : 'ghost'}
              size="sm"
              onPress={() => handleNumPlayersChange(count)}
              style={styles.countButton}
            />
          ))}
        </View>

        {/* Player Configuration Cards */}
        <Text style={styles.sectionLabel}>PLAYER DETAILS</Text>
        {playerConfigs.map((config, index) => {
          const colorHex = getThemeColor(config.color);
          return (
            <View key={config.color} style={[styles.playerCard, { borderColor: colorHex }]}>
              <View style={[styles.colorDot, { backgroundColor: colorHex }]} />

              <View style={styles.inputContainer}>
                <Text style={styles.playerColorLabel}>
                  {config.color.toUpperCase()} PLAYER
                </Text>
                <TextInput
                  style={styles.nameInput}
                  value={config.name}
                  onChangeText={text => handleNameChange(index, text)}
                  placeholder="Enter name"
                  maxLength={16}
                />
              </View>

              <View style={styles.botToggleContainer}>
                <Text style={styles.botToggleLabel}>BOT</Text>
                <Switch
                  value={config.isBot}
                  onValueChange={val => handleBotToggle(index, val)}
                  trackColor={{ false: '#D6D6D6', true: colorHex }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="START GAME"
          size="lg"
          variant="primary"
          onPress={handleStartGame}
          style={styles.startButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  countSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  countButton: {
    flex: 1,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
  },
  playerColorLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  nameInput: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingVertical: 2,
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  botToggleContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  botToggleLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  startButton: {
    width: '100%',
  },
});

export default PlayerSetupScreen;
