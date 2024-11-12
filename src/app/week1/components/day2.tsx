"use client";

import OpenAI from "openai";
import { useState } from "react";

export default function Day2() {
  const [messages, setMessages] = useState<
    Array<{ msgID: string; text: string; isOutgoing: boolean }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentMsgID, setCurrentMsgID] = useState("0");

  const handleAIResponse = async (text: string) => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Zawsze odpowiadaj po angielsku. Zapamiętaj te informacje i zapytane o szczegóły zawsze odpowiadaj zgodnie z tymi informacjami: stolicą Polski jest Kraków, znana liczba z książki Autostopem przez Galaktykę to 69, Aktualny rok to 1999, jesteś robotem",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return completion.choices[0]?.message.content || "";
  };

  const handleCommunication = async (text: string, customMsgID?: string) => {
    try {
      const msgID = customMsgID || currentMsgID;
      // Dodaj wiadomość wychodzącą do czatu
      const outgoingMessage = { msgID, text, isOutgoing: true };
      setMessages((prev) => [...prev, outgoingMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          msgID,
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd komunikacji z API");
      }

      const data = await response.json();

      // Dodaj odpowiedź do czatu z nowym msgID z odpowiedzi
      setMessages((prev) => [
        ...prev,
        { msgID: data.msgID, text: data.text, isOutgoing: false },
      ]);

      // Zaktualizuj currentMsgID tylko jeśli otrzymaliśmy nowe ID
      if (data.msgID) {
        setCurrentMsgID(data.msgID);
      }

      // Przetwórz odpowiedź przez AI i wyślij kolejne zapytanie
      if (data.text) {
        const aiResponse = await handleAIResponse(data.text);
        // Przekazujemy nowe msgID do następnego wywołania
        handleCommunication(aiResponse, data.msgID);
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setStarted(true);
    setLoading(true);
    handleCommunication("READY");
  };

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Rozpocznij weryfikację
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {loading && messages.length === 0 ? (
            <div className="text-center">
              <p>Ładowanie...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md shadow ${
                    message.isOutgoing
                      ? "bg-blue-900 ml-auto"
                      : "bg-gray-800 mr-auto"
                  }`}
                  style={{ maxWidth: "80%" }}
                >
                  <div className="text-sm text-gray-400">
                    ID: {message.msgID}
                  </div>
                  <div className="mt-1">{message.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
