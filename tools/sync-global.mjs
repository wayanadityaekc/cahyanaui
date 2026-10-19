import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHARED_FILES = ['CLAUDE-global.md', 'tools/eslint/cahyana-rules.mjs', 'tools/eslint/css-comments.mjs', 'tools/check-global.mjs'];
const SITE_REPOS = ['cahyana-api', 'cahyana-dashboard', 'cahyana-ubud-experience', 'cahyana-my', 'ubud-private-villas'];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const parentFolder = process.argv[2] ? resolve(process.argv[2]) : dirname(repoRoot);

function syncFile(repoPath, repoName, file) {
  const masterPath = join(repoRoot, file);
  const copyPath = join(repoPath, file);
  const isSame = existsSync(copyPath) && readFileSync(copyPath, 'utf8') === readFileSync(masterPath, 'utf8');
  if (isSame) {
    console.log(`same    ${repoName}/${file}`);
    return;
  }
  mkdirSync(dirname(copyPath), { recursive: true });
  copyFileSync(masterPath, copyPath);
  console.log(`copied  ${repoName}/${file}`);
}

function syncRepo(repoName) {
  const repoPath = join(parentFolder, repoName);
  if (!existsSync(repoPath)) {
    console.log(`skip    ${repoName}: not found at ${repoPath}`);
    return;
  }
  SHARED_FILES.forEach((file) => syncFile(repoPath, repoName, file));
}

SITE_REPOS.forEach((repoName) => syncRepo(repoName));
