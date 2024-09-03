import React from "react"
import { View, Text, StyleSheet } from "react-native"

const Logo = () => {
  const gridSize = 3 // Number of rows and columns in the grid

  const renderGrid = () => {
    const rows = []

    for (let row = 0; row < gridSize; row++) {
      const columns = []

      for (let col = 0; col < gridSize; col++) {
        columns.push(<View key={`${row}-${col}`} style={[styles.cell]} />)
      }

      rows.push(
        <View key={row} style={styles.row}>
          {columns}
        </View>
      )
    }

    return rows
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>{renderGrid()}</View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Sudoku Time</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginRight: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  text: {
    fontSize: 40,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    margin: 4,
    padding: 8,
    backgroundColor: "#fff", // Color of each cell
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default Logo
