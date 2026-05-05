import mongoose from 'mongoose';

const BlogAnalyticsSchema = new mongoose.Schema(
    {
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
            unique: true,
        },

        // Core metrics
        totalViews: { type: Number, default: 0 },
        totalReads: { type: Number, default: 0 },
        totalCompletions: { type: Number, default: 0 },

        // Engagement
        totalLikes: { type: Number, default: 0 },
        totalComments: { type: Number, default: 0 },
        totalBookmarks: { type: Number, default: 0 },

        // Calculated
        readRate: { type: Number, default: 0 },
        avgReadTime: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },

        // Trending
        views7d: { type: Number, default: 0 },
        views30d: { type: Number, default: 0 }, // ← ADD IF MISSING
        views180d: { type: Number, default: 0 }, // ← 6 months
        isTrending: { type: Boolean, default: false },

        lastUpdated: Date,
    },
    {
        timestamps: true,
    },
);

// Method to recalculate all stats
BlogAnalyticsSchema.methods.recalculate = async function () {
    const BlogView = mongoose.model('BlogView');
    const Like = mongoose.model('Like');
    const Comment = mongoose.model('Comment');
    const Bookmark = mongoose.model('Bookmark');

    const views = await BlogView.find({ blogId: this.blogId }).lean();

    this.totalViews = views.length;
    this.totalReads = views.filter((v) => v.timeSpent >= 30).length;
    this.totalCompletions = views.filter((v) => v.completed).length;

    const readViews = views.filter((v) => v.timeSpent >= 30);
    this.avgReadTime =
        readViews.length > 0
            ? readViews.reduce((sum, v) => sum + v.timeSpent, 0) /
              readViews.length
            : 0;

    this.totalLikes = await Like.countDocuments({ blogId: this.blogId });
    this.totalComments = await Comment.countDocuments({ blogId: this.blogId });
    this.totalBookmarks = await Bookmark.countDocuments({
        blogId: this.blogId,
    });

    this.readRate =
        this.totalViews > 0 ? (this.totalReads / this.totalViews) * 100 : 0;

    this.completionRate =
        this.totalReads > 0
            ? (this.totalCompletions / this.totalReads) * 100
            : 0;

    this.engagementRate =
        this.totalViews > 0
            ? ((this.totalLikes + this.totalComments + this.totalBookmarks) /
                  this.totalViews) *
              100
            : 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now - 180 * 24 * 60 * 60 * 1000);

    this.views7d = views.filter((v) => v.viewedAt >= sevenDaysAgo).length;
    this.views30d = views.filter((v) => v.viewedAt >= thirtyDaysAgo).length;
    this.views180d = views.filter((v) => v.viewedAt >= sixMonthsAgo).length;

    const avgDailyViews = this.totalViews / 30;
    this.isTrending = this.views7d > avgDailyViews * 7 * 2;

    this.lastUpdated = new Date();

    return this.save();
};

export default mongoose.model('BlogAnalytics', BlogAnalyticsSchema);
