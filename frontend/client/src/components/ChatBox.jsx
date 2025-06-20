import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ChatBox({ isOpen, messages, participants, onSendMessage, isTeacher, onKick }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-24 right-8 w-[360px] max-h-[500px] bg-white rounded-lg shadow-2xl z-50 overflow-hidden border"
        >
          {/* Tabs */}
          <div className="flex border-b text-sm font-medium">
            <button
              className={`flex-1 px-6 py-2 ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary-light' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`flex-1 px-6 py-2 ${activeTab === 'participants' ? 'text-primary border-b-2 border-primary-light' : 'text-gray-500'}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[calc(500px-110px)]">
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.isSelf ? 'bg-primary-light text-white' : 'bg-gray-800 text-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-2 flex">
                <input
                  className="flex-1 px-3 py-2 border rounded-l outline-none text-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-primary-light text-white px-4 rounded-r text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="h-[calc(500px-110px)] overflow-y-auto p-4 text-sm">
              <div className="mb-2 text-gray-500 font-semibold">Name</div>
              {participants?.map((name, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b last:border-none">
                  <span className="font-medium text-gray-800">{name}</span>
                  {isTeacher && (
                    <button onClick={() => onKick(name)} className="text-primary hover:underline">Kick out</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChatBox;
