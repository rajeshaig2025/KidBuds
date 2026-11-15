// src/services/firebaseService.js
// Kid Buds Public Senior Secondary School, Bijhari (Hamirpur, H.P.)
// Future-Ready Modular Firebase Service (Firestore + Cloud Storage + Role-Based Architecture Ready)

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

let firebaseApp = null;
let db = null;
let storage = null;

// Namespaced collections so school data stays cleanly organized and future-ready for Phase 2 & 3
export const COLLECTIONS = {
  CONFIG: 'kb_school_config',
  HERO: 'kb_hero_slides',
  NOTICES: 'kb_notices',
  STAFF: 'kb_faculty',
  TOPPERS: 'kb_toppers',
  GALLERY: 'kb_gallery',
  ENQUIRIES: 'kb_admission_enquiries',
  // Future Phase 2 & Phase 3 Portal Collections (Pre-configured in foundation)
  USERS: 'kb_portal_users',       // role: 'admin' | 'teacher' | 'student' | 'parent'
  RESULTS: 'kb_exam_results',     // Phase 2: Online Report Cards
  ATTENDANCE: 'kb_attendance',    // Phase 3: Student Attendance
  FEES: 'kb_fee_records'          // Phase 3: Fee Ledger
};

export function isFirebaseConfigValid(config) {
  if (!config) return false;
  return Boolean(
    config.apiKey?.trim() &&
    config.projectId?.trim() &&
    config.storageBucket?.trim()
  );
}

export function getEffectiveFirebaseConfig(customConfig) {
  if (isFirebaseConfigValid(customConfig)) return customConfig;

  const savedRaw = localStorage.getItem('kb_firebase_config');
  if (savedRaw) {
    try {
      const parsed = JSON.parse(savedRaw);
      if (isFirebaseConfigValid(parsed)) return parsed;
    } catch {}
  }

  const envConfig = {
    apiKey: (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) || '',
    authDomain: (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || '',
    projectId: (import.meta.env && import.meta.env.VITE_FIREBASE_PROJECT_ID) || '',
    storageBucket: (import.meta.env && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || '',
    messagingSenderId: (import.meta.env && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || '',
    appId: (import.meta.env && import.meta.env.VITE_FIREBASE_APP_ID) || ''
  };

  if (isFirebaseConfigValid(envConfig)) return envConfig;
  return null;
}

export function initFirebase(customConfig) {
  const activeConfig = getEffectiveFirebaseConfig(customConfig);
  if (!activeConfig) {
    return {
      initialized: false,
      error: 'Running in Instant Local Persistence Mode. Add Firebase keys in Admin > Cloud Setup to enable multi-device cloud sync.'
    };
  }

  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(activeConfig);
    } else {
      firebaseApp = getApp();
    }
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    return { initialized: true, app: firebaseApp, db, storage };
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
    return { initialized: false, error: err.message };
  }
}

export async function testFirebaseConnection(config) {
  const activeConfig = getEffectiveFirebaseConfig(config);
  if (!activeConfig) {
    return {
      success: false,
      error: 'Please enter API Key, Project ID, and Storage Bucket to test cloud connection.'
    };
  }

  try {
    const { initialized, db: testDb, error } = initFirebase(activeConfig);
    if (!initialized || !testDb) {
      return { success: false, error: error || 'Failed to initialize Firebase.' };
    }

    const pingDoc = doc(collection(testDb, COLLECTIONS.CONFIG), 'health_ping');
    await setDoc(pingDoc, {
      lastPing: new Date().toISOString(),
      school: 'Kid Buds Public Senior Secondary School, Bijhari'
    }, { merge: true });

    localStorage.setItem('kb_firebase_config', JSON.stringify(activeConfig));
    return {
      success: true,
      message: `Connected to Firebase Project "${activeConfig.projectId}"! Cloud Sync is active.`
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Connection failed. Check Firestore rules in Firebase Console.'
    };
  }
}

export async function uploadSchoolMedia(file, folder = 'kidbuds_media', onProgress = null) {
  if (!storage) {
    try { initFirebase(); } catch {}
  }
  if (!storage) {
    throw new Error('Using instant optimized WebP storage.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}_${cleanName}`;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try { uploadTask.cancel(); } catch {}
      reject(new Error('Storage upload timed out. Using local WebP fallback.'));
    }, 3500);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
      async () => {
        clearTimeout(timer);
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
}

export async function saveSchoolConfigToCloud(settings) {
  try {
    if (!db) initFirebase();
    if (!db) return false;
    const refDoc = doc(db, COLLECTIONS.CONFIG, 'main_settings');
    await setDoc(refDoc, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Cloud config save skipped (saved locally):', err);
    return false;
  }
}

export async function fetchSchoolConfigFromCloud() {
  try {
    if (!db) initFirebase();
    if (!db) return null;
    const refDoc = doc(db, COLLECTIONS.CONFIG, 'main_settings');
    const snap = await getDoc(refDoc);
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

export async function syncCollectionToCloud(collectionName, items) {
  try {
    if (!db) initFirebase();
    if (!db) return false;
    for (const item of items) {
      const docId = String(item.id || Date.now());
      await setDoc(doc(db, collectionName, docId), item, { merge: true });
    }
    return true;
  } catch (err) {
    console.warn(`Cloud sync skipped for ${collectionName}:`, err);
    return false;
  }
}

export async function fetchCollectionFromCloud(collectionName) {
  try {
    if (!db) initFirebase();
    if (!db) return null;
    const snap = await getDocs(collection(db, collectionName));
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export async function deleteDocFromCloud(collectionName, docId) {
  try {
    if (!db) initFirebase();
    if (!db) return false;
    await deleteDoc(doc(db, collectionName, String(docId)));
    return true;
  } catch {
    return false;
  }
}
