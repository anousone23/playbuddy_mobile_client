import { Href, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppName from "@/components/shared/AppName";
import CustomButton from "@/components/shared/CustomButton";
import FormField from "@/components/shared/FormField";
import { useResetPassword } from "@/libs/React Query/auth";
import FastImage from "react-native-fast-image";
import images from "../../constants/images";

type ResetPasswordType = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function ForgotPasswordScreen() {
  const { email } = useLocalSearchParams();

  const [form, setForm] = useState<ResetPasswordType>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const { mutate: resetPassword, isPending: isResettingPassword } =
    useResetPassword();

  function handleResetPassword() {
    resetPassword({
      email: email as string,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <FastImage
        source={images.auth}
        resizeMode={FastImage.resizeMode.cover}
        style={{ width: "100%", height: 500 }}
      />

      <View className="bg-slate-50 absolute w-full bottom-0 py-8 rounded-t-3xl flex h-[600px] flex-col">
        <View className="flex flex-row items-center justify-center text-black gap-2">
          <AppName />
        </View>

        <View className="mt-4 flex flex-col gap-y-2">
          <Text className="font-poppins-medium text-center text-lg text-black">
            Reset password
          </Text>

          <Text className="font-poppins-regular text-center text-black">
            Your new password must be different from previous password
          </Text>
        </View>

        <ScrollView>
          <View className="mx-8 mt-12 flex flex-col gap-8">
            <FormField
              type="password"
              label="New password"
              placeholder="Enter your new password"
              value={form?.newPassword}
              onChangeText={(value) => setForm({ ...form, newPassword: value })}
            />

            <FormField
              type="password"
              label="Confirm new password"
              placeholder="Enter your confirm password"
              value={form?.confirmNewPassword}
              onChangeText={(value) =>
                setForm({ ...form, confirmNewPassword: value })
              }
            />

            <CustomButton
              isLoading={isResettingPassword}
              disabled={isResettingPassword}
              title="Continue"
              onPress={handleResetPassword}
              containerStyles="mt-12"
            />

            <CustomButton
              title="Cancel"
              onPress={() => {
                router.replace("(auth)/sign-in" as Href);
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
