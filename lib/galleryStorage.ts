/**
 * Reliable Multi-Tier Storage, Server-Sync & Image Compression
 * for Pooja Saree Draping Pune.
 *
 * Tier 1: Server-Side API (/api/site-data) - Shared across all devices, browsers & visitors
 * Tier 2: Browser IndexedDB - High-capacity client-side offline storage
 * Tier 3: Browser LocalStorage - Instant synchronous hydration
 * Tier 4: In-Memory Cache - Instant cross-component rendering
 * + HTML5 Canvas Image Compression (~80-120KB optimized Web images)
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

export interface WorkshopConfig {
  title: string;
  instructor: string;
  training: string;
  suitableFor: string;
  nextDate: string;
  time: string;
  fee: string;
  seatsLeft: string;
  venue: string;
}

export interface BookingLead {
  id: string;
  name: string;
  phone: string;
  workshopType: string;
  participants: string;
  message?: string;
  date: string;
  status: 'new' | 'contacted' | 'confirmed';
}

export const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  title: '1 डे साडी ड्रॅपिंग वर्कशॉप',
  instructor: 'पूजा पाटील',
  training: 'गौरी महालक्ष्मीच्या 14 ते 15 सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
  suitableFor: 'उभारलेल्या तसेच बसलेल्या गौरीसाठी आणि सणांसारख्या विशेष प्रसंगांसाठी',
  nextDate: 'आगामी शनिवार / रविवार (Upcoming Weekend)',
  time: 'सकाळी 10:30 ते संध्याकाळी 5:30 (पूर्ण 1 दिवस)',
  fee: '₹1,999/- फक्त',
  seatsLeft: 'फक्त 8 ते 10 जागा (वैयक्तिक लक्ष देण्यासाठी मर्यादित बॅच)',
  venue: 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, सिंहगड रोड, आनंद नगर, पुणे - 411051',
};

const DB_NAME = 'PoojaSareeDrapingDB';
const DB_VERSION = 2;
const STORE_NAME = 'siteData';
const GALLERY_KEY = 'pooja_saree_gallery_items_v2';
const STYLES_KEY = 'pooja_custom_style_images';
const WORKSHOP_KEY = 'pooja_workshop_config';
const LEADS_KEY = 'pooja_workshop_bookings';

// In-memory cache for fast reactivity within the current session
let memoryGalleryCache: GalleryItem[] | null = null;
let memoryStylesCache: Record<number | string, string> | null = null;
let memoryWorkshopCache: WorkshopConfig | null = null;
let memoryLeadsCache: BookingLead[] | null = null;

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
 * Drops heavy 4-10MB mobile camera photos down to crisp ~80-120KB images.
 */
export async function compressImageFile(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  if (typeof window === 'undefined') return '';

  return new Promise((resolve) => {
    const processImg = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth/maxHeight
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

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };

    if (typeof fileOrDataUrl === 'string') {
      if (fileOrDataUrl.startsWith('data:image/')) {
        processImg(fileOrDataUrl);
      } else {
        resolve(fileOrDataUrl);
      }
    } else {
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

/* =========================================================================
   SERVER SYNC HELPERS
   ========================================================================= */

async function fetchServerSiteData(): Promise<any | null> {
  try {
    const res = await fetch('/api/site-data', {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // offline or error
  }
  return null;
}

async function postServerSiteData(payload: Record<string, any>): Promise<any | null> {
  try {
    const res = await fetch('/api/site-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Server sync offline, cached locally:', err);
  }
  return null;
}

/* =========================================================================
   1. FULL SITE DATA
   ========================================================================= */

export async function loadFullSiteDataAsync(): Promise<{
  workshopConfig: WorkshopConfig;
  galleryItems: GalleryItem[];
  styleImages: Record<string | number, string>;
  leads: BookingLead[];
}> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData) {
    if (serverData.workshopConfig) {
      memoryWorkshopCache = serverData.workshopConfig;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(WORKSHOP_KEY, JSON.stringify(serverData.workshopConfig)); } catch {}
        saveToIDB(WORKSHOP_KEY, serverData.workshopConfig);
      }
    }
    if (Array.isArray(serverData.galleryItems) && serverData.galleryItems.length > 0) {
      memoryGalleryCache = serverData.galleryItems;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(GALLERY_KEY, JSON.stringify(serverData.galleryItems)); } catch {}
        saveToIDB(GALLERY_KEY, serverData.galleryItems);
      }
    }
    if (serverData.styleImages) {
      memoryStylesCache = serverData.styleImages;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(STYLES_KEY, JSON.stringify(serverData.styleImages)); } catch {}
        saveToIDB(STYLES_KEY, serverData.styleImages);
      }
    }
    if (Array.isArray(serverData.leads)) {
      memoryLeadsCache = serverData.leads;
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(LEADS_KEY, JSON.stringify(serverData.leads)); } catch {}
        saveToIDB(LEADS_KEY, serverData.leads);
      }
    }

    return {
      workshopConfig: serverData.workshopConfig || DEFAULT_WORKSHOP_CONFIG,
      galleryItems: serverData.galleryItems || (businessData.galleryItems as GalleryItem[]),
      styleImages: serverData.styleImages || {},
      leads: serverData.leads || [],
    };
  }

  // 2. Fallback to local
  const [gallery, styles, workshop, leads] = await Promise.all([
    loadGalleryAsync(),
    loadStylesAsync(),
    loadWorkshopConfigAsync(),
    loadLeadsAsync(),
  ]);

  return {
    workshopConfig: workshop,
    galleryItems: gallery,
    styleImages: styles,
    leads,
  };
}

/* =========================================================================
   2. GALLERY ITEMS
   ========================================================================= */

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

