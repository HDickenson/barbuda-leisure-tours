import 'dotenv/config';
import { cloneWebsite } from "../apps/orchestrator/agent";

const argUrl = process.argv.find(a => a.startsWith("--url="));
const cliUrl = argUrl ? argUrl.split("=")[1] : undefined;
const url = process.env.TARGET_URL || cliUrl;

if (!url) {
  console.error("❌ Error: No URL provided");
  console.error("Usage: pnpm run full --url=https://example.com");
  console.error("   or: Set TARGET_URL in .env");
  process.exit(1);
}

console.log(`\n🚀 Starting orchestration for: ${url}\n`);

cloneWebsite(url)
  .then(result => {
    console.log("\n📋 Final Result:");
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
