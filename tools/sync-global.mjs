import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MASTER_FILE_NAME = 'CLAUDE-global.md';
const SITE_REPOS = [
  'cahyana-api',
  'cahyana-dashboard',
  'cahyana-ubud-experience',
  'cahyana-my',
  'ubud-private-villas',
];

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const parentFolder = process.argv[2] ? resolve(process.argv[2]) : dirname(repoRoot);
const masterPath = join(repoRoot, MASTER_FILE_NAME);
const masterText = readFileSync(masterPath, 'utf8');

function syncRepo(repoName) {
  const repoPath = join(parentFolder, repoName);
  if (!existsSync(repoPath)) {
    console.log(`skip ${repoName}: not found at ${repoPath}`);
    return;
  }
  const copyPath = join(repoPath, MASTER_FILE_NAME);
  const isSame = existsSync(copyPath) && readFileSync(copyPath, 'utf8') === masterText;
  if (isSame) {
    console.log(`same ${repoName}`);
    return;
  }
  copyFileSync(masterPath, copyPath);
  console.log(`copied ${repoName}`);
}

SITE_REPOS.forEach((repoName) => syncRepo(repoName));
