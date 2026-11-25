import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { recordVote, IS_VOTING_CLOSED } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  // Official Voting Closed Guard
  if (IS_VOTING_CLOSED) {
    return NextResponse.json(
      {
        error: "⚠️ Online voting for Runway Kids Fashion Week is now officially closed. Thank you to everyone who participated! Final results will be announced at the Grand Finale on 29th November 2026.",
        isVotingClosed: true,
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { contestantId, voterName, voterPhone, voterEmail, voterCity, deviceId } = body;
    const cookieDeviceId = req.cookies.get("iem_voter_device_id")?.value || "";
    const lockedDeviceId =
      cookieDeviceId ||
      (typeof deviceId === "string" && deviceId.trim()) ||
      randomUUID();

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

    // Get client IP for logging safely
    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      (forwardedFor ? forwardedFor.split(",")[0]?.trim() || "" : "") ||
      "127.0.0.1";

    const withDeviceCookie = (response: NextResponse) => {
      response.cookies.set("iem_voter_device_id", lockedDeviceId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    };

    const result = await recordVote({
      contestantId,
      voterName: trimmedName || "Supporter",
      voterPhone: trimmedPhone,
      voterEmail: trimmedEmail,
      voterCity: voterCity || "Lucknow",
      ip,
      deviceId: lockedDeviceId,
    });

    if (!result.success) {
      return withDeviceCookie(
        NextResponse.json({ error: result.error }, { status: 409 })
      );
    }

    return withDeviceCookie(
      NextResponse.json({
        success: true,
        message: `Vote successfully recorded for ${result.candidate?.name}!`,
        candidate: result.candidate,
        voteId: result.vote?.id,
      })
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process vote." }, { status: 500 });
  }
}
