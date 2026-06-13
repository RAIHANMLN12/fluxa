export async function generateChat(
  apiKey: string,
  model: string,
  prompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-OpenRouter-Title": "Fluxa",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("OpenRouter API error (" + res.status + "): " + text);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateImage(
  apiKey: string,
  model: string,
  prompt: string,
  options?: { aspectRatio?: string; steps?: number }
): Promise<string> {
  let finalPrompt = prompt;
  if (options?.aspectRatio && options.aspectRatio !== "1:1") {
    finalPrompt = prompt + " --ar " + options.aspectRatio;
  }

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "user", content: finalPrompt }],
    max_tokens: 4096,
    modalities: ["image"],
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-OpenRouter-Title": "Fluxa",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("OpenRouter image API error (" + res.status + "): " + text);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  const imageContent = data.choices?.[0]?.message?.content?.find?.(
    (c: { type: string }) => c.type === "image_url"
  );
  if (imageContent?.image_url?.url) {
    return imageContent.image_url.url;
  }

  const urlMatch = content.match(/https?:\/\/[^\s)]+/);
  if (urlMatch) {
    const imageUrl = urlMatch[0];
    if (imageUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)/i)) {
      return imageUrl;
    }
  }

  const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (markdownMatch) {
    return markdownMatch[1];
  }

  return content;
}
