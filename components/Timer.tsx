import React, { useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

interface TimerProps {
  // State Variables
  isTimerRunning: boolean
  conflictingCells: [number, number][]
  // State Update Functions
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>
  // Functions
  isBoardCompleted: () => boolean
}

const TimerIcon = ({ name }: { name: string }) => {
  return (
    <Ionicons
      name={name as keyof typeof Ionicons.glyphMap}
      size={18}
      color="#1E2A5E"
    />
  )
}

const Timer: React.FC<TimerProps> = ({
  // State Variables
  isTimerRunning,
  conflictingCells,
  isBoardCompleted,

  // State Update Functions
  setIsTimerRunning,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const savedTimeRef = useRef(0) // Save elapsed time when pausing

  useEffect(() => {
    if (isBoardCompleted() && conflictingCells.length === 0) {
      setIsTimerRunning(false)
    }

    let interval: NodeJS.Timeout

    if (isTimerRunning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now()
      }

      interval = setInterval(() => {
        if (startTimeRef.current !== null) {
          const now = Date.now()
          const elapsed =
            Math.floor((now - startTimeRef.current) / 1000) +
            savedTimeRef.current
          setElapsedTime(elapsed)
        }
      }, 1000)
    } else {
      if (startTimeRef.current !== null) {
        savedTimeRef.current += Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        )
      }
      startTimeRef.current = null // Reset start time reference
    }

    return () => clearInterval(interval) // Cleanup the interval on component unmount
  }, [isTimerRunning, isBoardCompleted, setIsTimerRunning, conflictingCells])

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = secs % 60
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleTimer}>
        <View style={styles.row}>
          <TimerIcon
            name={
              isTimerRunning ? "pause-circle-outline" : "play-circle-outline"
            }
          />
          <Text style={styles.time}>{formatTime(elapsedTime)}</Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 0,
    marginRight: 0,
    color: "#1E2A5E",
    minWidth: 44,
    textAlign: "center",
  },
})

export default Timer
