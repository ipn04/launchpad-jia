import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const draft = await request.json();
    const { db } = await connectMongoDB();

    draft.updatedAt = new Date();

    if (draft.draftId) {
      const { draftId, ...rest } = draft;
      await db.collection("careerDrafts").updateOne(
        { _id: new ObjectId(draftId) },
        { $set: rest }
      );
      return NextResponse.json({ message: "Draft updated successfully", draftId });
    } else {
      const result = await db.collection("careerDrafts").insertOne({
        ...draft,
        createdAt: new Date(),
      });
      return NextResponse.json({
        message: "Draft created successfully",
        draftId: result.insertedId.toString(),
      });
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

