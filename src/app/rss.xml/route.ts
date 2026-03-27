export async function GET() {
  const API_URL = process.env.API_URL || "http://localhost:4001";

  try {
    const res = await fetch(`${API_URL}/api/rss`);
    const xml = await res.text();
    return new Response(xml, {
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  } catch {
    return new Response("RSS feed unavailable", { status: 500 });
  }
}
