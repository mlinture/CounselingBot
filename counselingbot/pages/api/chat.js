const OPENAI_API_KEY = "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";

// import OpenAI from "openai";

// const openai = new OpenAI();

export default async function handler(req, res) {
    const { userInput } = req.body;
    // implement logic to call OpenAI's API
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: userInput,
          max_tokens: 150,
        }),
      });
      const openaiData = await openaiResponse.json();
      console.log(openaiData, 'here');

      res.status(200).json({ response: openaiData.choices[0].text });

    }
    catch (error) {
      console.error('Error calling OpenAI:', error);
      res.status(500).json({ error: 'Error calling OpenAI' });
    }
}