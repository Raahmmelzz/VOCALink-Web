import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
<<<<<<< HEAD
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
=======
  const [password, setPassword]     = useState("");
  const [remember, setRemember]     = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
>>>>>>> 50a0724 (with login)

  const toggleShowPass = () => setShowPass((v) => !v);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ identifier, password, remember });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    }
  };

<<<<<<< HEAD
  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    remember,
    setRemember,
    showPass,
    toggleShowPass,
    error,
    onSubmit,
  };
};
=======
  return { identifier, setIdentifier, password, setPassword, remember, setRemember, showPass, toggleShowPass, error, onSubmit };
};
>>>>>>> 50a0724 (with login)
