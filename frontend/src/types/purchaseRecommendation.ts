export interface PurchaseRecommendation {
  idRecommendation: number;
  idCompany: number;
  idProduct: number;
  idSupplier: number;

  productReference: string;
  productName: string;
  supplierName: string;

  status: string;

  recommendedQuantity: number;

  currentStock: number;
  safetyStock: number;
  reorderPoint: number;

  estimatedDailyConsumption: number;
  estimatedLeadTimeDays: number;

  estimatedStockoutDate: string;

  estimatedPurchaseAmount: number;

  confidenceScore: number;

  reason: string;

  createdAt: string;
  resolvedAt: string | null;
}