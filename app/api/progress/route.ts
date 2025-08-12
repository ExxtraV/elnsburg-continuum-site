import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { markRead, toggleBookmark } from "@/lib/userData";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug, type } = await req.json();
  if (type === "read") {
    markRead(session.user.name, slug);
  } else if (type === "bookmark") {
    toggleBookmark(session.user.name, slug);
  }
  return NextResponse.json({ success: true });
}
