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
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease-out] ${
              t.type === 'success' ? 'bg-emerald-600 text-white' :
              t.type === 'error' ? 'bg-red-500 text-white' :
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
