import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { APP_NAME, APP_VERSION, SPLASH_DURATION } from '../constants/appConstants';
import { COLORS } from '../constants/colors';
import { loadSettings } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Load settings in background
    loadSettings();

    // Start logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after SPLASH_DURATION
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.diceIcon}>🎲</Text>
        </View>

        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>Classic Board Game</Text>

        <View style={styles.colorDotsRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.red }]} />
          <View style={[styles.dot, { backgroundColor: COLORS.green }]} />
          <View style={[styles.dot, { backgroundColor: COLORS.yellow }]} />
          <View style={[styles.dot, { backgroundColor: COLORS.blue }]} />
        </View>
      </Animated.View>

      <Text style={styles.versionText}>v{APP_VERSION}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.boardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: COLORS.borderColor,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  diceIcon: {
    fontSize: 54,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  colorDotsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  versionText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

export default SplashScreen;
