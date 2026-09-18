import assert from "assert"
import { renderHook, waitFor } from "@testing-library/react"
import { IDBFactory } from "fake-indexeddb"
import "fake-indexeddb/auto"
import { JSDOM } from "jsdom"
import { afterEach, beforeEach, describe, test } from "node:test"

import { useIndexedDb } from "@/hooks/store"

describe("useIndexedDb", () => {
  let cleanup: () => void

  beforeEach(() => {
    const dom = new JSDOM("<!DOCTYPE html><body></body>", { url: "http://localhost" })
    defineGlobal("window", dom.window)
    defineGlobal("document", dom.window.document)
    defineGlobal("navigator", dom.window.navigator)
    defineGlobal("indexedDB", new IDBFactory())

    cleanup = () => {
      dom.window.close()
      Reflect.deleteProperty(globalThis, "window")
      Reflect.deleteProperty(globalThis, "document")
      Reflect.deleteProperty(globalThis, "navigator")
      Reflect.deleteProperty(globalThis, "indexedDB")
    }
  })

  afterEach(() => cleanup())

  test("should open indexedDB with the given name and store", async () => {
    const { result } = renderHook(() =>
      useIndexedDb<ITestData>({ dbName: "test-db", storeName: "test-store" }),
    )

    await waitFor(async () => {
      const { api, db } = result.current
      assert.ok(db, "IndexedDB should be opened")
      assert.strictEqual(db?.name, "test-db")
      assert.ok(db?.objectStoreNames.contains("test-store"), "Object store should exist")

      api.add({ id: "test-id", name: "test-name" })
      const getResult = await api.get("test-id")
      assert.strictEqual(getResult.name, "test-name")

      const putResult = await api.put({ id: "test-id", name: "test-name-updated" })
      assert.strictEqual(putResult, "test-id")
    })
  })
})

function defineGlobal(name: string, value: unknown) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  })
}

interface ITestData {
  id: IDBValidKey
  name: string
}
