import { NextRequest, NextResponse } from "next/server";
import { updateCandidate, deleteCandidate, getCandidates } from "@/lib/dataStore";
import { isRequestAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const candidates = await getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, candidate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch candidate." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();

    const updated = await updateCandidate(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Candidate ${id} updated successfully.`,
      candidate: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update candidate." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const { id } = params;
    const deleted = await deleteCandidate(id);
    if (!deleted) {
      return NextResponse.json({ error: "Candidate not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Candidate ${id} was deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete candidate." }, { status: 500 });
  }
}
