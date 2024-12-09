export function checkPasswordStrength(
  password: string,
): PasswordCheckError | null {
  // Vérifie la longueur minimale
  if (password.length < 8) {
    return PasswordCheckError.LENGTH;
  }

  // Vérifie la présence d'au moins une lettre minuscule
  if (!/[a-z]/.test(password)) {
    return PasswordCheckError.LOWERCASE;
  }

  // Vérifie la présence d'au moins une lettre majuscule
  if (!/[A-Z]/.test(password)) {
    return PasswordCheckError.UPPERCASE;
  }

  // Vérifie la présence d'au moins un chiffre
  if (!/[0-9]/.test(password)) {
    return PasswordCheckError.NUMBER;
  }

  // Vérifie la présence d'au moins un caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return PasswordCheckError.SPECIAL;
  }

  return null;
}

enum PasswordCheckError {
  LENGTH = "Le mot de passe doit contenir au moins 8 caractères.",
  LOWERCASE = "Le mot de passe doit contenir au moins une minuscule.",
  UPPERCASE = "Le mot de passe doit contenir au moins une majuscule.",
  NUMBER = "Le mot de passe doit contenir au moins un chiffre.",
  SPECIAL = "Le mot de passe doit contenir au moins un caractère spécial.",
}
