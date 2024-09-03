import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native"
import { Mode } from "../types/modeTypes"
import { Move, PlaceMove, MarkMove } from "../types/moveHistoryTypes"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"

interface KeypadProps {
  // State Variables
  selectedSquare: [number, number]
  board: number[][]
  lockedSquares: [number, number][]
  conflictingCells: [number, number][]
  candidates: { [key: string]: number[] }
  mode: Mode

  // State Update Functions
  setBoard: React.Dispatch<React.SetStateAction<number[][]>>
  setConflictingCells: React.Dispatch<React.SetStateAction<[number, number][]>>
  setMoveHistory: React.Dispatch<React.SetStateAction<Move[]>>
  setMoveFutures: React.Dispatch<React.SetStateAction<Move[]>>
  setCandidates: React.Dispatch<
    React.SetStateAction<{ [key: string]: number[] }>
  >
  setIsBoardConflicting: React.Dispatch<React.SetStateAction<boolean>>

  // Utility Functions
  checkValidBoard: (board: number[][]) => boolean
}
const Keypad: React.FC<KeypadProps> = ({
  // State Variables
  selectedSquare,
  board,
  lockedSquares,
  mode,
  conflictingCells,

  // State Update Functions
  setBoard,
  setMoveHistory,
  setMoveFutures,
  setCandidates,
  setIsBoardConflicting,

  // Utility Functions
  checkValidBoard,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  const addMovePlaceMode = ([rowIndex, colIndex, from, to]: [
    number,
    number,
    number,
    number
  ]) => {
    const newMove: PlaceMove = {
      moveType: "place",
      row: rowIndex,
      col: colIndex,
      from: from,
      to: to,
    }
    setMoveHistory((prevHistory) => [...prevHistory, newMove])
  }

  const addMoveMarkMode = ([rowIndex, colIndex, from, to]: [
    number,
    number,
    number[],
    number[]
  ]) => {
    const newMove: MarkMove = {
      moveType: "mark",
      row: rowIndex,
      col: colIndex,
      from: from,
      to: to,
    }
    setMoveHistory((prevHistory) => [...prevHistory, newMove])
  }

  const onNumberPress = (item: number) => {
    const [rowIndex, colIndex] = selectedSquare

    // Check if the selected square is locked
    const isLocked = lockedSquares.some(
      ([rIndex, cIndex]) => rIndex === rowIndex && cIndex === colIndex
    )
    // Update only if the selected square is not locked
    if (!isLocked) {
      if (mode === Mode.Place) {
        // Remove the current value if the user presses it when it is already placed
        const currentValue = board[rowIndex][colIndex]
        if (item === currentValue) {
          item = 0
        }
        const newBoard = board.map((row, rIndex) =>
          row.map((val, cIndex) =>
            rIndex === rowIndex && cIndex === colIndex ? item : val
          )
        )
        setBoard(newBoard)
        checkValidBoard(newBoard)
        addMovePlaceMode([rowIndex, colIndex, board[rowIndex][colIndex], item])
        setIsBoardConflicting(
          conflictingCells.some(
            ([rIndex, cIndex]) => rIndex === rowIndex && cIndex === colIndex
          )
        )
        setMoveFutures([])
      }

      if (mode === Mode.Mark) {
        setCandidates((prevCandidates) => {
          // Early exit in case the marker is a zero (because of the clear button!)
          if (item === 0) {
            return prevCandidates
          }

          const key = `${rowIndex},${colIndex}`
          const currentValues = prevCandidates[key] || []

          let updatedValues: number[]
          if (currentValues.includes(item)) {
            updatedValues = currentValues.filter((v) => v !== item)
          } else {
            updatedValues = [...currentValues, item]
          }

          const updatedCandidates: { [key: string]: number[] } = {
            ...prevCandidates,
            [key]: updatedValues,
          }

          addMoveMarkMode([rowIndex, colIndex, currentValues, updatedValues])
          setMoveFutures([])

          return updatedCandidates
        })
      }
    }
  }

  // Render item function for FlatList
  const renderItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        styles.buttonNumber,
        item === 0 ? styles.buttonClear : styles.button,
      ]}
      onPress={() => onNumberPress(item)}
    >
      <View style={styles.buttonTextContainer}>
        {item === 0 && <FontAwesome5 name="eraser" size={24} color="#1E2A5E" />}
        <Text style={item === 0 ? styles.textClear : styles.textNumber}>
          {item === 0 ? "Clear Cell" : item}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.keypad}>
      <FlatList
        data={numbers}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  keypad: {
    marginBottom: 16,
    flex: 4,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 30,
  },
  buttonNumber: {
    backgroundColor: "#3a4777",
    borderColor: "#ccc",
  },
  buttonClear: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    borderColor: "#1E2A5E",
    borderWidth: 1,
  },
  buttonTextContainer: {
    flexDirection: "row",
    gap: 20,
  },
  textNumber: {
    fontSize: 24,
    color: "#fff",
  },
  textClear: {
    fontSize: 18,
    color: "#1E2A5E",
  },
})

export default Keypad
