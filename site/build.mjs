// Renders ../README.md into dist/index.html using template.html, and copies style.css.
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { marked } from "marked";

const started = Date.now();
const log = (msg) => console.log(`[build] ${msg}`);
const here = (p) => new URL(p, import.meta.url);

log("reading ../README.md ...");
const markdown = await readFile(here("../README.md"), "utf8");
log(`README.md read, ${Buffer.byteLength(markdown)} bytes`);

log("rendering markdown with marked ...");
let content = marked.parse(markdown, { breaks: true });
log(`markdown rendered, ${Buffer.byteLength(content)} bytes of HTML`);

// Print-only line with the site URL, right under the first <h4> (the school line)
const siteLine = '<p class="print-only"><a href="https://vizn3r.eu">https://vizn3r.eu</a></p>';
log("adding the print-only vizn3r.eu line ...");
const h4End = content.indexOf("</h4>");
if (h4End === -1) {
  content = siteLine + content;
  log("no </h4> found, vizn3r.eu line added at the top");
} else {
  const at = h4End + "</h4>".length;
  content = content.slice(0, at) + siteLine + content.slice(at);
  log("vizn3r.eu line added under the first <h4>");
}

log("reading template.html ...");
const template = await readFile(here("./template.html"), "utf8");
if (!template.includes("{{content}}")) {
  throw new Error("template.html has no {{content}} placeholder");
}
log("template.html read");

log("writing dist/index.html ...");
await mkdir(here("./dist/"), { recursive: true });
await writeFile(here("./dist/index.html"), template.replace("{{content}}", () => content));
log("dist/index.html written");

log("copying style.css to dist/ ...");
await copyFile(here("./style.css"), here("./dist/style.css"));
log("style.css copied");

log(`build done after ${Date.now() - started} ms`);
