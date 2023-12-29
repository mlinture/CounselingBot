import OpenAI, { APIConnectionError } from 'openai';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import multer from 'multer';
import express from 'express';

const OPENAI_API_KEY = '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';

export const config = {
  api: {
      bodyParser: false,
  }
}

const app = express();

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
let assistant;
let thread;
let added = false;

const downloadFile = async (url, filepath) => {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

async function setEnv(schoolLink) {
  //This is the temporary path for locally uploaded transcript pdf
  //const tempTransPath = path.join(__dirname, transFile.originalname);
  //This is the temporary path for the corresponding school catalog pdf
  const temp = path.join(__dirname, 'temp.pdf');
  await downloadFile(schoolLink, temp);

  const file = await openai.files.create({
    file: fs.createReadStream(temp),
    purpose: "assistants",
  });

  fs.unlinkSync(temp);

  assistant = await openai.beta.assistants.create({
    name: "Counseling Bot",
    instructions:
    "You are a college counselor who helps students schedule classes and gives specialized advice for prosperous future career development. Attached is a school catalog; parse through and find relevant information based on the query.",
    tools: [{ type: "retrieval" }],
    file_ids: [file.id],
    model: "gpt-3.5-turbo-1106",
  });

  return await openai.beta.threads.create();
};

async function addFile(transFile) {

  const downTrans = await openai.files.create({
    file: fs.createReadStream(transFile.path),
    purpose: "assistants",
  })

  fs.unlinkSync(transFile.path);

  let existing = assistant.file_ids || [];

  await openai.beta.assistants.update(assistant.id, {
    file_ids: [...existing, downTrans.id],
  });

  added = true;
  return;

}

app.post('/api/getAssistant', upload.single('transcripts'), async (req, res) => {

  try {

    const { prompt, school } = req.body;
    const transcripts = req.file;

    if (!prompt) {
      res.status(400).json({ message: 'No prompt was provided. Please try again.'});
      return;
    }

    if (thread === undefined) {
      thread = await setEnv(school);
    }

    if (transcripts && added == false) {
      await addFile(transcripts);
    }

    //console.log(school);
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("STOPPP");
      status = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      // count += 1;
      // if (count == 5) {
      //   break;
      // }
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessage = messages.data.filter((mess) => mess.run_id === run.id && mess.role === "assistant").pop();
    console.log(messages);
    res.status(200).json({ message: lastMessage.content[0].text.value });

  } catch (error) {
      console.error('OpenAI API request failed:', error);
      res.status(500).json({ message: 'Error processing your request' });
  }

});


export default app;

