const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe audio using Groq Whisper API
 */
const transcribeAudio = async (audioFilePath) => {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-large-v3',
    language: 'en'
  });
  return transcription.text;
};

/**
 * Generate detailed AI feedback for an interview answer
 */
const generateFeedback = async (question, answer, category = 'general') => {
  const systemPrompt = 'You are an expert technical interviewer from a top-tier tech company (Google, Amazon, Meta). Your job is to evaluate interview answers and give constructive, detailed, honest feedback. Always respond in valid JSON format only.';

  const userPrompt = `Evaluate this interview answer:

QUESTION: ${question}
CATEGORY: ${category}
CANDIDATE ANSWER: ${answer}

Provide JSON: { "score": <1-10>, "feedback": "<detailed feedback>", "strengths": ["<strength1>"], "improvements": ["<improvement1>"], "idealAnswer": "<brief ideal answer>" }`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 600
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

/**
 * Generate session summary
 */
const generateSessionSummary = async (answers, sessionType) => {
  const answersText = answers.map((a, i) => `Q${i+1}: ${a.question}\nA: ${a.answer}`).join('\n\n');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert career coach. Analyze interview performance and give actionable insights. Respond in JSON only.' },
      { role: 'user', content: `Session type: ${sessionType}\n\nAll answers:\n${answersText}\n\nProvide JSON: { "summary": "<overall performance summary>", "topicsToImprove": ["<topic1>", "<topic2>"], "readyForInterview": <boolean>, "estimatedLevel": "<junior/mid/senior>", "studyPlan": ["<action 1>", "<action 2>", "<action 3>"] }` }
    ],
    temperature: 0.7,
    max_tokens: 600
  });

  const text = response.choices[0].message.content.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

/**
 * Generate a follow-up question based on answer
 */
const generateFollowUp = async (question, answer) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a senior interviewer. Generate ONE smart follow-up question based on the candidate\'s answer. Just the question text, nothing else.' },
      { role: 'user', content: `Original question: ${question}\nCandidate said: ${answer}\n\nWhat follow-up question would you ask?` }
    ],
    temperature: 0.8,
    max_tokens: 150
  });
  return response.choices[0].message.content.trim();
};

module.exports = { transcribeAudio, generateFeedback, generateSessionSummary, generateFollowUp };
