"use client";
import { useState } from "react";

export function useIndexedDb<T>({ dbName, storeName }: IUseAnkhIndexedDb) {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const openRequest = indexedDB.open(dbName, 6);

  openRequest.onupgradeneeded = (event: Event) => {
    const db: IDBDatabase = (event.target as IDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    }
  }
  openRequest.onsuccess = (event: Event) => {
    setDb((event.target as IDBOpenDBRequest).result);
  }
  openRequest.onerror = (event: Event) => console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);

  const put = (data: T, id: IDBValidKey) => new Promise<IDBValidKey>((resolve, reject) => {
    if (!db) { reject('no db'); return }
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data, id);

    request.onsuccess = (event: Event) => {
      setDb((event.target as IDBOpenDBRequest).result)
      resolve(request.result)
    };
    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  const api = {
    create: put,
    read: (id: IDBValidKey) => new Promise<T>((resolve, reject) => {
      if (!db) { reject('no db'); return }
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      }
      request.onerror = (event: Event) => {
        reject((event.target as IDBRequest).error);
      }
    }),
    update: put,
    delete: (id: IDBValidKey) => new Promise<undefined>((resolve, reject) => {
      if (!db) { reject('no db'); return }
      const transaction = db.transaction(storeName);
      transaction.oncomplete = () => {
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = (event: Event) => {
          reject((event.target as IDBRequest).error);
        };
      }
    })
  };

  return { api };
}

interface IUseAnkhIndexedDb {
  readonly dbName: string;
  readonly storeName: string;
  readonly keyPath?: IDBValidKey;
}

interface IUseIndexedDbApi {
  create: (data: any, id: IDBValidKey) => Promise<IDBValidKey>;
  read: (id: IDBValidKey) => Promise<any>;
  update: (data: any, id: IDBValidKey) => any;
  delete: (id: IDBValidKey) => Promise<undefined>;
}