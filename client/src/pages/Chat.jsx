import { useState, useEffect, useRef } from "react";

const contacts = [
  { id: 1, name: "Ali Khan", avatar: "https://i.pravatar.cc/40?img=11", online: true, lastMessage: "Sure, let's schedule a call!", time: "2m ago" },
  { id: 2, name: "Sara Malik", avatar: "https://i.pravatar.cc/40?img=5", online: false, lastMessage: "Thanks for the React resources", time: "1h ago" },
  { id: 3, name: "Ahmed Raza", avatar: "https://i.pravatar.cc/40?img=12", online: true, lastMessage: "Can you help me with CSS?", time: "3h ago" },
  { id: 4, name: "Fatima Noor", avatar: "https://i.pravatar.cc/40?img=9", online: false, lastMessage: "Looking forward to our session", time: "Yesterday" },
];

const initialMessages = [
  { id: 1, sender: "other", text: "Hey! I saw your profile and I'm interested in exchanging skills 👋", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Hi! Sure, I'd love to help. What would you like to learn?", time: "10:32 AM" },
  { id: 3, sender: "other", text: "I'm really interested in learning React. In return, I can teach you UI/UX design principles!", time: "10:35 AM" },
  { id: 4, sender: "me", text: "That sounds like a great deal! I have some experience with React. Let's do it!", time: "10:38 AM" },
  { id: 5, sender: "other", text: "Awesome! When are you available for a quick call?", time: "10:40 AM" },
];

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responseMsg = {
          id: messages.length + 2,
          sender: "other",
          text: "That sounds great! Let's connect soon.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, responseMsg]);
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar - Contacts */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                selectedContact.id === contact.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-400">{contact.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-10 h-10 rounded-full"
            />
            {selectedContact.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
            <p className="text-sm text-gray-500">
              {selectedContact.online ? "Online" : "Offline"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${msg.sender === "me" ? "order-2" : "order-1"}`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === "me" 
                    ? "bg-gradient-to-r from-primary to-indigo-600 text-white rounded-br-none" 
                    : "bg-white text-gray-900 rounded-bl-none"
                }`}>
                  <p>{msg.text}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            
            <button 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
