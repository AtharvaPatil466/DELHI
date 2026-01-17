// src/services/airQualityBot.js

import { SYSTEM_PROMPT } from "../chatbot/systemPrompt";

export async function askAirQualityBot({ question, context }) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Use stable model
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `
Context Data (STRICTLY USE ONLY THIS):
${JSON.stringify(context, null, 2)}

User question:
${question}
`
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Bot API Error:", errorData);
        throw new Error("Chatbot implementation pending or API key missing.");
    }

    const data = await response.json();
    return data.choices[0].message.content;
}