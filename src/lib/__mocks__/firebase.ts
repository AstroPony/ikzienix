import { jest } from '@jest/globals'

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
}

const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  endBefore: jest.fn(),
}

const mockStorage = {
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}

export const getAuth = jest.fn(() => mockAuth)
export const getFirestore = jest.fn(() => mockFirestore)
export const getStorage = jest.fn(() => mockStorage)

export const initializeApp = jest.fn(() => ({
  auth: () => mockAuth,
  firestore: () => mockFirestore,
  storage: () => mockStorage,
}))

export const mockAuth = mockAuth
export const mockFirestore = mockFirestore
export const mockStorage = mockStorage 