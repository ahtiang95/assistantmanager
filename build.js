// Builds the standalone web version (docs/index.html, served by GitHub Pages) from app.html.
// app.html is written for claude.ai, which adds the document skeleton itself; here we add it.
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "app.html"), "utf8");
const cut = src.indexOf("<style>");
if (cut < 0) throw new Error("app.html has no <style> block");
const headBits = src.slice(0, cut).trim();
const body = src.slice(cut);

const html = `<!doctype html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#1e5a7d">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="保险助理">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<meta name="robots" content="noindex">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px;font-family:system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
${headBits}
</head>
<body>
${body}
<script>if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>
</body>
</html>
`;

fs.mkdirSync(path.join(__dirname, "docs"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "docs", "index.html"), html);
console.log("built docs/index.html", html.length, "bytes");
