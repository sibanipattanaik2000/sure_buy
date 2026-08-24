const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("API REQUEST:", url);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "object" && data !== null && "message" in data
          ? String(data.message)
          : `API request failed: ${response.status}`,
      );
    }

    return data as T;
  } catch (error) {
    console.error("API REQUEST FAILED:", {
      endpoint,
      baseUrl: API_BASE_URL,
      error,
    });

    throw error;
  }
}