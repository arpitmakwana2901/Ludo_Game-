import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/Button';
import { COLORS } from '../constants/colors';
import { AppSettings, loadSettings, saveSettings, clearAll } from '../utils/storage';
import { DEFAULT_SETTINGS } from '../constants/appConstants';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleToggleSound = (value: boolean) => {
    const updated = { ...settings, soundEnabled: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleToggleVibration = (value: boolean) => {
    const updated = { ...settings, vibrationEnabled: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    const updated = { ...settings, animationSpeed: speed };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetStats = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all saved statistics and preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            setSettings(DEFAULT_SETTINGS);
            Alert.alert('Reset Complete', 'Statistics have been reset successfully.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
        <Text style={styles.subtitle}>Game preferences & audio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Audio & Haptics Section */}
        <Text style={styles.sectionTitle}>AUDIO & HAPTICS</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDesc}>Play sounds on roll & token move</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: '#D6D6D6', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Vibration</Text>
              <Text style={styles.settingDesc}>Vibrate on dice roll & capture</Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={handleToggleVibration}
              trackColor={{ false: '#D6D6D6', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Animation Speed Section */}
        <Text style={styles.sectionTitle}>ANIMATION SPEED</Text>
        <View style={styles.settingCard}>
          <View style={styles.speedOptionsRow}>
            {(['slow', 'normal', 'fast'] as const).map(speed => (
              <Button
                key={speed}
                title={speed.toUpperCase()}
                size="sm"
                variant={settings.animationSpeed === speed ? 'primary' : 'ghost'}
                onPress={() => handleSpeedChange(speed)}
                style={styles.speedButton}
              />
            ))}
          </View>
        </View>

        {/* Data & Storage Section */}
        <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
        <View style={styles.settingCard}>
          <Button
            title="RESET STATISTICS & SETTINGS"
            variant="danger"
            size="md"
            onPress={handleResetStats}
            style={styles.resetButton}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="BACK TO MAIN MENU"
          size="md"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 14,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  speedOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  speedButton: {
    flex: 1,
  },
  resetButton: {
    width: '100%',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  backButton: {
    width: '100%',
  },
});

export default SettingsScreen;
