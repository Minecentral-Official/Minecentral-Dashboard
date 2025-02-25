import { customAlphabet } from 'nanoid';

// Create a NanoID generator
export default function createUUID() {
  return customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    8,
  )();
}
