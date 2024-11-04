import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import stompService from "../utils/socketService";
import "./Chat.css"; 

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
        <div className="chat-container">
            <div className="chat-header">
                <input
                    type="text"
                    value={to}
                    onChange={(e) => {
                        setTo(e.target.value);
                        fetchExistingMessages();
                    }}
                    placeholder="Destinatario"
                    className="recipient-input"
                />
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${msg.sender === sender ? 'sent' : 'received'}`}
                    >
                        <p className="message-sender">{msg.sender}</p>
                        <p className="message-content">{msg.content}</p>
                        <p className="message-time">{new Date(msg.time).toLocaleTimeString()}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe tu mensaje"
                    className="message-input"
                />
                <button
                    onClick={sendMessage}
                    disabled={!to || !sender || !newMessage}
                    className="send-button"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default Chat;
