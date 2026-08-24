import type { PurchaseOrderItem } from "./purchaseOrderItem"; // Ajuste le chemin d'import si ton fichier purchaseOrderItem est ailleurs

export interface PurchaseOrder {
  idPurchaseOrder: number;
  idCompany: number;
  idSupplier: number;

  supplierName: string;

  orderNumber: string;
  status: string;

  orderedAt: string;
  expectedDeliveryDate: string;
  receivedAt?: string | null;

  totalAmount: number;
  createdAt: string;
  isAutoRecommended: boolean;

  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderCreate {
  idCompany: number;
  idSupplier: number;
  orderNumber: string;
  status: string;
  orderedAt?: string;
  expectedDeliveryDate?: string;
  totalAmount?: number;
  isAutoRecommended?: boolean;
}

export interface PurchaseOrderUpdate {
  status: string;
  expectedDeliveryDate?: string;
  receivedAt?: string | null;
  totalAmount?: number;
}

export interface PurchaseOrderItemReceiveDTO {
  idPurchaseOrderItem: number;
  quantityReceivedNow: number;
  unitPrice?: number;
}

export interface PurchaseOrderReceiveDTO {
  items: PurchaseOrderItemReceiveDTO[];
}