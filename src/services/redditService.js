import redditApi from '../config/redditConfig.js';

export const fetchPostData = async (subreddit, postId) => {
    const response = await redditApi.get(`/r/${subreddit}/comments/${postId}.json`);
    return response.data;
};

export const fetchPostsFromSubreddit = async (subreddit) => {
    const response = await redditApi.get(`/r/${subreddit}.json`);
    return response.data;
};