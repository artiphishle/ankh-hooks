#!/usr/bin/env node

import test from "node:test"
import assert from "node:assert"
import fs from "fs"
import path from "path"
import os from "os"
import { useDirectory, useJavaDirectory, useTypeScriptDirectory } from "../../hooks/fs/useDirectory"

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

// Setup a test project with multiple file types and nested directories
function setupTestProject(dirPath: string) {
  // Create root files
  fs.writeFileSync(
    path.join(dirPath, "package.json"),
    JSON.stringify({
      name: "test-project",
      version: "1.0.0",
    }),
  )

  fs.writeFileSync(
    path.join(dirPath, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "es2016",
      },
    }),
  )

  // Create src directory with TypeScript files
  const srcDir = path.join(dirPath, "src")
  fs.mkdirSync(srcDir)

  fs.writeFileSync(
    path.join(srcDir, "index.ts"),
    `import { App } from './app';
    import express from 'express';
    
    export function startServer() {
      const app = new App();
      app.start();
    }
    
    export type ServerConfig = {
      port: number;
      host: string;
    };
    
    export interface ILogger {
      log(message: string): void;
    }`,
  )

  fs.writeFileSync(
    path.join(srcDir, "app.ts"),
    `export class App {
      start() {
        console.log('App started');
      }
    }`,
  )

  // Create java directory with Java files
  const javaDir = path.join(dirPath, "java")
  fs.mkdirSync(javaDir)

  fs.writeFileSync(
    path.join(javaDir, "Main.java"),
    `package com.example;
    
    import java.util.List;
    import java.util.ArrayList;
    
    public class Main {
      public static void main(String[] args) {
        System.out.println("Hello, World!");
      }
    }`,
  )

  // Create nested directories
  const nestedDir = path.join(dirPath, "nested", "deep")
  fs.mkdirSync(nestedDir, { recursive: true })

  fs.writeFileSync(path.join(nestedDir, "nested.txt"), "This is a nested text file.")
}

test("scans directory structure correctly", () => {
  const tempDir = createTempDir()

  try {
    setupTestProject(tempDir)

    const result = useDirectory({ directoryPath: tempDir })

    // Check root structure
    assert.strictEqual(result.path, tempDir)
    assert.strictEqual(result.name, path.basename(tempDir))
    assert(Array.isArray(result.files), "files should be an array")
    assert(Array.isArray(result.dirs), "dirs should be an array")

    // Check root files
    const rootFiles = result.files.map((f) => f.file)
    assert(rootFiles.includes("package.json"), "Should include package.json")
    assert(rootFiles.includes("tsconfig.json"), "Should include tsconfig.json")

    // Check directories
    const dirNames = result.dirs.map((d) => d.name)
    assert(dirNames.includes("src"), "Should include src directory")
    assert(dirNames.includes("java"), "Should include java directory")
    assert(dirNames.includes("nested"), "Should include nested directory")

    // Check nested structure
    const nestedDir = result.dirs.find((d) => d.name === "nested")
    assert(nestedDir, "Should find nested directory")
    assert(nestedDir?.dirs.length === 1, "Nested directory should have one subdirectory")
    assert(nestedDir?.dirs[0]?.name === "deep", "Deep directory should be found")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("parses TypeScript files correctly", () => {
  const tempDir = createTempDir()

  try {
    setupTestProject(tempDir)

    const result = useTypeScriptDirectory({
      directoryPath: tempDir,
      includeContent: true,
    })

    // Find src directory
    const srcDir = result.dirs.find((d) => d.name === "src")
    assert(srcDir, "Should find src directory")

    // Find index.ts file
    const indexFile = srcDir?.files.find((f) => f.file === "index.ts")
    assert(indexFile, "Should find index.ts file")

    // Check TypeScript-specific parsing
    if (indexFile) {
      assert(Array.isArray(indexFile.imports), "Should parse imports")
      assert(
        indexFile.imports?.some((i) => i.includes("App")),
        "Should find App import",
      )
      assert(
        indexFile.imports?.some((i) => i.includes("express")),
        "Should find express import",
      )

      assert(Array.isArray(indexFile.exports), "Should parse exports")
      assert(indexFile.exports?.includes("startServer"), "Should find startServer export")

      assert(Array.isArray(indexFile.types), "Should parse types")
      assert(indexFile.types?.includes("ServerConfig"), "Should find ServerConfig type")

      assert(Array.isArray(indexFile.interfaces), "Should parse interfaces")
      assert(indexFile.interfaces?.includes("ILogger"), "Should find ILogger interface")
    }
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("parses Java files correctly", () => {
  const tempDir = createTempDir()

  try {
    setupTestProject(tempDir)

    const result = useJavaDirectory({
      directoryPath: tempDir,
      includeContent: true,
    })

    // Find java directory
    const javaDir = result.dirs.find((d) => d.name === "java")
    assert(javaDir, "Should find java directory")

    // Find Main.java file
    const mainFile = javaDir?.files.find((f) => f.file === "Main.java")
    assert(mainFile, "Should find Main.java file")

    // Check Java-specific parsing
    if (mainFile) {
      assert.strictEqual(mainFile.packageName, "com.example", "Should parse package name")

      assert(Array.isArray(mainFile.imports), "Should parse imports")
      assert(mainFile.imports?.includes("java.util.List"), "Should find List import")
      assert(mainFile.imports?.includes("java.util.ArrayList"), "Should find ArrayList import")

      assert.strictEqual(mainFile.className, "Main", "Should parse class name")
    }
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("respects maxDepth option", () => {
  const tempDir = createTempDir()

  try {
    setupTestProject(tempDir)

    // Test with maxDepth = 1 (should not scan nested/deep)
    const result = useDirectory({
      directoryPath: tempDir,
      maxDepth: 1,
    })

    // Find nested directory
    const nestedDir = result.dirs.find((d) => d.name === "nested")
    assert(nestedDir, "Should find nested directory")

    // Nested directory should be empty because maxDepth = 1
    assert(nestedDir?.dirs.length === 0, "Should not scan deeper than maxDepth")
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("respects recursive option", () => {
  const tempDir = createTempDir()

  try {
    setupTestProject(tempDir)

    // Test with recursive = false
    const result = useDirectory({
      directoryPath: tempDir,
      recursive: false,
    })

    // Should find directories but not scan them
    assert(result.dirs.length > 0, "Should find directories")

    // All directories should be empty
    for (const dir of result.dirs) {
      assert(dir.dirs.length === 0, "Directory should not be scanned")
      assert(dir.files.length === 0, "Directory should not be scanned")
    }
  } finally {
    cleanupTempDir(tempDir)
  }
})

test("throws error for non-existent directory", () => {
  const nonExistentDir = path.join(os.tmpdir(), "non-existent-dir-" + Date.now())

  assert.throws(() => useDirectory({ directoryPath: nonExistentDir }), /Directory does not exist/)
})
