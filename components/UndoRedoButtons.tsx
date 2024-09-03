import React from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Mode } from "../types/modeTypes"
import {
  Move,
  //PlaceMove, MarkMove
} from "../types/moveHistoryTypes"

interface UndoRedoButtonsProps {
  // State Variables
  moveHistory: Move[]
  moveFutures: Move[]
  board: number[][]
  selectedSquare: [number, number]

  // State Update Functions
  setMoveHistory: React.Dispatch<React.SetStateAction<Move[]>>
  setMoveFutures: React.Dispatch<React.SetStateAction<Move[]>>
  setBoard: React.Dispatch<React.SetStateAction<number[][]>>
  setSelectedSquare: React.Dispatch<React.SetStateAction<[number, number]>>
  setCandidates: React.Dispatch<
    React.SetStateAction<{ [key: string]: number[] }>
  >

  // Board Validation
  checkValidBoard: (board: number[][]) => boolean
}
const UndoRedoButtons: React.FC<UndoRedoButtonsProps> = ({
  // State Variables
  moveFutures,
  moveHistory,

  // State Update Functions
  setMoveHistory,
  setMoveFutures,
  setBoard,
  setSelectedSquare,
  setCandidates,

  // Board Validation
  checkValidBoard,
}) => {
  const handleUndo = () => {
    if (moveHistory.length === 0) {
      return
    }

    // Get the last move from the history
    const lastMove = moveHistory[moveHistory.length - 1]

    if (lastMove.moveType === "place") {
      // Destructure the place move
      const { row, col, from } = lastMove

      // Revert the board to the old value
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r, _rIndex) => [...r])
        newBoard[row][col] = from // Revert to the old value
        checkValidBoard(newBoard) // Re-check if the board is valid
        setSelectedSquare([row, col]) // Set the selected square to the reverted move
        return newBoard
      })
    } else if (lastMove.moveType === "mark") {
      // Destructure the mark move
      const { row, col, from } = lastMove

      // Revert the candidates
      setCandidates((prevCandidates) => {
        const key = `${row},${col}`
        const updatedCandidates = {
          ...prevCandidates,
          [key]: from, // Restore the previous candidates
        }
        setSelectedSquare([row, col]) // Set the selected square to the reverted move
        return updatedCandidates
      })
    }

    // Remove the last move from the history and add it to moveFutures for redo functionality
    setMoveHistory((prevHistory) => prevHistory.slice(0, -1))
    setMoveFutures((prevFutures) => [lastMove, ...prevFutures]) // Push the undone move onto moveFutures
  }

  const handleRedo = () => {
    if (moveFutures.length === 0) {
      return
    }

    // Get the last undone move from moveFutures
    const nextMove = moveFutures[0]

    if (nextMove.moveType === "place") {
      const { row, col, to } = nextMove

      // Apply the move to the board
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r])
        newBoard[row][col] = to
        checkValidBoard(newBoard)
        setSelectedSquare([row, col])
        return newBoard
      })
    } else if (nextMove.moveType === "mark") {
      const { row, col, to } = nextMove

      // Apply the move to the candidates
      setCandidates((prevCandidates) => {
        const key = `${row},${col}`
        const updatedCandidates = {
          ...prevCandidates,
          [key]: to,
        }
        setSelectedSquare([row, col])
        return updatedCandidates
      })
    }

    // Add the redone move to the moveHistory and remove it from moveFutures
    setMoveHistory((prevHistory) => [...prevHistory, nextMove])
    setMoveFutures((prevFutures) => prevFutures.slice(1))
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleUndo}>
        <MaterialIcons name="undo" size={32} color="#1E2A5E" />
        <Text style={styles.text}>Undo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRedo}>
        <MaterialIcons name="redo" size={24} color="black" />
        <Text style={styles.text}>Redo</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#eee",
    borderColor: "#1E2A5E",
    borderWidth: 1,
  },

  text: {
    fontSize: 12,
    color: "#1E2A5E",
  },
})

export default UndoRedoButtons
