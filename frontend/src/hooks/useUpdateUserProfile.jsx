import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/user/update", {
          method: "POST",
          headers: {
            "COntent-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
        console.log(typeof data);

        if (!res.ok) throw new Error(data.error || "Something went wrong");

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authuser"] }),
        queryClient.invalidateQueries({ queryKey: ["userprofile"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update Profile");
    },
  });
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
