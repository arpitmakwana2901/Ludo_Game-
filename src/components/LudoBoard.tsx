import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';
import { PlayerColor, Token as TokenType } from '../types/game';
import { getTokenCoordinates } from '../game/boardLogic';
import { PATH_GRID_COORDS, HOME_COLUMN_GRID_COORDS } from '../game/boardCells';
import { SAFE_POSITIONS } from '../constants/gameConstants';
import { COLORS } from '../constants/colors';
import Token from './Token';

export interface LudoBoardProps {
  tokens: TokenType[];
  movableTokenIds: string[];
  onTokenPress: (tokenId: string) => void;
}

const getPlayerColorHex = (color: PlayerColor) => {
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

const getPlayerLightColorHex = (color: PlayerColor) => {
  switch (color) {
    case 'red':
      return COLORS.redLight;
    case 'green':
      return COLORS.greenLight;
    case 'yellow':
      return COLORS.yellowLight;
    case 'blue':
      return COLORS.blueLight;
  }
};

export const LudoBoard: React.FC<LudoBoardProps> = ({
  tokens,
  movableTokenIds,
  onTokenPress,
}) => {
  const [boardSize, setBoardSize] = useState<number>(340);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setBoardSize(width);
    }
  };

  const cellSize = boardSize / 15;
  const tokenSize = cellSize * 0.82;
  const centerSize = cellSize * 3;
  const halfCenter = centerSize / 2;

  // Group active tokens on standard path/home column to calculate stack offsets
  const positionGroups: Record<string, TokenType[]> = {};
  tokens.forEach(t => {
    const coords = getTokenCoordinates(t);
    const key = `${coords.x.toFixed(3)}_${coords.y.toFixed(3)}`;
    if (!positionGroups[key]) {
      positionGroups[key] = [];
    }
    positionGroups[key].push(t);
  });

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.boardContainer,
        { width: '100%', aspectRatio: 1, backgroundColor: COLORS.boardBg },
      ]}
    >
      {/* ================= 4 CORNER HOME BASES (6x6 cells each) ================= */}
      {/* RED HOME BASE (top-left: 0..5, 0..5) */}
      <View style={[styles.homeBaseArea, styles.redHome, { width: cellSize * 6, height: cellSize * 6, left: 0, top: 0 }]}>
        <View style={styles.homeInnerWhite}>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.red }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.red }]} />
          </View>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.red }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.red }]} />
          </View>
        </View>
      </View>

      {/* GREEN HOME BASE (top-right: 9..14, 0..5) */}
      <View style={[styles.homeBaseArea, styles.greenHome, { width: cellSize * 6, height: cellSize * 6, right: 0, top: 0 }]}>
        <View style={styles.homeInnerWhite}>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.green }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.green }]} />
          </View>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.green }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.green }]} />
          </View>
        </View>
      </View>

      {/* YELLOW HOME BASE (bottom-right: 9..14, 9..14) */}
      <View style={[styles.homeBaseArea, styles.yellowHome, { width: cellSize * 6, height: cellSize * 6, right: 0, bottom: 0 }]}>
        <View style={styles.homeInnerWhite}>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.yellow }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.yellow }]} />
          </View>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.yellow }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.yellow }]} />
          </View>
        </View>
      </View>

      {/* BLUE HOME BASE (bottom-left: 0..5, 9..14) */}
      <View style={[styles.homeBaseArea, styles.blueHome, { width: cellSize * 6, height: cellSize * 6, left: 0, bottom: 0 }]}>
        <View style={styles.homeInnerWhite}>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.blue }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.blue }]} />
          </View>
          <View style={styles.homeBoxRow}>
            <View style={[styles.homeCircle, { backgroundColor: COLORS.blue }]} />
            <View style={[styles.homeCircle, { backgroundColor: COLORS.blue }]} />
          </View>
        </View>
      </View>

      {/* ================= 52 MAIN PATH CELLS ================= */}
      {PATH_GRID_COORDS.map((coord, index) => {
        const isSafe = SAFE_POSITIONS.includes(index);
        let cellBg = COLORS.pathWhite;
        if (index === 0) cellBg = COLORS.redLight;
        if (index === 13) cellBg = COLORS.greenLight;
        if (index === 26) cellBg = COLORS.yellowLight;
        if (index === 39) cellBg = COLORS.blueLight;

        return (
          <View
            key={`path-${index}`}
            style={[
              styles.cell,
              {
                left: coord.col * cellSize,
                top: coord.row * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: cellBg,
              },
            ]}
          >
            {isSafe && <Text style={styles.safeStar}>★</Text>}
          </View>
        );
      })}

      {/* ================= 4 HOME COLUMNS (5 cells each) ================= */}
      {(['red', 'green', 'yellow', 'blue'] as PlayerColor[]).map(color => {
        const coords = HOME_COLUMN_GRID_COORDS[color];
        const colorHex = getPlayerLightColorHex(color);
        return coords.map((coord, idx) => (
          <View
            key={`homecol-${color}-${idx}`}
            style={[
              styles.cell,
              {
                left: coord.col * cellSize,
                top: coord.row * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: colorHex,
              },
            ]}
          />
        ));
      })}

      {/* ================= CENTER TRIANGLES (3x3 area: cols 6-8, rows 6-8) ================= */}
      <View
        style={[
          styles.centerSquare,
          {
            left: cellSize * 6,
            top: cellSize * 6,
            width: centerSize,
            height: centerSize,
          },
        ]}
      >
        <Svg
          width={centerSize}
          height={centerSize}
          viewBox={`0 0 ${centerSize} ${centerSize}`}
          style={StyleSheet.absoluteFill}
        >
          {/* Top Triangle (Green) */}
          <Polygon
            points={`0,0 ${centerSize},0 ${halfCenter},${halfCenter}`}
            fill={COLORS.green}
          />
          {/* Right Triangle (Yellow) */}
          <Polygon
            points={`${centerSize},0 ${centerSize},${centerSize} ${halfCenter},${halfCenter}`}
            fill={COLORS.yellow}
          />
          {/* Bottom Triangle (Blue) */}
          <Polygon
            points={`0,${centerSize} ${halfCenter},${halfCenter} ${centerSize},${centerSize}`}
            fill={COLORS.blue}
          />
          {/* Left Triangle (Red) */}
          <Polygon
            points={`0,0 ${halfCenter},${halfCenter} 0,${centerSize}`}
            fill={COLORS.red}
          />

          {/* Crisp Diagonal Dividing Borders */}
          <Line
            x1="0"
            y1="0"
            x2={centerSize}
            y2={centerSize}
            stroke={COLORS.borderColor}
            strokeWidth="1.5"
          />
          <Line
            x1="0"
            y1={centerSize}
            x2={centerSize}
            y2="0"
            stroke={COLORS.borderColor}
            strokeWidth="1.5"
          />
        </Svg>

        {/* Center Circular Badge */}
        <View
          style={[
            styles.centerBadge,
            {
              width: cellSize * 1.15,
              height: cellSize * 1.15,
              borderRadius: (cellSize * 1.15) / 2,
            },
          ]}
        >
          <Text style={[styles.centerText, { fontSize: cellSize * 0.28 }]}>
            LUDO
          </Text>
        </View>
      </View>

      {/* ================= TOKENS OVERLAY ================= */}
      {tokens.map(t => {
        const isMovable = movableTokenIds.includes(t.id);
        const coords = getTokenCoordinates(t);
        const key = `${coords.x.toFixed(3)}_${coords.y.toFixed(3)}`;
        const group = positionGroups[key] || [t];
        const stackIndex = group.findIndex(gt => gt.id === t.id);
        const total = group.length;

        // Offset when stacked on the same cell
        let offsetX = 0;
        let offsetY = 0;
        if (total > 1) {
          const spread = 4;
          const offsets = [
            { x: -spread, y: -spread },
            { x: spread, y: -spread },
            { x: -spread, y: spread },
            { x: spread, y: spread },
          ];
          const off = offsets[stackIndex % offsets.length];
          offsetX = off.x;
          offsetY = off.y;
        }

        const posX = coords.x * boardSize + (cellSize - tokenSize) / 2 + offsetX;
        const posY = coords.y * boardSize + (cellSize - tokenSize) / 2 + offsetY;

        return (
          <View
            key={`token-render-${t.id}`}
            style={[
              styles.tokenWrapper,
              {
                left: posX,
                top: posY,
                zIndex: isMovable ? 100 : 20 + stackIndex,
              },
            ]}
          >
            <Token
              id={t.id}
              color={t.player}
              isMovable={isMovable}
              onPress={onTokenPress}
              size={tokenSize}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    borderWidth: 3,
    borderColor: COLORS.borderColor,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  homeBaseArea: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  redHome: { backgroundColor: COLORS.red },
  greenHome: { backgroundColor: COLORS.green },
  yellowHome: { backgroundColor: COLORS.yellow },
  blueHome: { backgroundColor: COLORS.blue },
  homeInnerWhite: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
  },
  homeBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  homeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  cell: {
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeStar: {
    fontSize: 14,
    color: '#D81B60',
    fontWeight: '900',
  },
  centerSquare: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centerBadge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
    zIndex: 10,
  },
  centerText: {
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  tokenWrapper: {
    position: 'absolute',
  },
});

export default LudoBoard;
