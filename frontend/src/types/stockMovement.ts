export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "RETURN"
  | "LOSS"
  | "ADJUSTMENT"
  | "TRANSFER";

export interface StockMovement {
  idStockMovement: number;
  idProduct: number;
  movementType: StockMovementType;
  quantity: number;
  movementDate: string;
  reference: string;
  createdAt?: string;
}

export interface StockMovementCreate {
  idProduct: number;
  movementType: StockMovementType;
  quantity: number;
  movementDate?: string;
  reference?: string;
}

export interface StockAdjustment { 
  targetStock: number; 
  reason: string; 
}