import { Redirect, Stack } from "expo-router";
import React from "react";

import { useGetAuthUser } from "@/libs/React Query/auth";

export default function AuthLayout() {
  const { data: user, isLoading: isGettingAuthUser } = useGetAuthUser();

  if (!isGettingAuthUser && user) return <Redirect href={"/(tabs)/explore"} />;

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="forget-password" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
