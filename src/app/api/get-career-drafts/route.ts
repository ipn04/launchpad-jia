import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgID = searchParams.get("orgID");
    const userEmail = searchParams.get("userEmail");

    if (!orgID || !userEmail) {
      return NextResponse.json({ error: "orgID and userEmail are required" }, { status: 400 });
    }

    const { db } = await connectMongoDB();

    const drafts = await db
      .collection("careerDrafts")
      .find({ orgID, "createdBy.email": userEmail })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ drafts });

  } catch (error) {
    console.error("Error fetching draft careers:", error);
    return NextResponse.json({ error: "Failed to fetch draft careers" }, { status: 500 });
  }
}
