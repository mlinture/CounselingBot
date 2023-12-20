// pages/api/getAssistant.js

import axios from 'axios';
const OPENAI_API_KEY = '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';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST requests are allowed' });
        return;
    }

    const { prompt } = req.body;

    if (!prompt) {
        res.status(400).json({ message: 'No prompt provided' });
        return;
    }

    try {
         const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data.choices[0].text.trim());
        res.status(200).json({ message: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error('OpenAI API request failed:', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
}
