import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ progress: [] });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { progress: true }
  });
  return NextResponse.json({ progress: user?.progress ?? [] });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { series, chapter } = await req.json();
  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: { email: session.user.email, name: session.user.name ?? undefined }
  });
  await prisma.progress.upsert({
    where: { userId_series_chapter: { userId: user.id, series, chapter } },
    update: {},
    create: { userId: user.id, series, chapter }
  });
  return NextResponse.json({ ok: true });
}
