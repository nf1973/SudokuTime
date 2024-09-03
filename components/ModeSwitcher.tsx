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
import { Mode } from "../types/modeTypes"

interface ModeSwitcherProps {
  // State Variables
  mode: Mode
  // State Update Functions
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}
const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  // State Variables
  mode,
  // State Update Functions
  setMode,
}) => {
  const handModeSwitch = (newMode: Mode) => {
    setMode(newMode)
  }

  const getStylesForMarkModeButton = () => {
    let appliedStyles: StyleProp<ViewStyle> = []
    if (mode === Mode.Mark) {
      appliedStyles.push(styles.buttonActive)
    } else {
      appliedStyles.push(styles.button)
    }
    return appliedStyles
  }

  const getStylesForPlaceModeButton = () => {
    let appliedStyles: StyleProp<ViewStyle> = []
    if (mode === Mode.Place) {
      appliedStyles.push(styles.buttonActive)
    } else {
      appliedStyles.push(styles.button)
    }
    return appliedStyles
  }

  const placeMarkerData = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const placeMarkerRenderItem = ({ item }: { item: number }) => (
    <View style={styles.placeMarkerItem}>
      <Text style={styles.placeMarkerText}>{item}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={getStylesForPlaceModeButton()}
        onPress={() => handModeSwitch(Mode.Place)}
      >
        <View style={styles.placeNumberView}>
          <Text style={styles.placeNumberText}>4</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={getStylesForMarkModeButton()}
        onPress={() => handModeSwitch(Mode.Mark)}
      >
        <View style={styles.placeNumberView}>
          <FlatList
            data={placeMarkerData}
            renderItem={placeMarkerRenderItem}
            keyExtractor={(item) => item.toString()}
            numColumns={3}
            contentContainerStyle={styles.placeMarkerGrid}
          />
        </View>
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

  buttonActive: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#d8850a88",
    borderColor: "#1E2A5E",
    borderWidth: 1,
  },
  placeNumberView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#1E2A5E",
    borderRadius: 5,
  },
  placeNumberText: {
    fontSize: 28,
  },
  placeNumberTextActive: {
    fontSize: 28,
    color: "#ccc",
  },
  placeMarkerGrid: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  placeMarkerItem: {
    paddingHorizontal: 3,
  },
  placeMarkerText: {
    fontSize: 9,
    color: "#1E2A5E",
  },
})

export default ModeSwitcher
