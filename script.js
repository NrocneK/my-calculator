
/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const state = {
    expr: '',
    prevExpr: '',
    isDeg: true,
    isInv: false,
    afterCalc: false,
};

/* ═══════════════════════════════════════════════════════════
   VIEW ROUTER
═══════════════════════════════════════════════════════════ */
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'history') renderHistory();
}

/* ═══════════════════════════════════════════════════════════
   MENU
═══════════════════════════════════════════════════════════ */
function toggleMenu() { document.getElementById('menu-overlay').classList.toggle('open'); }
function closeMenu() { document.getElementById('menu-overlay').classList.remove('open'); }

/* ═══════════════════════════════════════════════════════════
   CALCULATOR ENGINE
═══════════════════════════════════════════════════════════ */
function factorial(n) {
    n = Math.floor(Math.abs(n));
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function evalExpr(raw, isDeg) {
    try {
        if (!raw) return '0';
        let e = raw
            .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.');

        e = e
            .replace(/asin\(/g, '__AS(').replace(/acos\(/g, '__AC(').replace(/atan\(/g, '__AT(')
            .replace(/sin\(/g, '__SN(').replace(/cos\(/g, '__CS(').replace(/tan\(/g, '__TN(')
            .replace(/log\(/g, '__LG(').replace(/ln\(/g, '__LN(').replace(/exp\(/g, '__XP(')
            .replace(/√\(/g, '__SQ(');

        e = e.replace(/(\d+\.?\d*)!/g, (_, n) => String(factorial(parseFloat(n))));
        e = e.replace(/\^/g, '**');
        e = e.replace(/π/g, String(Math.PI));
        e = e.replace(/\be\b/g, String(Math.E));

        const D = Math.PI / 180, R = 180 / Math.PI;
        const __SN = x => Math.sin(isDeg ? x * D : x);
        const __CS = x => Math.cos(isDeg ? x * D : x);
        const __TN = x => { const v = Math.tan(isDeg ? x * D : x); return Math.abs(v) > 1e14 ? Infinity : v; };
        const __AS = x => isDeg ? Math.asin(x) * R : Math.asin(x);
        const __AC = x => isDeg ? Math.acos(x) * R : Math.acos(x);
        const __AT = x => isDeg ? Math.atan(x) * R : Math.atan(x);
        const __LG = x => Math.log10(x);
        const __LN = x => Math.log(x);
        const __SQ = x => Math.sqrt(x);
        const __XP = x => Math.exp(x);

        // eslint-disable-next-line no-new-func
        const fn = new Function('__SN', '__CS', '__TN', '__AS', '__AC', '__AT', '__LG', '__LN', '__SQ', '__XP',
            `"use strict"; return (${e});`);
        const result = fn(__SN, __CS, __TN, __AS, __AC, __AT, __LG, __LN, __SQ, __XP);

        if (typeof result !== 'number' || isNaN(result)) return 'Lỗi';
        if (!isFinite(result)) return result > 0 ? '∞' : '-∞';

        const abs = Math.abs(result);
        if (abs === 0) return '0';
        if (abs < 0.0001 || abs >= 1e13)
            return parseFloat(result.toPrecision(8)).toExponential();
        return parseFloat(result.toPrecision(10)).toString();
    } catch { return 'Lỗi'; }
}

/* ── Display update ───────────────────────────── */
function updateDisplay() {
    const main = document.getElementById('disp-main');
    const exprEl = document.getElementById('disp-expr');
    const prevEl = document.getElementById('disp-prev');

    const val = state.expr || '0';

    // Font size by length
    main.className = val.length > 16 ? 'xsmall' : val.length > 10 ? 'small' : '';

    // Animate number change
    main.classList.add('pop');
    setTimeout(() => main.classList.remove('pop'), 120);

    main.textContent = val;
    exprEl.textContent = state.afterCalc ? '' : state.expr.length > 30
        ? '...' + state.expr.slice(-28) : state.expr;
    prevEl.textContent = state.prevExpr;

    // Mode tags
    document.getElementById('tag-deg').classList.toggle('on', state.isDeg);
    document.getElementById('tag-rad').classList.toggle('on', !state.isDeg);
    document.getElementById('tag-inv').classList.toggle('on', state.isInv);
}

/* ── Input handlers ───────────────────────────── */
function pushStr(s) {
    state.afterCalc = false;
    state.expr += s;
    updateDisplay();
}

function handleDigit(d) {
    if (state.afterCalc) { state.afterCalc = false; state.expr = d === '00' ? '0' : d; updateDisplay(); return; }
    if ((!state.expr || state.expr === '0') && d !== '00' && d !== '.') state.expr = '';
    if (d === '00' && !state.expr) return;
    state.expr += d;
    updateDisplay();
}

function handleOp(op) {
    state.afterCalc = false;
    if (!state.expr) { if (op === '-') { state.expr = '-'; } updateDisplay(); return; }
    if (/[+\-×÷]$/.test(state.expr)) state.expr = state.expr.slice(0, -1);
    state.expr += op;
    updateDisplay();
}

function handleFn(fn) {
    if (state.afterCalc) { state.afterCalc = false; state.expr = fn + '('; updateDisplay(); return; }
    state.expr += fn + '(';
    updateDisplay();
}

function handleEquals() {
    if (!state.expr) return;
    const result = evalExpr(state.expr, state.isDeg);
    state.prevExpr = state.expr + ' =';
    state.expr = result;
    state.afterCalc = true;
    updateDisplay();
    if (result !== 'Lỗi') saveHistory({ expression: state.prevExpr.slice(0, -2), result, ts: Date.now() });
}

function handleAC() { state.expr = ''; state.prevExpr = ''; state.afterCalc = false; updateDisplay(); }

function handleDel() {
    state.afterCalc = false;
    state.expr = state.expr.slice(0, -1);
    updateDisplay();
}

function handlePct() {
    try {
        const v = parseFloat(state.expr.replace(',', '.'));
        if (!isNaN(v)) { state.expr = String(v / 100); updateDisplay(); }
    } catch { }
}

function toggleDeg(deg) { state.isDeg = deg; updateDisplay(); }
function toggleInv() { state.isInv = !state.isInv; renderCalcBtns(); updateDisplay(); }

/* ── Button definitions ───────────────────────── */
function getRows() {
    const inv = state.isInv;
    return [
        [
            { l: inv ? 'sin⁻¹' : 'sin', t: 'f', fn: () => handleFn(inv ? 'asin' : 'sin') },
            { l: inv ? 'cos⁻¹' : 'cos', t: 'f', fn: () => handleFn(inv ? 'acos' : 'cos') },
            { l: inv ? 'tan⁻¹' : 'tan', t: 'f', fn: () => handleFn(inv ? 'atan' : 'tan') },
            { l: 'rad', t: 'f', fn: () => toggleDeg(false), act: !state.isDeg },
            { l: 'deg', t: 'f', fn: () => toggleDeg(true), act: state.isDeg },
        ],
        [
            { l: inv ? '10ˣ' : 'log', t: 'f', fn: () => inv ? pushStr('10^(') : handleFn('log') },
            { l: inv ? 'eˣ' : 'ln', t: 'f', fn: () => inv ? handleFn('exp') : handleFn('ln') },
            { l: '(', t: 'n', fn: () => pushStr('(') },
            { l: ')', t: 'n', fn: () => pushStr(')') },
            { l: 'inv', t: 'f', fn: toggleInv, act: inv },
        ],
        [
            { l: 'n!', t: 'f', fn: () => pushStr('!') },
            { l: 'AC', t: 'c', fn: handleAC },
            { l: '%', t: 'f', fn: handlePct },
            { l: '⌫', t: 'f', fn: handleDel, long: handleAC },
            { l: '÷', t: 'o', fn: () => handleOp('÷') },
        ],
        [
            { l: '^', t: 'f', fn: () => pushStr('^') },
            { l: '7', t: 'n', fn: () => handleDigit('7') },
            { l: '8', t: 'n', fn: () => handleDigit('8') },
            { l: '9', t: 'n', fn: () => handleDigit('9') },
            { l: '×', t: 'o', fn: () => handleOp('×') },
        ],
        [
            { l: inv ? 'x²' : '√', t: 'f', fn: () => inv ? pushStr('^2') : handleFn('√') },
            { l: '4', t: 'n', fn: () => handleDigit('4') },
            { l: '5', t: 'n', fn: () => handleDigit('5') },
            { l: '6', t: 'n', fn: () => handleDigit('6') },
            { l: '−', t: 'o', fn: () => handleOp('-') },
        ],
        [
            { l: 'π', t: 'f', fn: () => pushStr('π') },
            { l: '1', t: 'n', fn: () => handleDigit('1') },
            { l: '2', t: 'n', fn: () => handleDigit('2') },
            { l: '3', t: 'n', fn: () => handleDigit('3') },
            { l: '+', t: 'o', fn: () => handleOp('+') },
        ],
        [
            { l: 'e', t: 'f', fn: () => pushStr('e') },
            { l: '00', t: 'n', fn: () => handleDigit('00') },
            { l: '0', t: 'n', fn: () => handleDigit('0') },
            { l: ',', t: 'n', fn: () => pushStr(',') },
            { l: '=', t: 'e', fn: handleEquals },
        ],
    ];
}

function renderCalcBtns() {
    const grid = document.getElementById('btn-grid');
    grid.innerHTML = '';
    getRows().forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'btn-row';
        row.forEach(def => {
            const btn = document.createElement('button');
            btn.className = `mbtn btn-${def.t}${def.act ? ' btn-act' : ''}`;

            const span = document.createElement('span');
            span.textContent = def.l;
            btn.appendChild(span);

            // font size heuristic
            const ll = String(def.l).length;
            if (ll >= 5) btn.style.fontSize = '10px';
            else if (ll >= 3) btn.style.fontSize = '12px';

            btn.addEventListener('click', () => {
                if (document.getElementById('s-vibrate').checked && navigator.vibrate)
                    navigator.vibrate(12);
                def.fn();
            });
            if (def.long) {
                btn.addEventListener('contextmenu', e => { e.preventDefault(); def.long(); });
                let lt;
                btn.addEventListener('pointerdown', () => { lt = setTimeout(() => def.long(), 600); });
                btn.addEventListener('pointerup', () => clearTimeout(lt));
                btn.addEventListener('pointerleave', () => clearTimeout(lt));
            }
            rowEl.appendChild(btn);
        });
        grid.appendChild(rowEl);
    });
}

/* ── Keyboard support ─────────────────────────── */
document.addEventListener('keydown', e => {
    if (!document.getElementById('calc-view').classList.contains('active')) return;
    const k = e.key;
    if (k >= '0' && k <= '9') handleDigit(k);
    else if (k === '+') handleOp('+');
    else if (k === '-') handleOp('-');
    else if (k === '*') handleOp('×');
    else if (k === '/') { e.preventDefault(); handleOp('÷'); }
    else if (k === 'Enter' || k === '=') handleEquals();
    else if (k === 'Backspace') handleDel();
    else if (k === 'Escape') handleAC();
    else if (k === '(') pushStr('(');
    else if (k === ')') pushStr(')');
    else if (k === '.') pushStr(',');
    else if (k === '%') handlePct();
    else if (k === '^') pushStr('^');
});

/* ═══════════════════════════════════════════════════════════
   HISTORY
═══════════════════════════════════════════════════════════ */
function getHistory() { try { return JSON.parse(localStorage.getItem('calc_hist') || '[]'); } catch { return []; } }
function saveHistory(item) {
    try {
        const h = [item, ...getHistory()].slice(0, 50);
        localStorage.setItem('calc_hist', JSON.stringify(h));
    } catch { }
}
function clearHistory() {
    if (!confirm('Xóa toàn bộ lịch sử?')) return;
    localStorage.removeItem('calc_hist');
    renderHistory();
}
function renderHistory() {
    const list = document.getElementById('hist-list');
    const h = getHistory();
    if (!h.length) {
        list.innerHTML = '<div class="hist-empty">Chưa có lịch sử</div>';
        return;
    }
    list.innerHTML = h.map(item => {
        const d = new Date(item.ts);
        const t = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
        return `<div class="hist-item">
<div style="flex:1;overflow:hidden">
<div class="hist-expr">${escHtml(item.expression)}</div>
<div class="hist-result">= ${escHtml(item.result)}</div>
</div>
<div class="hist-time">${t}</div>
</div>`;
    }).join('');
}
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ═══════════════════════════════════════════════════════════
   CONVERTERS
═══════════════════════════════════════════════════════════ */
const linear = (units, val, f, t) => {
    const fu = units.find(u => u.s === f), tu = units.find(u => u.s === t);
    return fu && tu ? (val * fu.b) / tu.b : 0;
};

const CONVERTERS = {
    currency: {
        name: 'Tiền tệ', icon: '¥',
        units: [
            { n: 'USD', s: 'USD', b: 1 }, { n: 'VND', s: 'VND', b: 25000 }, { n: 'EUR', s: 'EUR', b: 0.92 },
            { n: 'GBP', s: 'GBP', b: 0.79 }, { n: 'JPY', s: 'JPY', b: 149.5 }, { n: 'CNY', s: 'CNY', b: 7.24 },
            { n: 'KRW', s: 'KRW', b: 1330 }, { n: 'SGD', s: 'SGD', b: 1.34 }, { n: 'THB', s: 'THB', b: 35.8 }, { n: 'AUD', s: 'AUD', b: 1.53 },
        ],
        convert: (v, f, t, u) => { const fu = u.find(x => x.s === f), tu = u.find(x => x.s === t); return fu && tu ? (v / fu.b) * tu.b : 0; },
    },
    length: {
        name: 'Độ dài', icon: '↔',
        units: [{ n: 'km', s: 'km', b: 1000 }, { n: 'm', s: 'm', b: 1 }, { n: 'dm', s: 'dm', b: 0.1 }, { n: 'cm', s: 'cm', b: 0.01 },
        { n: 'mm', s: 'mm', b: 0.001 }, { n: 'mi', s: 'mi', b: 1609.344 }, { n: 'yd', s: 'yd', b: 0.9144 },
        { n: 'ft', s: 'ft', b: 0.3048 }, { n: 'in', s: 'in', b: 0.0254 }, { n: 'nmi', s: 'nmi', b: 1852 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    area: {
        name: 'Diện tích', icon: '⬜',
        units: [{ n: 'km²', s: 'km²', b: 1e6 }, { n: 'ha', s: 'ha', b: 1e4 }, { n: 'm²', s: 'm²', b: 1 },
        { n: 'dm²', s: 'dm²', b: 0.01 }, { n: 'cm²', s: 'cm²', b: 1e-4 }, { n: 'mm²', s: 'mm²', b: 1e-6 },
        { n: 'ac', s: 'ac', b: 4046.86 }, { n: 'ft²', s: 'ft²', b: 0.0929 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    volume: {
        name: 'Thể tích', icon: '◻',
        units: [{ n: 'kL', s: 'kL', b: 1000 }, { n: 'L', s: 'L', b: 1 }, { n: 'dL', s: 'dL', b: 0.1 },
        { n: 'cL', s: 'cL', b: 0.01 }, { n: 'mL', s: 'mL', b: 0.001 }, { n: 'm³', s: 'm³', b: 1000 },
        { n: 'cm³', s: 'cm³', b: 0.001 }, { n: 'gal', s: 'gal', b: 3.785 }, { n: 'qt', s: 'qt', b: 0.946 },
        { n: 'cup', s: 'cup', b: 0.2366 }, { n: 'fl oz', s: 'fl oz', b: 0.02957 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    weight: {
        name: 'Cân nặng', icon: '⚖',
        units: [{ n: 't', s: 't', b: 1e6 }, { n: 'kg', s: 'kg', b: 1000 }, { n: 'g', s: 'g', b: 1 },
        { n: 'mg', s: 'mg', b: 0.001 }, { n: 'lb', s: 'lb', b: 453.592 }, { n: 'oz', s: 'oz', b: 28.35 }, { n: 'st', s: 'st', b: 6350 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    temperature: {
        name: 'Nhiệt độ', icon: '🌡',
        units: [{ n: 'Celsius', s: '°C' }, { n: 'Fahrenheit', s: '°F' }, { n: 'Kelvin', s: 'K' }],
        convert: (v, f, t) => {
            let c; if (f === '°C') c = v; else if (f === '°F') c = (v - 32) * 5 / 9; else c = v - 273.15;
            if (t === '°C') return c; if (t === '°F') return c * 9 / 5 + 32; return c + 273.15;
        },
    },
    speed: {
        name: 'Tốc độ', icon: '▶',
        units: [{ n: 'm/s', s: 'm/s', b: 1 }, { n: 'km/h', s: 'km/h', b: 1 / 3.6 }, { n: 'mph', s: 'mph', b: 0.44704 },
        { n: 'kt', s: 'kt', b: 0.5144 }, { n: 'ft/s', s: 'ft/s', b: 0.3048 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    pressure: {
        name: 'Áp suất', icon: '◎',
        units: [{ n: 'Pa', s: 'Pa', b: 1 }, { n: 'kPa', s: 'kPa', b: 1000 }, { n: 'MPa', s: 'MPa', b: 1e6 },
        { n: 'bar', s: 'bar', b: 1e5 }, { n: 'mbar', s: 'mbar', b: 100 }, { n: 'atm', s: 'atm', b: 101325 },
        { n: 'psi', s: 'psi', b: 6894.76 }, { n: 'mmHg', s: 'mmHg', b: 133.322 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    power: {
        name: 'Công suất', icon: '⚡',
        units: [{ n: 'W', s: 'W', b: 1 }, { n: 'kW', s: 'kW', b: 1000 }, { n: 'MW', s: 'MW', b: 1e6 },
        { n: 'hp', s: 'hp', b: 745.7 }, { n: 'BTU/h', s: 'BTU/h', b: 0.29307 }, { n: 'cal/s', s: 'cal/s', b: 4.1868 }],
        convert: (v, f, t, u) => linear(u, v, f, t),
    },
    numbersystem: {
        name: 'Hệ thống số', icon: '01', isSpecial: true,
        units: [{ n: 'BIN', s: 'BIN', base: 2 }, { n: 'OCT', s: 'OCT', base: 8 }, { n: 'DEC', s: 'DEC', base: 10 }, { n: 'HEX', s: 'HEX', base: 16 }],
        convert: (v, f, t, u) => {
            try {
                const fb = u.find(x => x.s === f)?.base ?? 10, tb = u.find(x => x.s === t)?.base ?? 10;
                const dec = parseInt(String(v).trim(), fb);
                return isNaN(dec) ? 'Lỗi' : dec.toString(tb).toUpperCase();
            } catch { return 'Lỗi'; }
        },
    },
};

/* ── Render converter home ────────────────────── */
(function renderConvHome() {
    const grid = document.getElementById('conv-grid');
    Object.entries(CONVERTERS).forEach(([key, conv]) => {
        const card = document.createElement('div');
        card.className = 'conv-card';
        card.innerHTML = `<div class="conv-icon">${conv.icon}</div><div class="conv-name">${conv.name}</div>`;
        card.addEventListener('click', () => openConverter(key));
        grid.appendChild(card);
    });
})();

/* ── Unit converter logic ─────────────────────── */
let currentConv = null, fromUnit = '', toUnit = '';

function openConverter(key) {
    currentConv = CONVERTERS[key];
    fromUnit = currentConv.units[0].s;
    toUnit = currentConv.units[1].s;
    document.getElementById('conv-title').textContent = currentConv.name.toUpperCase();
    document.getElementById('conv-input').value = '';
    document.getElementById('conv-result').textContent = '—';
    document.getElementById('conv-result-unit').textContent = toUnit;
    renderChips();
    showView('conv-view');
}

function renderChips() {
    const fc = document.getElementById('from-chips');
    const tc = document.getElementById('to-chips');
    fc.innerHTML = tc.innerHTML = '';
    currentConv.units.forEach(u => {
        [fc, tc].forEach((el, i) => {
            const chip = document.createElement('div');
            chip.className = 'chip' + (i === 0 ? (u.s === fromUnit ? ' active' : '') : (u.s === toUnit ? ' active' : ''));
            chip.textContent = u.s;
            chip.addEventListener('click', () => {
                if (i === 0) fromUnit = u.s; else toUnit = u.s;
                document.getElementById('conv-result-unit').textContent = toUnit;
                renderChips(); doConvert();
            });
            el.appendChild(chip);
        });
    });
}

function doConvert() {
    const raw = document.getElementById('conv-input').value.trim();
    if (!raw) { document.getElementById('conv-result').textContent = '—'; return; }
    const num = currentConv.isSpecial ? raw : parseFloat(raw.replace(',', '.'));
    if (!currentConv.isSpecial && isNaN(num)) { document.getElementById('conv-result').textContent = 'Lỗi'; return; }
    const r = currentConv.convert(currentConv.isSpecial ? raw : num, fromUnit, toUnit, currentConv.units);
    document.getElementById('conv-result').textContent = typeof r === 'number'
        ? parseFloat(r.toPrecision(10)).toString() : String(r);
}

function swapUnits() {
    const inp = document.getElementById('conv-input');
    const res = document.getElementById('conv-result').textContent;
    [fromUnit, toUnit] = [toUnit, fromUnit];
    if (res !== '—' && res !== 'Lỗi') inp.value = res;
    document.getElementById('conv-result-unit').textContent = toUnit;
    renderChips(); doConvert();
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
renderCalcBtns();
updateDisplay();
