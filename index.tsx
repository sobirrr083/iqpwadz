<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Text Copier Pro - Browser</title>
    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: background-color 0.3s, color 0.3s;
            overflow-x: hidden;
        }
        
        body.light-mode {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #212529;
        }
        
        body.dark-mode {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #f8f9fa;
        }
        
        .app-container {
            display: flex;
            height: 100vh;
            width: 100%;
        }
        
        .text-copier-panel {
            width: 100%;
            height: 100vh;
            overflow-y: auto;
            transition: all 0.3s;
            padding: 20px;
        }
        
        .text-copier-panel.with-browser {
            width: 40%;
        }
        
        .browser-panel {
            width: 0;
            height: 100vh;
            overflow: hidden;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            background: white;
        }
        
        .browser-panel.active {
            width: 60%;
        }
        
        .dark-mode .browser-panel {
            background: #1a1a2e;
        }
        
        .card {
            backdrop-filter: blur(10px);
            border: none;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .light-mode .card {
            background: rgba(255, 255, 255, 0.95);
        }
        
        .dark-mode .card {
            background: rgba(30, 30, 46, 0.95);
        }
        
        .header-icon {
            font-size: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .dark-mode .header-icon {
            background: linear-gradient(135deg, #667eea 0%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        #textArea {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            min-height: 300px;
            resize: vertical;
        }
        
        .text-copier-panel.with-browser #textArea {
            min-height: 200px;
        }
        
        .btn-browser {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 12px 24px;
            font-size: 1rem;
            transition: transform 0.2s;
        }
        
        .btn-browser:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .quick-link {
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .quick-link:hover {
            transform: translateY(-2px);
        }
        
        .browser-toolbar {
            padding: 8px;
            border-bottom: 1px solid #dee2e6;
            background: #f8f9fa;
        }
        
        .dark-mode .browser-toolbar {
            border-bottom-color: #495057;
            background: #16213e;
        }
        
        .browser-content {
            flex: 1;
            width: 100%;
            border: none;
            background: white;
        }
        
        .dark-mode .browser-content {
            background: #1a1a2e;
        }
        
        .webview-frame {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .url-bar {
            flex: 1;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .selecting-indicator {
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
        }
        
        .stat-badge {
            font-size: 0.8rem;
            padding: 4px 10px;
        }
        
        .btn-sm {
            padding: 4px 8px;
            font-size: 0.85rem;
        }
        
        @media (max-width: 768px) {
            .text-copier-panel.with-browser {
                width: 100%;
                height: 50vh;
            }
            
            .browser-panel.active {
                width: 100%;
                height: 50vh;
            }
            
            .app-container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body class="light-mode">

    <div class="app-container">
        <!-- Text Copier Panel -->
        <div class="text-copier-panel" id="textCopierPanel">
            <div class="container-fluid">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-file-text header-icon"></i>
                        <h1 class="h4 mb-0 fw-bold">AI Text Copier</h1>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm" id="menuBtn" data-bs-toggle="collapse" data-bs-target="#quickLinksMenu">
                            <i class="bi bi-list"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm" id="themeToggle">
                            <i class="bi bi-moon-fill"></i>
                        </button>
                    </div>
                </div>

                <button class="btn btn-browser w-100 mb-3 shadow" onclick="toggleBrowser()">
                    <i class="bi bi-globe me-2"></i>
                    <span id="browserBtnText">Brauzer ochish</span>
                </button>

                <div class="collapse mb-3" id="quickLinksMenu">
                    <div class="card">
                        <div class="card-body p-2">
                            <h6 class="card-title mb-2">Tezkor havolalar:</h6>
                            <div class="row g-2">
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://www.google.com')">
                                        <div class="small fw-bold">Google</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://chat.openai.com')">
                                        <div class="small fw-bold">ChatGPT</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://claude.ai')">
                                        <div class="small fw-bold">Claude</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://x.ai')">
                                        <div class="small fw-bold">Grok</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://www.youtube.com')">
                                        <div class="small fw-bold">YouTube</div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="quick-link card p-2 text-center" onclick="openUrl('https://www.wikipedia.org')">
                                        <div class="small fw-bold">Wikipedia</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-3">
                    <div class="card-body p-2">
                        <p class="mb-1 small">
                            Maslahat: Brauzerda matn nusxa oling va bu yerga paste qiling!
                        </p>
                        <div class="d-flex gap-3">
                            <span class="badge stat-badge bg-primary">
                                Belgilar: <strong id="charCount">0</strong>
                            </span>
                            <span class="badge stat-badge bg-success">
                                Sozlar: <strong id="wordCount">0</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card mb-3">
                    <div id="selectingIndicator" class="selecting-indicator" style="display: none;"></div>
                    <div class="card-body p-0">
                        <textarea class="form-control border-0" id="textArea" placeholder="Bu yerga matn paste qiling..."></textarea>
                    </div>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-6 col-md-3">
                        <button class="btn btn-success w-100 py-2" id="copyBtn" onclick="copyAll()">
                            <i class="bi bi-clipboard-check me-1"></i>
                            <span id="copyBtnText">Copy</span>
                        </button>
                    </div>
                    <div class="col-6 col-md-3">
                        <button class="btn btn-primary w-100 py-2" onclick="saveTxt(false)">
                            <i class="bi bi-download me-1"></i>
                            Save All
                        </button>
                    </div>
                    <div class="col-6 col-md-3">
                        <button class="btn btn-info w-100 py-2" onclick="saveTxt(true)">
                            <i class="bi bi-save me-1"></i>
                            Selected
                        </button>
                    </div>
                    <div class="col-6 col-md-3">
                        <button class="btn btn-danger w-100 py-2" onclick="clearText()">
                            <i class="bi bi-trash me-1"></i>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Browser Panel -->
        <div class="browser-panel" id="browserPanel">
            <div class="browser-toolbar">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="browserBack()">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="browserForward()">
                        <i class="bi bi-arrow-right"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="browserRefresh()">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    
                    <input type="text" class="url-bar form-control form-control-sm" id="urlInput" placeholder="URL..." value="https://www.google.com">
                    
                    <button class="btn btn-sm btn-primary" onclick="navigateUrl()">
                        <i class="bi bi-search"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="toggleBrowser()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="d-flex gap-2 overflow-auto">
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateToUrl('https://www.google.com')">Google</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateToUrl('https://chat.openai.com')">ChatGPT</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateToUrl('https://claude.ai')">Claude</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateToUrl('https://x.ai')">Grok</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="navigateToUrl('https://www.youtube.com')">YouTube</button>
                </div>
            </div>
            
            <div class="browser-content">
                <iframe id="browserFrame" class="webview-frame" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation"></iframe>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    
    <script>
        var pressTimer = null;
        var currentUrl = 'https://www.google.com';
        var browserOpen = false;
        
        var textArea = document.getElementById('textArea');
        var browserPanel = document.getElementById('browserPanel');
        var textCopierPanel = document.getElementById('textCopierPanel');
        var browserFrame = document.getElementById('browserFrame');
        var urlInput = document.getElementById('urlInput');
        var selectingIndicator = document.getElementById('selectingIndicator');
        var browserBtnText = document.getElementById('browserBtnText');
        
        document.getElementById('themeToggle').addEventListener('click', function() {
            var body = document.body;
            var icon = this.querySelector('i');
            
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                icon.classList.remove('bi-moon-fill');
                icon.classList.add('bi-sun-fill');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                icon.classList.remove('bi-sun-fill');
                icon.classList.add('bi-moon-fill');
            }
        });
        
        textArea.addEventListener('input', updateStats);
        textArea.addEventListener('mousedown', startPress);
        textArea.addEventListener('mouseup', cancelPress);
        textArea.addEventListener('mouseleave', cancelPress);
        textArea.addEventListener('touchstart', startPress);
        textArea.addEventListener('touchend', cancelPress);
        
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                navigateUrl();
            }
        });
        
        function updateStats() {
            var text = textArea.value;
            var charCount = text.length;
            var wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
            
            document.getElementById('charCount').textContent = charCount;
            document.getElementById('wordCount').textContent = wordCount;
        }
        
        function startPress() {
            selectingIndicator.style.display = 'block';
            pressTimer = setTimeout(function() {
                selectBetweenWords();
                selectingIndicator.style.display = 'none';
            }, 3000);
        }
        
        function cancelPress() {
            if (pressTimer) {
                clearTimeout(pressTimer);
                selectingIndicator.style.display = 'none';
            }
        }
        
        function selectBetweenWords() {
            var start = textArea.selectionStart;
            var end = textArea.selectionEnd;
            var text = textArea.value;
            
            if (start === end) {
                alert("Ikkita sozni tanlang!");
                return;
            }
            
            var selected = text.substring(start, end).trim().split(/\s+/);
            
            if (selected.length < 2) {
                alert("Kamida 2 ta soz tanlang!");
                return;
            }
            
            var firstWord = selected[0];
            var lastWord = selected[selected.length - 1];
            
            var startIndex = text.indexOf(firstWord, 0);
            var endIndex = text.lastIndexOf(lastWord) + lastWord.length;
            
            if (startIndex === -1 || endIndex === -1) {
                alert("Sozlar topilmadi!");
                return;
            }
            
            textArea.focus();
            textArea.setSelectionRange(startIndex, endIndex);
            alert("Sozlar orasidagi matn belgilandi!");
        }
        
        function copyAll() {
            if (!textArea.value.trim()) {
                alert("Matn yoq!");
                return;
            }
            
            textArea.select();
            document.execCommand('copy');
            
            var btnText = document.getElementById('copyBtnText');
            btnText.textContent = 'Copied!';
            
            setTimeout(function() {
                btnText.textContent = 'Copy';
            }, 2000);
        }
        
        function saveTxt(onlySelected) {
            var textToSave = textArea.value;
            
            if (onlySelected) {
                var start = textArea.selectionStart;
                var end = textArea.selectionEnd;
                
                if (start === end) {
                    alert("Matn belgilanmagan!");
                } else {
                    textToSave = textArea.value.substring(start, end);
                }
            }
            
            if (!textToSave.trim()) {
                alert("Saqlanadigan matn yoq!");
                return;
            }
            
            var now = new Date();
            var site = window.location.hostname.replace(/\./g, '_') || 'text-copier';
            var month = now.getMonth() + 1;
            var monthStr = month < 10 ? '0' + month : '' + month;
            var day = now.getDate();
            var dayStr = day < 10 ? '0' + day : '' + day;
            var hours = now.getHours();
            var hoursStr = hours < 10 ? '0' + hours : '' + hours;
            var minutes = now.getMinutes();
            var minutesStr = minutes < 10 ? '0' + minutes : '' + minutes;
            var seconds = now.getSeconds();
            var secondsStr = seconds < 10 ? '0' + seconds : '' + seconds;
            
            var date = now.getFullYear() + '-' + monthStr + '-' + dayStr;
            var time = hoursStr + '-' + minutesStr + '-' + secondsStr;
            
            var defaultName = site + '_' + date + '_' + time + '.txt';
            var filename = prompt("Fayl nomi:", defaultName);
            
            if (!filename) return;
            
            var blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename.indexOf('.txt') !== -1 ? filename : filename + '.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        function clearText() {
            if (confirm("Barcha matn ochirilsinmi?")) {
                textArea.value = '';
                updateStats();
            }
        }
        
        function toggleBrowser() {
            browserOpen = !browserOpen;
            
            if (browserOpen) {
                browserPanel.classList.add('active');
                textCopierPanel.classList.add('with-browser');
                browserBtnText.textContent = 'Brauzer yopish';
                if (!browserFrame.src) {
                    browserFrame.src = currentUrl;
                }
            } else {
                browserPanel.classList.remove('active');
                textCopierPanel.classList.remove('with-browser');
                browserBtnText.textContent = 'Brauzer ochish';
            }
        }
        
        function openUrl(url) {
            currentUrl = url;
            urlInput.value = url;
            browserFrame.src = url;
            if (!browserOpen) {
                toggleBrowser();
            }
        }
        
        function navigateUrl() {
            var url = urlInput.value.trim();
            
            if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                if (url.indexOf('.') !== -1) {
                    url = 'https://' + url;
                } else {
                    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                }
            }
            
            currentUrl = url;
            urlInput.value = url;
            browserFrame.src = url;
        }
        
        function navigateToUrl(url) {
            currentUrl = url;
            urlInput.value = url;
            browserFrame.src = url;
        }
        
        function browserBack() {
            try {
                browserFrame.contentWindow.history.back();
            } catch (e) {
                console.log('Cannot go back');
            }
        }
        
        function browserForward() {
            try {
                browserFrame.contentWindow.history.forward();
            } catch (e) {
                console.log('Cannot go forward');
            }
        }
        
        function browserRefresh() {
            browserFrame.src = currentUrl;
        }
        
        updateStats();
    </script>
</body>
</html>
