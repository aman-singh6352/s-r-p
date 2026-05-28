import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function StudyRoom({ roomId, user, leaveRoom }) {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setRoom(data);
        setMessages(data.messages || []);
        socketRef.current.emit('joinRoom', { roomId, username: user.username });
      });

    socketRef.current.on('messageRecieved', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('timerSynced', ({ timeRemaining, isRunning }) => {
      setTimeRemaining(timeRemaining);
      setIsRunning(isRunning);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      fetch(`http://localhost:5000/api/rooms/${roomId}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ duration: 1500 })
      });
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, roomId, user.token]);

  const toggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    socketRef.current.emit('timerUpdate', { roomId, timeRemaining, isRunning: nextState });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    socketRef.current.emit('sendMessage', { roomId, sender: user.username, text: inputMsg });
    setInputMsg('');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!room) return <div className="p-6 text-center text-slate-400">Syncing workspace room profile...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
      <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
        <div className="bg-brand-panel p-6 rounded-xl border border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{room.name}</h2>
            <p className="text-xs text-indigo-400 mt-1">Invite Token ID: <span className="text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded">{room._id}</span></p>
          </div>
          <button onClick={leaveRoom} className="text-xs px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer">
            Exit Workspace
          </button>
        </div>

        <div className="bg-brand-panel p-8 rounded-xl border border-slate-800 flex flex-col items-center justify-center flex-1 space-y-6">
          <div className="text-7xl font-mono font-bold tracking-wider text-slate-100 bg-slate-900/60 px-12 py-6 rounded-3xl border border-slate-800">
            {formatTime(timeRemaining)}
          </div>
          <button onClick={toggleTimer} className={`px-8 py-2.5 rounded-full font-bold text-sm shadow-md text-white transition-all cursor-pointer ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
            {isRunning ? 'Pause Deep Work' : 'Start Focus Clock'}
          </button>
        </div>

        <div className="bg-brand-panel p-5 rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Workspace Interval History Logs</h4>
          <div className="space-y-1 text-xs font-mono text-slate-500">
            {room.history?.map((h, i) => (
              <div key={i}>✓ Tracked session block at {new Date(h.startTime).toLocaleTimeString()} for 25 mins</div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-panel rounded-xl border border-slate-800 flex flex-col justify-between h-full overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-sm text-white">Focused Room Feed</h3>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-sm ${m.sender === user.username ? 'bg-indigo-600/20 border border-indigo-500/30 ml-8' : 'bg-slate-800/60 border border-slate-700/30 mr-8'}`}>
              <div className="text-xs text-slate-400 font-semibold mb-1">{m.sender}</div>
              <div className="text-slate-200">{m.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="p-3 bg-slate-900/50 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Sync clean notes or chat..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
          />
          <button className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer">Send</button>
        </form>
      </div>
    </div>
  );
}