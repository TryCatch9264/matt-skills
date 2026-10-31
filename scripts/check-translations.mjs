#!/usr/bin/env node
// Keeps this repo's Chinese translations honest.
//
// Every English markdown file in scope can have a `*.zh-CN.md` sibling. The
// lock file records the git blob of the English file at the moment it was
// translated, so "is this translation out of date?" is answered by comparing
// content, not timestamps. Rebase and cherry-pick don't disturb the answer.
//
//   node scripts/check-translations.mjs              check (default)
//   node scripts/check-translations.mjs --init       create the lock file
//   node scripts/check-translations.mjs --update <path>...
//                                                    re-record one or more files
//
// This is a dev-only script, like the rest of `scripts/`. It reads git through
// `git rev-parse HEAD:<path>`, so it never hashes working-tree files and never
// confuses an uncommitted edit with a committed one.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK_FILE = "translations.lock.json";
const ZH_SUFFIX = ".zh-CN.md";
const SOURCE_SUFFIX = ".md";

// Same boundary as translate-progress.md. Keep the two in step.
const ROOT_FILES = ["SCOPE.md", "README.md", "GLOSSARY.md", "CLAUDE.md"];
const SCOPE_DIRS = ["docs", "skills"];
const SKIP_PREFIXES = ["skills/deprecated/", "skills/in-progress/"];

const args = process.argv.slice(2);
const toPosix = (p) => p.split(sep).join("/");
const zhPathFor = (source) => source.slice(0, -SOURCE_SUFFIX.length) + ZH_SUFFIX;

