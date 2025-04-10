#!/usr/bin/env node

const fs = require("fs")

function addClientDirective(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  const serverDirective = '"use server"';
  const clientDirective = '"use client";\n'

  if (content.startsWith(serverDirective) || content.startsWith(clientDirective)) return

  fs.writeFileSync(filePath, `${clientDirective}${content}`, "utf8")
}
;["dist/index.js", "dist/index.mjs"].forEach(addClientDirective)

process.exit(0)
