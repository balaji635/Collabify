import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChatPage() {
  const { backendURL, userData, socket, setUnreadMessages } = useContext(AppContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${backendURL}/chat/my-chats`, { withCredentials: true });
      if (res.data.success) setChats(res.data.chats);
    } catch {
      toast.error("Failed to fetch chats");
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${backendURL}/chat/messages/${chatId}`, { withCredentials: true });
      if (res.data.success) setMessages(res.data.messages);
    } catch {
      toast.error("Failed to fetch messages");
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedChat) return;
    try {
      const res = await axios.post(
        `${backendURL}/chat/message`,
        { chatId: selectedChat._id, content: newMsg.trim() },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
        setNewMsg("");
        socket?.emit("sendMessage", {
          chatId: selectedChat._id,
          message: res.data.message
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    fetchChats();
    setUnreadMessages(0);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = msg => {
      if (selectedChat?._id === msg.chatId) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [socket, selectedChat]);

  const getChatName = chat => {
    const other = chat.users.find(u => u._id !== userData?._id);
    return other?.name || "Unknown Chat";
  };

  return (
 <div className="h-[calc(100vh-4rem)] bg-slate-900 pt-4 pb-6">
     
      <div className="max-w-5xl mx-auto h-full flex gap-6 px-4">
        
        <div className="w-1/3 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col">
          <h3 className="text-slate-200 font-bold mb-4">Chats</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.length === 0 ? (
              <p className="text-slate-400 text-sm">No chats yet. Accept requests to start chatting!</p>
            ) : (
              chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                    fetchMessages(chat._id);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                >
                  {getChatName(chat)}
                </div>
              ))
            )}
          </div>
        </div>

       
        <div className="flex-1 flex flex-col bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg">
          <h3 className="text-slate-200 font-bold mb-4">
            {selectedChat ? getChatName(selectedChat) : "Select a chat"}
          </h3>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
            {messages.map(msg => (
              <div
                key={msg._id}
                className={`flex ${msg.sender._id === userData._id ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.sender._id === userData._id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          
          {selectedChat && (
            <div className="flex gap-2">
              <textarea
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                placeholder="Type a message..."
                className="flex-1 resize-none bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!newMsg.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  newMsg.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-600 text-slate-400 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
