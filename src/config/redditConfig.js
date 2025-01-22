import axios from 'axios';

const redditApi = axios.create({
    baseURL: 'https://www.reddit.com/',
});

export default redditApi;