// ===== Dark mode =====
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// ===== Toast helper =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Char counter =====
const sourceText = document.getElementById('sourceText');
const charCount = document.getElementById('charCount');
if (sourceText && charCount) {
  const update = () => charCount.textContent = sourceText.value.length;
  sourceText.addEventListener('input', update);
  update();
}

// ===== Ctrl+Enter submit =====
const mainForm = document.getElementById('translateForm');
if (mainForm) {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') mainForm.submit();
  });
}

// ===== Paste from clipboard =====
const pasteBtn = document.getElementById('pasteBtn');
if (pasteBtn && sourceText) {
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      sourceText.value += text;
      sourceText.dispatchEvent(new Event('input'));
      showToast('Pasted!');
    } catch {
      showToast('Clipboard access denied');
    }
  });
}

// ===== Quick phrase chips =====
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    if (sourceText) {
      sourceText.value = chip.dataset.phrase;
      sourceText.dispatchEvent(new Event('input'));
    }
  });
});

// ===== Swap languages =====
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const swapBtn = document.getElementById('swapBtn');
if (swapBtn) {
  swapBtn.addEventListener('click', () => {
    if (sourceLang.value === 'auto') { showToast("Can't swap from Auto Detect"); return; }
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
  });
}

// ===== Copy result =====
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const text = document.getElementById('resultText').innerText;
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
  });
}

// ===== Text-to-speech =====
const speakBtn = document.getElementById('speakBtn');
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    const text = document.getElementById('resultText').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = (window.VOICE_TAGS && window.VOICE_TAGS[targetLang.value]) || 'en-US';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
}

// ===== Speech-to-text =====
const micBtn = document.getElementById('micBtn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (micBtn && SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = false;

  micBtn.addEventListener('click', () => {
    if (sourceLang.value === 'auto') { showToast('Pick a specific language before speaking 🎤'); return; }
    recognition.lang = window.VOICE_TAGS[sourceLang.value];
    recognition.start();
    micBtn.classList.add('listening');
  });
  recognition.addEventListener('result', (e) => {
    sourceText.value += (sourceText.value ? ' ' : '') + e.results[0][0].transcript;
    sourceText.dispatchEvent(new Event('input'));
  });
  recognition.addEventListener('end', () => micBtn.classList.remove('listening'));
  recognition.addEventListener('error', () => micBtn.classList.remove('listening'));
} else if (micBtn) {
  micBtn.style.display = 'none';
}

// ===== Typing animation for result =====
const resultText = document.getElementById('resultText');
if (resultText) {
  const fullText = resultText.textContent.trim();
  resultText.textContent = '';
  let i = 0;
  function typeChar() {
    if (i < fullText.length) {
      resultText.textContent += fullText[i];
      i++;
      setTimeout(typeChar, 12);
    }
  }
  typeChar();
}

// ===== 3D tilt effect on card =====
const container = document.querySelector('.container');
if (container) {
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 4;
    const rotateY = (x / rect.width) * 4;
    container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  container.addEventListener('mouseleave', () => {
    container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

// ===== Confetti (first translation only) =====
function fireConfetti() {
  const colors = ['#667eea', '#764ba2', '#ff9a9e', '#a1c4fd', '#fbc2eb'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.top = '-10px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.borderRadius = '50%';
    el.style.zIndex = 2000;
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    const fall = el.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration: 2000 + Math.random() * 1500, easing: 'ease-in' });
    fall.onfinish = () => el.remove();
  }
}

if (resultText && !localStorage.getItem('firstTranslateDone')) {
  fireConfetti();
  localStorage.setItem('firstTranslateDone', 'true');
}

// ===== Session translation counter =====
const statsEl = document.getElementById('statsCount');
if (statsEl) {
  let count = parseInt(localStorage.getItem('translateCount') || '0');
  if (resultText) {
    count++;
    localStorage.setItem('translateCount', count);
  }
  statsEl.textContent = count;
}

// ===== Command palette (Ctrl+K) =====
const cmdkOverlay = document.getElementById('cmdkOverlay');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');

if (cmdkOverlay && targetLang) {
  const langOptions = Array.from(targetLang.options).map(o => ({ code: o.value, name: o.textContent }));

  function renderCmdkList(filter = '') {
    cmdkList.innerHTML = '';
    langOptions
      .filter(l => l.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(l => {
        const item = document.createElement('div');
        item.className = 'cmdk-item';
        item.textContent = l.name;
        item.addEventListener('click', () => {
          targetLang.value = l.code;
          closeCmdk();
          showToast(`Target set to ${l.name}`);
        });
        cmdkList.appendChild(item);
      });
  }

  function openCmdk() {
    cmdkOverlay.classList.add('show');
    cmdkInput.value = '';
    renderCmdkList();
    cmdkInput.focus();
  }
  function closeCmdk() { cmdkOverlay.classList.remove('show'); }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmdk();
    }
    if (e.key === 'Escape') closeCmdk();
  });
  cmdkOverlay.addEventListener('click', (e) => { if (e.target === cmdkOverlay) closeCmdk(); });
  cmdkInput.addEventListener('input', () => renderCmdkList(cmdkInput.value));
}

// ===== Translation history =====
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyOverlay = document.getElementById('historyOverlay');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');

function getHistory() {
  return JSON.parse(localStorage.getItem('translationHistory') || '[]');
}

function saveToHistory(entry) {
  let history = getHistory();
  history.unshift(entry);
  history = history.slice(0, 10);
  localStorage.setItem('translationHistory', JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No translations yet</div>';
    return;
  }
  history.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<div class="h-source">${entry.source}</div><div class="h-translated">${entry.translated}</div>`;
    item.addEventListener('click', () => {
      if (sourceText) {
        sourceText.value = entry.source;
        sourceText.dispatchEvent(new Event('input'));
      }
      if (sourceLang) sourceLang.value = entry.sourceLang;
      if (targetLang) targetLang.value = entry.targetLang;
      historyPanel.classList.remove('show');
      historyOverlay.classList.remove('show');
    });
    historyList.appendChild(item);
  });
}

if (historyToggle) {
  historyToggle.addEventListener('click', () => {
    renderHistory();
    historyPanel.classList.add('show');
    historyOverlay.classList.add('show');
  });
  closeHistory.addEventListener('click', () => {
    historyPanel.classList.remove('show');
    historyOverlay.classList.remove('show');
  });
  historyOverlay.addEventListener('click', () => {
    historyPanel.classList.remove('show');
    historyOverlay.classList.remove('show');
  });
}

if (window.CURRENT_TRANSLATION && window.CURRENT_TRANSLATION.translated) {
  saveToHistory(window.CURRENT_TRANSLATION);
}