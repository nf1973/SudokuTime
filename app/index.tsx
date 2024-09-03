import React from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Stack, useRouter } from "expo-router"
//import { RootStackParamList } from "./_layout"
import { LinearGradient } from "expo-linear-gradient"

import Logo from "../components/Logo"
import HomeScreenQuote from "../components/HomeScreenQuote"

type Board = number[][]

interface BoardItem {
  board: Board
  id: string
  name: string
  difficulty: string
}

const Home = () => {
  //const navigation = useNavigation<HomeScreenNavigationProp>()

  const router = useRouter()

  const handleStartGame = (level: string) => {
    const randomBoard = (difficulty: string): BoardItem => {
      const boardsData: BoardItem[] = require("../assets/boards.json")
      const filteredBoards = boardsData.filter(
        (board) => board.difficulty === difficulty
      )

      if (filteredBoards.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredBoards.length)
        return filteredBoards[randomIndex]
      }
      return {
        board: Array.from({ length: 9 }, () => Array(9).fill(0)),
        id: "empty",
        name: "0",
        difficulty: "Easy",
      } // Return empty board which is not really useful TODO: Find a better solution
    }

    const {
      board: initialBoard,
      id: boardId,
      name: name,
      difficulty: difficulty,
    } = randomBoard(level)

    // navigation.navigate("Game", { initialBoard, boardId, difficulty, name })

    // Navigate to the Game screen with the appropriate params
    router.push({
      pathname: "/game",
      params: {
        initialBoard: JSON.stringify(initialBoard),
        boardId,
        difficulty,
        name,
      },
    })
  }

  return (
    <>
      <LinearGradient
        colors={["#1E2A5E", "#2E4F9C"]}
        style={StyleSheet.absoluteFill}
      />
      <Stack.Screen
        options={{
          title: "Home",
          headerShown: false,
          statusBarColor: "#1E2A5E",
        }}
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <HomeScreenQuote />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleStartGame("Easy")
            }}
          >
            <Text style={styles.buttonText}>Start Easy Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleStartGame("Medium")
            }}
          >
            <Text style={styles.buttonText}>Start Medium Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleStartGame("Expert")
            }}
          >
            <Text style={styles.buttonText}>Start Expert Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#1E2A5E",
  },
  logoContainer: {
    marginTop: 64,
    marginBottom: 0,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  image: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    width: 220,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#d8850a",
    borderColor: "#2e2e2e10",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
})
