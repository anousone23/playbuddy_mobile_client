import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppName from "@/components/shared/AppName";
import CustomButton from "@/components/shared/CustomButton";
import FormField from "@/components/shared/FormField";
import { useForgetPassword } from "@/libs/React Query/auth";
import FastImage from "react-native-fast-image";
import images from "../../constants/images";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const { mutate: forgetPassword, isPending: isSendingResetPasswordRequest } =
    useForgetPassword();

  async function handleForgotPassword() {
    if (isSendingResetPasswordRequest) return;

    forgetPassword(email.toLowerCase());

    setEmail("");
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <FastImage
        source={images.auth}
        resizeMode={FastImage.resizeMode.cover}
        style={{ width: "100%", height: 500 }}
      />

      <View className="bg-slate-50 absolute w-full bottom-0 py-8 rounded-t-3xl flex h-[440px] flex-col">
        <View className="flex flex-row items-center justify-center text-black gap-2">
          <AppName />
        </View>

        <Text className="font-poppins-regular text-center text-black mt-4">
          Enter your email to reset your password
        </Text>

        <ScrollView>
          <View className="mx-8 mt-12 flex flex-col gap-8">
            <FormField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />

            <CustomButton
              isLoading={isSendingResetPasswordRequest}
              disabled={isSendingResetPasswordRequest}
              title="Continue"
              onPress={handleForgotPassword}
              containerStyles="mt-12"
            />

            <CustomButton
              title="Back"
              onPress={() => {
                if (isSendingResetPasswordRequest) return;
                router.back();
              }}
              containerStyles="!bg-slate-100 border !border-slate-300"
              titleStyles="!text-black"
            />
          </View>
        </ScrollView>
      </View>

      <StatusBar hidden={true} />
    </SafeAreaView>
  );
}
