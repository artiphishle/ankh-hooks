"use client";
import { useState } from "react";

export function useIndexedDb(dbName: string) {
  const [db, setDb] = useState<any | null>(null);
  const [store, setStore] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = async function (event: any) {
    const db = event.target.result;
    const store = await db.createObjectStore("ankh-cms-config", { keyPath: "id" });
    setDb(db);
    setStore(store);
    // objectStore.createIndex("nameIndex", "name", { unique: false });
  };
  request.onsuccess = function (event: any) {
    console.log("Connected to:", dbName);
  };
  request.onerror = function (event: any) {
    setError("Fehler");
  };

  const getConfig = async (id: number) => store.get(id);

  const addConfig = async (data: any) => {
    if (!db) return console.log('Db not available...');
    const transaction = db?.transaction("ankh-cms-config", "readwrite");
    const configStore = transaction?.objectStore("ankh-cms-config");
    await configStore?.add(data);
  }

  return { error, db, store, getConfig, addConfig };
}