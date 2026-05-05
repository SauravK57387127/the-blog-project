import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { clearAdminToken } from "@/lib/auth-token";
import { useRouter } from "next/navigation";

export function useAdminProfile() {
    return useQuery({
        queryKey: ["admin", "profile"],
        queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN.AUTH.ME),
        staleTime: 10 * 60 * 1000,
        select: (r) => r?.data ?? null,
        retry: false,
    });
}

export function useAdminLogout() {
    const router = useRouter();
    return useMutation({
        mutationFn: () => apiClient.post(API_ENDPOINTS.ADMIN.AUTH.LOGOUT),
        onSettled: () => {
            // Always clear local token and redirect — even if backend call fails
            clearAdminToken();
            router.push("/admin/login");
        },
    });
}
