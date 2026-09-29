import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PlayerColor } from '../types/game';
import { COLORS } from '../constants/colors';

export interface TokenProps {
  id: string;
  color: PlayerColor;
  isMovable: boolean;
  onPress?: (tokenId: string) => void;
  size?: number;
}

const getPlayerColorHex = (color: PlayerColor): { main: string; light: string; dark: string } => {
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
      return { main: '#999', light: '#EEE', dark: '#333' };
  }
};

export const Token: React.FC<TokenProps> = ({
  id,
  color,
  isMovable,
  onPress,
  size = 26,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorHex = getPlayerColorHex(color);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isMovable) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isMovable, pulseAnim]);

  const tokenLabel = id.replace(/[^0-9]/g, '') || id.charAt(0).toUpperCase();

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <Pressable
        disabled={!isMovable}
        onPress={() => onPress && onPress(id)}
        accessibilityLabel={`Token ${id} for ${color}`}
        accessibilityRole="button"
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colorHex.main,
            borderColor: isMovable ? '#FFFFFF' : colorHex.dark,
            borderWidth: isMovable ? 2.5 : 1.5,
          },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              width: size * 0.65,
              height: size * 0.65,
              borderRadius: (size * 0.65) / 2,
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              borderColor: colorHex.dark,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: size * 0.4 }]}>
            {tokenLabel}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 6,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default Token;
