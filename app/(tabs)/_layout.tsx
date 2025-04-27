import { USER_ONLINE_EVENT } from "@/constants";
import { useSocket } from "@/contexts/SocketProvider";
import { useGetAuthUser } from "@/libs/React Query/auth";
import { useGetAllNotifications } from "@/libs/React Query/notification";
import { socket } from "@/libs/socket";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function TabLayout() {
  const { data: user, isLoading: isGettingAuthUser } = useGetAuthUser();
  const { data: notifications, isLoading: isGettingNotification } =
    useGetAllNotifications();
  const { onlineUsers, setOnlineUsers } = useSocket();

  const hasUnreadNotifications = notifications?.some(
    (notification) => !notification.isRead
  );

  useEffect(() => {
    const handleConnect = () => {
      console.log("socket connected");

      if (user && !onlineUsers.includes(user._id)) {
        console.log("emitting user online...");
        socket.emit(USER_ONLINE_EVENT, user._id);
      }
    };

    if (!socket.connected) {
      socket.connect();
    }

    if (socket.connected && user && !onlineUsers.includes(user._id)) {
      console.log("Socket already connected, emitting user online...");
      socket.emit(USER_ONLINE_EVENT, user._id);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setOnlineUsers(onlineUsers.filter((userId) => userId !== user?._id));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [user, onlineUsers, setOnlineUsers]);

  if (!isGettingAuthUser && !user) return <Redirect href={"/(auth)/sign-in"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#17255470",
        tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: "#f8fafc", height: 64, paddingTop: 4 },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: ({ color }) => (
            <Text
              style={{ color }}
              className="text-black text-sm font-poppins-medium"
            >
              Explore
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="travel-explore" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: ({ color }) => (
            <Text
              style={{ color }}
              className="text-black text-sm font-poppins-medium"
            >
              Chat
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: ({ color }) => (
            <Text
              style={{ color }}
              className="text-black text-sm font-poppins-medium"
            >
              Notification
            </Text>
          ),
          tabBarIcon: ({ color }) => {
            return (
              <View className="relative">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={color}
                />
                {!isGettingNotification && hasUnreadNotifications && (
                  <View className="w-2 h-2 bg-red-500 rounded-full absolute right-0"></View>
                )}
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: ({ color }) => (
            <Text
              style={{ color }}
              className="text-black text-sm font-poppins-medium"
            >
              Account
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
