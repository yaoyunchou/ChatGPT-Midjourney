import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

async function handle(req: NextRequest) {
  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  const reqPath = `${req.nextUrl.pathname}`.replaceAll(
    "/api/cnd-discordapp/",
    "",
  );

  let fetchUrl = `https://cdn.discordapp.com/${reqPath}`;

  try {
    const result = await fetch(fetchUrl, {
      method: req.method,
      body: req.body,
      cache: "no-store",
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export const GET = handle;
