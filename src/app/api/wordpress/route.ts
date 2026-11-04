import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, article } = body;

    const siteUrl = process.env.WORDPRESS_SITE_URL || "https://www.19network.com";
    const username = process.env.WORDPRESS_USERNAME;
    const appPassword = process.env.WORDPRESS_APP_PASSWORD;

    if (action === "test_connection") {
      if (!username || !appPassword) {
        return NextResponse.json({
          connected: false,
          status: "unconfigured",
          message: "No WordPress credentials configured on server. Fallback export modes active.",
          siteUrl,
        });
      }

      // Test connection with auth header
      const authHeader = `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`;
      try {
        const testRes = await fetch(`${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/users/me`, {
          headers: { Authorization: authHeader },
        });

        if (testRes.ok) {
          const user = await testRes.json();
          return NextResponse.json({
            connected: true,
            status: "connected",
            user: user.name || username,
            siteUrl,
          });
        } else {
          return NextResponse.json({
            connected: false,
            status: "error",
            message: `WordPress responded with HTTP ${testRes.status}`,
            siteUrl,
          });
        }
      } catch (err: unknown) {
        return NextResponse.json({
          connected: false,
          status: "error",
          message: err instanceof Error ? err.message : "Connection failed",
          siteUrl,
        });
      }
    }

    if (action === "create_draft") {
      if (!username || !appPassword) {
        return NextResponse.json(
          {
            error: "WordPress credentials not configured in environment variables (WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD). Use HTML/Markdown/JSON export.",
          },
          { status: 400 }
        );
      }

      const authHeader = `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`;
      const wpEndpoint = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`;

      const postPayload = {
        title: article.title,
        content: article.content,
        excerpt: article.metaDescription || "",
        status: "draft", // Always draft, never public publish directly
        slug: article.slug || "",
      };

      const wpRes = await fetch(wpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(postPayload),
      });

      if (!wpRes.ok) {
        const errorText = await wpRes.text();
        return NextResponse.json(
          { error: `WordPress error (${wpRes.status}): ${errorText}` },
          { status: wpRes.status }
        );
      }

      const createdPost = await wpRes.json();
      return NextResponse.json({
        success: true,
        postId: createdPost.id,
        link: createdPost.link,
        status: createdPost.status,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
