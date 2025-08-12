import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser } from "@/lib/userData";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) {
    return NextResponse.json({ progress: [], bookmarks: [] });
  }
  const user = getUser(session.user.name);
  return NextResponse.json({
    progress: user?.progress || [],
    bookmarks: user?.bookmarks || [],
  });
}
