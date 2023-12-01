const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();

router.post('/api/generateImage', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/images/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt : prompt,
        n: 1,
        size: '256x256',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const generatedImage = data && data.data && data.data[0];
      if (generatedImage) {
        res.json({ image: generatedImage });
      } else {
        console.error('Image data is undefined:', data);
        res.status(500).send('Internal Server Error');
      }
    } else {
      console.error('Image generation failed:', response.statusText);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
