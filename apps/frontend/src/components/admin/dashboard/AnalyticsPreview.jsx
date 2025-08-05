export default function AnalyticsPreview() {
    return <div>Quick website analytics + link to full analytics page</div>;
}

// ### ✅ 5. `AnalyticsPreview.jsx`

// **Purpose:** Quick traffic insights + link to full analytics

// **🔗 Endpoint needed:**

// ```http
// GET /api/admin/analytics/preview
// ```

// **🧠 Controller:**

// ```js
// AnalyticsController.getPreview(req, res)
// ```

// **🔧 Service:**

// ```js
// AnalyticsService.getPreviewMetrics()
// ```
