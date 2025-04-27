import { Toasts } from "@backpackapp-io/react-native-toast";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { PaperProvider } from "react-native-paper";

import "../global.css";
import { SocketProvider } from "@/contexts/SocketProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  const [loaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <KeyboardProvider>
          <GestureHandlerRootView>
            <PaperProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="locations"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="groupChats"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="chats" options={{ headerShown: false }} />
              </Stack>

              <Toasts
                globalAnimationConfig={{}}
                defaultStyle={{
                  text: {
                    fontFamily: "Poppins-Regular",
                    color: "#083344",
                    fontSize: 14,
                  },
                  view: { backgroundColor: "#f1f5f9", borderRadius: 8 },
                }}
              />
            </PaperProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}
