import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const admin = await db.collection("admins").findOne({ email });
    if (admin) {
      await db.collection("admins").updateOne(
        { email },
        { $set: { name, image, lastSeen: new Date() } }
      );
      return NextResponse.json({ name, email, image, role: "admin" });
    }

    const orgMember = await db.collection("members").findOne({ email });
    if (orgMember) {
      await db.collection("orgMembers").updateOne(
        { email },
        { $set: { lastLogin: new Date() } }
      );
      return NextResponse.json({
        name,
        email,
        image,
        role: orgMember.role,
        orgID: orgMember.orgID,
      });
    }

    let applicant = await db.collection("applicants").findOne({ email });
    if (applicant) {
      await db.collection("applicants").updateOne(
        { email },
        { $set: { lastSeen: new Date() } }
      );
      return NextResponse.json({
        name: applicant.name,
        email: applicant.email,
        image: applicant.image,
        role: "applicant",
      });
    }

    await db.collection("applicants").insertOne({
      name,
      email,
      image,
      createdAt: new Date(),
      lastSeen: new Date(),
      role: "applicant",
    });

    return NextResponse.json({ name, email, image, role: "applicant" });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
