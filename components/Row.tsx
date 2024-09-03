// Row.js
import React from "react"
import { View, StyleSheet } from "react-native"
import Square from "./Square"

interface RowProps {
  // State Variables
  lockedSquares: [number, number][]
  rowData: number[]
  rowIndex: number
  selectedSquare: [number, number]
  conflictingCells: [number, number][]
  candidates: {}
  isBoardCompleted: () => boolean

  //State Update Handlers
  setSelectedSquare: React.Dispatch<React.SetStateAction<[number, number]>>
}
const Row: React.FC<RowProps> = ({
  // State Variables
  rowData,
  rowIndex,
  selectedSquare,
  lockedSquares,
  conflictingCells,
  candidates,
  isBoardCompleted,

  // State Update Handlers
  setSelectedSquare,
}) => {
  return (
    <View style={styles.row}>
      {rowData.map((square, colIndex) => (
        <View
          style={styles.square}
          key={colIndex.toString() + rowIndex.toString()}
        >
          <Square
            value={square}
            selectedSquare={selectedSquare}
            lockedSquares={lockedSquares}
            rowIndex={rowIndex}
            colIndex={colIndex}
            setSelectedSquare={setSelectedSquare}
            conflictingCells={conflictingCells}
            candidates={candidates}
            isBoardCompleted={isBoardCompleted}
          />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    borderColor: "#1E2A5E55",
    borderWidth: 0.5,
    width: "11%",
    aspectRatio: 1,
    margin: 0,
    padding: 0,
  },
})

export default Row
