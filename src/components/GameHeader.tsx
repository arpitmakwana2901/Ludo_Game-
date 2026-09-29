import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { PlayerColor } from '../types/game';

export interface GameHeaderProps {
  title?: string;
  currentPlayerName?: string;
  currentPlayerColor?: PlayerColor;
  onBackPress?: () => void;
  onMenuPress?: () => void;
}

const getPlayerColorHex = (color?: PlayerColor): string => {
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

export const GameHeader: React.FC<GameHeaderProps> = ({
  title = 'LUDO CHAMPION',
  currentPlayerName,
  currentPlayerColor,
  onBackPress,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets();
  const themeColor = getPlayerColorHex(currentPlayerColor);

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Left Back Button */}
      {onBackPress ? (
        <Pressable
          onPress={onBackPress}
          style={styles.iconButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.iconText}>◀</Text>
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Center Title & Current Turn Badge */}
      <View style={styles.centerContainer}>
        <Text style={styles.titleText}>{title}</Text>
        {currentPlayerName && (
          <View style={[styles.turnBadge, { borderColor: themeColor }]}>
            <View style={[styles.colorDot, { backgroundColor: themeColor }]} />
            <Text style={styles.turnText}>Turn: {currentPlayerName}</Text>
          </View>
        )}
      </View>

      {/* Right Menu Button */}
      {onMenuPress ? (
        <Pressable
          onPress={onMenuPress}
          style={styles.iconButton}
          accessibilityLabel="Open game menu"
          accessibilityRole="button"
        >
          <Text style={styles.iconText}>⚙️</Text>
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconPlaceholder: {
    width: 40,
  },
  centerContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
  },
  turnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 3,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  turnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
});

export default GameHeader;
