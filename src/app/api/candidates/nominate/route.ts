import { NextRequest, NextResponse } from "next/server";
import { nominateCandidateByVoter } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { childName, age, category, city, imageUrl, parentName, parentPhone, parentEmail } = body;

    const trimmedChildName = (childName || "").trim();
    const trimmedAge = (age || "").trim();
    const trimmedCategory = (category || "").trim();
    const trimmedPhone = (parentPhone || "").trim();

    if (!trimmedChildName || !trimmedAge || !trimmedCategory) {
      return NextResponse.json(
        { error: "Child Name, Age, and Category are required." },
        { status: 400 }
      );
    }

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Parent Contact / WhatsApp Number." },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const result = await nominateCandidateByVoter({
      childName: trimmedChildName,
      age: trimmedAge,
      category: trimmedCategory,
      city: (city || "Lucknow").trim(),
      imageUrl: imageUrl || "/images/category-1.jpg",
      parentName: (parentName || "Parent").trim(),
      parentPhone: trimmedPhone,
      parentEmail: (parentEmail || "").trim(),
      ip,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Nomination failed." }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Congratulations! ${result.candidate?.name} has been added for Wild Card voting!`,
        candidate: result.candidate,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit child." }, { status: 500 });
  }
}
