#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('[vercel-compat] Executing portfolio build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  process.exit(0);
} catch (err) {
  process.exit(err.status || 1);
}
