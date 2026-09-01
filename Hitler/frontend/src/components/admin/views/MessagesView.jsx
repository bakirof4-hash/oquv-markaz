import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Loader from '../../ui/Loader';
import { useToast } from '../../../context/ToastContext';
import axios from 'axios';

export default function MessagesView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [textInput, setTextInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchMessages = () => {
    setLoading(true);
    axios.get('/api/admin/messages')
      .then(res => setMessages(res.data))
      .catch(() => addToast("Xabarlarni yuklashda xatolik", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setSubmitting(true);
    axios.post('/api/admin/messages', {
      senderName: 'Admin',
      senderEmail: 'admin@itacademy.uz',
      message: textInput,
    })
      .then(res => {
        setMessages(prev => [...prev, res.data]);
        setTextInput('');
        addToast("Xabar yuborildi", "success");
      })
      .catch(() => addToast("Xabarni yuborishda xatolik", "error"))
      .finally(() => setSubmitting(false));
  };

  const filteredMessages = messages.filter(m =>
    m.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Messages & Support Chat</h2>
        <p className="view-subtitle">Mijozlar va foydalanuvchilar bilan jonli muloqot xonasi</p>
      </div>

      <div className="messages-layout-card">
        {/* Conversations List */}
        <div className="conversations-pane">
          <div className="pane-header">
            <Input
              placeholder="Suhbatdoshni qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon="🔍"
            />
          </div>
          <div className="pane-list">
            {loading ? (
              <Loader text="Suhbatlar yuklanmoqda..." />
            ) : filteredMessages.length === 0 ? (
              <div className="pane-empty">Xabarlar mavjud emas</div>
            ) : (
              filteredMessages.map(m => (
                <div key={m.id} className="conversation-item active">
                  <div className="avatar-circle">{m.senderName ? m.senderName[0].toUpperCase() : 'U'}</div>
                  <div className="conv-info">
                    <div className="flex-between">
                      <strong className="conv-name">{m.senderName}</strong>
                      <span className="conv-time">{m.createdAt}</span>
                    </div>
                    <p className="conv-snippet">{m.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat History Thread */}
        <div className="chat-thread-pane">
          <div className="chat-thread-header">
            <div className="avatar-circle">J</div>
            <div>
              <h4>Jamshid Aliyev</h4>
              <span className="online-status">🟢 Onlayn (Mijoz)</span>
            </div>
          </div>

          <div className="chat-thread-body">
            {messages.map((m, idx) => (
              <div key={m.id || idx} className={`chat-bubble-wrap ${m.senderName === 'Admin' ? 'outgoing' : 'incoming'}`}>
                <div className="chat-bubble">
                  <span className="chat-sender">{m.senderName}</span>
                  <p className="chat-text">{m.message}</p>
                  <span className="chat-time">{m.createdAt}</span>
                </div>
              </div>
            ))}
          </div>

          <form className="chat-thread-footer" onSubmit={handleSend}>
            <Input
              placeholder="Xabaringizni yozing..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
            />
            <Button variant="primary" loading={submitting} type="submit" icon="✈️">
              Yuborish
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