export async function loadGalleryAsync(): Promise<GalleryItem[]> {
  // 1. Try Server API first for cross-device consistency
  const serverData = await fetchServerSiteData();
  if (serverData && Array.isArray(serverData.galleryItems) && serverData.galleryItems.length > 0) {
    memoryGalleryCache = serverData.galleryItems;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(GALLERY_KEY, JSON.stringify(serverData.galleryItems)); } catch {}
      saveToIDB(GALLERY_KEY, serverData.galleryItems);
    }
    return serverData.galleryItems;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<GalleryItem[]>(GALLERY_KEY);
    if (idbData && Array.isArray(idbData) && idbData.length > 0) {
      memoryGalleryCache = idbData;
      return idbData;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  if (typeof window !== 'undefined') {
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
  }

  const defaults = businessData.galleryItems as GalleryItem[];
  memoryGalleryCache = defaults;
  return defaults;
}

export async function saveGalleryAsync(items: GalleryItem[]): Promise<boolean> {
  memoryGalleryCache = items;

  // 1. Save to Server
  postServerSiteData({ galleryItems: items });

  // 2. Save to IndexedDB
  await saveToIDB(GALLERY_KEY, items);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    } catch {
      console.warn('LocalStorage full, saved in Server & IndexedDB');
    }

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

/* =========================================================================
   3. SAREE STYLES PHOTOS
   ========================================================================= */

export function getInitialStyles(): Record<number | string, string> {
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

export async function loadStylesAsync(): Promise<Record<number | string, string>> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData && serverData.styleImages) {
    memoryStylesCache = serverData.styleImages;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STYLES_KEY, JSON.stringify(serverData.styleImages)); } catch {}
      saveToIDB(STYLES_KEY, serverData.styleImages);
    }
    return serverData.styleImages;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<Record<number | string, string>>(STYLES_KEY);
    if (idbData && typeof idbData === 'object') {
      memoryStylesCache = idbData;
      return idbData;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  const local = getInitialStyles();
  return local;
}

export async function saveStylesAsync(styles: Record<number | string, string>): Promise<boolean> {
  memoryStylesCache = styles;

  // 1. Save to Server
  postServerSiteData({ styleImages: styles });

  // 2. Save to IndexedDB
  await saveToIDB(STYLES_KEY, styles);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STYLES_KEY, JSON.stringify(styles));
    } catch {
      console.warn('LocalStorage full, saved in Server & IndexedDB');
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

/* =========================================================================
   4. WORKSHOP CONFIG
   ========================================================================= */

export function getInitialWorkshopConfig(): WorkshopConfig {
  if (memoryWorkshopCache) return memoryWorkshopCache;
  if (typeof window === 'undefined') return DEFAULT_WORKSHOP_CONFIG;
  try {
    const saved = localStorage.getItem(WORKSHOP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged: WorkshopConfig = { ...DEFAULT_WORKSHOP_CONFIG, ...parsed };
      memoryWorkshopCache = merged;
      return merged;
    }
  } catch {
    // ignore
  }
  return DEFAULT_WORKSHOP_CONFIG;
}

export async function loadWorkshopConfigAsync(): Promise<WorkshopConfig> {
  // 1. Try server
  const serverData = await fetchServerSiteData();
  if (serverData && serverData.workshopConfig) {
    const merged = { ...DEFAULT_WORKSHOP_CONFIG, ...serverData.workshopConfig };
    memoryWorkshopCache = merged;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(WORKSHOP_KEY, JSON.stringify(merged)); } catch {}
      saveToIDB(WORKSHOP_KEY, merged);
    }
    return merged;
  }

  // 2. Try IndexedDB
  try {
    const idbData = await getFromIDB<WorkshopConfig>(WORKSHOP_KEY);
    if (idbData && typeof idbData === 'object') {
      const merged = { ...DEFAULT_WORKSHOP_CONFIG, ...idbData };
      memoryWorkshopCache = merged;
      return merged;
    }
  } catch {
    // ignore
  }

  // 3. Try LocalStorage
  return getInitialWorkshopConfig();
}

export async function saveWorkshopConfigAsync(config: WorkshopConfig): Promise<boolean> {
  memoryWorkshopCache = config;

  // 1. Save to Server
  postServerSiteData({ workshopConfig: config });

  // 2. Save to IndexedDB
  await saveToIDB(WORKSHOP_KEY, config);

  // 3. Save to LocalStorage & broadcast
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(WORKSHOP_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_workshop_updated', {
          detail: config,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

/* =========================================================================
   5. BOOKINGS / LEADS
   ========================================================================= */

export function getInitialLeads(): BookingLead[] {
  if (memoryLeadsCache) return memoryLeadsCache;
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LEADS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        memoryLeadsCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export async function loadLeadsAsync(): Promise<BookingLead[]> {
  const serverData = await fetchServerSiteData();
  if (serverData && Array.isArray(serverData.leads)) {
    memoryLeadsCache = serverData.leads;
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(LEADS_KEY, JSON.stringify(serverData.leads)); } catch {}
      saveToIDB(LEADS_KEY, serverData.leads);
    }
    return serverData.leads;
  }

  return getInitialLeads();
}

export async function saveLeadsAsync(leads: BookingLead[]): Promise<boolean> {
  memoryLeadsCache = leads;

  postServerSiteData({ leads });

  await saveToIDB(LEADS_KEY, leads);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore
    }

    try {
      window.dispatchEvent(
        new CustomEvent('pooja_leads_updated', {
          detail: leads,
        })
      );
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
  }

  return true;
}

export async function addLeadAsync(newLead: BookingLead): Promise<boolean> {
  const current = await loadLeadsAsync();
  const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
  return saveLeadsAsync(updated);
}
