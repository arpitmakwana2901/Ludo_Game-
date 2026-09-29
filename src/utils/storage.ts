import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  GameStats,
} from '../constants/appConstants';

export interface AppSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

/**
 * Save user app settings.
 */
export const saveSettings = async (settings: AppSettings): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Load user app settings with default fallback.
 */
export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (jsonValue !== null) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(jsonValue) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save cumulative game statistics.
 */
export const saveStats = async (stats: GameStats): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving stats:', error);
    return false;
  }
};

/**
 * Load cumulative game statistics with default fallback.
 */
export const loadStats = async (): Promise<GameStats> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    if (jsonValue !== null) {
      return { ...DEFAULT_STATS, ...JSON.parse(jsonValue) };
    }
    return DEFAULT_STATS;
  } catch (error) {
    console.error('Error loading stats:', error);
    return DEFAULT_STATS;
  }
};

/**
 * Clear all AsyncStorage values.
 */
export const clearAll = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
