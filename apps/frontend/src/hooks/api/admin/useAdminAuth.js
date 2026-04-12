import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { adminAuthService } from '@/api/services/admin/auth.service';
import { toast } from 'sonner';

export function useAdminLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ username, password }) =>
      adminAuthService.login(username, password),

    onSuccess: () => {
      router.push('/admin/home');
    },

    onError: (error) => {
      // Return error message to component — don't toast, show inline
      // error.message comes from backend response shape { success, message }
    },
  });
}

export function useAdminGuard() {
  const router = useRouter();

  const [isAuthed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('adminToken');
  });

  useEffect(() => {
    if (!isAuthed) router.replace('/admin/login');
  }, []);

  return isAuthed;
}
