import { NextRequest, NextResponse } from "next/server";
import { recordVote } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contestantId, voterName, voterPhone, voterEmail, voterCity } = body;

    if (!contestantId) {
      return NextResponse.json({ error: "Contestant ID is required." }, { status: 400 });
    }

    const trimmedPhone = (voterPhone || "").trim();
    const trimmedEmail = (voterEmail || "").trim();
    const trimmedName = (voterName || "").trim();

    if (!trimmedPhone && !trimmedEmail) {
      return NextResponse.json(
        { error: "Please enter your Mobile Number or Email Address to cast your verified vote." },
        { status: 400 }
      );
    }

    if (trimmedPhone && trimmedPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (trimmedEmail && !trimmedEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const result = await recordVote({
      contestantId,
      voterName: trimmedName || "Supporter",
      voterPhone: trimmedPhone,
      voterEmail: trimmedEmail,
      voterCity: voterCity || "Lucknow",
      ip,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: `Vote successfully recorded for ${result.candidate?.name}!`,
      candidate: result.candidate,
      voteId: result.vote?.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process vote." }, { status: 500 });
  }
}
