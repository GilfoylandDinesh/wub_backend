import { Router } from 'express';
import { fetchPostFromURL, fetchSubredditPosts, fetchSubredditsPosts } from '../controllers/redditController.js';

const router = Router();

// Routes
router.post('/reddit/fetch', fetchPostFromURL);
router.post('/reddit/subreddit', fetchSubredditPosts);
router.post('/reddit/multiple-subreddits', fetchSubredditsPosts); // New endpoint

export default router;