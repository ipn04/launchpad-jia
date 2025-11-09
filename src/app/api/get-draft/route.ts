import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  if (!draftId) {
    return NextResponse.json({ error: "draftId is required" }, { status: 400 });
  }

  try {
    const { db } = await connectMongoDB();

    const draft = await db
      .collection("careerDrafts")
      .findOne({ _id: new ObjectId(draftId) });

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("[GET /api/get-draft] Error fetching draft:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
