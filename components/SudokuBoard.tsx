import React from "react"
import { StyleSheet, FlatList } from "react-native"

// Components
import Row from "./Row"

interface SudokuBoardProps {
  // State Variables
  selectedSquare: [number, number]
  lockedSquares: [number, number][]
  board: number[][]
  conflictingCells: [number, number][]
  candidates: {}
  isBoardConflicting: boolean

  // State Update Handlers
  setSelectedSquare: React.Dispatch<React.SetStateAction<[number, number]>>
  setBoard: React.Dispatch<React.SetStateAction<number[][]>>
  setIsBoardConflicting: React.Dispatch<React.SetStateAction<boolean>>

  // Functions
  isBoardCompleted: () => boolean
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  // State Variables
  selectedSquare,
  board,
  lockedSquares,
  conflictingCells,
  candidates,
  isBoardCompleted,

  // State Update Handlers
  setSelectedSquare,
}) => {
  return (
    <FlatList
      data={board}
      renderItem={({ item, index }) => (
        <Row
          rowData={item}
          rowIndex={index}
          selectedSquare={selectedSquare}
          lockedSquares={lockedSquares}
          setSelectedSquare={setSelectedSquare}
          conflictingCells={conflictingCells}
          candidates={candidates}
          isBoardCompleted={isBoardCompleted}
        />
      )}
      keyExtractor={(_item, index) => index.toString()}
      contentContainerStyle={styles.board}
    />
  )
}

const styles = StyleSheet.create({
  board: {
    flexDirection: "column",
    margin: 0,
    padding: 0,
  },
})

export default SudokuBoard
