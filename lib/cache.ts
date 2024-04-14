class Cache {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase>;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target!.result as IDBDatabase;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBOpenDBRequest).result);
        console.log("Database initialized successfully");
      };
      request.onerror = (event: Event) => {
        console.error(
          "Database initialization failed:",
          (event.target as IDBOpenDBRequest).error
        );
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async set(id: string, blobData: Blob): Promise<string> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id, blob: blobData });
      request.onsuccess = () =>
        resolve(`Blob with ID ${id} has been stored successfully.`);
      request.onerror = () =>
        reject("Error storing blob: " + request.error?.message);
    });
  }

  async get(id: string): Promise<Blob | null> {
    const db = await this.dbPromise;
    return new Promise((resolve) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      console.log("store", store, request, id);
      request.onsuccess = () => {
        console.log("---", request, request.result);
        if (request.result) {
          resolve(request.result.blob);
        } else {
          // 如果没有，直接下载
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }
}

export const cache = new Cache("asdpodcast", "audio");
