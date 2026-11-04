import { NextRequest, NextResponse } from "next/server";
import { fetchAggregatedNews } from "@/lib/sources/source-manager";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const geo = searchParams.get("geo") || undefined;

    const data = await fetchAggregatedNews({ query, geo });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("News aggregation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve news feeds",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
