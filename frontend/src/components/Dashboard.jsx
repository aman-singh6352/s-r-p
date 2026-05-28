import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, selectRoom, logout }) {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchRooms = async () => {
    try {
      const res = await fetch('${API_URL}/api/rooms', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await fetch('${API_URL}/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      setName('');
      setDescription('');
      fetchRooms();
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Hello, {user.username}! 👋🏼</h1>
          <p className="text-sm text-slate-400">Ready for a productive distraction-free session?</p>
        </div>
        <button onClick={logout} className="px-4 py-2 text-sm bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer">
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleCreateRoom} className="bg-brand-panel p-6 rounded-xl border border-slate-800 space-y-4 h-fit">
          <h2 className="text-xl font-semibold text-white">Create Study Room</h2>
          <input
            type="text"
            placeholder="Room Name"
            value={name}
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description / Context"
            value={description}
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors cursor-pointer">
            Launch Space
          </button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">Available Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div key={room._id} className="bg-brand-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <h3 className="text-lg font-bold text-indigo-400">{room.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{room.description || 'No description provided.'}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{room.participants?.length || 0} active members</span>
                  <button onClick={() => selectRoom(room._id)} className="bg-slate-800 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer">
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}   