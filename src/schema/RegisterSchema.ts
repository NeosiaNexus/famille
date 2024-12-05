import { z } from "zod";

const email = z
  .string({
    message: "L'adresse e-mail doit être une chaîne de caractères.",
  })
  .min(3, {
    message: "L'adresse e-mail est trop courte (minimum 3 caractères).",
  })
  .max(255, {
    message: "L'adresse e-mail est trop longue (maximum 255 caractères).",
  })
  .email({
    message:
      "L'adresse e-mail est invalide, elle doit être au format : mail@example.com",
  });

const password = z
  .string({
    message: "Le mot de passe doit être une chaîne de caractères.",
  })
  .min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  })
  .max(255, {
    message: "Le mot de passe est trop long (maximum 255 caractères).",
  });

const pseudo = z
  .string({
    message: "Le pseudo doit être une chaîne de caractères.",
  })
  .min(3, {
    message: "Le pseudo est trop court (minimum 3 caractères).",
  })
  .max(16, {
    message: "Le pseudo est trop long (maximum 16 caractères).",
  });

export const RegisterSchema = z.object({
  pseudo,
  email,
  password,
});
