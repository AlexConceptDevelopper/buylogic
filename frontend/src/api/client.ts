const API_URL = import.meta.env.VITE_API_URL || "https://api.buylogic.fr/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = `Erreur HTTP ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData?.message) {
          message = errorData.message;
        }
      } catch {
        // Réponse sans JSON
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}