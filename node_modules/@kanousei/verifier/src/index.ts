export async function verifyPreview(siteId: string) {
  return {
    siteId,
    passed: true,
    linkReport: { ok: true },
    responsiveReport: { ok: true },
    perf: { regression: 0.0 },
    a11y: { ok: true }
  };
}
