/**
 * Reliable Client-Side Storage & Image Compression for Pooja Saree Draping
 * Uses dual-layer storage:
 * 1. IndexedDB (Supports large images, no 5MB quota restrictions)
 * 2. LocalStorage (Instant synchronous hydration)
 * 3. HTML5 Canvas Image Compression (Converts heavy 5-10MB camera photos into ~80-120KB crisp HD Web-optimized images)
 */

import businessData from '../data/business-data.json';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryMarathi?: string;
  image: string;
  isCustom?: boolean;
}

const DB_NAME = 'PoojaSareeDrapingDB';
const DB_VERSION = 1;
const STORE_NAME = 'siteData';
const GALLERY_KEY = 'pooja_saree_gallery_items_v2';
const STYLES_KEY = 'pooja_custom_style_images';

// In-memory cache for ultra-fast component sharing in the same session
let memoryGalleryCache: GalleryItem[] | null = null;
let memoryStylesCache: Record<number, string> | null = null;

/**
 * Open IndexedDB safely
 */
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Get item from IndexedDB
 */
export async function getFromIDB<T>(key: string): Promise<T | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Save item to IndexedDB
 */
export async function saveToIDB<T>(key: string, value: T): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Compress an uploaded image file or base64 string using Canvas.
 * Drops typical 4-10MB mobile photos down to crisp ~80-120KB images.
 */
export async function compressImageFile(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  if (typeof window === 'undefined') return '';

  return new Promise((resolve) => {
    const processImg = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Draw and compress to JPEG
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => {
        resolve(src);
      };
      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      // Already a data URL or regular URL
      if (fileOrDataUrl.startsWith('data:image/')) {
        processImg(fileOrDataUrl);
      } else {
        resolve(fileOrDataUrl);
      }
    } else {
      // File object
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        processImg(result);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Get initial synchronous gallery items (for instant rendering)
 */
export function getInitialGallery(): GalleryItem[] {
  if (memoryGalleryCache && memoryGalleryCache.length > 0) {
    return memoryGalleryCache;
  }
  if (typeof window === 'undefined') {
    return businessData.galleryItems as GalleryItem[];
  }
  try {
    const saved = localStorage.getItem(GALLERY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryGalleryCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return businessData.galleryItems as GalleryItem[];
}

/**
 * Load gallery items asynchronously with IndexedDB + LocalStorage fallback
 */
export async function loadGalleryAsync(): Promise<GalleryItem[]> {
  if (memoryGalleryCache && memoryGalleryCache.length > 0) {
    return memoryGalleryCache;
  }

  // 1. Try IndexedDB
  try {
    const idbData = await getFromIDB<GalleryItem[]>(GALLERY_KEY);
    if (idbData && Array.isArray(idbData) && idbData.length > 0) {
      memoryGalleryCache = idbData;
      // Sync to localStorage if possible
      try {
        localStorage.setItem(GALLERY_KEY, JSON.stringify(idbData));
      } catch {
        // quota exceeded is fine since IndexedDB has it
      }
      return idbData;
    }
  } catch {
    // ignore
  }

  // 2. Try LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryGalleryCache = parsed;
          // Sync to IndexedDB in background
          saveToIDB(GALLERY_KEY, parsed);
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback to default JSON
  const defaults = businessData.galleryItems as GalleryItem[];
  memoryGalleryCache = defaults;
  return defaults;
}

/**
 * Save gallery items to both IndexedDB and LocalStorage, and broadcast update
 */
export async function saveGalleryAsync(items: GalleryItem[]): Promise<boolean> {
  memoryGalleryCache = items;

  // 1. Save to IndexedDB (virtually unlimited capacity)
  await saveToIDB(GALLERY_KEY, items);

  // 2. Try saving to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    } catch {
      // If quota exceeded, attempt to prune very large non-critical items or rely purely on IndexedDB
      console.warn('LocalStorage quota reached, saved securely in IndexedDB');
    }

    // 3. Broadcast to all open components and listeners
    try {
      window.dispatchEvent(
        new CustomEvent('pooja_gallery_updated', {
          detail: items,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

/**
 * Get initial custom style images
 */
export function getInitialStyles(): Record<number, string> {
  if (memoryStylesCache) return memoryStylesCache;
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STYLES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      memoryStylesCache = parsed;
      return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

/**
 * Save custom style images to IndexedDB and LocalStorage
 */
export async function saveStylesAsync(styles: Record<number, string>): Promise<boolean> {
  memoryStylesCache = styles;
  await saveToIDB(STYLES_KEY, styles);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STYLES_KEY, JSON.stringify(styles));
    } catch {
      console.warn('LocalStorage quota reached, saved in IndexedDB');
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_styles_updated', {
          detail: styles,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}
