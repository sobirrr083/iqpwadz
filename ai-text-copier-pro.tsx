import React, { useState, useRef, useEffect } from 'react';
import { Copy, Download, Trash2, Moon, Sun, FileText, Check, Globe, ArrowLeft, ArrowRight, RefreshCw, X, Minimize2, Search, Menu } from 'lucide-react';

export default function BrowserTextCopier() {
  const [text, setText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState('https://www.google.com');
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [browserMinimized, setBrowserMinimized] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const textareaRef = useRef(null);
  const pressTimerRef = useRef(null);
  const iframeRef = useRef(null);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
    { name: 'Claude', url: 'https://claude.ai', icon: '🧠' },
    { name: 'Grok', url: 'https://x.ai', icon: '✨' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '📺' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' }
  ];

  const startPress = () => {
    setSelecting(true);
    pressTimerRef.current = setTimeout(() => {
      selectBetweenWords();
      setSelecting(false);
    }, 3000);
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      setSelecting(false);
    }
  };

  const selectBetweenWords = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert("❌ Ikkita so'zni tanlang (bosib turing)!");
      return;
    }

    const selected = text.substring(start, end).trim().split(/\s+/);

    if (selected.length < 2) {
      alert("❌ Kamida 2 ta so'z tanlang!");
      return;
    }

    const firstWord = selected[0];
    const lastWord = selected[selected.length - 1];

    const startIndex = text.indexOf(firstWord, 0);
    const endIndex = text.lastIndexOf(lastWord) + lastWord.length;

    if (startIndex === -1 || endIndex === -1) {
      alert("❌ So'zlar topilmadi!");
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(startIndex, endIndex);
    alert("✅ So'zlar orasidagi barcha matn belgilandi!");
  };

  const copyAll = () => {
    if (!text.trim()) {
      alert("❌ Matn yo'q!");
      return;
    }
    
    const textarea = textareaRef.current;
    textarea.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveTxt = (onlySelected = false) => {
    const textarea = textareaRef.current;
    let textToSave = text;

    if (onlySelected) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        alert("❌ Matn belgilanmagan! Barcha matn saqlanadi.");
      } else {
        textToSave = text.substring(start, end);
      }
    }

    if (!textToSave.trim()) {
      alert("❌ Saqlanadigan matn yo'q!");
      return;
    }

    const now = new Date();
    const site = window.location.hostname.replace(/\./g, '_') || 'text-copier';
    const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const time = `${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${String(now.getSeconds()).padStart(2,'0')}`;
    
    const defaultName = `${site}_${date}_${time}.txt`;
    const filename = prompt("📝 Fayl nomini kiriting:", defaultName);

    if (!filename) return;

    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.txt') ? filename : filename + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearText = () => {
    if (confirm("🗑️ Barcha matn o'chirilsinmi?")) {
      setText('');
    }
  };

  const openBrowser = (url = null) => {
    if (url) {
      setBrowserUrl(url);
      setUrlInput(url);
    }
    setShowBrowser(true);
    setBrowserMinimized(false);
  };

  const closeBrowser = () => {
    setShowBrowser(false);
    setBrowserMinimized(false);
  };

  const minimizeBrowser = () => {
    setBrowserMinimized(true);
  };

  const handleUrlSubmit = () => {
    let url = urlInput.trim();
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
      }
    }
    
    setBrowserUrl(url);
    setUrlInput(url);
  };

  const handleUrlKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const refreshBrowser = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        iframeRef.current.src = currentSrc;
      }, 10);
    }
  };

  const goBack = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.back();
      } catch (e) {
        console.log('Cannot go back');
      }
    }
  };

  const goForward = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.forward();
      } catch (e) {
        console.log('Cannot go forward');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Main Content */}
      <div className={`${showBrowser && !browserMinimized ? 'hidden' : 'block'} p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className="text-2xl font-bold">AI Text Copier Pro</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Browser Button */}
          <button
            onClick={() => openBrowser()}
            className={`w-full mb-4 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-all ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            } text-white shadow-lg`}
          >
            <Globe className="w-6 h-6" />
            <span className="text-lg">🌐 Brauzer ochish</span>
          </button>

          {/* Quick Links Menu */}
          {showMenu && (
            <div className={`${cardBg} rounded-lg p-4 mb-4 shadow-lg border ${borderColor}`}>
              <h3 className="font-semibold mb-3">🔗 Tezkor havolalar:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.url}
                    onClick={() => openBrowser(link.url)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className={`${cardBg} rounded-lg p-4 mb-4 shadow-sm border ${borderColor}`}>
            <p className="text-sm opacity-75 mb-2">
              💡 <strong>Maslahat:</strong> Brauzerda ChatGPT/Claude ga kiring, matnni nusxa oling va bu yerga paste qiling!
            </p>
            <div className="flex gap-4 text-sm">
              <span>📊 Belgilar: <strong>{charCount}</strong></span>
              <span>📝 So'zlar: <strong>{wordCount}</strong></span>
            </div>
          </div>

          {/* Text Area */}
          <div className={`${cardBg} rounded-lg shadow-lg border ${borderColor} overflow-hidden relative`}>
            {selecting && (
              <div className="absolute top-0 left-0 right-0 bg-blue-500 h-1 animate-pulse"></div>
            )}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onMouseDown={startPress}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
              placeholder="Bu yerga brauzerdan yoki AI'dan matn paste qiling...

💡 Funksiyalar:
• Paste va Edit
• Copy All
• Save .TXT
• Ikki so'z orasini belgilash (3 soniya bosib turing)"
              className={`w-full h-96 p-4 focus:outline-none resize-none ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} transition-colors`}
              style={{ fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <button
              onClick={copyAll}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Nusxa olindi!' : 'Copy All'}
            </button>

            <button
              onClick={() => saveTxt(false)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Download className="w-5 h-5" />
              Save All
            </button>

            <button
              onClick={() => saveTxt(true)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              <Download className="w-5 h-5" />
              Save Selected
            </button>

            <button
              onClick={clearText}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              Clear
            </button>
          </div>

          {/* Footer Info */}
          <div className={`mt-6 p-4 ${cardBg} rounded-lg border ${borderColor} shadow-sm`}>
            <h3 className="font-semibold mb-2">🚀 Qanday foydalanish:</h3>
            <ol className="text-sm space-y-1 opacity-75 list-decimal list-inside">
              <li><strong>Brauzer ochish</strong> - ChatGPT, Claude, Grok va boshqa saytlarga kiring</li>
              <li>AI javobini nusxa oling (Ctrl+C yoki Copy)</li>
              <li>Bu yerga qaytib paste qiling (Ctrl+V)</li>
              <li>Xohlagancha edit qiling</li>
              <li><strong>Copy All</strong> - to'liq nusxa olish</li>
              <li><strong>Save All/Selected</strong> - .txt faylga saqlash</li>
              <li><strong>3 soniya bosish</strong> - ikki so'z orasidagi matnni tanlash</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Browser Minimized Button */}
      {browserMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setBrowserMinimized(false)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl font-medium transition-all animate-pulse ${
              darkMode 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
          >
            <Globe className="w-5 h-5" />
            Brauzer ochish
          </button>
        </div>
      )}

      {/* Browser View */}
      {showBrowser && !browserMinimized && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white dark:bg-gray-900">
          {/* Browser Controls */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-2`}>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={goBack}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                title="Orqaga"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goForward}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                title="Oldinga"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={refreshBrowser}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                title="Yangilash"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={handleUrlKeyPress}
                  className={`flex-1 px-4 py-2 rounded-full border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-100 border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="URL yoki qidiruv..."
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={minimizeBrowser}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                title="Yashirish"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={closeBrowser}
                className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 transition-colors`}
                title="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Links Bar */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickLinks.map((link) => (
                <button
                  key={link.url}
                  onClick={() => {
                    setBrowserUrl(link.url);
                    setUrlInput(link.url);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 relative bg-white">
            <iframe
              ref={iframeRef}
              src={browserUrl}
              className="w-full h-full border-0"
              title="Browser"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"
            />
            <div className="absolute bottom-4 right-4 z-10">
              <div className={`${cardBg} rounded-lg shadow-lg p-3 border ${borderColor} text-xs opacity-90`}>
                💡 Matnni nusxa oling (Ctrl+C) va Text Copier'ga o'ting
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}