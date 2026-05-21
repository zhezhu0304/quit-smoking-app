import { useState, useCallback } from 'react';

const USER_KEY = 'quit-smoking-user';

function generateId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function loadUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  const newUser = { id: generateId(), createdAt: Date.now() };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
}

export function useUser() {
  const [user, setUser] = useState(loadUser);

  const switchUser = useCallback((id) => {
    const clean = id.toUpperCase().trim();
    if (!clean || clean.length < 4) return false;
    const newUser = { id: clean, createdAt: Date.now() };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }, []);

  return { user, switchUser };
}
