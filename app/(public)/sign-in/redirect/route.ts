import { authOptions } from "@lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  if (role) {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }
}
