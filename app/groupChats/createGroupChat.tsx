import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/shared/CustomButton";
import FormField from "@/components/shared/FormField";
import SkillSelection from "@/components/SkillSelection";
import SportTypeSelection from "@/components/SportTypeSelection";
import { useCreateGroupChat } from "@/libs/React Query/groupChat";
import { useGetLocationSportTypes } from "@/libs/React Query/location";
import { ISportType } from "@/types";

export default function CreateGroupChatScreen() {
  const { locationId } = useLocalSearchParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    maxMembers: 0,
  });
  const [selectedSportType, setSelectedSportType] = useState<ISportType | null>(
    null
  );
  const [selectedSkill, setSelectedSkill] = useState("");

  const { data: locationSportTypes, isLoading: isGettingLocationSportTypes } =
    useGetLocationSportTypes(locationId as string);
  const { mutate: createGroupChat, isPending: isCreatingGroupChat } =
    useCreateGroupChat({ setForm, setSelectedSportType, setSelectedSkill });

  const handleCreateGroupChat = () => {
    const sportTypeId = selectedSportType?._id;

    createGroupChat({
      locationId: locationId as string,
      groupData: {
        name: form.name,
        description: form.description,
        maxMembers: form.maxMembers,
        sportType: sportTypeId!,
        preferredSkill: selectedSkill,
      },
    });
  };

  if (isGettingLocationSportTypes)
    return (
      <SafeAreaView className="items-center justify-center">
        <ActivityIndicator size={"large"} color="#0ea5e9" />
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5">
      <ScrollView className="" nestedScrollEnabled={true}>
        <View className="gap-y-8">
          {/* group name */}
          <FormField
            label="Group name"
            inputStyles="text-sm"
            placeholder="Enter your group chat name"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          {/* group description */}
          <View className="gap-y-2">
            <Text className={`font-poppins-medium text-black`}>
              Group description (Optional)
            </Text>

            <TextInput
              style={{ textAlignVertical: "top" }}
              className="bg-slate-100 font-poppins-regular border border-slate-300  text-black rounded-md px-2 text-sm py-4 pb-8"
              placeholder="Enter your group chat description"
              placeholderTextColor={"#08334480"}
              multiline={true}
              numberOfLines={10}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              maxLength={300}
            />

            <View className="absolute right-2 bottom-2">
              <Text className="font-poppins-regular text-sm text-black opacity-70">
                {form.description.length}/300
              </Text>
            </View>
          </View>

          {/* sport type */}
          <SportTypeSelection
            sportTypes={locationSportTypes!.sort((a, b) =>
              a.name.localeCompare(b.name)
            )}
            selectedSportType={selectedSportType}
            setSelectedSportType={setSelectedSportType}
          />

          {/* preferred skill */}
          <SkillSelection
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />

          {/* max members */}
          <FormField
            type="number"
            label="Max members (2-30)"
            inputStyles="text-sm"
            placeholder="Enter your group max members"
            value={form.maxMembers}
            onChangeText={(value) => setForm({ ...form, maxMembers: +value })}
          />
        </View>

        <CustomButton
          isLoading={isCreatingGroupChat}
          disabled={isCreatingGroupChat}
          title="Create"
          onPress={handleCreateGroupChat}
          containerStyles="mb-12 mt-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
