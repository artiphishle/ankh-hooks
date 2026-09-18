import assert from "node:assert"
import { afterEach, beforeEach, describe, test } from "node:test"
import { act, renderHook, waitFor } from "@testing-library/react"
import { JSDOM } from "jsdom"

import { useLocalStorage } from "@/hooks/store"

declare global {
  namespace NodeJS {
    interface Global {
      window: Window & typeof globalThis
      document: Document
      navigator: Navigator
    }
  }
}

let cleanup: () => void

beforeEach(() => {
  const dom = new JSDOM("<!DOCTYPE html><body></body>", { url: "http://localhost" })
  global.window = dom.window as unknown as Window & typeof globalThis
  global.document = dom.window.document
  global.navigator = { userAgent: "node.js" } as Navigator

  cleanup = () => {
    global.window.close()
    global.window = undefined!
    global.document = undefined!
    global.navigator = undefined!
  }
})

afterEach(() => cleanup())

describe("useLocalStorage", () => {
  test("hydrates from localStorage after mounting", async () => {
    window.localStorage.setItem("settings", JSON.stringify({ enabled: true }))

    const { result } = renderHook(() => useLocalStorage("settings", { enabled: false }))

    await waitFor(() => assert.deepStrictEqual(result.current[0], { enabled: true }))
  })

  test("persists functional updates against the latest value", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0))

    act(() => {
      result.current[1]((value) => value + 1)
      result.current[1]((value) => value + 1)
    })

    assert.strictEqual(result.current[0], 2)
    assert.strictEqual(window.localStorage.getItem("count"), "2")
  })

  test("falls back to the initial value for malformed stored JSON", async () => {
    window.localStorage.setItem("broken", "{")
    const originalWarn = console.warn
    const warnings: unknown[][] = []
    console.warn = (...args: unknown[]) => warnings.push(args)

    try {
      const { result } = renderHook(() => useLocalStorage("broken", 7))
      await waitFor(() => assert.strictEqual(result.current[0], 7))
      assert.strictEqual(warnings.length, 1)
    } finally {
      console.warn = originalWarn
    }
  })

  test("keeps in-memory state when persistence serialization fails", () => {
    const originalWarn = console.warn
    const warnings: unknown[][] = []
    console.warn = (...args: unknown[]) => warnings.push(args)

    try {
      const { result } = renderHook(() => useLocalStorage<object>("value", {}))
      const circular: { self?: unknown } = {}
      circular.self = circular

      act(() => result.current[1](circular))

      assert.strictEqual(result.current[0], circular)
      assert.strictEqual(window.localStorage.getItem("value"), null)
      assert.strictEqual(warnings.length, 1)
    } finally {
      console.warn = originalWarn
    }
  })

  test("synchronizes matching storage events and resets removed values", () => {
    const { result } = renderHook(() => useLocalStorage("count", 1))

    act(() => {
      window.dispatchEvent(
        new window.StorageEvent("storage", {
          key: "count",
          newValue: "5",
          storageArea: window.localStorage,
        }),
      )
    })
    assert.strictEqual(result.current[0], 5)

    act(() => {
      window.dispatchEvent(
        new window.StorageEvent("storage", {
          key: "count",
          newValue: null,
          storageArea: window.localStorage,
        }),
      )
    })
    assert.strictEqual(result.current[0], 1)
  })
})
