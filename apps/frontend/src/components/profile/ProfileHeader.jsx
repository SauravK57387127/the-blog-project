export default function ProfileHeader() {
    return <div>User avatar and name will be shown here.</div>;
}

// ### ✅ 3. `ProfileHeader.jsx`

// **🔗 Endpoint:**

// ```http
// GET /api/user/profile
// ```

// **🧠 Controller:**

// ```js
// UserController.getProfile(req, res)
// ```

// **🔧 Service:**

// ```js
// UserService.getProfileInfo(userId)
// ```

// ProfileHeader.jsx is used to show a quick summary at the top of the profile page. Typically includes:

// ✅ User name or email

// ✅ Avatar (optional)

// ✅ Welcome message like “Here’s your activity”

// (Optional) stats: total bookmarks, likes
