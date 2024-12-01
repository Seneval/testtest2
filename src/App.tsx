import { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { sendMessage } from './services/openai';

// Define the Message type explicitly
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const App = () => {
  // Use the explicit Message type for state
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (message: string) => {
    // Create a user message
    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the user message and get the assistant's response
      const assistantResponse = await sendMessage(message);
      const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat with Assistant</h1>
      <div className="space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default App;
