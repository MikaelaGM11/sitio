export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { prompt, messages: rawMessages, system, temperature, max_tokens } = body;

    let messages;
    let systemMsg = undefined;

    if (rawMessages) {
      messages = rawMessages;
      systemMsg = system;
    } else if (prompt) {
      try {
        const parsed = JSON.parse(prompt);
        if (parsed.messages) {
          messages = parsed.messages;
          systemMsg = parsed.system;
        } else {
          messages = [{ role: "user", content: prompt }];
        }
      } catch {
        messages = [{ role: "user", content: prompt }];
      }
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Prompt requerido" }) };
    }

    const groqBody = {
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: temperature ?? 0.85,
      max_tokens: max_tokens ?? 900,
    };
    if (systemMsg) groqBody.system = systemMsg;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groqBody),
    });

    const data = await response.json();

    if (!response.ok) return { statusCode: response.status, body: JSON.stringify(data) };
    return { statusCode: 200, body: JSON.stringify(data) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error consultando Groq" }) };
  }
}