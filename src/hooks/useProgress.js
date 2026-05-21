import { useState, useEffect, useCallback } from 'react';

const VALID_STEPS = ['intro', 'cards', 'complete'];

function getKey(userId) {
  return `quit-smoking-${userId}`;
}

function loadProgress(userId) {
  try {
    const data = localStorage.getItem(getKey(userId));
    if (!data) return { completed: [], currentStep: 'intro' };
    const parsed = JSON.parse(data);
    if (!VALID_STEPS.includes(parsed.currentStep)) {
      parsed.currentStep = 'intro';
    }
    return parsed;
  } catch {
    return { completed: [], currentStep: 'intro' };
  }
}

function saveProgress(userId, progress) {
  localStorage.setItem(getKey(userId), JSON.stringify(progress));
}

export function useProgress(userId) {
  const [progress, setProgress] = useState(() => loadProgress(userId));

  // 当 userId 变化时重新加载对应进度
  useEffect(() => {
    setProgress(loadProgress(userId));
  }, [userId]);

  useEffect(() => {
    saveProgress(userId, progress);
  }, [userId, progress]);

  const isUnlocked = useCallback(
    (moduleId) => {
      if (moduleId === 1) return true;
      return progress.completed.includes(moduleId - 1);
    },
    [progress.completed]
  );

  const isCompleted = useCallback(
    (moduleId) => progress.completed.includes(moduleId),
    [progress.completed]
  );

  const completeModule = useCallback((moduleId) => {
    setProgress((prev) => {
      if (prev.completed.includes(moduleId)) return prev;
      return { ...prev, completed: [...prev.completed, moduleId] };
    });
  }, []);

  const setStep = useCallback((step) => {
    setProgress((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ completed: [], currentStep: 'intro' });
  }, []);

  return {
    progress,
    isUnlocked,
    isCompleted,
    completeModule,
    setStep,
    resetProgress,
  };
}
