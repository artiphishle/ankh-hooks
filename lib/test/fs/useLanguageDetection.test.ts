#!/usr/bin/env node

import test from "node:test"
import assert from "node:assert"
import fs from "fs"
import path from "path"
import os from "os"
import { ELanguage, useLanguageDetection } from "../../hooks/fs/useLanguageDetection"

// Create temporary test directories
function createTempDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ankh-test-"))
  return tempDir
}

// Clean up temporary directories
function cleanupTempDir(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        cleanupTempDir(entryPath)
      } else {
        fs.unlinkSync(entryPath)
      }
    }

    fs.rmdirSync(dirPath)
  }
}

// Setup JavaScript project structure
function setupJavaScriptProject(dirPath: string) {
  // Create package.json
  fs.writeFileSync(
    path.join(dirPath, "package.json"),
    JSON.stringify({
      name: "test-js-project",
      version: "1.0.0",
      dependencies: {
        react: "^18.0.0",
      },
    }),
  )

  // Create JavaScript files
  fs.writeFileSync(
    path.join(dirPath, "index.js"),
    "const express = require('express');\nconst app = express();\napp.listen(3000);",
  )

  // Create node_modules directory
  fs.mkdirSync(path.join(dirPath, "node_modules"))
}

// Setup TypeScript project structure
function setupTypeScriptProject(dirPath: string) {
  // Create package.json with TypeScript
  fs.writeFileSync(
    path.join(dirPath, "package.json"),
    JSON.stringify({
      name: "test-ts-project",
      version: "1.0.0",
      dependencies: {
        react: "^18.0.0",
      },
      devDependencies: {
        typescript: "^4.9.0",
      },
    }),
  )

  // Create tsconfig.json
  fs.writeFileSync(
    path.join(dirPath, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "es2016",
        module: "commonjs",
        strict: true,
      },
    }),
  )

  // Create TypeScript files
  fs.writeFileSync(
    path.join(dirPath, "index.ts"),
    "import express from 'express';\nconst app = express();\napp.listen(3000);",
  )
}

// Setup Java project structure
function setupJavaProject(dirPath: string) {
  // Create pom.xml
  fs.writeFileSync(
    path.join(dirPath, "pom.xml"),
    `<project>
      <modelVersion>4.0.0</modelVersion>
      <groupId>com.example</groupId>
      <artifactId>test-java-project</artifactId>
      <version>1.0.0</version>
    </project>`,
  )

  // Create src/main/java directory structure
  const srcDir = path.join(dirPath, "src", "main", "java", "com", "example")
  fs.mkdirSync(srcDir, { recursive: true })

  // Create Java file
  fs.writeFileSync(
    path.join(srcDir, "Main.java"),
    `package com.example;
    
    import java.util.ArrayList;
    import java.util.List;
    
    public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }`,
  )
}

// Setup mixed project structure
function setupMixedProject(dirPath: string) {
  // Create package.json
  fs.writeFileSync(
    path.join(dirPath, "package.json"),
    JSON.stringify({
      name: "test-mixed-project",
      version: "1.0.0",
    }),
  )

  // Create both JS and Java files
  fs.writeFileSync(path.join(dirPath, "script.js"), "console.log('Hello from JS');")

  fs.writeFileSync(path.join(dirPath, "Test.java"), "public class Test { }")
}

test("detects JavaScript project correctly", () => {
  const tempDir = createTempDir()
  let result

  try {
    setupJavaScriptProject(tempDir)

    result = useLanguageDetection(tempDir)

    assert.strictEqual(result.language, ELanguage.JavaScript)
    assert(result.confidence > 0.5, "Confidence should be greater than 0.5")
    assert(result.indicators.length > 0, "Should have at least one indicator")
    assert(
      result.indicators.some((i) => i.includes("package.json")),
      "Should detect package.json",
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("detects TypeScript project correctly", () => {
  const tempDir = createTempDir()
  let result

  try {
    setupTypeScriptProject(tempDir)

    result = useLanguageDetection(tempDir)

    assert.strictEqual(result.language, ELanguage.TypeScript)
    assert(result.confidence > 0.5, "Confidence should be greater than 0.5")
    assert(
      result.indicators.some((i) => i.includes("tsconfig.json")),
      "Should detect tsconfig.json",
    )
    assert(
      result.indicators.some((i) => i.includes(".ts")),
      "Should detect .ts files",
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("detects Java project correctly", () => {
  const tempDir = createTempDir()
  let result

  try {
    setupJavaProject(tempDir)

    result = useLanguageDetection(tempDir)

    assert.strictEqual(result.language, ELanguage.Java)
    assert(result.confidence > 0.5, "Confidence should be greater than 0.5")
    assert(
      result.indicators.some((i) => i.includes("pom.xml")),
      "Should detect pom.xml",
    )
    assert(
      result.indicators.some((i) => i.includes(".java")),
      "Should detect .java files",
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("handles mixed project indicators", () => {
  const tempDir = createTempDir()
  let result

  try {
    setupMixedProject(tempDir)

    result = useLanguageDetection(tempDir)

    // The result could be either JavaScript or Java depending on the confidence calculation
    assert(
      result.language === ELanguage.JavaScript || result.language === ELanguage.Java,
      "Should detect either JavaScript or Java",
    )
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("returns unknown for empty directory", () => {
  const tempDir = createTempDir()
  let result

  try {
    result = useLanguageDetection(tempDir)

    assert.strictEqual(result.language, ELanguage.Unknown)
    assert.strictEqual(result.confidence, 0)
    assert.strictEqual(result.indicators.length, 0)
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("throws error for non-existent directory", () => {
  const nonExistentDir = path.join(os.tmpdir(), "non-existent-dir-" + Date.now())

  assert.throws(() => useLanguageDetection(nonExistentDir), /Directory does not exist/)
})
