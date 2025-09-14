const fetch = require('node-fetch');

// The AI's core instructions have been adapted for the new flow.
const systemPrompt = `You are a friendly and empathetic digital concierge for "Café Aroma."
Your user has just given you a star rating and some optional text feedback.

Your ONLY job is to generate a short, appropriate heading and a single paragraph of text for the final screen, based on their feedback.

- **If the rating is 4 or 5 stars (positive):** Write a warm, celebratory message. Start with a heading like "That's wonderful to hear!" and then a short paragraph confirming they had a great experience and that you'd love to help them share the good news.
- **If the rating is 1, 2, or 3 stars (negative/neutral):** Write a sincere, apologetic message. Start with a heading like "We're truly sorry to hear this." and then a short paragraph acknowledging that you fell short of their expectations and want to make things right immediately.

Do NOT ask any questions. Do NOT suggest next steps. Just provide the heading and the paragraph, separated by a pipe character "|".

Example for a POSITIVE review:
That's wonderful to hear!|It sounds like you had a fantastic experience! We'd love to help you celebrate that and share the good news.

Example for a NEGATIVE review:
We're truly sorry to hear this.|It sounds like we fell short of your expectations. We want to make things right for you immediately.
`;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { messages } = JSON.parse(event.body);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [ { role: 'system', content: systemPrompt }, ...messages, ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });
    if (!response.ok) { throw new Error('OpenAI API request failed.'); }
    const data = await response.json();
    const aiMessage = data.choices[0].message;
    return { statusCode: 200, body: JSON.stringify({ message: aiMessage }), };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "AI service is currently unavailable." }), };
  }
};
