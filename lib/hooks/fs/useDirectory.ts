"use server"
import fs from "fs"
import path from "path"
import xml2js from "xml2js";
import { ELanguage, useLanguageDetection } from "./useLanguageDetection"

export interface IFile {
  path: string
  file: string
  extension: string
  size: number
  lastModified: Date
  content?: string
}
export interface IJavaFile extends IFile {
  packageName?: string
  imports?: string[]
  className?: string
}
export interface ITypeScriptFile extends IFile {
  imports?: string[]
  exports?: string[]
  interfaces?: string[]
  types?: string[]
}
export interface IDirectory {
  path: string
  name: string
  files: IFile[]
  dirs: IDirectory[]
}
export interface IUseDirectory {
  directoryPath: string
  recursive?: boolean
  includeContent?: boolean
  maxDepth?: number
}
export interface IUseJavaDirectory extends IUseDirectory {
  parseJavaFiles?: boolean
}
export interface IUseTypeScriptDirectory extends IUseDirectory {
  parseTypeScriptFiles?: boolean
}

export function useDirectory(options: IUseDirectory): IDirectory {
  const { directoryPath, recursive = true, includeContent = false, maxDepth = 5 } = options

  // Check if directory exists
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Directory does not exist: ${directoryPath}`)
  }

  // Detect language to determine how to parse files
  const { language } = useLanguageDetection(directoryPath)

  return scanDirectory(directoryPath, {
    recursive,
    includeContent,
    maxDepth,
    currentDepth: 0,
    language,
  })
}

function scanDirectory(
  directoryPath: string,
  options: {
    recursive: boolean
    includeContent: boolean
    maxDepth: number
    currentDepth: number
    language: ELanguage
  },
): IDirectory {
  const { recursive, includeContent, maxDepth, currentDepth, language } = options

  const files: IFile[] = []
  const dirs: IDirectory[] = []
  const dirName = path.basename(directoryPath)

  // Read directory contents
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })

  // Process files
  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isFile()) {
      const stats = fs.statSync(entryPath)
      const extension = path.extname(entry.name).slice(1)

      const fileInfo: IFile = {
        path: directoryPath,
        file: entry.name,
        extension,
        size: stats.size,
        lastModified: stats.mtime,
      }

      if (includeContent) {
        fileInfo.content = fs.readFileSync(entryPath, "utf8")
      }

      // Process specific file types based on language
      if (language === ELanguage.Java && extension === "java") {
        files.push(parseJavaFile(fileInfo, includeContent))
      } else if (
        (language === ELanguage.TypeScript || language === ELanguage.JavaScript) &&
        (extension === "ts" || extension === "tsx" || extension === "js" || extension === "jsx")
      ) {
        files.push(parseTypeScriptFile(fileInfo, includeContent))
      } else {
        files.push(fileInfo)
      }
    }
    // Process directories recursively if needed
    else if (entry.isDirectory() && recursive && currentDepth < maxDepth) {
      const subDir = scanDirectory(entryPath, {
        ...options,
        currentDepth: currentDepth + 1,
      })
      dirs.push(subDir)
    }
  }

  return {
    path: directoryPath,
    name: dirName,
    files,
    dirs,
  }
}

function parseJavaFile(file: IFile, includeContent: boolean): IJavaFile {
  const javaFile: IJavaFile = { ...file }

  // If content is not included, read it temporarily for parsing
  const content =
    file.content || (includeContent ? file.content : fs.readFileSync(path.join(file.path, file.file), "utf8"))

  if (content) {
    // Extract package name
    const packageMatch = content.match(/package\s+([a-zA-Z0-9_.]+)\s*;/)
    if (packageMatch && packageMatch[1]) {
      javaFile.packageName = packageMatch[1]
    }

    // Extract imports
    const importMatches = content.matchAll(/import\s+([a-zA-Z0-9_.*]+)\s*;/g)
    javaFile.imports = Array.from(importMatches)
      .map((match) => match[1])
      .filter((importName): importName is string => importName !== undefined)

    // Extract class name
    const classMatch = content.match(/class\s+([a-zA-Z0-9_]+)/)
    if (classMatch && classMatch[1]) {
      javaFile.className = classMatch[1]
    }

    // Remove content if it wasn't requested
    if (!includeContent) {
      delete javaFile.content
    }
  }

  return javaFile
}

function parseTypeScriptFile(file: IFile, includeContent: boolean): ITypeScriptFile {
  const tsFile: ITypeScriptFile = { ...file }

  // If content is not included, read it temporarily for parsing
  const content =
    file.content || (includeContent ? file.content : fs.readFileSync(path.join(file.path, file.file), "utf8"))

  if (content) {
    // Extract imports
    const importMatches = content.matchAll(
      /import\s+(?:{([^}]+)}|\*\s+as\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+))\s+from\s+['"]([^'"]+)['"]/g,
    )
    tsFile.imports = Array.from(importMatches).map((match) => {
      const importedItems = match[1] || match[2] || match[3]
      const source = match[4]
      return `${importedItems} from ${source}`
    })

    // Extract exports
    const exportMatches = content.matchAll(
      /export\s+(?:const|let|var|function|class|interface|type|enum)\s+([a-zA-Z0-9_]+)/g,
    )
    tsFile.exports = Array.from(exportMatches)
      .map((match) => match[1])
      .filter((exportName): exportName is string => exportName !== undefined)

    // Extract interfaces
    const interfaceMatches = content.matchAll(/interface\s+([a-zA-Z0-9_]+)/g)
    tsFile.interfaces = Array.from(interfaceMatches)
      .map((match) => match[1])
      .filter((interfaceName): interfaceName is string => interfaceName !== undefined)

    // Extract types
    const typeMatches = content.matchAll(/type\s+([a-zA-Z0-9_]+)/g)
    tsFile.types = Array.from(typeMatches)
      .map((match) => match[1])
      .filter((typeName): typeName is string => typeName !== undefined)

    // Remove content if it wasn't requested
    if (!includeContent) {
      delete tsFile.content
    }
  }

  return tsFile
}

async function getJavaSourceDirectory(directoryPath: string){
  const pomPath = path.resolve(directoryPath, 'pom.xml');
  const pomData = fs.readFileSync(pomPath, 'utf8');
  const pomParsed = await xml2js.parseStringPromise(pomData);
  const build = pomParsed.project.build;
  const sourceDirectory = build && build[0].sourceDirectory ? build[0].sourceDirectory[0] : 'src/main/java';

  return sourceDirectory;
}

export async function useJavaSourceDirectory(options: IUseJavaDirectory){
  const directory = useJavaDirectory({...options});

  const javaSrcDir = await getJavaSourceDirectory(directory.path);
  const javaSrcDirArray = javaSrcDir.slice(directory.path.length).split('/');
  const filteredDirs = directory.dirs.filter((dir) => dir.name === javaSrcDirArray[0]);
  
  return {...directory, dirs: filteredDirs};
}

export function useJavaDirectory(options: IUseJavaDirectory){
  return useDirectory({
    ...options,
    // Additional Java-specific options can be added here
  });
}

export function useTypeScriptDirectory(options: IUseTypeScriptDirectory): IDirectory {
  return useDirectory({
    ...options,
    // Additional TypeScript-specific options can be added here
  })
}
