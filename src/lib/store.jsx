import { createContext, useContext, useMemo } from 'react';
import { usePersistentState } from './hooks.js';

const DEFAULT = {
  compass: {},
  trackId: 'freelance',
  hours: 15,
  goal: 3000,
  price: 150,
  costs: 15,
  feePct: 8,
  hoursPerUnit: 6,
  days: 24,
  currency: 'MAD',
  tasks: {},
  streak: {},
  focusMode: false,
};

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = usePersistentState('adha.v2', DEFAULT);

  const value = useMemo(() => {
    const set = (patch) => setState((prev) => ({ ...prev, ...patch }));
    return {
      ...state,
      set,
      setKey: (key, v) => setState((prev) => ({ ...prev, [key]: v })),
      toggleTask: (key) =>
        setState((prev) => ({ ...prev, tasks: { ...prev.tasks, [key]: !prev.tasks[key] } })),
      toggleDay: (key) =>
        setState((prev) => ({ ...prev, streak: { ...prev.streak, [key]: !prev.streak[key] } })),
      reset: () => setState(DEFAULT),
    };
  }, [state, setState]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export { DEFAULT as DEFAULT_STATE };
