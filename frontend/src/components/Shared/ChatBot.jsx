"use client";
import apiUrl from "@/utils/baseURL";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { RiChat3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

function UserMessage({ message }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs break-words">
        {message}
      </div>
    </div>
  );
}

function BotMessage({ message }) {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-gray-200 text-gray-900 p-2 rounded-lg max-w-xs break-words">
        {message}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const chatbotRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (input.trim()) {
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const response = await axios.post(`${apiUrl}/getAIResponse`, {
          input,
        });

        const updatedMessages = [
          ...newMessages,
          { sender: "bot", text: response.data.reply },
        ];

        setMessages(updatedMessages);
      } catch (error) {
        console.error("Error fetching data from OpenAI:", error);
        setMessages([
          ...newMessages,
          {
            sender: "bot",
            text: "Sorry, something went wrong. Please try again later.",
          },
        ]);
      }

      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="bg-[#f29620] text-white p-4 rounded-full shadow-lg hover:bg-[#ff9e20] focus:outline-none"
        >
          <RiChat3Fill className="text-[27px]" />
        </button>
      )}

      {isOpen && (
        <div
          ref={chatbotRef}
          className="bg-white rounded-lg shadow-lg py-4 pl-4 pr-1 mt-2 w-80  z-40 relative"
        >
          <div className="flex justify-between items-center pr-2 border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold">Chatbot Assistant</h3>
            <button
              onClick={toggleChatbot}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <RxCross1 className="text-[20px]" />
            </button>
          </div>
          <div className="w-full overflow-y-auto h-96 pb-7 custom-scrollbar">
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, index) =>
                msg.sender === "user" ? (
                  <UserMessage key={index} message={msg.text} />
                ) : (
                  <BotMessage key={index} message={msg.text} />
                )
              )}
            </div>
          </div>
          <form
            onSubmit={handleSend}
            className="flex bg-[#fff] pt-2 absolute right-1 left-1 bottom-3 z-10 "
          >
            <input
              type="text"
              value={input}
              required
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg p-2 mr-2 focus:outline-none"
              placeholder="Type your question..."
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
