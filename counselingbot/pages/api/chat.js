export default async function handler(req, res) {
    console.log("in the backend");
    const { userInput } = req.body;

    // implement logic to call OpenAI's API

    // For now, we'll just return a placeholder response
    res.status(200).json({ response: "OpenAI's response will go here" });
    
  }