import React from "react"
import { StyleSheet, Text, View } from "react-native"

const HomeScreenQuote = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>
        "Sudoku is a game that requires no language, but connects people through
        numbers."
      </Text>
      <Text style={styles.attribution}>- Maki Kaji</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    maxHeight: 180,
  },
  quote: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#7C93C3",
    marginBottom: 10,
  },
  attribution: {
    fontSize: 16,
    textAlign: "center",
    color: "#7C93C3",
  },
})

export default HomeScreenQuote
