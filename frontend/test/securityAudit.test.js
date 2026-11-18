import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

test('Security: No hardcoded secrets, private keys, or credentials in .env.example', () => {
  const envExamplePath = path.join(frontendDir, '.env.example');
  assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');

  const content = fs.readFileSync(envExamplePath, 'utf8');
  assert.ok(!content.includes('SECRET'), '.env.example must not contain secret tokens');
  assert.ok(!content.includes('PASSWORD'), '.env.example must not contain passwords');
  assert.ok(!content.includes('MONGODB_URI'), '.env.example must not contain database strings');
});

test('Security: Single-origin index.html and admin.html have no cross-contamination scripts', () => {
  const indexHtml = fs.readFileSync(path.join(frontendDir, 'index.html'), 'utf8');
  const adminHtml = fs.readFileSync(path.join(frontendDir, 'admin.html'), 'utf8');

  // index.html must mount public entry only
  assert.ok(indexHtml.includes('/src/public/main.jsx'), 'index.html must load public main');
  assert.ok(!indexHtml.includes('/src/admin/main.jsx'), 'index.html must not load admin main');

  // admin.html must mount admin entry only
  assert.ok(adminHtml.includes('/src/admin/main.jsx'), 'admin.html must load admin main');
  assert.ok(!adminHtml.includes('/src/public/main.jsx'), 'admin.html must not load public main');
});
