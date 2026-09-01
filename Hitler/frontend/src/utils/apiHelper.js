/**
 * Helper function to safely fetch and parse JSON responses.
 * Prevents "Unexpected end of JSON input" when response body is empty or non-JSON.
 */
export async function safeFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = {};
    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { rawText: text };
      }
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: { message: error.message || "Tarmoq ulanishida xatolik" } };
  }
}
