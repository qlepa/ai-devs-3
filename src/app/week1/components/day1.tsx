"use client";

import OpenAI from "openai";
import { useState } from "react";

export default function Day1() {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(0);
  const [verifyResponse, setVerifyResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setStarted(true);
    setLoading(true);

    try {
      const questionResponse = await fetch("/api/questions");
      const questionData = await questionResponse.json();
      const fetchedQuestion = questionData.content;
      setQuestion(fetchedQuestion);

      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Odpowiedz na pytanie wyłącznie numerycznie, podając rok.",
          },
          {
            role: "user",
            content: `${fetchedQuestion}\n\nProszę o odpowiedź na to pytanie.`,
          },
        ],
      });

      const aiAnswer = Number(completion.choices[0]?.message.content) || 0;
      setAiResponse(aiAnswer);

      const formData = new FormData();
      formData.append("username", "tester");
      formData.append("password", "574e112a");
      formData.append("answer", aiAnswer.toString());

      const verifyResponse = await fetch("/api/answer", {
        method: "POST",
        body: formData,
      });

      const responseText = await verifyResponse.text();
      if (!verifyResponse.ok) {
        throw new Error("Błąd weryfikacji");
      }

      // Otwórz nowe okno i wyświetl odpowiedź HTML
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(responseText);
        newWindow.document.close();
      }

      setVerifyResponse("Odpowiedź została wyświetlona w nowym oknie");
    } catch (error) {
      console.error("Błąd:", error);
      setVerifyResponse("Wystąpił błąd podczas weryfikacji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Wykonaj zadanie...
          </button>
          <div className="h-6 w-1 bg-white animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center">
              <p>Ładowanie...</p>
            </div>
          ) : (
            <>
              {question && (
                <div className="p-4 bg-gray-800 rounded-md shadow">
                  <h2 className="font-medium mb-2">Pytanie:</h2>
                  <p>{question}</p>
                </div>
              )}
              {aiResponse && (
                <div className="p-4 bg-gray-700 rounded-md shadow">
                  <h2 className="font-medium mb-2">Odpowiedź AI:</h2>
                  <p>{aiResponse}</p>
                </div>
              )}
              {verifyResponse && (
                <div className="p-4 bg-gray-600 rounded-md shadow">
                  <h2 className="font-medium mb-2">Odpowiedź z weryfikacji:</h2>
                  <p>{verifyResponse}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
