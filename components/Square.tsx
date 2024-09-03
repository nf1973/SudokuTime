import React from "react"
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  FlatList,
} from "react-native"

interface SquareProps {
  // State Variables
  value: number
  rowIndex: number
  colIndex: number
  selectedSquare: [number, number]
  lockedSquares: [number, number][]
  conflictingCells: [number, number][]
  candidates: { [key: string]: number[] }
  isBoardCompleted: () => boolean

  // State Update Functions
  setSelectedSquare: React.Dispatch<React.SetStateAction<[number, number]>>
}

const Square: React.FC<SquareProps> = ({
  // State Variables
  value,
  rowIndex,
  colIndex,
  selectedSquare,
  lockedSquares,
  conflictingCells,
  candidates,

  //Functions
  isBoardCompleted,

  // State Update Handlers
  setSelectedSquare,
}) => {
  // Check if the current square is conflicting to be able to set the styles
  const isSquareConflicting = () => {
    return conflictingCells.find(([conflictRow, conflictCol]) => {
      return conflictRow === rowIndex && conflictCol === colIndex
    })
  }

  const getStylesForGrid = (): StyleProp<ViewStyle> => {
    let gridAppliedStyles: StyleProp<ViewStyle> = [styles.grid]

    // Top border for the first row
    if (rowIndex === 0) {
      gridAppliedStyles.push(styles.borderTop)
    }

    // Bottom border for the last row
    if (rowIndex === 8) {
      gridAppliedStyles.push(styles.borderBottomEdge)
    } else if ((rowIndex + 1) % 3 === 0) {
      gridAppliedStyles.push(styles.borderBottom)
    }

    // Left border for the first column
    if (colIndex === 0) {
      gridAppliedStyles.push(styles.borderLeft)
    }

    // Right border for the last column
    if (colIndex === 8) {
      gridAppliedStyles.push(styles.borderRightEdge)
    } else if ((colIndex + 1) % 3 === 0) {
      gridAppliedStyles.push(styles.borderRight)
    }

    // Locked squares styling
    if (isLocked) {
      gridAppliedStyles.push(styles.lockedSquare)
    }

    // Conflicting squares
    if (isSquareConflicting()) {
      gridAppliedStyles.push(styles.conflictingSquare)
    }

    if (isBoardCompleted() && conflictingCells.length === 0) {
      gridAppliedStyles.push(styles.gridCompleted)
    }

    // Selected square
    if (isSelected) {
      gridAppliedStyles.push(styles.selectedSquare)
    }

    return gridAppliedStyles
  }

  const getStylesForText = (): StyleProp<TextStyle> => {
    let TextAppliedStyles: StyleProp<TextStyle> = [styles.text]

    if (isLocked) {
      TextAppliedStyles.push(styles.textLocked)
    }

    if (isSquareConflicting()) {
      TextAppliedStyles.push(styles.textConflicting)
    }

    return TextAppliedStyles
  }

  const isLocked = lockedSquares.some(
    ([rIndex, cIndex]) => rIndex === rowIndex && cIndex === colIndex
  )
  const isSelected =
    rowIndex === selectedSquare[0] && colIndex === selectedSquare[1]

  // Get markers for this cell from the candidates
  const key = `${rowIndex},${colIndex}`
  const markers: number[] = candidates[key] || []

  const renderMarkerItem = ({ item }: { item: number }) => (
    <View>
      <Text style={styles.markerText}>{item}</Text>
    </View>
  )

  return (
    <TouchableOpacity
      onPress={() => setSelectedSquare([rowIndex, colIndex])}
      style={getStylesForGrid()}
    >
      <View>
        {value !== 0 ? (
          <Text style={getStylesForText()}>{value}</Text>
        ) : (
          <FlatList
            data={markers.sort()}
            renderItem={renderMarkerItem}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    aspectRatio: 1,
    padding: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  borderTop: {
    borderTopWidth: 2.5,
    borderColor: "#7C93C3",
  },

  borderBottom: {
    borderBottomWidth: 2.5,
    borderColor: "#7C93C3",
  },

  borderRight: {
    borderRightWidth: 2.5,
    borderColor: "#7C93C3",
  },

  borderLeft: {
    borderLeftWidth: 2.5,
    borderColor: "#7C93C3",
  },

  // Edge borders for the right and bottom edges
  borderBottomEdge: {
    borderBottomWidth: 2.5,
    borderColor: "#7C93C3",
  },

  borderRightEdge: {
    borderRightWidth: 2.5,
    borderColor: "#7C93C3",
  },

  gridCompleted: {
    backgroundColor: "#c9d9c5",
  },

  selectedSquare: {
    borderColor: "#d8850a",
    borderWidth: 2.5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },

  lockedSquare: {
    backgroundColor: "#7C93C322",
  },

  conflictingSquare: {
    backgroundColor: "#FF000055",
  },

  text: {
    fontSize: 26,
    color: "#7C93C3",
    fontWeight: "400",
  },

  textLocked: {
    fontWeight: "600",
    color: "#000000cc",
  },

  textConflicting: {
    color: "#FF0000",
  },

  markerText: {
    fontSize: 10,
    paddingHorizontal: 2,
    color: "#1E2A5E",
    fontWeight: "400",
  },
})

export default Square
