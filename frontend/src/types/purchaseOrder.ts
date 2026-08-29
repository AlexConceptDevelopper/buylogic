import type { PurchaseOrderItem } from "./purchaseOrderItem";
import type { OrderStatus } from "./OrderStatus";

export interface PurchaseOrder {
  idPurchaseOrder: number;
  idCompany: number;
  idSupplier: number;
  supplierName: string;
  orderNumber: string;
  status: OrderStatus;
  arcNumber?: string | null;
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
  status: OrderStatus;
  orderedAt?: string;
  expectedDeliveryDate?: string;
  totalAmount?: number;
  isAutoRecommended?: boolean;
}

export interface PurchaseOrderUpdate {
  status: OrderStatus;
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

export interface PurchaseOrderArcUpdateDTO {
  arcNumber: string;
  expectedDeliveryDate: string;
}