"use client";
import { useEffect, useState } from "react";

export function useIndexedDb<T extends IData>({ dbName, storeName }: IUseAnkhIndexedDb) {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  function createTransaction(mode: EIndexedDbTransactionMode = EIndexedDbTransactionMode.ReadOnly) {
    if (!db) throw new Error("Trying to call db.transaction before db was initialized");

    const tx = db.transaction(storeName, mode);

    tx.onerror = (event) => console.warn(event);

    return tx;
  }

  const api = {
    add: (data: IData) => {
      return new Promise((resolve, reject) => {
        const tx = createTransaction(EIndexedDbTransactionMode.ReadWrite);
        const store = tx.objectStore(storeName);
        const addRequest = store.add(data);

        addRequest.onsuccess = () => resolve(addRequest.result);
        addRequest.onerror = () => reject(addRequest.error);
      });
    },
    get: (id: IDBValidKey) => {
      return new Promise<IData>((resolve, reject) => {
        const tx = createTransaction();
        const store = tx.objectStore(storeName);
        const getRequest = store.get(id);

        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error)
      });
    },
    put: (data: IData) => {
      return new Promise<IDBValidKey>((resolve, reject) => {
        const tx = createTransaction(EIndexedDbTransactionMode.ReadWrite);
        const store = tx.objectStore(storeName);
        const putRequest = store.put(data);

        putRequest.onsuccess = () => resolve(putRequest.result);
        putRequest.onerror = () => reject(putRequest.error)
      })
    }
  };

  useEffect(() => {
    const openRequest = indexedDB.open(dbName);

    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: 'id' });
      }
    }
    openRequest.onsuccess = () => {
      setDb(openRequest.result);
    }
  }, [dbName, storeName]);

  return { db, api };
}

enum EIndexedDbTransactionMode {
  ReadWrite = "readwrite",
  ReadOnly = "readonly"
}
interface IUseAnkhIndexedDb {
  readonly dbName: string;
  readonly storeName: string;
  readonly keyPath?: IDBValidKey;
}
interface IData {
  id: IDBValidKey
  [k: string]: any;
}