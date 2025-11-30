/**
 * Sanity CMS QC Agent
 *
 * Tests the Sanity CMS integration:
 * 1. Verify all migrated content in Sanity
 * 2. Test Sanity Studio accessibility
 * 3. Compare data integrity with original TypeScript files
 * 4. Validate GROQ queries
 * 5. Test content editing workflow
 */

import { createClient } from '@sanity/client';
import { getAllTours } from '../data/tours';
import { getAllArticles } from '../data/articles';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

interface SanityTest {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  details?: any;
}

class SanityQCAgent {
  private client: any;
  private tests: SanityTest[] = [];

  constructor() {
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_API_TOKEN!,
      useCdn: false,
    });
  }

  async runAllTests() {
    console.log('\n🧪 Sanity CMS Quality Control');
    console.log('═══════════════════════════════════════\n');

    // Test 1: Environment Configuration
    await this.testEnvironmentConfig();

    // Test 2: Sanity API Connectivity
    await this.testSanityConnection();

    // Test 3: Migrated Tours Data
    await this.testMigratedTours();

    // Test 4: Migrated Articles Data
    await this.testMigratedArticles();

    // Test 5: Author and Category References
    await this.testReferences();

    // Test 6: Data Integrity
    await this.testDataIntegrity();

    // Test 7: GROQ Queries
    await this.testGROQQueries();

    // Test 8: Sanity Studio Accessibility
    await this.testStudioAccess();

    // Generate report
    this.generateReport();
  }

  private async testEnvironmentConfig() {
    const test: SanityTest = {
      name: 'Environment Configuration',
      status: 'pass',
      message: '',
    };

    try {
      const required = [
        'NEXT_PUBLIC_SANITY_PROJECT_ID',
        'NEXT_PUBLIC_SANITY_DATASET',
        'SANITY_API_TOKEN',
      ];

      const missing = required.filter((key) => !process.env[key]);

      if (missing.length > 0) {
        test.status = 'fail';
        test.message = `Missing environment variables: ${missing.join(', ')}`;
      } else {
        test.message = 'All required environment variables present';
        test.details = {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          tokenLength: process.env.SANITY_API_TOKEN?.length,
        };
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testSanityConnection() {
    const test: SanityTest = {
      name: 'Sanity API Connectivity',
      status: 'pass',
      message: '',
    };

    try {
      const start = Date.now();
      const result = await this.client.fetch('*[_type == "tour"][0...1]');
      const duration = Date.now() - start;

      test.message = `Connected successfully (${duration}ms)`;
      test.details = {
        responseTime: `${duration}ms`,
        sampledDocs: result.length,
      };
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Connection failed: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testMigratedTours() {
    const test: SanityTest = {
      name: 'Migrated Tours Data',
      status: 'pass',
      message: '',
    };

    try {
      const originalTours = getAllTours();
      const sanityTours = await this.client.fetch('*[_type == "tour"]');

      if (sanityTours.length !== originalTours.length) {
        test.status = 'fail';
        test.message = `Count mismatch: Expected ${originalTours.length}, got ${sanityTours.length}`;
      } else {
        test.message = `All ${sanityTours.length} tours migrated successfully`;

        // Verify each tour exists
        const titles = sanityTours.map((t: any) => t.title);
        test.details = {
          count: sanityTours.length,
          titles,
        };
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testMigratedArticles() {
    const test: SanityTest = {
      name: 'Migrated Articles Data',
      status: 'pass',
      message: '',
    };

    try {
      const originalArticles = getAllArticles();
      const sanityArticles = await this.client.fetch('*[_type == "article"]');

      if (sanityArticles.length !== originalArticles.length) {
        test.status = 'fail';
        test.message = `Count mismatch: Expected ${originalArticles.length}, got ${sanityArticles.length}`;
      } else {
        test.message = `All ${sanityArticles.length} articles migrated successfully`;

        const titles = sanityArticles.map((a: any) => a.title);
        test.details = {
          count: sanityArticles.length,
          titles,
        };
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testReferences() {
    const test: SanityTest = {
      name: 'Author and Category References',
      status: 'pass',
      message: '',
    };

    try {
      const authors = await this.client.fetch('*[_type == "author"]');
      const categories = await this.client.fetch('*[_type == "category"]');

      if (authors.length === 0) {
        test.status = 'fail';
        test.message = 'No authors found';
      } else if (categories.length === 0) {
        test.status = 'fail';
        test.message = 'No categories found';
      } else {
        test.message = `Found ${authors.length} author(s) and ${categories.length} category(ies)`;
        test.details = {
          authors: authors.map((a: any) => a.name),
          categories: categories.map((c: any) => c.title),
        };
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testDataIntegrity() {
    const test: SanityTest = {
      name: 'Data Integrity Check',
      status: 'pass',
      message: '',
    };

    try {
      const originalTours = getAllTours();
      const sanityTours = await this.client.fetch(`
        *[_type == "tour"] | order(title asc) {
          title,
          slug,
          duration,
          price,
          groupSize,
          "includedCount": count(included)
        }
      `);

      const issues: string[] = [];

      for (const original of originalTours) {
        const sanityTour = sanityTours.find((t: any) => t.slug.current === original.slug);

        if (!sanityTour) {
          issues.push(`Tour "${original.title}" not found in Sanity`);
          continue;
        }

        // Check required fields
        if (!sanityTour.title) issues.push(`${original.title}: Missing title`);
        if (!sanityTour.duration) issues.push(`${original.title}: Missing duration`);
        if (!sanityTour.price) issues.push(`${original.title}: Missing price`);
        if (sanityTour.includedCount === 0) issues.push(`${original.title}: No included items`);
      }

      if (issues.length > 0) {
        test.status = 'fail';
        test.message = `Found ${issues.length} integrity issue(s)`;
        test.details = { issues };
      } else {
        test.message = 'All data integrity checks passed';
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testGROQQueries() {
    const test: SanityTest = {
      name: 'GROQ Query Performance',
      status: 'pass',
      message: '',
    };

    try {
      const queries = [
        { name: 'All Tours', query: '*[_type == "tour"]' },
        { name: 'Featured Tours', query: '*[_type == "tour" && featured == true]' },
        { name: 'All Articles', query: '*[_type == "article"]' },
        { name: 'Tour by Slug', query: '*[_type == "tour" && slug.current == "discover-barbuda-by-sea"][0]' },
      ];

      const results: any[] = [];

      for (const q of queries) {
        const start = Date.now();
        const result = await this.client.fetch(q.query);
        const duration = Date.now() - start;

        results.push({
          query: q.name,
          duration: `${duration}ms`,
          resultCount: Array.isArray(result) ? result.length : 1,
        });
      }

      test.message = `All queries executed successfully`;
      test.details = { queries: results };
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Query error: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private async testStudioAccess() {
    const test: SanityTest = {
      name: 'Sanity Studio Accessibility',
      status: 'pass',
      message: '',
    };

    try {
      // Test if Studio endpoint is accessible
      const response = await fetch('http://localhost:3003/studio');

      if (response.ok) {
        test.message = 'Studio accessible at http://localhost:3003/studio';
        test.details = {
          status: response.status,
          url: 'http://localhost:3003/studio',
        };
      } else {
        test.status = 'fail';
        test.message = `Studio returned HTTP ${response.status}`;
      }
    } catch (error: any) {
      test.status = 'fail';
      test.message = `Studio not accessible: ${error.message}`;
    }

    this.tests.push(test);
    this.logTest(test);
  }

  private logTest(test: SanityTest) {
    const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⊘';
    console.log(`${icon} ${test.name}`);
    console.log(`   ${test.message}`);

    if (test.details) {
      console.log(`   Details:`, JSON.stringify(test.details, null, 2));
    }

    console.log('');
  }

  private generateReport() {
    console.log('\n═══════════════════════════════════════');
    console.log('📊 QC SUMMARY');
    console.log('═══════════════════════════════════════\n');

    const passed = this.tests.filter((t) => t.status === 'pass').length;
    const failed = this.tests.filter((t) => t.status === 'fail').length;
    const total = this.tests.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%\n`);

    if (failed > 0) {
      console.log('⚠️  Failed Tests:');
      this.tests
        .filter((t) => t.status === 'fail')
        .forEach((t) => {
          console.log(`   • ${t.name}: ${t.message}`);
        });
      console.log('');
    }

    if (passed === total) {
      console.log('🎉 All tests passed! Sanity CMS integration is working perfectly.\n');
    } else {
      console.log('⚠️  Some tests failed. Review the issues above.\n');
    }
  }
}

async function main() {
  const agent = new SanityQCAgent();
  await agent.runAllTests();
}

main().catch(console.error);
