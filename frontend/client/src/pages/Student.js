import { useState, useEffect } from 'react';
import socket from '../socket';
import NameInput from '../components/NameInput';
import QuestionCard from '../components/QuestionCard';
import WaitingScreen from '../components/WaitingScreen';
import { MessageCircle } from 'lucide-react';
import PollResultCard from '../components/PollResult';
import ChatBox from '../components/ChatBox';
import { useNavigate } from 'react-router-dom';

function StudentPage() {
  const [name, setName] = useState(() => sessionStorage.getItem('studentName') || '');
  const [inputName, setInputName] = useState('');
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState({});
  const [timer, setTimer] = useState(60);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleFakeResult = () => {
  //     setResults({
  //       "bhbdcsh cd cdjcbdhbchdh": 1,
  //       "vfjvffvnnnvnfjjff": 5,
  //       "cjnbcdndndnndn": 0
  //     });
  //     setShowResult(true);
  //   };

  //   window.addEventListener("fakeResult", handleFakeResult);
  //   return () => window.removeEventListener("fakeResult", handleFakeResult);
  // }, []);

  useEffect(() => {
  socket.on('kicked', () => {
    console.log('🚫 You were kicked out.');
    sessionStorage.removeItem('studentName');
    navigate('/kickout');
  });

  return () => {
    socket.off('kicked');
  };
}, [navigate]);

  useEffect(() => {
  if (name && socket?.connected) {
    socket.emit('join', name);
    console.log('📨 Emitted join on socket connect (StudentPage):', name);
  }
}, [name, socket]);

useEffect(() => {
    socket.on('chat_message', (msg) => {
      const isSelf = msg.name === name;
      setMessages((prev) => [...prev, { ...msg, isSelf }]);
    });

    socket.on('participants', (list) => {
      setParticipants(list);
    });

    return () => {
      socket.off('chat_message');
      socket.off('participants');
    };
  }, [name]);


  useEffect(() => {
    socket.on('new_question', (data) => {
      setQuestion(data);
      setSelectedOption('');
      setShowResult(false);
      setTimer(data.duration || 60);
    });

    socket.on('poll_result', (data) => {
      setResults(data);
      setShowResult(true);
    });

    return () => {
      socket.off('new_question');
      socket.off('poll_result');
    };
  }, []);

  const submitAnswer = () => {
    if (!selectedOption || !socket?.connected) return;

    console.log("📤 Emitting submit_answer:", {
      name,
      answer: selectedOption,
    });

    socket.emit('submit_answer', {
      name,
      answer: selectedOption,
    });

    setShowResult(true);
  };

  useEffect(() => {
    if (!question || showResult) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          submitAnswer();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question, showResult]);


  const handleNameSubmit = () => {
  sessionStorage.setItem('studentName', inputName);
  setName(inputName);

  if (socket.connected) {
    socket.emit('join', inputName);
    console.log('📨 Emitted join (immediate):', inputName);
  } else {
    socket.once('connect', () => {
      socket.emit('join', inputName);
      console.log('📨 Emitted join (on connect):', inputName);
    });
  }
};

  if (!name) {
    return (
      <NameInput
        inputName={inputName}
        setInputName={setInputName}
        handleSubmit={handleNameSubmit}
      />
    );
  }

  const renderChatButton = (
    <button
      className="fixed bottom-10 right-8 p-3 bg-primary-light text-white rounded-full shadow-lg hover:bg-primary transition"
      aria-label="Open Chat"
      onClick={() => setIsChatOpen(prev => !prev)}
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );

  

  const chatBox = (
    <ChatBox
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      username={name}
      isTeacher={false}
      messages={messages}
      participants={participants}
      onSendMessage={(text) => socket.emit('chat_message', { name, text })}
    />
  );

  if (!question) {
    return (
      <>
        <WaitingScreen />
        {renderChatButton}
        {chatBox}
      </>
    );
  }

  if (showResult) {
    return (
      <div className="h-screen flex flex-col bg-white px-4 pb-20 pt-12">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <PollResultCard question={question} results={results} />
            <p className="text-center text-lg text-grayish-dark font-bold mt-2">
              Wait for the teacher to ask a new question..
            </p>
          </div>
        </div>
        {renderChatButton}
        {chatBox}
      </div>
    );
  }

  return (
    <>
      <QuestionCard
        question={question}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        timer={timer}
        submitAnswer={submitAnswer}
      />
      {renderChatButton}
      {chatBox}
    </>
  );
}

export default StudentPage;
