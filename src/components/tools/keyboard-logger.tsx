'use client';

import { History, Laptop, Monitor, Moon, Sun, Terminal, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface KeyData {
  id: number;
  key: string;
  code: string;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  timestamp: string;
}

export function KeyboardLogger() {
  const [os, setOs] = useState('Detecting...');
  const [history, setHistory] = useState<KeyData[]>([]);
  const [currentKey, setCurrentKey] = useState<KeyData | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Mac')) {
      setOs('macOS');
    } else if (userAgent.includes('Win')) {
      setOs('Windows');
    } else {
      setOs('Linux/Other');
    }

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const timestamp = new Date().toLocaleTimeString();

      const keyData: KeyData = {
        id: Date.now(),
        key: event.key,
        code: event.code,
        modifiers: {
          ctrl: event.ctrlKey,
          shift: event.shiftKey,
          alt: event.altKey,
          meta: event.metaKey,
        },
        timestamp,
      };

      setCurrentKey(keyData);
      setHistory((prev) => [...prev, keyData]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatKeyDisplay = (data: KeyData | null) => {
    if (!data) return '';

    const parts: string[] = [];
    const isMac = os === 'macOS';

    if (data.modifiers.meta) parts.push(isMac ? '⌘ Cmd' : '⊞ Win');
    if (data.modifiers.ctrl) parts.push(isMac ? '⌃ Ctrl' : 'Ctrl');
    if (data.modifiers.alt) parts.push(isMac ? '⌥ Option' : 'Alt');
    if (data.modifiers.shift) parts.push(isMac ? '⇧ Shift' : 'Shift');

    const upperKey = data.key.toUpperCase();
    if (upperKey !== 'CONTROL' && upperKey !== 'SHIFT' && upperKey !== 'ALT' && upperKey !== 'META') {
      if (data.code === 'Space') {
        parts.push('␣ Space');
      } else {
        parts.push(data.key.length === 1 ? data.key.toUpperCase() : data.key);
      }
    }

    if (parts.length === 0) {
      if (data.key === 'Meta') parts.push(isMac ? '⌘ Cmd' : '⊞ Win');
      else if (data.key === 'Control') parts.push(isMac ? '⌃ Ctrl' : 'Ctrl');
      else if (data.key === 'Alt') parts.push(isMac ? '⌥ Option' : 'Alt');
      else if (data.key === 'Shift') parts.push(isMac ? '⇧ Shift' : 'Shift');
    }

    return parts.join(' + ');
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentKey(null);
  };

  const theme = isDarkMode
    ? {
        bg: 'bg-neutral-950',
        text: 'text-green-500',
        textDim: 'text-green-700',
        border: 'border-green-900/50',
        accent: 'text-green-400',
        bgSecondary: 'bg-neutral-900',
        highlight: 'bg-green-900/30',
        selection: 'selection:bg-green-900 selection:text-white',
        inputBg: 'bg-neutral-900/50',
        shadow: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]',
        cursor: 'bg-green-500',
        scrollThumb: '#14532d',
        scrollThumbHover: '#166534',
      }
    : {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        textDim: 'text-gray-500',
        border: 'border-gray-300',
        accent: 'text-blue-600',
        bgSecondary: 'bg-white',
        highlight: 'bg-gray-200',
        selection: 'selection:bg-gray-300 selection:text-black',
        inputBg: 'bg-white',
        shadow: 'drop-shadow-lg',
        cursor: 'bg-gray-800',
        scrollThumb: '#9ca3af',
        scrollThumbHover: '#6b7280',
      };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} font-mono p-4 flex flex-col items-center transition-colors duration-300 ${theme.selection}`}
    >
      <div
        className={`w-full max-w-4xl flex justify-between items-center border-b ${theme.border} pb-4 mb-8 transition-colors duration-300`}
      >
        <div className="flex items-center gap-2">
          <Terminal size={20} />
          <span className="font-bold tracking-wider">KEY_LOGGER_V1.1</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full hover:${theme.highlight} transition-colors`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors duration-300 ${theme.bgSecondary} ${theme.border} opacity-80`}
          >
            {os === 'macOS' ? <Laptop size={14} /> : <Monitor size={14} />}
            <span>{os.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1 opacity-80">
            <span
              className={`w-2 h-2 rounded-full ${isFocused ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            ></span>
            <span>{isFocused ? 'LISTENING' : 'PAUSED'}</span>
          </div>
        </div>
      </div>

      <main className="w-full max-w-4xl flex-1 flex flex-col gap-6">
        <div
          className={`relative group w-full h-48 ${theme.inputBg} rounded-lg border ${theme.border} flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-sm`}
        >
          {isDarkMode && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(18,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          )}

          <span
            className={`text-sm ${theme.textDim} mb-2 uppercase tracking-widest transition-colors duration-300`}
          >
            Current Input
          </span>

          <div
            className={`z-10 text-5xl md:text-7xl font-bold flex items-center gap-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } ${theme.shadow}`}
          >
            {currentKey ? (
              <>{formatKeyDisplay(currentKey)}</>
            ) : (
              <span className={`${theme.textDim} animate-pulse text-2xl`}>WAITING...</span>
            )}
            <span
              className={`block w-3 h-12 md:h-16 ${theme.cursor} animate-pulse ml-1 transition-colors duration-300`}
            ></span>
          </div>

          {currentKey && (
            <div className={`mt-4 flex gap-4 text-xs ${theme.textDim} font-mono transition-colors duration-300`}>
              <span>Code: {currentKey.code}</span>
              <span>Key: {currentKey.key}</span>
            </div>
          )}
        </div>

        <div
          className={`flex-1 min-h-[300px] ${theme.bgSecondary} border ${theme.border} rounded-lg p-4 flex flex-col relative overflow-hidden transition-colors duration-300 shadow-sm`}
        >
          <div
            className={`flex justify-between items-center mb-4 border-b ${theme.border} pb-2 transition-colors duration-300`}
          >
            <div className="flex items-center gap-2">
              <History size={16} />
              <span className="font-bold">INPUT_LOG</span>
              <span className={`${theme.highlight} text-xs px-2 py-0.5 rounded-full transition-colors duration-300`}>
                {history.length}
              </span>
            </div>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors cursor-pointer opacity-70 hover:opacity-100"
            >
              <Trash2 size={12} />
              CLEAR_LOGS
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-custom font-mono text-sm">
            {history.length === 0 && (
              <div className={`text-center ${theme.textDim} py-10 italic`}>No input detected yet. Start typing...</div>
            )}
            {history
              .slice(0)
              .reverse()
              .map((entry) => (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 gap-2 hover:${theme.highlight} p-1 rounded transition-colors border-l-2 border-transparent hover:border-current`}
                >
                  <div className={`col-span-2 ${theme.textDim} text-xs flex items-center`}>{entry.timestamp}</div>
                  <div
                    className={`col-span-3 ${theme.textDim} text-xs flex items-center truncate opacity-80`}
                    title={entry.code}
                  >
                    {entry.code}
                  </div>
                  <div className={`col-span-7 font-bold break-all ${isDarkMode ? 'text-green-300' : 'text-gray-900'}`}>
                    {formatKeyDisplay(entry)}
                  </div>
                </div>
              ))}
          </div>

          {isDarkMode && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-[5px] w-full animate-[scan_3s_ease-in-out_infinite] opacity-30"></div>
          )}
        </div>
      </main>

      <footer
        className={`w-full max-w-4xl mt-8 pt-4 border-t ${theme.border} flex justify-between text-xs ${theme.textDim} transition-colors duration-300`}
      >
        <div className="flex gap-4">
          <span className={currentKey?.modifiers.ctrl ? `font-bold ${theme.accent}` : ''}>CTRL</span>
          <span className={currentKey?.modifiers.alt ? `font-bold ${theme.accent}` : ''}>ALT</span>
          <span className={currentKey?.modifiers.shift ? `font-bold ${theme.accent}` : ''}>SHIFT</span>
          <span className={currentKey?.modifiers.meta ? `font-bold ${theme.accent}` : ''}>
            {os === 'macOS' ? 'CMD' : 'WIN'}
          </span>
        </div>
        <div>
          SYSTEM_STATUS: <span className={theme.accent}>ONLINE</span>
        </div>
      </footer>

      <style>{`
            .scrollbar-custom::-webkit-scrollbar {
                width: 8px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
                background: transparent; 
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
                background: ${theme.scrollThumb}; 
                border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                background: ${theme.scrollThumbHover}; 
            }
            @keyframes scan {
                0% { top: 0%; }
                100% { top: 100%; }
            }
        `}</style>
    </div>
  );
}
