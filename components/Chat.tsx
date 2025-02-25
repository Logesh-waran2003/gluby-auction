import React from "react";
import { MdSend } from "react-icons/md";
import Image from "next/image";

interface ChatProps {
  seller: {
    id: string;
    name: string;
  };
  auctionTitle: string;
}

function Chat({ seller, auctionTitle }: ChatProps) {
  const messages = [
    { id: 1, text: "Hi there!", type: "received", timestamp: "10:00 AM" },
    {
      id: 2,
      text: "Hello! How can I help you today?",
      type: "sent",
      timestamp: "10:01 AM",
    },
    {
      id: 3,
      text: "I have an issue with my account.",
      type: "received",
      timestamp: "10:02 AM",
    },
    {
      id: 4,
      text: "Sure, I can help with that. Can you provide more details?",
      type: "sent",
      timestamp: "10:05 AM",
    },
    {
      id: 5,
      text: "Yes, my account balance is not showing correctly.",
      type: "received",
      timestamp: "10:07 AM",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full border rounded-b-lg bg-white">
      <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src="/placeholder-user.jpg"
              alt={seller.name}
              fill
              className="object-cover rounded-full"
              sizes="40px"
              priority
            />
          </div>
          <div className="ml-2">
            <span className="font-semibold block">{seller.name}</span>
            <span className="text-xs text-gray-500">{auctionTitle}</span>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[380px]">
        {messages.map(({ id, text, type, timestamp }) => (
          <div
            key={id}
            className={`flex ${type === "sent" ? "justify-end" : ""} `}
          >
            <div
              className={`p-2 rounded-lg ${
                type === "received" ? "bg-blue-200" : "bg-green-200"
              } mb-4`}
            >
              <p>{text}</p>
              <small className="block text-right text-xs text-gray-500">
                {timestamp}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 flex items-center bg-gray-100">
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:outline-none"
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center">
          <MdSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;
