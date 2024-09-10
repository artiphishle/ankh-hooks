import { describe, afterEach, beforeEach, test } from "node:test";
import assert from "assert";
import { JSDOM } from "jsdom";
import { renderHook, waitFor } from "@testing-library/react";
import { useIndexedDb } from "@/hooks/store";
import { IDBFactory } from "fake-indexeddb";
import "fake-indexeddb/auto";

declare global {
  namespace NodeJS {
    interface Global {
      window: Window & typeof globalThis;
      document: Document;
      navigator: Navigator;
      indexedDB: IDBFactory;
    }
  }
}

let cleanup: () => void;

beforeEach(() => {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, { url: "http://localhost" });
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.document = dom.window.document;
  global.navigator = { userAgent: 'node.js' } as Navigator;
  global.indexedDB = new IDBFactory();

  cleanup = () => {
    global.window.close();
    global.window = undefined!;
    global.document = undefined!;
    global.navigator = undefined!;
    global.indexedDB = undefined!;
  }
});

afterEach(() => {
  cleanup();
})

describe("useIndexedDb", () => {
  test("should open indexedDB with the given name and store", async () => {
    const { result } = renderHook(() => useIndexedDb<ITestData>({ dbName: "test-db", storeName: "test-store" }));

    await waitFor(async () => {
      const { api, db } = result.current;
      assert.ok(db, "IndexedDB should be opened");
      assert.strictEqual(db?.name, 'test-db');
      assert.ok(db?.objectStoreNames.contains('test-store'), "Object store should exist");

      api.add({ id: 'test-id', name: 'test-name' });
      const getResult = await api.get("test-id");
      assert.strictEqual(getResult.name, 'test-name');

      const putResult = await api.put({ id: 'test-id', name: 'test-name-updated' });
      assert.strictEqual(putResult, 'test-id');
    });
  })
});

interface ITestData {
  id: IDBValidKey;
  name: string;
}