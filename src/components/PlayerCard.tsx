import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Player, PlayerColor } from '../types/game';
import { COLORS } from '../constants/colors';

export interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  compact?: boolean;
}

const getPlayerTheme = (color: PlayerColor) => {
  switch (color) {
    case 'red':
      return { main: COLORS.red, light: COLORS.redLight, dark: COLORS.redDark };
    case 'green':
      return { main: COLORS.green, light: COLORS.greenLight, dark: COLORS.greenDark };
    case 'yellow':
      return { main: COLORS.yellow, light: COLORS.yellowLight, dark: COLORS.yellowDark };
    case 'blue':
      return { main: COLORS.blue, light: COLORS.blueLight, dark: COLORS.blueDark };
    default:
      return { main: '#999', light: '#FFF', dark: '#333' };
  }
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentTurn,
  compact = false,
}) => {
  const theme = getPlayerTheme(player.color);

  const homeTokensCount = player.tokens.filter(t => t.position === -1).length;
  const finishedTokensCount = player.tokens.filter(t => t.position === 57).length;

  return (
    <View
      style={[
        styles.card,
        compact ? styles.compactCard : styles.fullCard,
        isCurrentTurn && [styles.activeCard, { borderColor: theme.main }],
      ]}
    >
      {/* Color Indicator */}
      <View style={[styles.colorDot, { backgroundColor: theme.main }]} />

      {/* Name and Bot Badge */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {player.name}
          </Text>
          {player.isBot && (
            <View style={styles.botBadge}>
              <Text style={styles.botText}>BOT</Text>
            </View>
          )}
        </View>

        {/* Tokens Status */}
        <Text style={styles.statusText}>
          Home: {homeTokensCount} | Finished: {finishedTokensCount}/4
        </Text>
      </View>

      {/* Turn Indicator Dot */}
      {isCurrentTurn && (
        <View style={[styles.turnRing, { backgroundColor: theme.main }]}>
          <Text style={styles.turnRingText}>TURN</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  fullCard: {
    minWidth: 140,
    marginHorizontal: 4,
  },
  compactCard: {
    flex: 1,
    marginHorizontal: 3,
  },
  activeCard: {
    backgroundColor: '#FAFAFA',
    shadowOpacity: 0.3,
    elevation: 6,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  botBadge: {
    backgroundColor: '#616161',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
  },
  botText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  statusText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  turnRing: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  turnRingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});

export default PlayerCard;
