import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import stompService from "../utils/socketService";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [to, setTo] = useState('');
    const [sender, setSender] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const { user } = useParams();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (user) {
            setSender(user);
            fetchExistingMessages();
        }
    }, [user]);

    const fetchExistingMessages = async () => {
        if (to) {
            try {
                const response = await fetch(`http://localhost:8080/chat?sender=${user}&to=${to}`);
                if (response.ok) {
                    const chat = await response.json();
                    if (chat && chat.messages) {
                        setMessages(chat.messages);
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }
    };

    useEffect(() => {
        if (sender) {
            const subscription = stompService.subscribe(`/messageTo/${sender}`, (msg) => {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            });

            return () => {
                stompService.unsubscribe(`/messageTo/${sender}`);
            };
        }
    }, [sender]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!to || !sender || !newMessage) return;

        const messageData = {
            sender: sender,
            time: Date.now(),
            type: "text",
            content: newMessage
        };

        try {
            const response = await fetch(`http://localhost:8080/chat?to=${to}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                
                setMessages(prev => [...prev, messageData]);
                setNewMessage('');
                scrollToBottom();
            } else {
                console.error('Error al enviar el mensaje:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            <div className="mb-4">
                <input
                    type="text"
                    value={to}
                    onChange={(e) => {
                        setTo(e.target.value);
                        fetchExistingMessages();
                    }}
                    placeholder="Destinatario"
                    className="w-full p-2 border rounded mb-2"
                />
            </div>

            <div className="flex-1 overflow-y-auto border rounded p-4 mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                            msg.sender === sender 
                                ? 'ml-auto bg-blue-500 text-white' 
                                : 'bg-gray-200'
                        }`}
                    >
                        <p className="text-sm font-semibold">{msg.sender}</p>
                        <p>{msg.content}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe tu mensaje"
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={sendMessage}
                    disabled={!to || !sender || !newMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Chat;