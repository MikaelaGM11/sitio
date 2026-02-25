export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}