function git(...gitArgs) {
  return execFileSync("git", gitArgs, {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function headCommit() {
  return git("rev-parse", "--short=12", "HEAD");
}

// The blob as committed, so an uncommitted edit reads as missing rather than
// as a change. Returns null when HEAD has no such file.
function blobAtHead(path) {
  try {
    return git("rev-parse", "--verify", `HEAD:${path}`);
  } catch {
    return null;
  }
}

// Working-tree changes are invisible to `rev-parse HEAD:<path>`, so a check
// that only read HEAD would call an edited-but-uncommitted English file "in
// sync". Collect them separately and report them as their own category.
function dirtyPaths() {
  const out = execFileSync("git", ["status", "--porcelain=v1", "-z"], {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  const paths = new Set();
  for (const chunk of out.split("\0")) {
    if (!/^[ MADRCU?!]{2} /.test(chunk)) continue;
    paths.add(chunk.slice(3));
  }
  return paths;
}

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(join(repo, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      found.push(...walk(rel));
    } else if (entry.name.endsWith(SOURCE_SUFFIX) && !entry.name.endsWith(ZH_SUFFIX)) {
      found.push(rel);
    }
  }
  return found;
}

function inScope() {
  const all = [...ROOT_FILES, ...SCOPE_DIRS.flatMap(walk)];
  return all
    .filter((p) => !SKIP_PREFIXES.some((prefix) => p.startsWith(prefix)))
    .sort();
}

function readLock() {
  const path = join(repo, LOCK_FILE);
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeLock(lock) {
  const sorted = {};
  for (const key of Object.keys(lock).sort()) sorted[key] = lock[key];
  writeFileSync(join(repo, LOCK_FILE), `${JSON.stringify(sorted, null, 2)}\n`);
}

function report(label, items) {
  if (items.length === 0) return;
  console.log(`\n${label} (${items.length})`);
  for (const item of items) console.log(`  ${item}`);
}

function check() {
  const scope = inScope();
  const scopeSet = new Set(scope);
  const lock = readLock();
  const commit = headCommit();
  const dirty = dirtyPaths();

  const stale = [];
  const unregistered = [];
  const orphan = [];
  const missingTranslation = [];
  const uncommitted = [];
  const untranslated = [];

  for (const [source, entry] of Object.entries(lock)) {
    if (!scopeSet.has(source)) {
      orphan.push(`${source} -> ${entry.zh}`);
      continue;
    }

    const target = entry.zh ?? zhPathFor(source);
    if (!existsSync(join(repo, target))) {
      missingTranslation.push(`${source} -> ${target}`);
    }

    if (dirty.has(source)) {
      uncommitted.push(source);
      continue;
    }

    const blob = blobAtHead(source);
    if (blob !== entry.blob) stale.push(`${source} -> ${target}`);
  }

  for (const source of scope) {
    if (Object.hasOwn(lock, source)) continue;
    if (dirty.has(source)) {
      uncommitted.push(source);
      continue;
    }

    const target = zhPathFor(source);
    if (existsSync(join(repo, target))) unregistered.push(`${source} -> ${target}`);
    else untranslated.push(source);
  }

  console.log(`Checked ${scope.length} source files against HEAD ${commit}.`);

  if (Object.keys(lock).length === 0) {
    console.log(`\n${LOCK_FILE} is missing or empty. Run \`npm run i18n:init\`.`);
    process.exit(1);
  }

  report("stale: English changed since it was translated", stale);
  report("unregistered: translation exists but is not in the lock", unregistered);
  report("orphan: English file gone or out of scope", orphan);
  report("missing translation: English file has no .zh-CN.md", missingTranslation);
  report("uncommitted: commit the English change, then re-check", uncommitted);
  report("untranslated: not started yet (warning only)", untranslated);

  const failures =
    stale.length + unregistered.length + orphan.length + missingTranslation.length + uncommitted.length;

  if (failures === 0) {
    console.log("\nAll translations are in sync.");
    if (untranslated.length > 0) {
      console.log(`${untranslated.length} file(s) still untranslated, which does not fail the check.`);
    }
    return;
  }

  console.log(
    `\n${failures} file(s) need attention. After syncing one, run \`npm run i18n:update -- <path>\`.`,
  );
  process.exit(1);
}

function init() {
  if (existsSync(join(repo, LOCK_FILE)) && !args.includes("--force")) {
    console.error(`${LOCK_FILE} already exists. Use --force to rebuild it from HEAD.`);
    process.exit(1);
  }

  const commit = headCommit();
  const lock = {};
  const skipped = [];

  for (const source of inScope()) {
    const target = zhPathFor(source);
    if (!existsSync(join(repo, target))) continue;

    const blob = blobAtHead(source);
    if (blob === null) {
      skipped.push(source);
      continue;
    }

    lock[source] = { zh: target, blob, commit };
  }

  if (skipped.length > 0) {
    console.error("These English files are not committed, so they cannot be recorded:");
    for (const source of skipped) console.error(`  ${source}`);
    process.exit(1);
  }

  writeLock(lock);
  console.log(`Recorded ${Object.keys(lock).length} translations against HEAD ${commit}.`);
}

function update(paths) {
  if (paths.length === 0) {
    console.error("Pass at least one English path, for example: npm run i18n:update -- docs/engineering/tdd.md");
    process.exit(1);
  }

  const scope = new Set(inScope());
  const lock = readLock();
  const commit = headCommit();
  let changed = 0;

  for (const raw of paths) {
    const source = toPosix(relative(repo, join(repo, raw)));
    if (!scope.has(source)) {
      console.error(`${source}: not an in-scope English markdown file (see translate-progress.md).`);
      process.exit(1);
    }

    const target = zhPathFor(source);
    if (!existsSync(join(repo, target))) {
      console.error(`${source}: no translation at ${target}.`);
      process.exit(1);
    }

    const blob = blobAtHead(source);
    if (blob === null) {
      console.error(`${source}: not committed, so there is no blob to record.`);
      process.exit(1);
    }

    lock[source] = { zh: target, blob, commit };
    changed += 1;
    console.log(`${source} -> ${target} recorded at ${commit}`);
  }

  writeLock(lock);
  console.log(`\n${changed} entry(ies) updated in ${LOCK_FILE}.`);
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node scripts/check-translations.mjs [--init [--force] | --update <path>...]

Checks that every recorded Chinese translation still matches the English
original. Exit code is 1 when something needs attention.`);
} else if (args.includes("--init")) {
  init();
} else if (args.indexOf("--update") !== -1) {
  update(args.slice(args.indexOf("--update") + 1));
} else {
  check();
}
