const express = require('express')
require('dotenv').config();
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const apiKey = process.env.YOUTUBE_API;  // Replace with your API key

// Route to search for YouTube review videos based on product name
app.get('/get-review', async (req, res) => {
    // Get the product name from query parameters
    const productName = req.query.productName;

    if (!productName) {
        return res.status(400).json({ error: 'Product name is required' });
    }

    // YouTube API URL for searching videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(productName)} review&type=video&key=${apiKey}`;

    try {
        // Fetch data from YouTube Data API
        const response = await fetch(searchUrl);

        // Check if the response is successful
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch data from YouTube API' });
        }

        const data = await response.json();

        // Check if there are any items (videos) in the response
        if (data.items && data.items.length > 0) {
            // Get the first video ID and construct the video URL
            const videoId = data.items[0].id.videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Respond with the video URL
            return res.json({ reviewLink: videoUrl });
        } else {
            // No review found
            return res.status(404).json({ message: 'No review found for the product' });
        }
    } catch (error) {
        // Handle errors in the request or response
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})