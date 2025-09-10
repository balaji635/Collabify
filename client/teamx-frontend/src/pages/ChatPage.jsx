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
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch chats");
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${backendURL}/chat/messages/${chatId}`, { withCredentials: true });
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages");
    }
  };

  // FIXED: Send message function
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
        
        // Emit socket event for real-time messaging
        if (socket) {
          socket.emit("sendMessage", { 
            chatId: selectedChat._id, 
            message: res.data.message 
          });
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
    }
  };

  // FIXED: Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Receive messages in real-time
  useEffect(() => {
    if (!socket) return;
    
    const handleMessage = (msg) => {
      if (selectedChat && msg.chatId === selectedChat._id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [socket, selectedChat]);

  useEffect(() => {
    setUnreadMessages(0); // reset badge when page is open
  }, []);

  // FIXED: Get chat name helper function
  const getChatName = (chat) => {
    if (!chat.users || chat.users.length === 0) return "Unknown Chat";
    
    // Find the other user (not current user)
    const otherUser = chat.users.find(user => user._id !== userData?._id);
    return otherUser ? otherUser.name : "Unknown User";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
      <div className="w-1/3 border border-gray-200 rounded p-4">
        <h3 className="font-bold mb-4">Chats</h3>
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm">No chats yet. Accept requests to start chatting!</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat._id}
              className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                selectedChat?._id === chat._id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setSelectedChat(chat);
                fetchMessages(chat._id);
              }}
            >
              {getChatName(chat)}
            </div>
          ))
        )}
      </div>

      <div className="flex-1 border border-gray-200 rounded p-4 flex flex-col h-[500px]">
        <h3 className="font-bold mb-4">
          {selectedChat ? getChatName(selectedChat) : "Select a chat"}
        </h3>
        
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map(msg => (
            <div key={msg._id} className={`${msg.sender._id === userData._id ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${msg.sender._id === userData._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        
        {selectedChat && (
          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
            />
            <button 
              onClick={sendMessage} 
              disabled={!newMsg.trim()}
              className={`px-4 rounded text-white ${
                !newMsg.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}