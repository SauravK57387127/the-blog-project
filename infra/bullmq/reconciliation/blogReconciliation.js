import Blog from "../../../database/models/blog.model.js";

export async function runBlogReconciliation() {
  try {
    const now = new Date();

    // Find all overdue scheduled blogs
    const overdueBlogs = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (!overdueBlogs.length) {
      console.log("✅ No overdue scheduled blogs found during reconciliation.");
      return;
    }

    for (const blog of overdueBlogs) {
      blog.status = "published";
      blog.publishedAt = now;
      await blog.save();
      console.log(`⚡ Reconciled & published missed blog: ${blog.title}`);
    }

  } catch (err) {
    console.error("❌ Error during reconciliation:", err);
  }
}