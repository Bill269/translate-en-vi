(() => {
  /* ===== STATE ===== */
  const state = {
    srcLang: 'auto',
    dstLang: 'vi',
    detectedSrc: null,
    history: JSON.parse(localStorage.getItem('trans_history') || '[]'),
    theme: localStorage.getItem('theme') || 'dark',
    uiLang: localStorage.getItem('uiLang') || 'vi',
    debounceTimer: null,
    isTranslating: false,
    abortController: null,
  };

  /* ===== I18N ===== */
const I18N = {
    vi: {
      uiLangAria: 'Đổi ngôn ngữ giao diện',
      themeAria: 'Chuyển theme',
      historyAria: 'Lịch sử dịch',
      historyBtn: 'Lịch sử dịch',
      historyTitle: 'Lịch sử dịch',
      clearHistory: 'Xóa tất cả',
      historyEmpty: 'Chưa có lịch sử dịch',
      srcLabel: 'Ngôn ngữ nguồn',
      dstLabel: 'Kết quả dịch',
      srcPh: 'Nhập hoặc dán văn bản tiếng Anh...',
      dstPh: 'Kết quả dịch sẽ hiện tại đây...',
      srcAria: 'Văn bản nguồn',
      dstAria: 'Văn bản đích',
      paste: 'Dán',
      file: 'File',
      speak: 'Phát âm',
      copy: 'Sao chép',
      pasteAria: 'Dán từ clipboard',
      fileAria: 'Mở file .txt',
      speakSrcAria: 'Phát âm văn bản nguồn',
      copySrcAria: 'Sao chép văn bản nguồn',
      speakDstAria: 'Phát âm kết quả',
      copyDstAria: 'Sao chép kết quả',
      swapAria: 'Đổi chiều (Ctrl+Shift+S)',
      footer: 'Google Translate bản Việt — một trang, không rườm rà',
      autoDetect: 'Tự động phát hiện',
      auto: 'Tự động',
      deleteItem: 'Xóa mục này',
      confirmClearHistory: 'Xóa toàn bộ lịch sử?',
      loadedHistory: 'Đã nạp từ lịch sử',
      deletedItem: 'Đã xóa mục lịch sử',
      clearedHistory: 'Đã xóa lịch sử',
      errPrefix: 'Lỗi dịch: ',
      bothFail: 'Cả hai dịch vụ đều thất bại',
      swapped: 'Đã đổi chiều',
      copied: 'Đã sao chép',
      copyFail: 'Không thể sao chép',
      pasted: 'Đã dán từ clipboard',
      pasteFail: 'Không thể dán (cần quyền clipboard)',
      txtOnly: 'Chỉ hỗ trợ file .txt',
      fileLoaded: 'Đã tải file',
      noSpeech: 'Trình duyệt không hỗ trợ phát âm',
      copySrc: 'nguồn',
      copyDst: 'kết quả',
      aiChat: 'Hỏi AI',
      aiChatAria: 'Hỏi AI về từ/câu đang dịch',
      aiTitle: 'AI Chat',
      aiClear: 'Xóa hội thoại',
      aiCloseAria: 'Đóng khung chat',
      aiContextLabel: 'Ngữ cảnh:',
      aiContextRemoveAria: 'Xóa ngữ cảnh',
      aiEmpty: 'Hỏi AI về cách dùng, ví dụ, ngữ pháp của từ/câu đang dịch...',
      aiPh: 'Nhập câu hỏi...',
      aiInputAria: 'Câu hỏi cho AI',
      aiSend: 'Gửi',
      aiThinking: 'Đang soạn...',
      aiFail: 'Không gọi được AI: ',
      aiBusy: 'AI đang quá tải, thử lại sau ít phút',
      aiCleared: 'Đã xóa hội thoại',
      aiContextMsg: (src, dst) => `Giải thích từ/câu này:\nNguồn: ${src}\nDịch: ${dst}\n\nCho mình nghĩa, cách dùng và 2-3 ví dụ câu tiếng Anh.`,
      aiSystem: 'Bạn là thầy dạy tiếng Anh cho người Việt. Luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện, có ví dụ cụ thể. Dùng **đậm** để nhấn mạnh và xuống dòng hợp lý.',
    },
    en: {
      uiLangAria: 'Switch UI language',
      themeAria: 'Toggle theme',
      historyAria: 'Translation history',
      historyBtn: 'History',
      historyTitle: 'Translation history',
      clearHistory: 'Clear all',
      historyEmpty: 'No translation history yet',
      srcLabel: 'Source language',
      dstLabel: 'Translation result',
      srcPh: 'Enter or paste English text...',
      dstPh: 'Translation will appear here...',
      srcAria: 'Source text',
      dstAria: 'Translated text',
      paste: 'Paste',
      file: 'File',
      speak: 'Speak',
      copy: 'Copy',
      pasteAria: 'Paste from clipboard',
      fileAria: 'Open .txt file',
      speakSrcAria: 'Speak source text',
      copySrcAria: 'Copy source text',
      speakDstAria: 'Speak translation',
      copyDstAria: 'Copy translation',
      swapAria: 'Swap languages (Ctrl+Shift+S)',
      footer: 'This is Google Translate, Vietnamese edition — one page, no fluff',
      autoDetect: 'Auto-detect',
      auto: 'Auto',
      deleteItem: 'Delete this item',
      confirmClearHistory: 'Delete all history?',
      loadedHistory: 'Loaded from history',
      deletedItem: 'History item deleted',
      clearedHistory: 'History cleared',
      errPrefix: 'Translation error: ',
      bothFail: 'Both translation services failed',
      swapped: 'Swapped',
      copied: 'Copied',
      copyFail: 'Could not copy',
      pasted: 'Pasted from clipboard',
      pasteFail: 'Could not paste (clipboard permission needed)',
      txtOnly: 'Only .txt files are supported',
      fileLoaded: 'File loaded',
      noSpeech: 'Your browser does not support speech synthesis',
      copySrc: 'source',
      copyDst: 'result',
      aiChat: 'Ask AI',
      aiChatAria: 'Ask AI about the current text',
      aiTitle: 'AI Chat',
      aiClear: 'Clear chat',
      aiCloseAria: 'Close chat',
      aiContextLabel: 'Context:',
      aiContextRemoveAria: 'Remove context',
      aiEmpty: 'Ask AI about usage, examples or grammar of the current text...',
      aiPh: 'Type a question...',
      aiInputAria: 'Question for AI',
      aiSend: 'Send',
      aiThinking: 'Typing...',
      aiFail: 'Could not reach AI: ',
      aiBusy: 'The AI is busy right now, please try again in a few minutes',
      aiCleared: 'Chat cleared',
      aiContextMsg: (src, dst) => `Explain this word/phrase:\nSource: ${src}\nTranslation: ${dst}\n\nGive me the meaning, usage and 2-3 English example sentences.`,
      aiSystem: 'You are an English teacher for Vietnamese learners. Always answer in English, keep it concise and friendly, with concrete examples. Use **bold** for emphasis and line breaks.',
    },
  };
  const t = (key) => I18N[state.uiLang][key] || I18N.vi[key] || key;
  const numLocale = () => (state.uiLang === 'en' ? 'en-US' : 'vi-VN');

  /* ===== DOM ELEMENTS ===== */
  const els = {
    srcText: document.getElementById('srcText'),
    dstText: document.getElementById('dstText'),
    srcCount: document.getElementById('srcCount'),
    dstCount: document.getElementById('dstCount'),
    srcLangBadge: document.getElementById('srcLangBadge'),
    dstLangBadge: document.getElementById('dstLangBadge'),
    swapBtn: document.getElementById('swapBtn'),
    copySrcBtn: document.getElementById('copySrcBtn'),
    copyDstBtn: document.getElementById('copyDstBtn'),
    speakSrcBtn: document.getElementById('speakSrcBtn'),
    speakDstBtn: document.getElementById('speakDstBtn'),
    pasteBtn: document.getElementById('pasteBtn'),
    fileBtn: document.getElementById('fileBtn'),
    fileInput: document.getElementById('fileInput'),
    historyBtn: document.getElementById('historyBtn'),
    historyDropdown: document.getElementById('historyDropdown'),
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),
    themeToggle: document.getElementById('themeToggle'),
    uiLangToggle: document.getElementById('uiLangToggle'),
    uiLangLabel: document.getElementById('uiLangLabel'),
    toastContainer: document.getElementById('toastContainer'),
    aiChatBtn: document.getElementById('aiChatBtn'),
    aiPopup: document.getElementById('aiPopup'),
    aiClearBtn: document.getElementById('aiClearBtn'),
    aiCloseBtn: document.getElementById('aiCloseBtn'),
    aiContext: document.getElementById('aiContext'),
    aiContextSrc: document.getElementById('aiContextSrc'),
    aiContextDst: document.getElementById('aiContextDst'),
    aiContextRemove: document.getElementById('aiContextRemove'),
    aiMessages: document.getElementById('aiMessages'),
    aiEmpty: document.getElementById('aiEmpty'),
    aiForm: document.getElementById('aiForm'),
    aiInput: document.getElementById('aiInput'),
    aiSendBtn: document.getElementById('aiSendBtn'),
  };

  /* ===== UTILITIES ===== */
  const showToast = (message, type = 'info', duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        ${type === 'success' ? '<path d="M20 6L9 17l-5-5"/>' : type === 'error' ? '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'}
      </svg>
      <span class="toast-message">${message}</span>
    `;
    els.toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); toast.addEventListener('animationend', () => toast.remove()); }, duration);
  };

  const setCharCount = (textarea, counter) => {
    const len = textarea.value.length;
    counter.textContent = `${len.toLocaleString(numLocale())} / ${(5000).toLocaleString(numLocale())}`;
    counter.style.color = len > 5000 ? 'var(--danger)' : len > 4500 ? 'var(--danger)' : 'var(--text-muted)';
  };

  const speak = (text, lang) => {
    if (!('speechSynthesis' in window)) { showToast(t('noSpeech'), 'error'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    utter.rate = 1; utter.pitch = 1; utter.volume = 1;
    window.speechSynthesis.speak(utter);
  };

  const escapeHtml = (str) => str.replace(/[&<>"']/g, c => {
    const map = {"&":"&","<":"<",">":">","\"":"\"","'":"'"};
    return map[c];
  });
const formatTime = (ts) => new Date(ts).toLocaleTimeString(numLocale(), { hour: '2-digit', minute: '2-digit' });

  const LANG_NAMES = { auto: 'Auto-detect', en: 'English', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', th: 'Thai', ru: 'Russian', fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', es: 'Spanish', pt: 'Portuguese', it: 'Italian', ar: 'Arabic', hi: 'Hindi', tr: 'Turkish', nl: 'Dutch' };

  const LANG_NAMES_LOCALIZED = {
    vi: { auto: 'Tự động phát hiện', en: 'English', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', th: 'Thai', ru: 'Russian', fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', es: 'Spanish', pt: 'Portuguese', it: 'Italian', ar: 'Arabic', hi: 'Hindi', tr: 'Turkish', nl: 'Dutch' },
    en: { auto: 'Auto-detect', en: 'English', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', th: 'Thai', ru: 'Russian', fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', es: 'Spanish', pt: 'Portuguese', it: 'Italian', ar: 'Arabic', hi: 'Hindi', tr: 'Turkish', nl: 'Dutch' },
  };

  const langName = (code) => (LANG_NAMES_LOCALIZED[state.uiLang] || LANG_NAMES_LOCALIZED.vi)[code] || LANG_NAMES[code] || code.toUpperCase();

  const updateBadges = () => {
    els.srcLangBadge.classList.toggle('auto', state.srcLang === 'auto');
    if (state.srcLang === 'auto') {
      const det = state.detectedSrc;
      els.srcLangBadge.textContent = det && det !== 'auto' && LANG_NAMES[det]
        ? `${t('autoDetect')}: ${langName(det)}`
        : t('autoDetect');
    } else {
      els.srcLangBadge.textContent = langName(state.srcLang) || t('autoDetect');
    }
    els.dstLangBadge.textContent = langName(state.dstLang) || langName('vi');
  };

  const applyI18n = () => {
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const v = t(el.dataset.i18nAria);
      el.setAttribute('aria-label', v);
      el.title = v;
    });
    els.uiLangLabel.textContent = state.uiLang.toUpperCase();
    document.documentElement.lang = state.uiLang;
    renderHistory();
    updateBadges();
    setCharCount(els.srcText, els.srcCount);
    setCharCount(els.dstText, els.dstCount);
  };

  /* ===== THEME ===== */
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
  applyTheme(state.theme);
  els.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
  });
  els.uiLangToggle.addEventListener('click', () => {
    state.uiLang = state.uiLang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('uiLang', state.uiLang);
    applyI18n();
  });

  /* ===== HISTORY ===== */
  const saveHistory = (src, dst, dir) => {
    const item = { src, dst, dir, time: Date.now() };
    state.history.unshift(item);
    if (state.history.length > 100) state.history.pop();
    localStorage.setItem('trans_history', JSON.stringify(state.history));
    renderHistory();
  };

  const renderHistory = () => {
    if (state.history.length === 0) {
      els.historyList.innerHTML = `<div class="history-empty">${t('historyEmpty')}</div>`;
      return;
    }
    els.historyList.innerHTML = state.history.map((item, idx) => `
      <div class="history-item" data-index="${idx}" role="menuitem" tabindex="0">
        <div class="history-text">
          <span class="src">${escapeHtml(item.src)}</span>
          <span class="dst">${item.dir.endsWith('-vi') ? '→' : '←'} ${escapeHtml(item.dst)}</span>
        </div>
        <div class="history-meta">
          <span class="history-time">${formatTime(item.time)}</span>
          <button class="history-delete" data-index="${idx}" aria-label="${t('deleteItem')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  };

  els.historyList.addEventListener('click', (e) => {
    const item = e.target.closest('.history-item');
    const del = e.target.closest('.history-delete');
    if (del) { e.stopPropagation(); deleteHistoryItem(+del.dataset.index); return; }
    if (item) loadHistoryItem(+item.dataset.index);
  });

  const loadHistoryItem = (idx) => {
    const item = state.history[idx];
    if (!item) return;
    els.srcText.value = item.src;
    els.dstText.value = item.dst;
    setCharCount(els.srcText, els.srcCount);
    setCharCount(els.dstText, els.dstCount);
    closeHistory();
    showToast(t('loadedHistory'), 'success');
  };

  const deleteHistoryItem = (idx) => {
    state.history.splice(idx, 1);
    localStorage.setItem('trans_history', JSON.stringify(state.history));
    renderHistory();
    showToast(t('deletedItem'), 'success');
  };

  els.clearHistory.addEventListener('click', () => {
    if (confirm(t('confirmClearHistory'))) {
      state.history = [];
      localStorage.removeItem('trans_history');
      renderHistory();
      showToast(t('clearedHistory'), 'success');
    }
  });

  /* ===== HISTORY DROPDOWN ===== */
  const toggleHistory = () => {
    const open = els.historyDropdown.classList.toggle('open');
    els.historyBtn.setAttribute('aria-expanded', open);
  };
  const closeHistory = () => { els.historyDropdown.classList.remove('open'); els.historyBtn.setAttribute('aria-expanded', 'false'); };
  els.historyBtn.addEventListener('click', toggleHistory);
  document.addEventListener('click', (e) => { if (!e.target.closest('.history-trigger')) closeHistory(); });

  /* ===== AI CHAT (Gemini) ===== */
  const GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemini-3.7-flash'];
  // Gọi serverless function /api/chat — API key nằm ở env của Vercel, không còn ở client.
  // Mở file:// (double-click index.html) thì gọi thẳng production.
  const CHAT_ENDPOINT = location.protocol === 'file:'
    ? 'https://translate-en-vi.vercel.app/api/chat'
    : '/api/chat';
  const AI_HISTORY_LIMIT = 20;

  const ai = {
    messages: JSON.parse(localStorage.getItem('ai_chat') || '[]'),
    abort: null,
    busy: false,
    context: { src: '', dst: '' },
  };

  const saveAiChat = () => localStorage.setItem('ai_chat', JSON.stringify(ai.messages.slice(-AI_HISTORY_LIMIT)));

  const escapeHtmlAi = (str) => escapeHtml(str);

  const renderAiText = (str) => escapeHtmlAi(str)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');

  const renderAiMessages = () => {
    els.aiMessages.innerHTML = '';
    if (ai.messages.length === 0) {
      els.aiMessages.appendChild(els.aiEmpty);
      els.aiEmpty.hidden = false;
      return;
    }
    for (const m of ai.messages) {
      const row = document.createElement('div');
      row.className = `ai-msg ${m.role === 'user' ? 'user' : 'ai'}`;
      const bubble = document.createElement('div');
      bubble.className = 'ai-bubble';
      bubble.innerHTML = renderAiText(m.text);
      row.appendChild(bubble);
      els.aiMessages.appendChild(row);
    }
    els.aiMessages.scrollTop = els.aiMessages.scrollHeight;
  };

  const setAiContextChip = () => {
    const { src, dst } = ai.context;
    if (src || dst) {
      els.aiContext.hidden = false;
      els.aiContextSrc.textContent = src;
      els.aiContextDst.textContent = dst;
    } else {
      els.aiContext.hidden = true;
    }
  };

  const aiSystemInstruction = () => {
    let sys = t('aiSystem');
    if (ai.context.src || ai.context.dst) {
      sys += `\n\n${t('aiContextLabel')} ${ai.context.src} → ${ai.context.dst}`;
    }
    return sys;
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Gọi Gemini với model chain + exponential backoff; buildBody trả về body JSON cho mỗi lần thử
  const callGemini = async (buildBody, { signal: outerSignal, emptyMsg } = {}) => {
    let lastErr = null;
    for (const model of GEMINI_MODELS) {
      for (let attempt = 0; ; attempt++) {
        try {
          // timeout 30s/request — model treo bị cắt, không chặn failover
          const timeoutSignal = AbortSignal.timeout(30000);
          const signal = outerSignal && AbortSignal.any
            ? AbortSignal.any([outerSignal, timeoutSignal])
            : timeoutSignal;
          const res = await fetch(`${CHAT_ENDPOINT}?model=${encodeURIComponent(model)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal,
            body: JSON.stringify(buildBody()),
          });
          if (!res.ok) {
            let msg = `HTTP ${res.status}`;
            try { msg = (await res.json()).error?.message || msg; } catch {}
            const err = new Error(msg);
            err.retryable = res.status === 429 || res.status >= 500;
            throw err;
          }
          const data = await res.json();
          const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text).join('');
          if (!text) { const e = new Error('empty'); e.empty = true; throw e; }
          return text;
        } catch (err) {
          if (err.name === 'AbortError') throw err; // user chủ động hủy
          if (err.empty) throw new Error(emptyMsg || 'empty response');
          if (err.name === 'TimeoutError') err.retryable = true; // model treo 30s → thử model khác
          lastErr = err;
          if (!err.retryable || attempt >= 1) break; // 1 lần/model → failover nhanh
          await sleep(2000);
        }
      }
    }
    console.warn('All Gemini models failed:', lastErr);
    throw new Error(t('aiBusy'));
  };

  const askGemini = async () => {
    ai.abort = new AbortController();
    const contents = ai.messages.slice(-AI_HISTORY_LIMIT).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
    return callGemini(() => ({
      system_instruction: { parts: [{ text: aiSystemInstruction() }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }), { signal: ai.abort.signal });
  };

  const showAiTyping = () => {
    const row = document.createElement('div');
    row.className = 'ai-msg ai typing';
    row.id = 'aiTyping';
    row.innerHTML = `<div class="ai-bubble"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div>`;
    els.aiMessages.appendChild(row);
    els.aiMessages.scrollTop = els.aiMessages.scrollHeight;
  };
  const hideAiTyping = () => document.getElementById('aiTyping')?.remove();

  const sendToAi = async (text) => {
    if (ai.busy || !text.trim()) return;
    ai.busy = true;
    els.aiSendBtn.disabled = true;
    ai.messages.push({ role: 'user', text: text.trim() });
    saveAiChat();
    renderAiMessages();
    showAiTyping();
    try {
      const reply = await askGemini();
      ai.messages.push({ role: 'ai', text: reply });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        showToast(t('aiFail') + err.message, 'error');
      }
    } finally {
      hideAiTyping();
      saveAiChat();
      renderAiMessages();
      ai.busy = false;
      els.aiSendBtn.disabled = false;
      els.aiInput.focus();
    }
  };

  const openAiPopup = () => {
    const src = els.srcText.value.trim();
    const dst = els.dstText.value.trim();
    if (src || dst) ai.context = { src, dst };
    setAiContextChip();
    renderAiMessages();
    els.aiPopup.hidden = false;
    requestAnimationFrame(() => els.aiPopup.classList.add('open'));

    // điền gợi ý vào ô nhập (không tự gửi): hội thoại trống + chưa có text trong ô
    const ctxText = (src || dst) ? t('aiContextMsg')(ai.context.src, ai.context.dst) : '';
    if (ctxText && ai.messages.length === 0 && !els.aiInput.value.trim()) {
      els.aiInput.value = ctxText;
      els.aiInput.dispatchEvent(new Event('input'));
    }
    els.aiInput.focus();
  };

  const closeAiPopup = () => {
    els.aiPopup.classList.remove('open');
    if (ai.abort) ai.abort.abort();
    setTimeout(() => { els.aiPopup.hidden = true; }, 250);
  };

  els.aiChatBtn.addEventListener('click', () => (els.aiPopup.hidden ? openAiPopup() : closeAiPopup()));
  els.aiCloseBtn.addEventListener('click', closeAiPopup);
  els.aiPopup.addEventListener('click', (e) => { if (e.target === els.aiPopup) closeAiPopup(); });

  els.aiClearBtn.addEventListener('click', () => {
    ai.messages = [];
    saveAiChat();
    renderAiMessages();
    showToast(t('aiCleared'), 'success');
  });

  els.aiContextRemove.addEventListener('click', () => {
    ai.context = { src: '', dst: '' };
    setAiContextChip();
  });

  els.aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.aiInput.value;
    els.aiInput.value = '';
    els.aiInput.style.height = 'auto';
    sendToAi(text);
  });

  els.aiInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); els.aiForm.requestSubmit(); }
  });
  els.aiInput.addEventListener('input', () => {
    els.aiInput.style.height = 'auto';
    els.aiInput.style.height = Math.min(els.aiInput.scrollHeight, 120) + 'px';
  });


  /* ===== TRANSLATION API ===== */
  const GOOGLE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
  const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';

  const buildGoogleUrl = (text, sl, tl) => `${GOOGLE_ENDPOINT}?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  const translateGoogle = async (text, sl, tl) => {
    const url = buildGoogleUrl(text, sl, tl);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translated = data[0]?.map(d => d[0]).join('') || '';
    let detected = sl;
    if (typeof data[2] === 'string') detected = data[2];
    else if (data[8]?.[0]?.[0]) detected = data[8][0][0];
    return { translated, detected };
  };

  const VIET_CHARS = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
  const CYRILLIC_CHARS = /[Ѐ-ӿ]/;
  const guessLang = (text, tl) => {
    if (VIET_CHARS.test(text)) return 'vi';
    if (CYRILLIC_CHARS.test(text)) return 'ru';
    // không dấu & không Cyrillic → giả định trái chiều với đích (đích vi → nguồn en, và ngược lại)
    return tl === 'vi' ? 'en' : 'vi';
  };

  const translateMyMemory = async (text, sl, tl) => {
    const src = sl === 'auto' ? guessLang(text, tl) : sl;
    if (src === tl) return { translated: text, detected: src };
    const langpair = `${src}|${tl}`;
    const url = `${MYMEMORY_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const translated = data.responseData?.translatedText || '';
    const details = String(data.responseDetails || '');
    if (!translated || /^'/i.test(translated) || /INVALID|LANGUAGE PAIR|MYMEMORY WARNING|LIMIT/i.test(details)) {
      throw new Error(details || 'MyMemory: empty response');
    }
    return { translated, detected: src };
  };

  const chunkText = (text, maxLen = 4800) => {
    if (text.length <= maxLen) return [text];
    const chunks = [];
    let current = '';
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    for (const s of sentences) {
      if ((current + s).length > maxLen) {
        if (current) chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current) chunks.push(current.trim());
    return chunks;
  };

  const translateWithFallback = async (text, sl, tl) => {
    try {
      return await translateGoogle(text, sl, tl);
    } catch (e) {
      console.warn('Google failed, trying MyMemory', e);
      try {
        return await translateMyMemory(text, sl, tl);
      } catch (e2) {
        console.error('MyMemory failed', e2);
        throw new Error(t('bothFail'));
      }
    }
  };

  const doTranslate = async (isRetry = false) => {
    const text = els.srcText.value.trim();
    if (!text) { els.dstText.value = ''; setCharCount(els.dstText, els.dstCount); return; }
    if (state.isTranslating) return;

    state.isTranslating = true;
    let flipTo = null;

    try {
      const chunks = chunkText(text);
      let fullResult = '';

      for (let i = 0; i < chunks.length; i++) {
        const { translated, detected } = await translateWithFallback(chunks[i], state.srcLang, state.dstLang);
        if (i === 0) {
          if (state.srcLang === 'auto' && detected && detected !== 'auto') state.detectedSrc = detected;
          // auto-detect trúng ngôn ngữ đích → tự đảo chiều (vd: gõ vi, đích vi → dịch vi→en)
          if (!isRetry && state.srcLang === 'auto' && state.detectedSrc === state.dstLang) {
            flipTo = state.dstLang === 'vi' ? 'en' : 'vi';
            break;
          }
        }
        fullResult += (i > 0 ? ' ' : '') + translated;
      }

      if (flipTo) {
        state.dstLang = flipTo;
        updateBadges();
      } else {
        els.dstText.value = fullResult;
        setCharCount(els.dstText, els.dstCount);
        updateBadges();
        saveHistory(text, fullResult, `${state.srcLang}-${state.dstLang}`);
      }
    } catch (err) {
      console.error(err);
      showToast(t('errPrefix') + err.message, 'error');
    } finally {
      state.isTranslating = false;
    }

    if (flipTo) await doTranslate(true);
  };

  /* ===== EVENT HANDLERS ===== */
  // Auto-translate on input (debounced); clearing source clears result too
  els.srcText.addEventListener('input', () => {
    setCharCount(els.srcText, els.srcCount);
    clearTimeout(state.debounceTimer);
    if (!els.srcText.value.trim()) {
      els.dstText.value = '';
      setCharCount(els.dstText, els.dstCount);
      state.detectedSrc = null;
      updateBadges();
      return;
    }
    state.debounceTimer = setTimeout(() => doTranslate(), 600);
  });

  // Swap languages
  els.swapBtn.addEventListener('click', () => {
    const srcVal = els.srcText.value;
    const dstVal = els.dstText.value;
    els.srcText.value = dstVal;
    els.dstText.value = srcVal;
    setCharCount(els.srcText, els.srcCount);
    setCharCount(els.dstText, els.dstCount);

    const newDst = state.dstLang === 'vi' ? 'en' : 'vi';
    state.srcLang = 'auto';
    state.dstLang = newDst;
    state.detectedSrc = null;
    updateBadges();

    if (els.srcText.value.trim()) doTranslate();
    showToast(t('swapped'), 'info');
  });

  // Copy
  const copyToClipboard = async (text, label) => {
    try { await navigator.clipboard.writeText(text); showToast(`${t('copied')} ${label}`, 'success'); }
    catch { showToast(t('copyFail'), 'error'); }
  };
  els.copySrcBtn.addEventListener('click', () => copyToClipboard(els.srcText.value, t('copySrc')));
  els.copyDstBtn.addEventListener('click', () => copyToClipboard(els.dstText.value, t('copyDst')));

  // Speak
  els.speakSrcBtn.addEventListener('click', () => speak(els.srcText.value, state.detectedSrc || 'en'));
  els.speakDstBtn.addEventListener('click', () => speak(els.dstText.value, state.dstLang));

  // Paste
  els.pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      els.srcText.value = text;
      setCharCount(els.srcText, els.srcCount);
      els.srcText.dispatchEvent(new Event('input'));
      showToast(t('pasted'), 'success');
    } catch { showToast(t('pasteFail'), 'error'); }
  });

  // File input
  els.fileBtn.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt')) { showToast(t('txtOnly'), 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      els.srcText.value = reader.result;
      setCharCount(els.srcText, els.srcCount);
      els.srcText.dispatchEvent(new Event('input'));
      showToast(t('fileLoaded'), 'success');
    };
    reader.readAsText(file);
    els.fileInput.value = '';
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doTranslate(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') { e.preventDefault(); els.swapBtn.click(); }
    if (e.key === 'Escape') { closeHistory(); if (!els.aiPopup.hidden) closeAiPopup(); }
  });

  // Initial render (counts, badges, history, i18n strings)
  applyI18n();
})();
