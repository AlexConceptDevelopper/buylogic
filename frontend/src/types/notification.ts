export interface Notification {
  idNotification: number;
  idUser: number;

  idRecommendation?: number | null;

  idProduct?: number | null;
  productReference?: string | null;
  productName?: string | null;

  type: string;
  title: string;
  message: string;

  readAt?: string | null;
  createdAt: string;
}