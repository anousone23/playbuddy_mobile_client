import {
  addFriend,
  deactivateAccount,
  getUserLocation,
  getUsersByName,
  reportUser,
  updateProfile,
  uploadImage,
} from "@/api/user";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLogout } from "./auth";

export function useUserLocation() {
  return useQuery({
    queryKey: ["userLocation"],
    queryFn: getUserLocation,
    staleTime: Infinity, // Prevents unnecessary refetching
    retry: false, // Avoid unnecessary retries if permission is denied
  });
}

export function useGetUsersByName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getUsersByName,
    onSuccess: (users) => {
      queryClient.setQueryData(["users"], users);
    },
  });
}

export function useAddFriend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFriend,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });

      toast.success("Friend request sent", {
        position: ToastPosition.BOTTOM,
      });
    },
    onError: (error: AxiosError | any) => {
      toast.error(error.response.data.message || "Failed to add friend", {
        position: ToastPosition.BOTTOM,
      });
    },
  });
}

export function useReportUser() {
  return useMutation({
    mutationFn: reportUser,
    onSuccess: () => {
      toast.success("User reported successfully", {
        position: ToastPosition.BOTTOM,
      });
    },
    onError: (error: AxiosError | any) => {
      toast.error(error.response.data.message || "Failed to report this user", {
        position: ToastPosition.BOTTOM,
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("Profile updated successfully", {
        position: ToastPosition.BOTTOM,
        duration: 2000,
      });
    },
    onError: (error: AxiosError | any) => {
      toast.error(error.response.data.message || "Failed to update profile", {
        position: ToastPosition.BOTTOM,
        duration: 2000,
      });
    },
  });
}

export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();

  return useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("Account deactivated successfully", {
        position: ToastPosition.BOTTOM,
        duration: 2000,
      });

      logout();
    },
    onError: (error: AxiosError | any) => {
      toast.error(error.response.data.message || "Failed to delete account", {
        position: ToastPosition.BOTTOM,
        duration: 2000,
      });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
    onError: (error: AxiosError | any) => {
      toast.error(error.response.data.message || "Failed to upload image", {
        position: ToastPosition.BOTTOM,
        duration: 2000,
      });
    },
  });
}
