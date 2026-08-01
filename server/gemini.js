async function geminiSearch(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada. Crea un archivo .env con tu API key de Google AI Studio.');

  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const fullPrompt = `${prompt}\n\nIMPORTANT: Return your response as valid JSON only. No markdown, no code blocks, no explanation. Just the raw JSON object.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      tools: [{ google_search: {} }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = await response.json();
  if (!data.candidates || !data.candidates[0]) {
    throw new Error('Gemini API no devolvió resultados');
  }

  const text = data.candidates[0].content.parts[0].text;

  // Extract JSON from response (handle both raw JSON and markdown code blocks)
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim());
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('No se pudo extraer JSON de la respuesta de Gemini: ' + text.substring(0, 200));
}

export { geminiSearch };
