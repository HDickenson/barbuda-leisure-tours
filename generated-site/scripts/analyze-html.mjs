#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

function readHtml(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractFeatures(html) {
  const $ = load(html);

  const sections = $("section").length;
  const headings = {
    h1: $("h1").length,
    h2: $("h2").length,
    h3: $("h3").length,
  };
  const images = $("img").length;
  const links = $("a").length;

  const hasWaveSvg =
    $("svg").filter((_, el) => {
      const $el = $(el);
      const d = $el.find("path").attr("d") || "";
      return d.includes("C") && d.includes("Z");
    }).length > 0 || $('[data-test="wave-divider"]').length > 0;

  const footerEl = $("footer");
  const hasFooter = footerEl.length > 0;
  const footerLinks = hasFooter ? footerEl.find("a").length : 0;

  return {
    sections,
    headings,
    images,
    links,
    hasWaveSvg,
    hasFooter,
    footerLinks,
  };
}

function diffFeatures(live, local) {
  const diff = {};
  for (const key of Object.keys(live)) {
    if (typeof live[key] === "object" && live[key] !== null) {
      diff[key] = diffFeatures(live[key], local[key] ?? {});
    } else {
      const liveVal = live[key] ?? 0;
      const localVal = local[key] ?? 0;
      if (liveVal !== localVal) {
        diff[key] = { live: liveVal, local: localVal };
      }
    }
  }
  for (const key of Object.keys(local)) {
    if (!(key in live)) {
      diff[key] = { live: 0, local: local[key] };
    }
  }
  return diff;
}

function main() {
  const routes = [
    { route: "/", liveFile: "home.html", localFile: "index.html" },
    { route: "/about", liveFile: "about.html", localFile: path.join("about", "index.html") },
    { route: "/faq", liveFile: "faq.html", localFile: path.join("faq", "index.html") },
    { route: "/reviews", liveFile: "reviews.html", localFile: path.join("reviews", "index.html") },
  ];

  const liveDir =
    process.env.LIVE_HTML_DIR || path.join("visual", "html-live");
  const localDir =
    process.env.LOCAL_HTML_DIR || path.join("out");

  const report = [];

  for (const { route, liveFile, localFile } of routes) {
    const livePath = path.join(liveDir, liveFile);
    const localPath = path.join(localDir, localFile);

    const entry = { route, livePath, localPath, status: "ok" };

    try {
      const liveHtml = readHtml(livePath);
      const localHtml = readHtml(localPath);

      const liveFeatures = extractFeatures(liveHtml);
      const localFeatures = extractFeatures(localHtml);

      const diff = diffFeatures(liveFeatures, localFeatures);

      entry.liveFeatures = liveFeatures;
      entry.localFeatures = localFeatures;
      entry.differences = diff;
    } catch (err) {
      entry.status = "error";
      entry.error = String(err);
    }

    report.push(entry);
  }

  const outPath = path.join("visual", "dom-file-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  for (const entry of report) {
    if (entry.status !== "ok") {
      console.log(`[${entry.route}] ERROR: ${entry.error}`);
      continue;
    }
    const diffs = entry.differences;
    const hasAnyDiff = Object.keys(diffs).some(
      (k) => Object.keys(diffs[k] || {}).length > 0,
    );
    console.log(
      `[${entry.route}] sections=${entry.localFeatures.sections} imgs=${entry.localFeatures.images} links=${entry.localFeatures.links} wave=${entry.localFeatures.hasWaveSvg} footer=${entry.localFeatures.hasFooter} diffs=${hasAnyDiff ? "YES" : "NO"}`,
    );
  }
}

main();
