import { Product } from './product';

export type Product_Host = Product & {
  metadata: Product_HostMetadata;
};

export type Product_HostMetadata = {
  allocations: number; //1
  backups: number; //1
  cpu: number; //200
  databases: number; //1
  disk: number; //20480
  egg: number; //5
  io: number; //500
  splits: number; //0
  nodes: number[] | null; //[2]
  ram: number; //4
  swap: number; //2048
};
