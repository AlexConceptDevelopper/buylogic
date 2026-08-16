export interface PurchaseOrderItem {
  idPurchaseOrderItem: number;
  idPurchaseOrder: number;
  idProduct: number;

  productReference?: string | null;
  productName?: string | null;

  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
}

export interface PurchaseOrderItemCreate {
  idPurchaseOrder: number;
  idProduct: number;
  quantityOrdered: number;
  quantityReceived?: number;
  unitPrice: number;
}

export interface PurchaseOrderItemUpdate {
  quantityOrdered?: number;
  quantityReceived?: number;
  unitPrice?: number;
}