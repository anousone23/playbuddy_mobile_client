import { Href, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppName from "@/components/shared/AppName";
import CustomButton from "@/components/shared/CustomButton";

import FormField from "@/components/shared/FormField";
import { useActivateAccount, useLogin } from "@/libs/React Query/auth";
import { LoginFormType } from "@/types";
import FastImage from "react-native-fast-image";
import { Modal } from "react-native-paper";
import images from "../../constants/images";

export default function SignInScreen() {
  const [form, setForm] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [isAccountDeactivated, setIsAccountDeativated] = useState(false);

  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: activateAccount, isPending: isActivating } =
    useActivateAccount({ setIsAccountDeativated });

  async function handleLogin() {
    const credentials = {
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    };

    login(credentials, {
      onError: (error) => {
        if (error.response.data.message === "Account is deactivated") {
          setIsAccountDeativated(true);
        }
      },
    });
  }

  function handleActivateAccount() {
    if (!form.email) return;

    activateAccount(form.email);
  }

  return (
    <KeyboardAvoidingView className="flex-1 w-full h-full bg-slate-50 relative">
      <FastImage
        source={images.auth}
        resizeMode={FastImage.resizeMode.cover}
        style={{ width: "100%", height: 500 }}
      />

      <ScrollView className="bg-slate-50 w-full absolute bottom-0 py-8 rounded-t-3xl flex h-[560px] flex-col">
        <View className="flex flex-row items-center justify-center text-black gap-2">
          <Text className="font-poppins-bold text-3xl">Sign in to</Text>
          <AppName />
        </View>

        <View>
          <View className="mx-8 mt-12 flex flex-col gap-8">
            <FormField
              label="email"
              labelStyles="text-lg"
              placeholder="Enter your email"
              value={form?.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <FormField
              type="password"
              label="Password"
              labelStyles="text-lg"
              placeholder="Enter your password"
              value={form?.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <Link
              href={"/(auth)/forget-password" as Href}
              className="font-poppins-regular underline text-black"
            >
              Forgot your password?
            </Link>

            <CustomButton
              title="Login"
              titleStyles="text-lg"
              onPress={handleLogin}
              containerStyles="mt-8"
              disabled={isLoggingIn}
              isLoading={isLoggingIn}
            />

            <Text className="font-poppins-regular text-black text-center">
              Don't have an account?{" "}
              <Link
                href={"/(auth)/sign-up" as Href}
                className="underline text-primary"
              >
                Sign up
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>

      <StatusBar hidden={true} />

      <Modal
        visible={isAccountDeactivated}
        onDismiss={() => setIsAccountDeativated(false)}
      >
        <View className="bg-slate-50 px-4 py-8 mx-4 rounded-md gap-y-8">
          <View className="gap-y-4">
            <Text className="text-black font-poppins-bold text-center text-lg">
              Your account is deactivated
            </Text>
            <Text className="text-black font-poppins-regular text-center">
              You must reactivate your account before logging in
            </Text>
          </View>

          <View className="flex-row justify-evenly items-center">
            <TouchableOpacity
              className={`bg-primary px-4 py-2 rounded-lg disabled:bg-sky-600`}
              disabled={isActivating}
              onPress={handleActivateAccount}
            >
              <Text className="text-white font-poppins-semiBold text-center">
                Reactivate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-slate-100 border border-slate-300 px-4 py-2 rounded-lg"
              onPress={() => setIsAccountDeativated(false)}
              disabled={isActivating}
            >
              <Text className="text-black font-poppins-semiBold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
