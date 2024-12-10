import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Vérifie si le chemin est la racine
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/home"; // Redirige vers /home
    return NextResponse.redirect(url);
  }

  // Continue le traitement si ce n'est pas la racine
  return NextResponse.next();
}

// Appliquer le middleware uniquement sur la racine
export const config = {
  matcher: "/", // Applique uniquement au chemin `/`
};
