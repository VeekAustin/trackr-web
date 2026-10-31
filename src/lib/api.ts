const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  // Error pages (a 502 while Render wakes up) are not JSON, so don't let parsing throw.
  const data = await res.json().catch(() => ({}));

  // An authenticated request that comes back 401 means the session is over.
  // A 401 on login (no token) is just a wrong password, so it falls through.
  if (res.status === 401 && token && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(data.error?.message || data.message || "Something went wrong");
  }

  return data;
}