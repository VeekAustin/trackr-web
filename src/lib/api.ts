const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}, token?: string) {
    const headers:HeadersInit = {
        "content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (!token) {
        (headers as Record<string, string>)["Authentication"]= 'Bearer ${token}';
    }

    const res = await fetch('${API_URL}${endpoint}',{
        ...options,
        headers, 
    });

    const data = await res.json();

    if (!res.ok){
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}