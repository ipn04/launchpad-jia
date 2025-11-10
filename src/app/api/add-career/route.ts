import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

const allowedTags = ["b", "i", "em", "strong", "p", "ul", "ol", "li", "br"];
const allowedAttributes = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredFields = ["jobTitle", "description", "questions", "location", "workSetup", "orgID"];
    for (const field of requiredFields) {
      if (!body[field] || validator.isEmpty(String(body[field]).trim())) {
        return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
      }
    }

    const jobTitle = sanitizeHtml(validator.escape(body.jobTitle.trim()));
    const description = sanitizeHtml(body.description, { allowedTags, allowedAttributes });
    const location = sanitizeHtml(validator.escape(body.location.trim()));
    const workSetup = sanitizeHtml(validator.escape(body.workSetup.trim()));
    const workSetupRemarks = sanitizeHtml(validator.escape(body.workSetupRemarks || ""));
    const country = sanitizeHtml(validator.escape(body.country || ""));
    const province = sanitizeHtml(validator.escape(body.province || ""));
    const employmentType = sanitizeHtml(validator.escape(body.employmentType || ""));

    const minimumSalary =
      body.minimumSalary && validator.isNumeric(String(body.minimumSalary)) ? Number(body.minimumSalary) : null;
    const maximumSalary =
      body.maximumSalary && validator.isNumeric(String(body.maximumSalary)) ? Number(body.maximumSalary) : null;

    const lastEditedBy = {
      name: sanitizeHtml(validator.escape(body.lastEditedBy?.name || "")),
      email: sanitizeHtml(validator.escape(body.lastEditedBy?.email || "")),
      image: sanitizeHtml(validator.escape(body.lastEditedBy?.image || "")),
    };
    const createdBy = {
      name: sanitizeHtml(validator.escape(body.createdBy?.name || "")),
      email: sanitizeHtml(validator.escape(body.createdBy?.email || "")),
      image: sanitizeHtml(validator.escape(body.createdBy?.image || "")),
    };

    const sanitizeArray = (arr: any[]) =>
      arr.map((q) => {
        if (typeof q === "string") return sanitizeHtml(validator.escape(q));
        if (typeof q === "object" && q !== null) {
          return {
            ...q,
            question: q.question ? sanitizeHtml(validator.escape(String(q.question))) : "",
            type: q.type ? sanitizeHtml(validator.escape(String(q.type))) : "",
          };
        }
        return {};
      });

    const questions = Array.isArray(body.questions) ? sanitizeArray(body.questions) : [];
    const preScreeningQuestions = Array.isArray(body.preScreeningQuestions)
      ? sanitizeArray(body.preScreeningQuestions)
      : [];

    const { db } = await connectMongoDB();

    const org = await db.collection("organizations").findOne({ _id: new ObjectId(body.orgID) });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: body.status || "active",
      screeningSetting: body.screeningSetting || null,
      orgID: body.orgID,
      requireVideo: !!body.requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable: !!body.salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
      preScreeningQuestions,
    };

    await db.collection("careers").insertOne(career);

    if (body.draftId) {
      await db.collection("careerDrafts").deleteOne({ _id: new ObjectId(body.draftId) });
    }

    return NextResponse.json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json({ error: "Failed to add career" }, { status: 500 });
  }
}
