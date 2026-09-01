import { apiRequest } from "./api";

export async function subscribeNewsletter(
  email: string,
) {
  return apiRequest<never>(
    "/newsletter/subscribe",
    {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    },
  );
}