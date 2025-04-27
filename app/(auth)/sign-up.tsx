import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/shared/CustomButton";
import FormField from "@/components/shared/FormField";
import { useSignup } from "@/libs/React Query/auth";
import { SignupFormType } from "@/types";
import { Href, Link } from "expo-router";
import { useState } from "react";

export default function SignUpScreen() {
  const [form, setForm] = useState<SignupFormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate: signup, isPending: isSigningUp } = useSignup();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Text className="font-poppins-bold text-2xl text-center mt-16">
        Create an account
      </Text>
      <ScrollView>
        <View className="py-4">
          <View className="mx-8 mt-12 flex flex-col gap-8">
            <FormField
              label="Name"
              labelStyles="text-lg"
              placeholder="Enter your name"
              value={form?.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />

            <FormField
              label="Email"
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

            <FormField
              type="password"
              label="Confirm password"
              labelStyles="text-lg"
              placeholder="Enter your confirm password"
              value={form?.confirmPassword}
              onChangeText={(value) =>
                setForm({ ...form, confirmPassword: value })
              }
            />

            <CustomButton
              isLoading={isSigningUp}
              disabled={isSigningUp}
              title="Sign Up"
              titleStyles="text-lg"
              containerStyles="mt-8"
              onPress={() => {
                signup(form);
              }}
            />

            <Text className="font-poppins-regular text-black text-center">
              Already have an account?{" "}
              <Link
                href={"/(auth)/sign-in" as Href}
                className="underline text-primary"
              >
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
