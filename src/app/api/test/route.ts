import getUserFamilies from "@/actions/get-user-families-action";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getUserFamilies("cm4kdbm2v0000trmznidkko7z"));
}
