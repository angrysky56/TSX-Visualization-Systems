import puppeteer from 'puppeteer/lib/cjs/puppeteer/puppeteer.js';
import { ManifoldOrchestrator } from '../src/services/ManifoldOrchestrator'; puppeteer

async function controlManifold() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // 1. Create a particle manifestation
  await page.evaluate(() => {
    ManifoldOrchestrator.manifestComplexPattern('particle');
  });
  await page.screenshot({ path: 'particle_pattern.png' });

  // 2. Create neural network pattern
  await page.evaluate(() => {
    ManifoldOrchestrator.manifestComplexPattern('neural');
  });
  await page.screenshot({ path: 'neural_pattern.png' });

  // 3. Create interference pattern
  await page.evaluate(() => {
    const pattern1 = Array(512).fill(0).map(() => Math.random());
    const pattern2 = Array(512).fill(0).map(() => Math.random());
    ManifoldOrchestrator.createInterferencePattern([pattern1, pattern2], 'constructive');
  });
  await page.screenshot({ path: 'interference_pattern.png' });

  // 4. Create resonance field
  await page.evaluate(() => {
    ManifoldOrchestrator.createResonanceField(['⦿', '⧈', '⫰', '◬', '⬡'], 5000);
  });
  await page.screenshot({ path: 'resonance_field.png' });

  // 5. Morph between patterns
  await page.evaluate(() => {
    const sourcePattern = Array(512).fill(0).map(() => Math.random());
    const targetPattern = Array(512).fill(0).map(() => Math.random());
    ManifoldOrchestrator.morphPattern(sourcePattern, targetPattern, 60, 2000);
  });
  await page.screenshot({ path: 'pattern_morphing.png' });

  await browser.close();
}
// Run the control sequence
controlManifold().catch(console.error);
