import images from "@/constants/images";
import { useGetAuthUser } from "@/libs/React Query/auth";
import { useGetLocationById } from "@/libs/React Query/location";
import { IGroupChat, IGroupMessage } from "@/types";
import { formatMessageTime } from "@/utils/helper";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";

export default function GroupChatItem({
  groupChat,
}: {
  groupChat: IGroupChat;
}) {
  const { data: user } = useGetAuthUser();
  const { data: location, isLoading: isGettingLocation } = useGetLocationById(
    groupChat.locationId
  );

  const translateX = useRef(new Animated.Value(100)).current;
  const lastMessage = groupChat.lastMessage as IGroupMessage | null;
  const isMyMessage = lastMessage?.sender === user?._id;
  const isReadByMe = lastMessage?.readBy.some(
    (memberId) => memberId === user?._id
  );

  useEffect(() => {
    if (groupChat.name.length > 6) {
      const startAnimation = () => {
        translateX.setValue(100);
        Animated.timing(translateX, {
          toValue: -50, // Move to left
          duration: 4000, // Adjust speed
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => startAnimation()); // Restart after completion
      };

      startAnimation();
    }
  }, [groupChat, translateX]);

  if (isGettingLocation)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"small"} color={"#0ea5e9"} />
      </View>
    );

  return (
    <>
      <TouchableOpacity
        className="py-4 px-2 rounded-lg flex-row items-center gap-x-4 bg-slate-100"
        style={{ elevation: 3 }}
        onPress={() => {
          router.push({
            pathname: `chats/groupChat/${groupChat._id}` as "/",
            params: { locationName: location?.name },
          });
        }}
      >
        {/* image */}
        <View>
          <View className="h-16 w-16 rounded-full bg-slate-300">
            {groupChat?.image ? (
              <FastImage
                source={{ uri: groupChat?.image }}
                resizeMode={FastImage.resizeMode.cover}
                style={{ width: "100%", height: "100%", borderRadius: 999 }}
              />
            ) : (
              <FastImage
                source={images.groupChatPlaceHolder}
                resizeMode={FastImage.resizeMode.cover}
                style={{ width: "100%", height: "100%", borderRadius: 999 }}
              />
            )}
          </View>
        </View>

        <View className="flex-1 gap-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-medium text-black">
              {groupChat.name}
            </Text>

            {groupChat.name.length > 6 ? (
              <View className="overflow-hidden">
                <Animated.Text
                  className="font-poppins-medium text-black text-sm opacity-50 "
                  style={{
                    transform: [{ translateX }],
                  }}
                >
                  {location?.name}
                </Animated.Text>
              </View>
            ) : (
              <Text className="font-poppins-medium text-black text-sm opacity-50">
                {location?.name}
              </Text>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            {/* last message */}
            {lastMessage && (
              <Text
                className={`flex-1 font-poppins-medium  ${
                  !isMyMessage && !isReadByMe
                    ? "text-black"
                    : " text-[#17255480]"
                } text-sm`}
              >
                {isMyMessage
                  ? `You: ${lastMessage?.text || " photo"}`
                  : lastMessage?.text || " photo"}
              </Text>
            )}

            <View className="flex-row items-center gap-x-4 ">
              {/* unread status */}
              {lastMessage && !isMyMessage && !isReadByMe && (
                <View className="w-3 h-3 bg-primary rounded-full justify-self-end" />
              )}

              {/* timestamp */}
              <Text className="font-poppins-medium text-[#17255480] text-sm ">
                {lastMessage?.createdAt &&
                  formatMessageTime(lastMessage.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
