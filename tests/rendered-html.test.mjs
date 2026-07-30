import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the PyTrail learning application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const visibleHtml = html.replaceAll("<!-- -->", "");
  assert.match(html, /<title>PyTrail — Python Automation from Basic to Advanced<\/title>/i);
  assert.match(visibleHtml, /6 chapters · 600 scenarios · 42 capstones/);
  assert.match(html, /DevOps\/SRE capstones/);
  assert.match(html, /Scenario bank/);
  assert.match(html, /AWS automation with boto3/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("defines seven complete capstones and 100 scenarios for every chapter", async () => {
  const [courseData, page, css] = await Promise.all([
    readFile(new URL("../app/course-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal((courseData.match(/\n      role:/g) ?? []).length, 42);
  assert.equal((courseData.match(/\n      result:/g) ?? []).length, 42);
  assert.equal((courseData.match(/\n    capstones: \[/g) ?? []).length, 6);
  assert.equal((courseData.match(/additionalCapstonesByChapter\[/g) ?? []).length, 5);
  assert.match(courseData, /additionalCapstonesByChapter\.production/);
  assert.equal((courseData.match(/\n  "a .*team|\n  "an .*team|\n  "an SRE incident-response/g) ?? []).length, 10);
  assert.match(courseData, /multi-account AWS compliance inventory/i);
  assert.match(courseData, /canary deployment and automatic rollback/i);
  assert.match(courseData, /production Kubernetes platform/i);
  assert.match(courseData, /internal developer platform/i);
  assert.match(courseData, /multi-account cloud landing zone/i);
  assert.match(courseData, /Validate production input/);
  assert.match(courseData, /Introduce dry-run safety/);
  assert.match(courseData, /Make the decision testable/);
  assert.match(courseData, /titles\.size !== chapter\.scenarios\.length/);
  assert.match(courseData, /tasks\.size !== chapter\.scenarios\.length/);
  assert.doesNotMatch(courseData, /title: `\$\{seed\.title\} · Case/);
  assert.doesNotMatch(
    courseData,
    /a data engineering team|a finance batch-processing service|an internal support platform/i,
  );
  assert.match(page, /function CapstoneView/);
  assert.match(page, /What each function does/);
  assert.match(page, /How this result is achieved/);
  assert.match(css, /\.capstone-layout/);
  assert.doesNotMatch(page, /localStorage|sessionStorage|indexedDB/);
});
