import { Link, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider, DefaultTheme } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"

export default function RootLayout() {
  return (
    <>
      <ThemeProvider value={DefaultTheme}>
        {/* <RealmCustomProvider> */}
        <Stack
          screenOptions={
            {
              // headerRight: () => (
              //   <Link href="/login" asChild>
              //     <FontAwesome name="user-circle-o" size={24} color="darkgray" />
              //   </Link>
              // ),
            }
          }
        ></Stack>
        {/* </RealmCustomProvider> */}
      </ThemeProvider>
      <StatusBar style="auto" />
    </>
  )
}
