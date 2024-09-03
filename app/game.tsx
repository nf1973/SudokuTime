import { Stack, useLocalSearchParams } from "expo-router"
import React, { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, View, Dimensions, Text } from "react-native"
import { RouteProp } from "@react-navigation/native"

// Components
import SudokuBoard from "../components/SudokuBoard"
import Keypad from "../components/Keypad"
import ModeSwitcher from "../components/ModeSwitcher"
import Timer from "../components/Timer"
import UndoRedoButtons from "../components/UndoRedoButtons"

// Types
import { Move } from "../types/moveHistoryTypes"
import { Mode } from "../types/modeTypes"
type Board = number[][]
type LockedCell = [number, number]

const width = Dimensions.get("window").width

// Main App component
const Game = (): JSX.Element => {
  const { initialBoard, boardId, difficulty, name } = useLocalSearchParams()
  const [board, setBoard] = useState<Board>(() => {
    try {
      return JSON.parse(initialBoard as string) // Convert JSON string back to an array
    } catch (error) {
      console.error("Failed to parse initialBoard:", error)
      return Array.from({ length: 9 }, () => Array(9).fill(0)) // Default to an empty board if parsing fails
    }
  })
  const [lockedSquares, setLockedSquares] = useState<LockedCell[]>([])
  const [selectedSquare, setSelectedSquare] = useState<[number, number]>([4, 4])
  const [conflictingCells, setConflictingCells] = useState<LockedCell[]>([])
  const [isBoardConflicting, setIsBoardConflicting] = useState<boolean>(false) /// NEW LINE
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [moveFutures, setMoveFutures] = useState<Move[]>([])
  const [mode, setMode] = useState<Mode>(Mode.Place)
  const [candidates, setCandidates] = useState({})
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)

  useEffect(() => {
    // Compute locked cells (only need to do this once at the start of the game)
    const lockedCells: LockedCell[] = []

    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
        if (board[rowIndex][colIndex] !== 0) {
          lockedCells.push([rowIndex, colIndex])
        }
      }
    }
    setLockedSquares(lockedCells)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Deps array is intentionally empty so it only runs once at the start of the game

  // Function to check if the same number is in the same row,  coluumn or 3x3 subgrid as the selected square.
  // Returns an array of conflicting cells
  const findConflicts = (
    group: number[],
    indices: [number, number][]
  ): [number, number][] => {
    const seen = new Map<number, [number, number][]>()
    const conflicts: [number, number][] = []

    group.forEach((num, index) => {
      if (num !== 0) {
        if (seen.has(num)) {
          conflicts.push(...seen.get(num)!, indices[index])
        } else {
          seen.set(num, [indices[index]])
        }
      }
    })

    return conflicts
  }

  // Check if the board state is valid and store the set of conflicting cells in state (conflictingCells)
  // Returns true if the board is valid
  // setConflictingCells() is passed to Keypad as a prop so that it be called when the board changes
  // TODO: Find a better way to do this
  const checkValidBoard = (thisBoard: number[][]): boolean => {
    let conflicts: [number, number][] = []

    // Check each row
    for (let row = 0; row < thisBoard.length; row++) {
      const rowIndices = thisBoard[row].map(
        (_, col) => [row, col] as [number, number]
      )
      conflicts = conflicts.concat(findConflicts(thisBoard[row], rowIndices))
    }

    // Check each column
    for (let col = 0; col < thisBoard[0].length; col++) {
      const column = thisBoard.map((row) => row[col])
      const colIndices = thisBoard.map(
        (_, row) => [row, col] as [number, number]
      )
      conflicts = conflicts.concat(findConflicts(column, colIndices))
    }

    // Check each 3x3 sub-grid
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const subGrid: number[] = []
        const subGridIndices: [number, number][] = []
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            subGrid.push(thisBoard[boxRow + r][boxCol + c])
            subGridIndices.push([boxRow + r, boxCol + c])
          }
        }
        conflicts = conflicts.concat(findConflicts(subGrid, subGridIndices))
      }
    }

    setConflictingCells(conflicts)
    return conflicts.length === 0
  }

  // Check if the board is completed by checking if there are any zeros remaining
  // Returns true if the board is completed
  // This is sent to the SudokuBoard for rendering and to the timer so it can be stopped when the board is completed
  const isBoardCompleted = () => {
    const numRows = board.length
    const numCols = board[0].length
    // Check rows and columns in a single pass
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (board[row][col] === 0) {
          return false // Early exit if any zero is found
        }
      }
    }
    return true // No zeros found in any row or column
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Board #" + name + " (" + difficulty + ")",
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Timer
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            isBoardCompleted={isBoardCompleted}
            conflictingCells={conflictingCells}
          />
        </View>
        <View style={styles.boardContainer}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <SudokuBoard
              board={board}
              setBoard={setBoard}
              lockedSquares={lockedSquares}
              selectedSquare={selectedSquare}
              setSelectedSquare={setSelectedSquare}
              conflictingCells={conflictingCells}
              candidates={candidates}
              isBoardCompleted={isBoardCompleted}
              isBoardConflicting={isBoardConflicting}
              setIsBoardConflicting={setIsBoardConflicting}
            />
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <View style={styles.keypadContainer}>
            <Keypad
              board={board}
              setBoard={setBoard}
              lockedSquares={lockedSquares}
              conflictingCells={conflictingCells}
              setConflictingCells={setConflictingCells}
              setMoveHistory={setMoveHistory}
              setMoveFutures={setMoveFutures}
              checkValidBoard={checkValidBoard}
              candidates={candidates}
              setCandidates={setCandidates}
              mode={mode}
              setIsBoardConflicting={setIsBoardConflicting}
              selectedSquare={selectedSquare}
            />
          </View>
          <View style={styles.modeSwitcherContainer}>
            <ModeSwitcher mode={mode} setMode={setMode} />
          </View>

          <View style={styles.undoRedoContainer}>
            <UndoRedoButtons
              board={board}
              selectedSquare={selectedSquare}
              moveFutures={moveFutures}
              moveHistory={moveHistory}
              setMoveHistory={setMoveHistory}
              setMoveFutures={setMoveFutures}
              setBoard={setBoard}
              setSelectedSquare={setSelectedSquare}
              setCandidates={setCandidates}
              checkValidBoard={checkValidBoard}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  topContainer: {
    flex: 1,
    justifyContent: "center",
  },
  boardContainer: {
    display: "flex",
    height: width, //because we need put a square inside, set height of this container to be the same as the width of the screen
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  lowerContainer: {
    flex: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  keypadContainer: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  modeSwitcherContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  undoRedoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
})

export default Game
