import { useState } from "react";
import { askAirQualityBot } from "../services/airQualityBot";
import { isForbiddenHealthQuery } from "../utils/chatGuards";

export default function ChatPanel({ context }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAsk() {
        if (!question.trim()) return;

        // 🔒 CHECK SAFETY GUARD
        if (isForbiddenHealthQuery(question)) {
            setAnswer("I cannot provide medical diagnosis or treatment advice. I am restricted to explaining air quality data and general safety guidance.");
            return;
        }

        setLoading(true);
        setAnswer("");

        try {
            const reply = await askAirQualityBot({
                question,
                context
            });
            setAnswer(reply);
        } catch (err) {
            setAnswer("Unable to get a response at the moment. Please check your AI configuration.");
        }

        setLoading(false);
    }

    return (
        <div className="glass p-6 rounded-2xl md:rounded-[32px] border-white/5 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
                Ask the Air Quality Assistant
            </h3>

            <div className="flex gap-2">
                <input
                    className="flex-1 bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                    placeholder="Why is AQI getting worse?"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAsk()}
                />
                <button
                    onClick={handleAsk}
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white font-bold rounded-xl disabled:opacity-50"
                >
                    {loading ? "..." : "Ask"}
                </button>
            </div>

            {answer && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-300">
                    {answer}
                </div>
            )}
        </div>
    );
}