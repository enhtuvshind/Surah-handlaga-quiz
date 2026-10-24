import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("quiz source includes the complete v1 assessment flow", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const questionCount = (page.match(/prompt: "/g) ?? []).length;

  assert.equal(questionCount, 20);
  assert.match(page, /const x = core\.AC - core\.CE/);
  assert.match(page, /const y = core\.AE - core\.RO/);
  assert.match(page, /value > 6 \? "ae" : value < -6 \? "ro" : "mid"/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /navigator\.share/);
});

test("project metadata is ready for a static Netlify deployment", async () => {
  const [netlify, metadata, packageJson] = await Promise.all([
    readFile(new URL("netlify.toml", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.match(netlify, /publish = "dist\/client"/);
  assert.match(metadata, /Суралцах хандлагын сорил/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
