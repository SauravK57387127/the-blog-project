import AuthCard from "@/components/admin/auth/AuthCard";

export default function AdminLoginPage() {
    return (
        <div>
            <AuthCard />
        </div>
    );
}

// Inside it:

//     🔵 Google One Tap Login                                         Trigger OAuth flow instantly (or as a component if you defer)

//     🟢 Google OAuth Button                                          “Login with Google” button (fallback or manual)

//     🟠 (Optional): Password form toggle                             Only if you decide to support legacy login (can stay hidden for now)

// 🔒 You do not need a separate /admin/register page

//     - With Google, first-time login is registration

//     - Backend just handles it by checking if user exists, else creates
