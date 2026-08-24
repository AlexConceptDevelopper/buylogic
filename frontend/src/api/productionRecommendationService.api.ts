import { apiFetch } from "./client";
import type { ProductionRecommendation } from "../types/productionRecommendation";

export function getProductionRecommendations() {
    return apiFetch<ProductionRecommendation[]>(
        "/production-recommendations",
    );
}

export function getProductionRecommendationById(
    id: number,
) {
    return apiFetch<ProductionRecommendation>(
        `/production-recommendations/${id}`,
    );
}

export function deleteProductionRecommendation(
    id: number,
) {
    return apiFetch<void>(
        `/production-recommendations/${id}`,
        {
            method: "DELETE",
        },
    );
}

export function calculateProductionRecommendation(
    companyId: number,
    productId: number,
) {
    return apiFetch<void>(
        `/production-recommendations/calculate/${companyId}/${productId}`,
        {
            method: "POST",
        },
    );
}