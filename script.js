 
        /* ════════════════════════════════════════
           UTILITIES
        ════════════════════════════════════════ */
        function switchTab(id) {
            document.querySelectorAll('.tab').forEach((t, i) => t.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + id).classList.add('active');
            event.target.classList.add('active');
        }

        /* ════════════════════════════════════════
           TAB 1 – PASSWORD ANALYZER
        ════════════════════════════════════════ */
        const COMMON = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'master', 'sunshine', 'princess', 'football', 'abc123', 'password1', 'iloveyou', 'login', 'passw0rd', 'superman', 'batman'];

        function analyzePassword() {
            const pw = document.getElementById('pwInput').value;
            const len = pw.length;
            // Character pool size
            let pool = 0;
            if (/[a-z]/.test(pw)) pool += 26;
            if (/[A-Z]/.test(pw)) pool += 26;
            if (/[0-9]/.test(pw)) pool += 10;
            if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
            // Entropy
            const entropy = pool > 0 ? Math.floor(len * Math.log2(pool)) : 0;
            // Score 0-100
            let score = 0;
            if (len >= 8) score += 10;
            if (len >= 12) score += 15;
            if (len >= 16) score += 15;
            if (/[a-z]/.test(pw)) score += 10;
            if (/[A-Z]/.test(pw)) score += 10;
            if (/[0-9]/.test(pw)) score += 10;
            if (/[^a-zA-Z0-9]/.test(pw)) score += 15;
            if (entropy > 50) score += 10;
            if (entropy > 70) score += 5;
            const isCommon = COMMON.includes(pw.toLowerCase());
            if (isCommon) score = Math.min(score, 10);
            score = Math.min(100, score);

            // Checks
            setCheck('chk-len', len >= 12);
            setCheck('chk-upper', /[A-Z]/.test(pw));
            setCheck('chk-lower', /[a-z]/.test(pw));
            setCheck('chk-num', /[0-9]/.test(pw));
            setCheck('chk-sym', /[^a-zA-Z0-9]/.test(pw));
            setCheck('chk-nocommon', !isCommon);

            // Strength label
            let label = '', color = '';
            if (!pw) { label = 'Enter a password'; color = 'var(--text2)' }
            else if (score < 25) { label = 'Very Weak 🚨'; color = 'var(--red)' }
            else if (score < 50) { label = 'Weak ⚠️'; color = 'var(--orange)' }
            else if (score < 70) { label = 'Fair 🟡'; color = 'var(--yellow)' }
            else if (score < 88) { label = 'Strong ✅'; color = 'var(--green)' }
            else { label = 'Very Strong 💪'; color = 'var(--green)' }

            document.getElementById('strengthLabel').textContent = label;
            document.getElementById('strengthLabel').style.color = color;
            document.getElementById('strengthBar').style.width = score + '%';
            document.getElementById('strengthBar').style.background = color;
            document.getElementById('scoreNum').textContent = score;
            document.getElementById('scoreNum').style.color = color;
            document.getElementById('entropyLabel').textContent = `Entropy: ${entropy} bits`;

            // Score ring
            const circ = 232;
            const offset = circ - (score / 100) * circ;
            const fg = document.getElementById('scoreCircle');
            fg.style.strokeDashoffset = offset;
            fg.style.stroke = color;

            // Crack times
            const combos = pool > 0 ? Math.pow(pool, len) : 0;
            document.getElementById('ct-online').textContent = fmtTime(combos / 100);
            document.getElementById('ct-slow').textContent = fmtTime(combos / 10000);
            document.getElementById('ct-fast').textContent = fmtTime(combos / 1e10);
            document.getElementById('ct-super').textContent = fmtTime(combos / 1e12);
        }

        function setCheck(id, pass) {
            const el = document.getElementById(id);
            el.className = 'check-item ' + (pass ? 'pass' : 'fail');
        }

        function fmtTime(secs) {
            if (!isFinite(secs) || secs <= 0) return '< 1 sec';
            if (secs < 1) return '< 1 sec';
            if (secs < 60) return secs.toFixed(1) + ' sec';
            if (secs < 3600) return (secs / 60).toFixed(1) + ' min';
            if (secs < 86400) return (secs / 3600).toFixed(1) + ' hrs';
            if (secs < 31536000) return (secs / 86400).toFixed(0) + ' days';
            if (secs < 3.15e9) return (secs / 31536000).toFixed(0) + ' years';
            if (secs < 3.15e12) return (secs / 31536000 / 1000).toFixed(0) + 'K years';
            if (secs < 3.15e15) return (secs / 31536000 / 1e6).toFixed(0) + 'M years';
            return '∞ (billions of years)';
        }

        function togglePwVis() {
            const inp = document.getElementById('pwInput');
            const btn = document.getElementById('showHideBtn');
            if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈' }
            else { inp.type = 'password'; btn.textContent = '👁' }
        }

        /* ════════════════════════════════════════
           TAB 2 – PASSWORD GENERATOR
        ════════════════════════════════════════ */
        const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', LOWER = 'abcdefghijklmnopqrstuvwxyz',
            NUMS = '0123456789', SYMS = '!@#$%^&*()-_=+[]{}|;:,.<>?',
            AMB = '0O1lI';

        function buildCharset() {
            let c = '';
            const noAmb = document.getElementById('genNoAmb').checked;
            if (document.getElementById('genUpper').checked) c += UPPER;
            if (document.getElementById('genLower').checked) c += LOWER;
            if (document.getElementById('genNum').checked) c += NUMS;
            if (document.getElementById('genSym').checked) c += SYMS;
            if (noAmb) c = [...c].filter(ch => !AMB.includes(ch)).join('');
            return c || LOWER;
        }

        function randPw(len, charset) {
            const arr = new Uint32Array(len);
            crypto.getRandomValues(arr);
            return [...arr].map(v => charset[v % charset.length]).join('');
        }

        function updateLenLabel() {
            const v = document.getElementById('genLen').value;
            document.getElementById('genLenVal').textContent = v;
        }

        function generatePassword() {
            const len = +document.getElementById('genLen').value;
            const cs = buildCharset();
            document.getElementById('genPw').textContent = randPw(len, cs);
            document.getElementById('multiPw').innerHTML = '';
        }

        function generateMultiple() {
            const len = +document.getElementById('genLen').value, cs = buildCharset();
            let html = '';
            for (let i = 0; i < 5; i++) {
                const pw = randPw(len, cs);
                html += `<div style="font-family:'Courier New',monospace;font-size:.88rem;padding:.5rem .8rem;margin:.3rem 0;background:var(--bg3);border-radius:.5rem;color:var(--green);word-break:break-all">${pw}</div>`;
            }
            document.getElementById('multiPw').innerHTML = html;
        }

        function copyPassword() {
            navigator.clipboard.writeText(document.getElementById('genPw').textContent);
            const b = document.querySelector('.copy-btn'); b.textContent = '✅ Copied!';
            setTimeout(() => b.textContent = '📋 Copy', 2000);
        }

        const WORDS = ['correct', 'horse', 'battery', 'staple', 'purple', 'monkey', 'cloud', 'river', 'maple', 'storm', 'castle', 'bridge', 'falcon', 'silver', 'dragon', 'thunder', 'crystal', 'shadow', 'forest', 'ocean'];
        function genPassphrase() {
            const arr = new Uint32Array(5);
            crypto.getRandomValues(arr);
            const ph = [...arr].map(v => WORDS[v % WORDS.length]).join('-');
            document.getElementById('passphrase').textContent = ph;
        }
        function copyPassphrase() {
            navigator.clipboard.writeText(document.getElementById('passphrase').textContent);
        }

        /* ════════════════════════════════════════
           TAB 3 – HASH TOOL (Web Crypto API)
        ════════════════════════════════════════ */
        let currentAlgo = 'sha256';

        function setHashAlgo(algo, el) {
            currentAlgo = algo;
            document.querySelectorAll('.hash-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            computeHash();
        }

        async function computeHash() {
            const txt = document.getElementById('hashInput').value;
            if (!txt) { document.getElementById('hashOutput').textContent = '—'; return; }
            let hex = '';
            if (currentAlgo === 'md5sim') {
                hex = simpleMD5sim(txt);
                document.getElementById('hashLen').textContent = `Output: ${hex.length} hex chars (128 bits) — ⚠️ MD5 is BROKEN, do not use for security`;
            } else {
                const algo = currentAlgo === 'sha1' ? 'SHA-1' : 'SHA-256';
                const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(txt));
                hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
                const bits = currentAlgo === 'sha1' ? 160 : 256;
                const warn = currentAlgo === 'sha1' ? ' — ⚠️ SHA-1 is WEAK' : '';
                document.getElementById('hashLen').textContent = `Output: ${hex.length} hex chars (${bits} bits)${warn}`;
            }
            document.getElementById('hashOutput').textContent = hex;
        }

        // Simplified (not real MD5, just for demo visuals)
        function simpleMD5sim(str) {
            let h = 0xdeadbeef ^ str.length;
            let h2 = 0x41c6ce57 ^ str.length;
            for (let i = 0; i < str.length; i++) {
                const c = str.charCodeAt(i);
                h = Math.imul(h ^ c, 2246822519);
                h2 = Math.imul(h2 ^ c, 3266489917);
            }
            h = Math.imul(h ^ (h >>> 16), 2246822519) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489917);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822519) ^ Math.imul(h ^ (h >>> 13), 3266489917);
            const a = (4294967296 * (h >>> 0)).toString(16).slice(1);
            const b = (4294967296 * (h2 >>> 0)).toString(16).slice(1);
            return (a + b + a.split('').reverse().join('') + b.split('').reverse().join('')).slice(0, 32);
        }

        async function compareHashes() {
            const a = document.getElementById('cmpA').value;
            const b = document.getElementById('cmpB').value;
            if (!a || !b) { document.getElementById('cmpResult').textContent = ''; return; }
            const enc = t => new TextEncoder().encode(t);
            const toHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
            const ha = toHex(await crypto.subtle.digest('SHA-256', enc(a)));
            const hb = toHex(await crypto.subtle.digest('SHA-256', enc(b)));
            const el = document.getElementById('cmpResult');
            if (ha === hb) { el.textContent = '✅ Hashes MATCH — identical content'; el.style.color = 'var(--green)' }
            else { el.textContent = '❌ Hashes DO NOT match — content differs'; el.style.color = 'var(--red)' }
        }

        /* ════════════════════════════════════════
           TAB 4 – PHISHING DETECTOR
        ════════════════════════════════════════ */
        function analyzeUrl() {
            const url = document.getElementById('urlInput').value.trim();
            if (!url) { document.getElementById('urlVerdict').innerHTML = ''; document.getElementById('urlFlags').innerHTML = ''; return; }
            const flags = [];
            let dangerScore = 0;
            // Checks
            if (!url.startsWith('https://')) { flags.push({ type: 'danger', icon: '🔓', msg: 'Not HTTPS – connection not encrypted' }); dangerScore += 30; }
            if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) { flags.push({ type: 'danger', icon: '🔢', msg: 'IP address used instead of domain name' }); dangerScore += 40; }
            const domain = (url.match(/(?:https?:\/\/)?([^\/]+)/) || [])[1] || '';
            const parts = domain.split('.');
            if (parts.length > 4) { flags.push({ type: 'danger', icon: '🔗', msg: `Excessive subdomains (${parts.length} parts)` }); dangerScore += 25; }
            if ((domain.match(/-/g) || []).length >= 2) { flags.push({ type: 'warn', icon: '➖', msg: 'Multiple hyphens in domain (common in phishing)' }); dangerScore += 20; }
            const badTlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.pw', '.cc', '.top', '.click', '.loan', '.win'];
            if (badTlds.some(t => url.includes(t))) { flags.push({ type: 'danger', icon: '🌐', msg: 'Suspicious TLD commonly used in phishing' }); dangerScore += 35; }
            const brandMisspell = ['paypa1', 'go0gle', 'faceb00k', 'amaz0n', 'netfl1x', 'app1e', 'micros0ft'];
            if (brandMisspell.some(b => url.toLowerCase().includes(b))) { flags.push({ type: 'danger', icon: '✍️', msg: 'Possible brand name misspelling detected' }); dangerScore += 50; }
            const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'rebrand.ly'];
            if (shorteners.some(s => url.includes(s))) { flags.push({ type: 'warn', icon: '🔀', msg: 'URL shortener hides real destination' }); dangerScore += 15; }
            if (url.length > 100) { flags.push({ type: 'warn', icon: '📏', msg: `Unusually long URL (${url.length} chars)` }); dangerScore += 10; }
            if (/login|verify|secure|account|update|confirm|banking|paypal|password/.test(url.toLowerCase()) && dangerScore > 20) {
                flags.push({ type: 'warn', icon: '🔑', msg: 'Sensitive keywords in URL (login/verify/account)' }); dangerScore += 10;
            }
            if (flags.length === 0) { flags.push({ type: 'safe', icon: '✅', msg: 'No obvious phishing indicators found' }); }

            // Verdict
            const verdictEl = document.getElementById('urlVerdict');
            if (dangerScore === 0) { verdictEl.innerHTML = `<div class="verdict-box safe">✅ Appears Safe — no red flags detected</div>`; }
            else if (dangerScore < 40) { verdictEl.innerHTML = `<div class="verdict-box warn">⚠️ Suspicious — exercise caution (risk score: ${dangerScore})</div>`; }
            else { verdictEl.innerHTML = `<div class="verdict-box danger">🚨 HIGH RISK — likely phishing URL (risk score: ${dangerScore})</div>`; }

            document.getElementById('urlFlags').innerHTML = flags.map(f =>
                `<div class="url-flag ${f.type}"><span class="flag-icon">${f.icon}</span><span>${f.msg}</span></div>`
            ).join('');
        }

        /* ════════════════════════════════════════
           TAB 5 – CAESAR CIPHER
        ════════════════════════════════════════ */
        function updateShift() { document.getElementById('shiftDisplay').textContent = document.getElementById('shiftVal').value; }

        function caesarShift(text, shift) {
            return text.split('').map(c => {
                if (/[a-z]/.test(c)) return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
                if (/[A-Z]/.test(c)) return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
                return c;
            }).join('');
        }

        function runCipher() {
            const txt = document.getElementById('cipherInput').value;
            const shift = +document.getElementById('shiftVal').value;
            const enc = caesarShift(txt, shift);
            const dec = caesarShift(enc, 26 - shift);
            document.getElementById('encryptOut').textContent = enc || '—';
            document.getElementById('decryptOut').textContent = dec || '—';
            document.getElementById('bruteOut').innerHTML = '';
        }

        function bruteForce() {
            const txt = document.getElementById('cipherInput').value;
            if (!txt) { return; }
            const enc = caesarShift(txt, +document.getElementById('shiftVal').value);
            let html = '<div style="font-size:.82rem;color:var(--text2);margin-bottom:.5rem">All 25 possible decryptions:</div>';
            for (let s = 1; s <= 25; s++) {
                const dec = caesarShift(enc, s);
                html += `<div style="display:flex;gap:1rem;padding:.35rem .6rem;background:var(--bg3);border-radius:.4rem;margin:.25rem 0;font-size:.8rem">
      <span style="color:var(--blue);min-width:3.5rem">Shift ${s}:</span>
      <span style="font-family:'Courier New',monospace;color:var(--text)">${dec}</span>
    </div>`;
            }
            document.getElementById('bruteOut').innerHTML = html;
        }

        /* ════════════════════════════════════════
           TAB 6 – QUIZ
        ════════════════════════════════════════ */
        const QUIZ = [
            { q: "What is the minimum recommended length for a strong password?", opts: ["6 characters", "8 characters", "12 characters", "16 characters"], ans: 2, exp: "Security experts recommend at least 12 characters. Longer is always better — aim for 16+ for sensitive accounts." },
            { q: "Which hashing algorithm is considered BROKEN and should NOT be used for security?", opts: ["SHA-256", "SHA-512", "MD5", "bcrypt"], ans: 2, exp: "MD5 is cryptographically broken. Collisions (two different inputs producing the same hash) can be generated quickly. Use SHA-256 or bcrypt for passwords." },
            { q: "What does HTTPS protect against?", opts: ["Malware downloads", "Eavesdropping and man-in-the-middle attacks", "Phishing websites", "SQL injection"], ans: 1, exp: "HTTPS encrypts data in transit using TLS, protecting against eavesdropping and tampering. It does NOT guarantee the website is legitimate or safe." },
            { q: "What is a 'salt' in password security?", opts: ["A type of encryption key", "Random data added to a password before hashing", "A brute-force attack method", "A type of firewall rule"], ans: 1, exp: "A salt is random data added to each password before hashing. This prevents rainbow table attacks where pre-computed hashes are used to crack passwords." },
            { q: "Which of the following is the MOST secure password?", opts: ["Password123!", "P@ssw0rd", "correct-horse-battery-staple-7X!", "MyDog2020"], ans: 2, exp: "Long passphrases with random words + symbols/numbers are both secure and memorable. Length is the single most important factor in password strength." },
            { q: "What type of attack tries every possible combination to crack a password?", opts: ["Phishing", "Dictionary attack", "Brute-force attack", "SQL injection"], ans: 2, exp: "A brute-force attack systematically tries every possible combination. This is why password length matters so much — each extra character exponentially increases the attack time." },
            { q: "What is two-factor authentication (2FA)?", opts: ["Using two different passwords", "Verifying identity using two separate factors", "Encrypting data twice", "Having two security questions"], ans: 1, exp: "2FA requires two different types of evidence: something you know (password) + something you have (phone/token) or something you are (biometrics). Even if your password is stolen, 2FA blocks attackers." },
            { q: "A legitimate bank email asks you to click a link and verify your account. What should you do?", opts: ["Click the link immediately", "Ignore it completely", "Go directly to the bank website by typing the URL", "Reply asking if it's real"], ans: 2, exp: "Always navigate directly to official websites rather than clicking email links. Phishing emails are designed to look identical to legitimate ones. When in doubt, call the institution directly." },
        ];

        let qIdx = 0, qScore = 0, answered = false;

        function renderQuiz() {
            if (qIdx >= QUIZ.length) {
                const pct = Math.round(qScore / QUIZ.length * 100);
                document.getElementById('quizContainer').innerHTML = `
      <div class="quiz-score-final">
        <div class="big">${qScore}/${QUIZ.length}</div>
        <div style="font-size:1.1rem;font-weight:700;margin:.5rem 0">${pct >= 80 ? '🏆 Excellent!' : pct >= 50 ? '👍 Good effort!' : '📚 Keep learning!'}</div>
        <div style="color:var(--text2);font-size:.9rem;margin-bottom:1.5rem">You scored ${pct}% on the cybersecurity quiz.</div>
        <button class="btn btn-primary" onclick="resetQuiz()">🔄 Restart Quiz</button>
      </div>`;
                return;
            }
            const q = QUIZ[qIdx];
            document.getElementById('quizContainer').innerHTML = `
    <div class="quiz-progress">Question ${qIdx + 1} of ${QUIZ.length} — Score: ${qScore}</div>
    <div class="quiz-q" style="margin-top:.8rem">${q.q}</div>
    <div class="quiz-opts">${q.opts.map((o, i) => `<button class="quiz-opt" id="opt${i}" onclick="answerQuiz(${i})">${o}</button>`).join('')}</div>
    <div class="quiz-exp" id="quizExp" style="display:none"></div>
    <div class="quiz-nav">
      <div></div>
      <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()" style="display:none">Next ➡</button>
    </div>`;
            answered = false;
        }

        function answerQuiz(i) {
            if (answered) return;
            answered = true;
            const q = QUIZ[qIdx];
            const opts = document.querySelectorAll('.quiz-opt');
            opts.forEach((o, idx) => {
                if (idx === q.ans) o.classList.add('correct');
                else if (idx === i && i !== q.ans) o.classList.add('wrong');
                o.style.pointerEvents = 'none';
            });
            if (i === q.ans) qScore++;
            const exp = document.getElementById('quizExp');
            exp.textContent = '💡 ' + q.exp;
            exp.style.display = 'block';
            document.getElementById('nextBtn').style.display = 'inline-flex';
        }

        function nextQuestion() { qIdx++; renderQuiz(); }
        function resetQuiz() { qIdx = 0; qScore = 0; renderQuiz(); }

        // Init
        generatePassword();
        renderQuiz();
  