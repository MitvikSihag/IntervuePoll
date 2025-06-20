import { useEffect, useState } from 'react';
import PollResultCard from '../components/PollResult';
import ChatBox from '../components/ChatBox';
import { MessageCircle } from 'lucide-react';
import socket from '../socket';

const PollHistoryPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    // Request poll history from backend
    socket.emit('get_poll_history');

    // Listen for poll history data
    socket.on('poll_history', (history) => {
      setPollHistory(history);
    });

    // Clean up on unmount
    return () => {
      socket.off('poll_history');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-10 pb-20">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-10">
        View <span className="text-grayish-dark font-bold">Poll History</span>
      </h1>

      <div className="space-y-12">
        {pollHistory.map((poll, index) => (
          <div key={index}>
            <PollResultCard question={poll.question} results={poll.results} />
          </div>
        ))}
        {pollHistory.length === 0 && (
          <p className="text-grayish text-center mt-10">No poll history available.</p>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-10 right-8 p-3 bg-primary-light text-white rounded-full shadow-lg hover:bg-primary transition"
        aria-label="Open Chat"
        onClick={() => setIsChatOpen(prev => !prev)}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        username="Teacher"
        isTeacher={true}
      />
    </div>
  );
};

export default PollHistoryPage;
