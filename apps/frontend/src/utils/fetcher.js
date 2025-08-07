const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';


export async function fetcher(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${BACKEND_URL}/api/${url}`;
    console.log(`📡 Fetching: ${fullUrl}`);


    const res = await fetch(url, {
        // credentials: "include", // optional: auto-sends cookies if present
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(
            `❌ Fetch error: ${res.status} - ${errorData.message || "Unknown error"}`,
        );
        throw new Error(errorData.message || "Fetch failed");
    }

    return res.json();
}
 