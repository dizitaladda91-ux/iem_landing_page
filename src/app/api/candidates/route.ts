import { NextRequest, NextResponse } from "next/server";
import { getCandidates, addCandidate } from "@/lib/dataStore";
import { isRequestAuthenticated } from "@/lib/auth";

// Public GET: Retrieve candidates for voting & portal
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const all = await getCandidates();
    const result = includeInactive ? all : all.filter((c) => c.isActive);

    return NextResponse.json({
      success: true,
      candidates: result,
      total: result.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch candidates." }, { status: 500 });
  }
}

// Admin POST: Add a new kid card for voting
export async function POST(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, age, category, city, imageUrl, badge, bio, initialVotes, isActive } = body;

    if (!name || !age || !category) {
      return NextResponse.json({ error: "Name, Age, and Category are required fields." }, { status: 400 });
    }

    const created = await addCandidate({
      name,
      age,
      category,
      city: city || "Lucknow",
      imageUrl: imageUrl || "/images/category-1.jpg",
      badge: badge || "WILD CARD CONTENDER",
      bio: bio || "",
      initialVotes: typeof initialVotes === "number" ? initialVotes : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      message: `Candidate card created for ${created.name} (${created.id})`,
      candidate: created,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create candidate." }, { status: 500 });
  }
}
