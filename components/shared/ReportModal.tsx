import { AntDesign } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Menu, Modal } from "react-native-paper";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import { useReportUser } from "@/libs/React Query/user";
import { ReportFormType } from "@/types";
import { useReportGroupChat } from "@/libs/React Query/groupChat";

type ReportModalType = {
  type: "groupChat" | "user";
  reasonOptions: string[];
  form: ReportFormType;
  setForm: Dispatch<SetStateAction<ReportFormType>>;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  reportedUser?: string | null;
  reportedGroupChat?: string | null;
};

export default function ReportModal({
  type,
  reasonOptions,
  form,
  setForm,
  modalVisible,
  setModalVisible,
  reportedUser,
  reportedGroupChat,
}: ReportModalType) {
  const [reasonOptionsVisible, setReasonOptionVisible] = useState(false);

  const { mutate: reportUser, isPending: isReportingUser } = useReportUser();
  const { mutate: reportGroupChat, isPending: isReportingGroupChat } =
    useReportGroupChat();

  function handleReasonOptionChange(option: string) {
    setForm({ ...form, reason: option });

    setReasonOptionVisible(false);
  }

  async function handleSubmitForm() {
    if (type === "user") {
      if (!reportedUser) return;

      reportUser(
        {
          userToReportId: reportedUser as string,
          reportData: form,
        },
        {
          onSuccess: () => setModalVisible(false),
        }
      );
    } else {
      if (!reportedGroupChat) return;

      reportGroupChat(
        {
          groupChatId: reportedGroupChat as string,
          reportData: form,
        },
        {
          onSuccess: () => {
            setForm({ reason: "", description: "", image: "" });
            setModalVisible(false);
          },
        }
      );
    }
  }

  return (
    <Modal
      visible={modalVisible}
      onDismiss={() => {
        setForm({ reason: "", description: "", image: "" });
        setModalVisible(false);
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="bg-slate-100 px-6 py-6 rounded-md gap-y-4">
        {/* reson for report */}
        <View className="gap-y-2">
          <Text className="font-poppins-semiBold text-black">
            Reason for reporting
          </Text>

          {/* reason option modal */}
          <Menu
            style={{
              backgroundColor: "#f1f5f9",
              width: "82%",
            }}
            contentStyle={{ backgroundColor: "#f1f5f9" }}
            visible={reasonOptionsVisible}
            onDismiss={() => setReasonOptionVisible(false)}
            anchorPosition="bottom"
            anchor={
              <TouchableOpacity
                className="border border-slate-300 bg-slate-100 px-2 py-2 rounded-md"
                onPress={() => setReasonOptionVisible(true)}
              >
                {form.reason ? (
                  <Text className="font-poppins-medium text-black text-sm">
                    {form.reason}
                  </Text>
                ) : (
                  <Text className="font-poppins-medium text-[#08334480] text-sm">
                    Select a reason for report
                  </Text>
                )}

                <View className="absolute right-2 bottom-2">
                  <AntDesign name="down" size={16} color="#083344" />
                </View>
              </TouchableOpacity>
            }
          >
            {reasonOptions.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => handleReasonOptionChange(option)}
                title={option}
                titleStyle={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  color: "#083344",
                }}
              />
            ))}
          </Menu>
        </View>

        {/* additional reason */}
        <View className="gap-y-2">
          <Text className={`font-poppins-semiBold text-black`}>
            Description (optional)
          </Text>

          <TextInput
            style={{ textAlignVertical: "top" }}
            className="bg-slate-100 font-poppins-medium border border-slate-300  text-black rounded-md px-2  text-sm py-4 pb-10"
            placeholder="Enter your group chat description"
            placeholderTextColor={"#08334480"}
            multiline={true}
            value={form.description}
            numberOfLines={10}
            onChangeText={(text) => setForm({ ...form, description: text })}
            maxLength={300}
          />

          <View className="absolute right-2 bottom-2">
            <Text className="font-poppins-regular text-sm text-black opacity-70">
              {form.description?.length}/300
            </Text>
          </View>
        </View>

        {/* evidence */}
        <FormField
          label="Evidence"
          placeholder="Add an evidence image"
          value={""}
          onChangeText={() => {}}
        />

        <CustomButton
          disabled={isReportingUser || isReportingGroupChat}
          isLoading={isReportingUser || isReportingGroupChat}
          title="Report"
          containerStyles="bg-red-500 mt-8"
          onPress={handleSubmitForm}
        />
      </View>
    </Modal>
  );
}
