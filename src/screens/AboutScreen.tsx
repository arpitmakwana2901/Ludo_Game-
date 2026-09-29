import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/Button';
import { APP_NAME, APP_VERSION } from '../constants/appConstants';
import { COLORS } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ABOUT & RULES</Text>
        <Text style={styles.subtitle}>Game guide and information</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Info Header */}
        <View style={styles.appInfoCard}>
          <Text style={styles.logoIcon}>🎲</Text>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
        </View>

        {/* Rules Section */}
        <Text style={styles.sectionTitle}>GAMEPLAY RULES</Text>

        <View style={styles.ruleCard}>
          <Text style={styles.ruleNumber}>1</Text>
          <View style={styles.ruleContent}>
            <Text style={styles.ruleHeader}>Starting the Game</Text>
            <Text style={styles.ruleBody}>
              Each player gets 4 tokens in their Home base. Rolling a 6 unlocks a token onto the starting cell.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Text style={styles.ruleNumber}>2</Text>
          <View style={styles.ruleContent}>
            <Text style={styles.ruleHeader}>Movement & Safe Cells</Text>
            <Text style={styles.ruleBody}>
              Tokens move clockwise around the 52-cell main path. Star cells (★) and home starting cells are Safe Cells where tokens cannot be captured.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Text style={styles.ruleNumber}>3</Text>
          <View style={styles.ruleContent}>
            <Text style={styles.ruleHeader}>Capturing Tokens</Text>
            <Text style={styles.ruleBody}>
              Landing on an opponent's token on a non-safe cell captures it and sends it back to their Home base.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Text style={styles.ruleNumber}>4</Text>
          <View style={styles.ruleContent}>
            <Text style={styles.ruleHeader}>Winning the Game</Text>
            <Text style={styles.ruleBody}>
              Enter your colored home column and move all 4 tokens to the center Home triangle to win!
            </Text>
          </View>
        </View>

        {/* Credits Section */}
        <Text style={styles.sectionTitle}>CREDITS</Text>
        <View style={styles.creditsCard}>
          <Text style={styles.creditsText}>
            Built with React Native & TypeScript. Designed for high performance and smooth cross-platform gameplay.
          </Text>
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
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  appVersion: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 10,
  },
  ruleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  ruleContent: {
    flex: 1,
  },
  ruleHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  ruleBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
  creditsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 20,
  },
  creditsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
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

export default AboutScreen;
