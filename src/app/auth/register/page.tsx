"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

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

    const [redirecting, setRedirecting] = useState<boolean>(false);

    const { user, loading, checkAuth, setUser } = useAuth();

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

            if (response.ok) {
                setUser(await response.json());
                toast.success("Inscription réussie.");
                setFormData({
                    pseudo: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                const data = await response.json();
                toast.error(data.message || "Erreur lors de l'inscription.");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Erreur lors de l'inscription.");
        }
    };

    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                setRedirecting(true);
                router.push("/space");
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
                        top: "80%",
                    }}
                >
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
                    <Button onClick={handleSubmit}>
                        S&apos;inscrire
                    </Button>
                    <p>
                        Déjà inscrit ? <Link href={"/auth/login"}>Se connecter</Link>
                    </p>
                </div>
            </form>
        </>
    );
}
