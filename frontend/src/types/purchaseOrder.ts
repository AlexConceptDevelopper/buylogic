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
}

export interface PurchaseOrderCreate {
  idCompany: number;
  idSupplier: number;
  orderNumber: string;
  status: string;
  orderedAt?: string;
  expectedDeliveryDate?: string;
  totalAmount?: number;
}

export interface PurchaseOrderUpdate {
  status: string;
  expectedDeliveryDate?: string;
  receivedAt?: string | null;
  totalAmount?: number;
}