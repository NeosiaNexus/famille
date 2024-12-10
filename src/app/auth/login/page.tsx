"use client";

import { ActionError } from "@/actions/utils/ActionError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface LoginFormProps {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormProps>({
    email: "",
    password: "",
  });

  const [redirecting, setRedirecting] = useState<boolean>(false);

  const { user, loading, setUser, setLoading, checkAuth } = useAuth();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.email) {
        throw new ActionError(
          "Veuillez entrer votre adresse e-mail ou votre pseudo.",
        );
      }

      if (!formData.password) {
        throw new ActionError("Veuillez entrer un mot de passe.");
      }

      setLoading(true);

      const result = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resultJson = await result.json();

      if (result.status !== 200) {
        if (resultJson.message) {
          throw new ActionError(resultJson.message);
        }
        throw new ActionError(
          "Échec de connexion. Si le problème persiste, contactez le support.",
        );
      }

      setUser(resultJson);

      toast.success("Connexion réussie !");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setRedirecting(true);
        router.push("/home");
      } else {
        setRedirecting(false);
      }
    }
  }, [loading, router, user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <p>{redirecting ? "Redirecting..." : "Not redirecting"}</p>
      {/*<PageLoader loading={loading || redirecting} white />*/}

      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            top: "70%",
          }}
        >
          <Input
            onChange={handleChange}
            name={"email"}
            placeholder={"e-mail ou pseudo"}
            type={"text"}
            value={formData.email}
          />
          <Input
            onChange={handleChange}
            name={"password"}
            placeholder={"mot de passe"}
            type={"password"}
            value={formData.password}
          />
          <Button onClick={handleSubmit}>Connexion</Button>
          <p>
            Pas encore inscrit ?{" "}
            <Link href={"/auth/register"}>S&apos;inscrire</Link>
          </p>
        </div>
      </form>
    </>
  );
}
