import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.redirect(
    new URL(`/admission/enrollment-application`, req.url)
  );
}
