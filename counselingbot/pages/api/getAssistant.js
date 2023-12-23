// pages/api/getAssistant.js
import OpenAI, { APIConnectionError } from 'openai';
import axios from 'axios';
const OPENAI_API_KEY = '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';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
let assistant;
let thread;

async function setEnv() {
  assistant = await openai.beta.assistants.create({
    name: "Counseling Bot",
    instructions:
    "You are a college counselor who helps students schedule classes and gives specialized advice for prosperous future career development.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-1106-preview",
  });

  return await openai.beta.threads.create();
}

export default async function handler(req, res) {

  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ message: 'No prompt was provided. Please try again.'});
    return;
  }

  try {

    if (thread === undefined) {
      thread = await setEnv();
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let status = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id,
    );
    
    let count = 0;
    while (status.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("STOPPP");
      status = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      if (count == 5) {
        break;
      }
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessage = messages.data.filter((mess) => mess.run_id === run.id && mess.role === "assistant").pop();
    res.status(200).json({ message: lastMessage.content[0].text.value });

  } catch (error) {
      console.error('OpenAI API request failed:', error);
      res.status(500).json({ message: 'Error processing your request' });
  }

} 


// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//       res.status(405).json({ message: 'Only POST requests are allowed' });
//       return;
//   }

//   const { prompt } = req.body;

//   if (!prompt) {
//       res.status(400).json({ message: 'No prompt provided' });
//       return;
//   }

//   try {
//         const response = await axios.post('https://api.openai.com/v1/completions', {
//           model: "text-davinci-003",
//           prompt: prompt,
//           max_tokens: 150
//       }, {
//           headers: {
//               'Authorization': `Bearer ${OPENAI_API_KEY}`,
//               'Content-Type': 'application/json'
//           }
//       });
//       console.log(response.data.choices[0].text.trim());
//       res.status(200).json({ message: response.data.choices[0].text.trim() });
//   } catch (error) {
//       console.error('OpenAI API request failed:', error);
//       res.status(500).json({ message: 'Error processing your request' });
//   }
// }
