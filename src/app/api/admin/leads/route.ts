import { NextRequest, NextResponse } from "next/server";
import { getVotes, getStats } from "@/lib/dataStore";
import { isRequestAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const contestantId = searchParams.get("contestantId");
    const format = searchParams.get("format");

    let votes = await getVotes();

    if (contestantId && contestantId !== "ALL") {
      votes = votes.filter((v) => v.contestantId === contestantId);
    }

    if (query) {
      votes = votes.filter(
        (v) =>
          v.voterName.toLowerCase().includes(query) ||
          v.voterPhone.toLowerCase().includes(query) ||
          v.voterEmail.toLowerCase().includes(query) ||
          v.contestantName.toLowerCase().includes(query) ||
          v.contestantId.toLowerCase().includes(query)
      );
    }

    // Export CSV format
    if (format === "csv") {
      const headers = ["Vote ID", "Voter Name", "Phone / WhatsApp", "Email", "Contestant ID", "Contestant Name", "City", "Timestamp"];
      const rows = votes.map((v) => [
        `"${v.id}"`,
        `"${v.voterName.replace(/"/g, '""')}"`,
        `"${v.voterPhone.replace(/"/g, '""')}"`,
        `"${v.voterEmail.replace(/"/g, '""')}"`,
        `"${v.contestantId}"`,
        `"${v.contestantName.replace(/"/g, '""')}"`,
        `"${(v.voterCity || "").replace(/"/g, '""')}"`,
        `"${v.timestamp}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="runway_voter_leads_${Date.now()}.csv"`,
        },
      });
    }

    const stats = await getStats();

    return NextResponse.json({
      success: true,
      leads: votes,
      totalLeads: votes.length,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch voter leads." }, { status: 500 });
  }
}
