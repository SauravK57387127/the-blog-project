export async function fetcher(url, options = {}) {
    console.log(`📡 Fetching: ${url}`);

    //   await new Promise(res => setTimeout(res, 2000)); // 2 sec delay

    const res = await fetch(url, {
        credentials: "include", // optional: auto-sends cookies if present
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
 