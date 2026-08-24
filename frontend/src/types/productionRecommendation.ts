export interface ProductionRecommendation {
  idProductionRecommendation: number;
  idCompany: number;
  idProduct: number;
  productReference: string;
  productName: string;
  status: string;
  recommendedQuantity: number;
  currentStock: number;
  safetyStock: number;
  estimatedDailyConsumption: number;
  estimatedStockoutDate: string;
  confidenceScore: number;
  reason: string;
  createdAt: string;
  resolvedAt?: string;
}