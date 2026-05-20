const DB_NAME = 'mypos-offline';
const DB_VERSION = 2;

interface OfflineOrder {
  id: string;
  data: any;
  createdAt: number;
  synced: boolean;
  retryCount: number;
  error?: string;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
          orderStore.createIndex('synced', 'synced', { unique: false });
          orderStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('pendingActions')) {
          const actionStore = db.createObjectStore('pendingActions', { keyPath: 'id' });
          actionStore.createIndex('synced', 'synced', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveOrder(order: OfflineOrder): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('orders', 'readwrite');
      tx.objectStore('orders').put({ ...order, retryCount: order.retryCount || 0 });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getUnsyncedOrders(): Promise<OfflineOrder[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('orders', 'readonly');
      const index = tx.objectStore('orders').index('synced');
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markOrderSynced(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('orders', 'readwrite');
      const store = tx.objectStore('orders');
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const order = getReq.result;
        if (order) {
          order.synced = true;
          store.put(order);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async cacheProducts(products: any[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      store.clear();
      products.forEach((p) => store.put(p));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getCachedProducts(): Promise<any[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('products', 'readonly');
      const request = tx.objectStore('products').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();

// Background sync with retry logic
export async function syncOfflineOrders() {
  const orders = await offlineStorage.getUnsyncedOrders();
  let synced = 0;
  let failed = 0;
  for (const order of orders) {
    if ((order as any).retryCount >= 5) continue; // Skip after 5 retries
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.accessToken;
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(order.data),
      });
      if (response.ok) {
        await offlineStorage.markOrderSynced(order.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
      break;
    }
  }
  return { synced, failed, remaining: orders.length - synced };
}

// Get queue status
export async function getOfflineQueueStatus() {
  const orders = await offlineStorage.getUnsyncedOrders();
  return {
    pendingOrders: orders.length,
    totalItems: orders.reduce((s, o) => s + (o.data?.items?.length || 0), 0),
    oldestOrder: orders.length > 0 ? new Date(orders[0].createdAt) : null,
  };
}

// Auto-sync when back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineOrders();
  });
}
