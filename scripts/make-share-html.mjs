import fs from "node:fs";
import path from "node:path";

const distDir = "dist";
const htmlPath = path.join(distDir, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => {
  const cssPath = path.join(distDir, href.replace(/^\//, ""));
  return `<style>${fs.readFileSync(cssPath, "utf8")}</style>`;
});

html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  const jsPath = path.join(distDir, src.replace(/^\//, ""));
  let js = fs.readFileSync(jsPath, "utf8");
  const deviceImage = `data:image/png;base64,${fs.readFileSync(path.join("public", "orbit-device.png")).toString("base64")}`;
  js = js.replaceAll("/Orbit/orbit-device.png", deviceImage);
  js = js.replaceAll("/orbit-device.png", deviceImage);
  return `<script>${js}</script>`;
});

fs.writeFileSync("Orbit-share.html", html);
console.log(`wrote Orbit-share.html (${fs.statSync("Orbit-share.html").size} bytes)`);
