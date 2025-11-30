import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '../../.env') });

import { query } from '@anthropic-ai/claude-agent-sdk';
import { crawlSite } from '@kanousei/crawler';
import { stashAssets, coverageForSite } from '@kanousei/asset-pipeline';
import { generateDesignSystem } from '@kanousei/design-system';
import { synthPages } from '@kanousei/page-synth';
import { verifyPreview } from '@kanousei/verifier';

const url = process.env.TARGET_URL || 'https://www.barbudaleisure.com/';

console.log('Starting orchestration for:', url);
console.log('SCOUT_WORKER_URL:', process.env.SCOUT_WORKER_URL);

// Call functions directly to test stub implementations
(async () => {
  try {
    console.log('\n1. Scout...');
    const crawlResult = await crawlSite(url);
    console.log('Scout result:', JSON.stringify(crawlResult, null, 2));

    console.log('\n2. Download assets...');
    const assetResult = await stashAssets(crawlResult.siteId);
    console.log('Asset result:', JSON.stringify(assetResult, null, 2));

    console.log('\n3. Check coverage...');
    const coverage = await coverageForSite(crawlResult.siteId);
    console.log('Coverage:', JSON.stringify(coverage, null, 2));

    console.log('\n4. Generate design system...');
    const designSystem = await generateDesignSystem(crawlResult.siteId);
    console.log('Design system:', JSON.stringify(designSystem, null, 2));

    console.log('\n5. Synthesize pages...');
    const synthResult = await synthPages(crawlResult.siteId);
    console.log('Synth result:', JSON.stringify(synthResult, null, 2));

    console.log('\n6. Verify...');
    const verification = await verifyPreview(crawlResult.siteId);
    console.log('Verification:', JSON.stringify(verification, null, 2));

    console.log('\n✅ Pipeline complete!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
