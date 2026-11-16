import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated, getAuthenticatedUser } from "@/lib/auth";
import { getAuditLogs, addAuditLog, clearAuditLogs } from "@/lib/dataStore";

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 200;

    const logs = await getAuditLogs({
      category: category !== "ALL" ? category : undefined,
      search: search || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve logs." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, category, description, details } = body;

    const user = getAuthenticatedUser(req) || "Client Session";
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const created = await addAuditLog({
      action: action || "SECURITY_ALERT",
      category: category || "SECURITY",
      user,
      description: description || "Client event logged.",
      details: details || "",
      ip,
    });

    return NextResponse.json({ success: true, log: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log event." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
  }

  try {
    await clearAuditLogs();
    return NextResponse.json({ success: true, message: "Audit logs history cleared." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to clear logs." }, { status: 500 });
  }
}
