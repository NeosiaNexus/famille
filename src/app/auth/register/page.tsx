"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REGISTER_USER } from "@/constants/socketChannel";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/socket";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface RegisterFormProps {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormProps>({
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setUser } = useAuth();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { pseudo, email, password, confirmPassword } = formData;

    if (!pseudo || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pseudo, email, password }),
      });

      const resultJson = await response.json();

      if (response.ok) {
        setUser(resultJson);
        if (socket && resultJson.id) {
          socket.emit(REGISTER_USER, {
            userId: resultJson.id,
            email: resultJson.email,
          });
        }
        toast.success("Inscription réussie.");
        setFormData({
          pseudo: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(resultJson.message || "Erreur lors de l'inscription.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "Erreur lors de l'inscription. Si le problème persiste, contactez le support.",
      );
    }
  };

  return (
    <div className={"flex justify-center items-center h-full w-full"}>
      <form>
        <div className={"flex flex-col justify-center items-center gap-3"}>
          <Input
            type={"text"}
            name={"pseudo"}
            placeholder={"pseudonyme"}
            onChange={handleChange}
            value={formData.pseudo}
          />
          <Input
            type={"email"}
            name={"email"}
            placeholder={"e-mail"}
            onChange={handleChange}
            value={formData.email}
          />
          <Input
            type={"password"}
            name={"password"}
            placeholder={"mot de passe"}
            onChange={handleChange}
            value={formData.password}
          />
          <Input
            type={"password"}
            name={"confirmPassword"}
            placeholder={"confirmer le mot de passe"}
            onChange={handleChange}
            value={formData.confirmPassword}
          />
          <p className={"text-white"}>
            Déjà inscrit ? <Link href={"/auth/login"}>Se connecter</Link>
          </p>
          <Button onClick={handleSubmit}>S&apos;inscrire</Button>
        </div>
      </form>
    </div>
  );
}
