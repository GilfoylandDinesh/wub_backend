import { fetchPostData, fetchPostsFromSubreddit } from '../services/redditService.js';

export const fetchPostFromURL = async (req, res, next) => {
    try {
        //redditUrl from params
        const { redditUrl } = req.body;

        if (!redditUrl) {
            return res.status(400).json({ success: false, message: 'Reddit URL is required' });
        }

        const match = redditUrl.match(/reddit\.com\/r\/([^/]+)\/comments\/([^/]+)/);
        if (!match) {
            return res.status(400).json({ success: false, message: 'Invalid Reddit URL format' });
        }

        const subreddit = match[1];
        const postId = match[2];

        const postData = await fetchPostData(subreddit, postId);
        res.status(200).json({ success: true, data: postData });
    } catch (err) {
        next(err);
    }
};

export const fetchSubredditPosts = async (req, res, next) => {
    try {
        const { subredditUrl } = req.body;

        if (!subredditUrl) {
            return res.status(400).json({ success: false, message: 'Subreddit URL is required' });
        }

        // Parse the subreddit name from the URL
        const match = subredditUrl.match(/reddit\.com\/r\/([^/]+)/);
        if (!match) {
            return res.status(400).json({ success: false, message: 'Invalid Subreddit URL format' });
        }

        const subreddit = match[1];

        // Fetch posts from the service
        const posts = await fetchPostsFromSubreddit(subreddit);

        // Transform the response into the desired format
        const formattedPosts = posts.data.children.map(post => ({
            subreddit: post.data.subreddit,
            title: post.data.title,
            content: post.data.selftext,
        }));

        // Respond with the transformed data
        res.status(200).json({
            status: 'success',
            posts: posts,
        });
    } catch (err) {
        next(err);
    }
};


export const fetchSubredditsPosts = async (req, res, next) => {
    try {
        const { subredditUrls } = req.body;

        if (!Array.isArray(subredditUrls) || subredditUrls.length === 0) {
            return res.status(400).json({ success: false, message: 'An array of subreddit URLs is required' });
        }

        const posts = [];
        const subredditCounts = {};

        // Iterate over subreddit URLs
        for (const subredditUrl of subredditUrls) {
            const match = subredditUrl.match(/reddit\.com\/r\/([^/]+)/);
            if (!match) {
                return res.status(400).json({ success: false, message: `Invalid Subreddit URL format: ${subredditUrl}` });
            }

            const subreddit = match[1];

            // Fetch posts for the subreddit
            const subredditPosts = await fetchPostsFromSubreddit(subreddit);

            // Format posts, excluding those made by moderators
            const formattedPosts = subredditPosts.data.children
                .filter(post => post.data.distinguished !== 'moderator') // Exclude moderator posts
                .map(post => ({
                    subreddit: post.data.subreddit,
                    title: post.data.title,
                    content: post.data.selftext,
                }));

            posts.push(...formattedPosts);

            // Update count per subreddit
            subredditCounts[subreddit] = formattedPosts.length;
        }

        // Respond with combined posts and counts
        res.status(200).json({
            status: 'success',
            totalPosts: posts.length,
            subredditCounts,
            posts,
        });
    } catch (err) {
        next(err);
    }
};