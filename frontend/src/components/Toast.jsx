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
          <div key={t.id}
            className={`px-5 py-3 rounded-2xl shadow-xl text-sm font-bold animate-[slideIn_0.3s_ease-out] ${
              t.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-emerald-200' :
              t.type === 'error' ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-red-200' :
              'bg-gray-800 text-white'
            }`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
