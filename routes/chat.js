// backend/api/chat.js (Using Node.js with Express)
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { systemPrompt, messages, prompt } = req.body;
    
    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY, // Store API key in environment variables
      baseURL: 'https://api.deepseek.com/v1',
    });

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      stream: true,
    });

    // Handle streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of response) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;