import { readFileSync } from 'node:fs';

const MASTER_BASE_URL = 'https://raw.githubusercontent.com/wayanadityaekc/cahyanaui/main';
const SHARED_FILES = [
  'CLAUDE-global.md',
  'tools/eslint/cahyana-rules.mjs',
  'tools/eslint/css-comments.mjs',
  'tools/check-global.mjs',
];

async function fetchMasterText(file) {
  const response = await fetch(`${MASTER_BASE_URL}/${file}`);
  if (!response.ok) throw new Error(`could not read the master ${file}: HTTP ${response.status}`);
  return response.text();
}

async function compareFile(file) {
  const masterText = await fetchMasterText(file);
  const localText = readFileSync(file, 'utf8');
  return { file, isSame: masterText === localText };
}

async function checkAllFiles() {
  try {
    const results = await Promise.all(SHARED_FILES.map(compareFile));
    const differingResults = results.filter((result) => !result.isSame);
    results.forEach((result) => console.log(`${result.isSame ? 'same' : 'DIFFERS'}  ${result.file}`));
    if (differingResults.length) {
      console.log('Copy the master from cahyanaui with: node tools/sync-global.mjs (run in cahyanaui)');
      process.exit(1);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

checkAllFiles();
