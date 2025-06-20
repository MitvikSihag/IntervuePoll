const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// ✅ Proper CORS setup for credentials
app.use(cors({
  origin: 'https://intervue-poll-beta.vercel.app',
  credentials: true,
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://intervue-poll-beta.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});


// 🧠 In-memory state
const state = {
  teacher: null,
  students: {}, // socketId -> { name, answered }
  currentQuestion: null,
  results: {},
  history: [],
};

// 🔁 Utility: emit participants list
const broadcastParticipants = () => {
  const names = Object.values(state.students).map(s => s.name);
  io.emit('participants', names);
};

// 🔌 Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join', (name) => {
  if (name.toLowerCase() === 'teacher') {
    state.teacher = socket.id;
    console.log(`👨‍🏫 Teacher joined: ${socket.id}`);
  } else {
    console.log(`🧑‍🎓 Student joined: ${name} [${socket.id}]`);
    
    const isDuringQuestion = !!state.currentQuestion;
    state.students[socket.id] = {
      name,
      answered: isDuringQuestion  // ✅ If already ongoing, consider them as "answered"
    };
    
    broadcastParticipants();

    // 👇 Optionally, don't send them the current question
    if (isDuringQuestion) {
      socket.emit('info_message', 'Wait for the next question.');
    }
  }
});

  socket.on('ask_question', (questionData) => {
    const isPreviousUnfinished = state.currentQuestion && 
    Object.values(state.students).some(s => !s.answered);

    if (isPreviousUnfinished) {
      socket.emit('error_message', 'Wait until the current question finishes.');
      return;
    }

    console.log('📨 Question asked:', questionData);
    state.currentQuestion = questionData;
    state.results = {};
    Object.keys(state.students).forEach(id => state.students[id].answered = false);
    io.emit('new_question', questionData);
  });

  socket.on('submit_answer', ({ name, answer }) => {
    console.log(`✅ Received answer from ${name}: ${answer}`);
    const student = state.students[socket.id];
    if (!student || student.answered) return;

    student.answered = true;
    state.results[answer] = (state.results[answer] || 0) + 1;

    // 📤 Send current results to all students who already submitted
    for (const [id, s] of Object.entries(state.students)) {
      if (s.answered) {
        io.to(id).emit('poll_result', state.results);
      }
    }

    // 📤 Send updated results to teacher
    if (state.teacher && io.sockets.sockets.has(state.teacher)) {
      io.to(state.teacher).emit('poll_result', state.results);
    }

    // 📦 Save to history if all answered
    const allAnswered = Object.values(state.students).every(s => s.answered);
    if (allAnswered) {
      // ✅ Save to history
      state.history.push({
        question: state.currentQuestion,
        results: { ...state.results }
      });

      // ✅ Let teacher know they can ask next
      if (state.teacher && io.sockets.sockets.has(state.teacher)) {
        io.to(state.teacher).emit('can_ask_next');
      }
    }

  });

  socket.on('get_poll_history', () => {
    socket.emit('poll_history', state.history);
  });

  socket.on('chat_message', (msg) => {
    io.emit('chat_message', msg); // { name, text }
  });

  socket.on('kick_user', (nameToKick) => {
    const targetEntry = Object.entries(state.students).find(([_, v]) => v.name === nameToKick);
    if (targetEntry) {
      const [targetId] = targetEntry;
      io.to(targetId).emit('kicked');
      delete state.students[targetId];
      broadcastParticipants();
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === state.teacher) {
      state.teacher = null;
      console.log('👨‍🏫 Teacher disconnected');
    } else {
      delete state.students[socket.id];
      broadcastParticipants();
      console.log('❌ Student disconnected:', socket.id);
    }
  });
});

// 🌐 Health check
app.get('/', (req, res) => {
  res.send('✅ Polling server is running');
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
