import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

export interface DiceProps {
  value: number | null;
  disabled: boolean;
  onPress: () => void;
  onRoll?: (val: number) => void;
  isRolling?: boolean;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  disabled,
  onPress,
  onRoll,
  isRolling = false,
}) => {
  const [displayValue, setDisplayValue] = useState<number | null>(value);
  const [internalRolling, setInternalRolling] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleRollPress = () => {
    if (disabled || internalRolling || isRolling) return;

    setInternalRolling(true);

    // Rapid face cycling animation
    let counter = 0;
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setInternalRolling(false);
        onPress();
        if (onRoll && value !== null) {
          onRoll(value);
        }
      }
    }, 60);

    // Scale and rotation animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const renderDots = (val: number | null) => {
    if (!val || val < 1 || val > 6) {
      return <Text style={styles.questionMark}>🎲</Text>;
    }

    const dotMatrix: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeIndices = dotMatrix[val] || [];

    return (
      <View style={styles.dotGrid}>
        {Array.from({ length: 9 }).map((_, idx) => (
          <View key={idx} style={styles.dotSlot}>
            {activeIndices.includes(idx) && (
              <View style={[styles.dot, val === 6 ? styles.redDot : styles.blackDot]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isButtonDisabled = disabled || internalRolling || isRolling;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { rotate: spin }],
      }}
    >
      <Pressable
        disabled={isButtonDisabled}
        onPress={handleRollPress}
        accessibilityLabel={isButtonDisabled ? 'Dice disabled' : 'Roll Dice'}
        accessibilityRole="button"
        style={[
          styles.dice3d,
          isButtonDisabled && styles.disabled,
        ]}
      >
        <View style={styles.diceFace}>
          {renderDots(displayValue)}
        </View>

        <Text style={styles.label}>
          {isButtonDisabled ? 'WAIT' : 'ROLL'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dice3d: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  diceFace: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 32,
  },
  dotGrid: {
    width: 42,
    height: 42,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dotSlot: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  blackDot: {
    backgroundColor: '#212121',
  },
  redDot: {
    backgroundColor: COLORS.red,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textSecondary,
    marginTop: -2,
    letterSpacing: 0.5,
  },
});

export default Dice;
