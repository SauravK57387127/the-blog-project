export default function StatsCards() {
    return (
        <div>
            <p>Global stats – total blogs, views, likes</p>
        </div>
    );
}

// ### ✅ 2. `StatsCards.jsx`

// **Purpose:** Show total blog count, total views, total likes (global)

// **🔗 Endpoint needed:**

// ```http
// GET /api/admin/analytics/summary
// ```

// **🧠 Controller:**

// ```js
// AnalyticsController.getSummary(req, res)
// ```

// **🔧 Service:**

// ```js
// AnalyticsService.getGlobalStats()
// ```
