import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export const useProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    organization: user?.organization || "",
    bio: user?.bio || ""
  });

  // Sync form if user data changes externally (e.g., from another component)
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        organization: user.organization || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiscard = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        organization: user.organization || "",
        bio: user.bio || ""
      });
      alert("Changes discarded!");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulated network sync
    setTimeout(() => {
      updateUser(formData);
      setIsSaving(false);
    }, 800);
  };

  return {
    formData,
    isSaving,
    updateField,
    handleDiscard,
    handleSubmit
  };
};