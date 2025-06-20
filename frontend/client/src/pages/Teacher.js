import { useState, useEffect } from 'react';
import socket from '../socket';
import PollResultCard from '../components/PollResult';
import ChatBox from '../components/ChatBox';
import { MessageCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultDurations = [30, 60, 120, 300, 600];

function TeacherPage() {
  const [questionText, setQuestionText] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [questionAsked, setQuestionAsked] = useState(false);
  const [results, setResults] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [teacherName, setTeacherName] = useState(() => sessionStorage.getItem('teacherName') || 'Teacher');
  const [canAskQuestion, setCanAskQuestion] = useState(true);

  const navigate = useNavigate();

   useEffect(() => {
    socket.emit('join', teacherName);
  }, [teacherName]);

  const updateOption = (index, newText) => {
    const newOptions = [...options];
    newOptions[index].text = newText;
    setOptions(newOptions);
  };

  const updateCorrect = (index, isCorrect) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleSubmit = () => {
  if (!canAskQuestion && questionAsked) {
    alert("Wait until all students have answered or the time runs out.");
    return;
  }

  const question = {
    question: questionText,
    options: options.map(opt => opt.text),
    correct: options.map((opt, i) => opt.isCorrect ? i : null).filter(i => i !== null),
    duration
  };

  if (!socket.connected) {
  alert("Socket not connected.");
  return;
}

console.log("📤 Emitting ask_question:", question);

  socket.emit("ask_question", question);
  setQuestionAsked(true);
  setResults({});
  setCanAskQuestion(false); // disable new questions until results come
};


  const handleNextQuestion = () => {
    if (!canAskQuestion) {
      alert("Wait until all students have answered or the time runs out.");
      return;
    }

    setQuestionText('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]);
    setQuestionAsked(false);
    setResults({});
  };

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      const isSelf = msg.name === teacherName;
      setMessages((prev) => [...prev, { ...msg, isSelf }]);
    });

    socket.on('participants', (list) => {
      setParticipants(list);
    });

    return () => {
      socket.off('chat_message');
      socket.off('participants');
    };
  }, [teacherName]);

  useEffect(() => {
  socket.on('poll_result', (data) => {
    setResults(data);
    // ❌ Don't setCanAskQuestion here anymore
  });

  socket.on('can_ask_next', () => {
    setCanAskQuestion(true); // ✅ Only enable after all answered
  });

  return () => {
    socket.off('poll_result');
    socket.off('can_ask_next');
  };
}, []);


  const sendMessage = (text) => {
    socket.emit('chat_message', { name: teacherName, text });
  };

  const kickUser = (nameToKick) => {
    socket.emit('kick_user', nameToKick);
  };

  const questionObj = {
    question: questionText,
    options: options.map(opt => opt.text)
  };

  if (questionAsked) {
    return (
      <div className="h-screen flex flex-col bg-white px-4 pt-10 pb-20">
        <div className="flex justify-end px-6">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 bg-primary-light text-white px-8 py-2 rounded-full font-medium hover:bg-primary-dark transition"
          >
            <Eye className="w-4 h-4" />
            View Poll history
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <PollResultCard question={questionObj} results={results} />
            <div className="flex justify-end mr-12">
              <button
                onClick={handleNextQuestion}
                disabled={!canAskQuestion}
                className={`bg-gradient-to-r from-primary-light to-primary text-white py-2 px-10 rounded-full font-semibold transition ${!canAskQuestion ? 'opacity-50 cursor-not-allowed' : 'hover:from-primary-dark hover:to-primary'}`}
              >
                + Ask a new question
              </button>
            </div>
          </div>
        </div>

        <button
          className="fixed bottom-10 right-8 p-3 bg-primary-light text-white rounded-full shadow-lg hover:bg-primary transition disabled:opacity-75 cursor-pointer"
          aria-label="Open Chat"
          onClick={() => setIsChatOpen(prev => !prev)}
        >
          <MessageCircle className="w-8 h-8" />
        </button>

        <ChatBox
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          username={teacherName}
          isTeacher={true}
          messages={messages}
          participants={participants}
          onSendMessage={sendMessage}
          onKick={kickUser}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-between px-48 pt-8 pb-24">
      <div className="max-w-2xl w-full">
        <span className="mb-4 inline-block bg-gradient-to-r from-primary-light to-primary text-white px-3 py-1 rounded-full">
          ✨ Intervue Poll
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
          Let’s <span className="text-grayish-dark font-bold">Get Started</span>
        </h1>
        <p className="text-grayish max-w-lg mb-6">
          you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className="flex justify-between items-center mb-2">
          <label className="text-grayish-dark font-semibold">Enter your question</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="p-2 bg-grayish-light text-grayish-dark rounded"
          >
            {defaultDurations.map((d) => (
              <option key={d} value={d}>{d} seconds</option>
            ))}
          </select>
        </div>

        <div className="relative mb-6">
          <textarea
            className="w-full bg-grayish-light p-3 pr-12 rounded resize-none"
            maxLength={100}
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <div className="absolute bottom-2 right-3 text-sm text-grayish-dark">{questionText.length}/100</div>
        </div>

        <label className="block text-grayish-dark font-semibold mb-2">Edit Options</label>
        <div className="space-y-4 mb-4">
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-light text-white text-sm font-semibold">
                {index + 1}
              </div>
              <input
                className="flex-1 p-2 bg-grayish-light rounded"
                value={opt.text}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <div className="flex gap-2 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={opt.isCorrect}
                    onChange={() => updateCorrect(index, true)}
                  /> Yes
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={!opt.isCorrect}
                    onChange={() => updateCorrect(index, false)}
                  /> No
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addOption}
          className="px-4 py-1 ml-[2.65rem] mt-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
        >
          + Add More option
        </button>
      </div>

      <div className="fixed bottom-6 right-20">
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-primary-light to-primary text-white py-3 px-12 rounded-full font-semibold hover:from-primary-dark hover:to-primary transition"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}

export default TeacherPage;
