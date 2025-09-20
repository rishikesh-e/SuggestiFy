import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const botMsg: Message = { sender: "bot", text: "" };
    setMessages((prev) => [...prev, botMsg]);

    if (eventSource) eventSource.close();

    const es = new EventSource(
      `http://localhost:5000/service/chat-gemini-stream?message=${encodeURIComponent(
        input
      )}`
    );
    setEventSource(es);

    es.onmessage = (e) => {
      const chunk = e.data;
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, text: prev[i].text + chunk } : msg
        )
      );
      scrollToBottom();
    };

    es.onerror = () => {
      es.close();
      setEventSource(null);
    };

    setInput("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <>
          <Navbar />

          <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-start p-6"
      style={{ backgroundImage: "url('/your-background.jpg')" }}
    >
      {/* WIDER container: use almost full width and flexible height */}
      <div className="w-full max-w-5xl h-[90vh] bg-black bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          SuggestiFy ChatBot
        </h2>

        {/* Chat window: fills most of the container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 w-full">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-2xl max-w-3xl break-words ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/20 text-white backdrop-blur-md"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="flex mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-l-2xl text-black focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="px-6 bg-blue-600 rounded-r-2xl text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
          <footer className="mt-16 mb-6 px-6">
        <div className="bg-black bg-opacity-60 text-gray-300 rounded-2xl shadow-lg py-6 text-center text-lg">
          <p>&copy; 2025 SuggestiFy. All rights reserved.</p>
        </div>
      </footer>
      </>

  );
};

export default ChatBot;
