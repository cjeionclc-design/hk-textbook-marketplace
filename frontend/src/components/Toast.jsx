import { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="card px-5 py-3 text-sm font-semibold animate-[slideUp_0.3s_ease-out]"
            style={{background: t.type==='error' ? '#fef2f2' : '#fff', color: t.type==='error' ? '#ef4444' : '#1a1a2e'}}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
