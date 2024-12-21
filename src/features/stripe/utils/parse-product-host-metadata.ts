import Stripe from 'stripe';

import { Product_HostMetadata } from '@/features/stripe/types/product-host';

export function parseProductMetadata(
  metadataArray: Stripe.Metadata,
): Product_HostMetadata {
  const metadata: Product_HostMetadata = {
    allocations: 1,
    backups: 1,
    cpu: 1,
    databases: 1,
    disk: 20,
    egg: 5,
    io: 500,
    splits: 0,
    nodes: null,
    ram: 0,
    swap: 2,
  };

  for (const key in metadataArray) {
    // console.log(key);
    if (metadataArray.hasOwnProperty(key)) {
      const value = metadataArray[key]; // This will still have a possible 'undefined' type
      if (value !== undefined) {
        // console.log("key, value", key, value); // Logs each key

        switch (key.toLowerCase()) {
          case 'allocations':
            metadata.allocations = Number(value);
            break;
          case 'backups':
            metadata.backups = Number(value);
            break;
          case 'cpu':
            metadata.cpu = Number(value);
            break;
          case 'databases':
            metadata.databases = Number(value);
            break;
          case 'disk':
            metadata.disk = Number(value);
            break;
          case 'egg':
            metadata.egg = Number(value);
            break;
          case 'io':
            metadata.io = Number(value);
            break;
          case 'splits':
            metadata.splits = Number(value);
            break;
          case 'nodes':
            try {
              const parsed = JSON.parse(value);
              if (
                Array.isArray(parsed) &&
                parsed.every((item) => typeof item === 'number')
              ) {
                metadata.nodes = parsed;
              } else {
                throw new Error('Parsed value is not a valid number array');
              }
            } catch (error) {
              console.error('Error parsing nodes:', error);
            }
            break;
          case 'ram':
            metadata.ram = Number(value);
            break;
          case 'swap':
            metadata.swap = Number(value);
            break;
          // default:
          // console.log(`Unknown property: ${key}`);
        }
      }
    }
  }

  // console.log("Meta in", metadataArray);
  // console.log("Meta out", metadata);

  return metadata;
}
