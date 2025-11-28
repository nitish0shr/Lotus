export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = request.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'OpenAI API key not configured' });
  }
  try {
    const fetchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await fetchResponse.json();
    const reply = data.choices?.[0]?.message?.content || '';
    return response.status(200).json({ reply });
  } catch (error) {
    return response.status(500).json({ error: 'Error calling OpenAI API' });
  }
}
