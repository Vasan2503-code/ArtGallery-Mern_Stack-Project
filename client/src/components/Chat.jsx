import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Send, X, MessageCircle, User } from "lucide-react";

// Initialize socket outside component to prevent multiple connections on re-renders
const socket = io("https://artgallery-y0rw.onrender.com", {
    autoConnect: false
});

const Chat = ({ currentUserId, artistId, artistName, onClose }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeChatUserId, setActiveChatUserId] = useState(null); // ID of the user the artist is talking to
    const messagesEndRef = useRef(null);

    const isArtist = currentUserId === artistId;

    // Determine the effective room ID
    // If I am the customer: artistId_myId
    // If I am the artist: artistId_activeChatUserId
    const roomId = isArtist && activeChatUserId
        ? `${artistId}_${activeChatUserId}`
        : `${artistId}_${currentUserId}`;

    // Helper to fetch conversations for the artist
    useEffect(() => {
        if (isArtist) {
            const fetchConversations = async () => {
                try {
                    const response = await axios.get(`https://artgallery-y0rw.onrender.com/chat/conversations/${artistId}`);
                    setConversations(response.data);
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                }
            };
            fetchConversations();
        }
    }, [isArtist, artistId]);

    useEffect(() => {
        // If artist hasn't selected a chat, don't connect yet
        if (isArtist && !activeChatUserId) return;

        socket.connect();
        socket.emit("join_room", roomId);
        console.log(`Joined room: ${roomId}`);

        const handleReceiveHistory = (messages) => {
            setMessageList(messages);
            scrollToBottom();
        };

        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
            scrollToBottom();
        };

        socket.on("receive_history", handleReceiveHistory);
        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_history", handleReceiveHistory);
            socket.off("receive_message", handleReceiveMessage);
            socket.emit("leave_room", roomId); // Good practice
            // Only disconnect if closing component, but here we just re-run effect.
            // We can keep connection open but leave room? 
            // Simpler to just disconnect/reconnect for this demo scope or manage rooms better.
            socket.disconnect();
        };
    }, [roomId, isArtist, activeChatUserId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                roomId: roomId,
                senderId: currentUserId,
                message: currentMessage,
                timestamp: new Date(Date.now()),
            };

            await socket.emit("send_message", messageData);
            setCurrentMessage("");
        }
    };

    // If Artist and no active chat selected, show conversation list
    if (isArtist && !activeChatUserId) {
        return (
            <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-brand-dark border-r border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-bg/50 backdrop-blur-md">
                    <h3 className="font-bold text-white">Your Conversations</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {conversations.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10">No messages yet.</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv._id}
                                onClick={() => setActiveChatUserId(conv._id)}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {conv.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{conv.name}</h4>
                                    <p className="text-xs text-gray-400">{conv.role}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-brand-dark border-r border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-bg/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {isArtist && (
                        <button onClick={() => setActiveChatUserId(null)} className="mr-2 text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{isArtist ? "Customer" : artistName}</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg/30">
                {messageList.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div
                            key={index}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe
                                        ? "bg-brand-accent text-white rounded-br-none"
                                        : "bg-white/10 text-gray-200 rounded-bl-none"
                                    }`}
                            >
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? "text-purple-200" : "text-gray-400"}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-brand-bg/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyDown={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent placeholder-gray-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="p-3 bg-brand-accent hover:bg-pink-600 rounded-xl transition-colors text-white shadow-lg shadow-purple-500/20"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple ArrowLeft component for back button
const ArrowLeft = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
);

export default Chat;
