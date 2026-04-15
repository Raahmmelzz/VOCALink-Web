import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [newSpec, setNewSpec] = useState("");

  const specs = user?.specializations || ["Autism Support", "Speech Therapy"];

  const initials = user?.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "ED";

  const handleAddSpec = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newSpec.trim();
    if (!trimmed) return;

    updateUser({ specializations: [...specs, trimmed] });
    setNewSpec("");
  };

  const removeSpec = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    updateUser({ specializations: updated });
  };

  return {
    user,
    specs,
    newSpec,
    setNewSpec,
    initials,
    handleAddSpec,
    removeSpec,
  };
};