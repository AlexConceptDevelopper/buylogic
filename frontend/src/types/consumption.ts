export interface Consumption {
  idConsumption: number;
  idProduct: number;
  quantity: number;
  consumptionDate: string;
  source: string;
  createdAt?: string;
}

export interface ConsumptionCreate {
  idProduct: number;
  quantity: number;
  consumptionDate: string;
  source?: string;
}

export interface ConsumptionImportRow {
  reference: string;
  quantity: number;
  consumptionDate: string;
}

export interface ConsumptionImport {
  fileName: string;
  fileHash: string;
  rows: ConsumptionImportRow[];
}