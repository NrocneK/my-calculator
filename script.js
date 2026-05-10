'use strict';
/* ═══════════════════════ CONSTANTS ═══════════════════════ */
const CONSTS = [
    { s: 'c', n: 'Speed of light', v: 299792458, u: 'm·s⁻¹' },
    { s: 'h', n: 'Planck constant', v: 6.62607015e-34, u: 'J·s' },
    { s: 'G', n: 'Gravitational const', v: 6.67430e-11, u: 'm³·kg⁻¹·s⁻²' },
    { s: 'g', n: 'Standard gravity', v: 9.80665, u: 'm·s⁻²' },
    { s: 'Nₐ', n: 'Avogadro number', v: 6.02214076e23, u: 'mol⁻¹' },
    { s: 'e', n: 'Elementary charge', v: 1.602176634e-19, u: 'C' },
    { s: 'mₑ', n: 'Electron mass', v: 9.1093837015e-31, u: 'kg' },
    { s: 'mp', n: 'Proton mass', v: 1.67262192369e-27, u: 'kg' },
    { s: 'u', n: 'Atomic mass unit', v: 1.66053906660e-27, u: 'kg' },
    { s: 'kB', n: 'Boltzmann constant', v: 1.380649e-23, u: 'J·K⁻¹' },
    { s: 'R', n: 'Gas constant', v: 8.314462618, u: 'J·mol⁻¹·K⁻¹' },
    { s: 'σ', n: 'Stefan-Boltzmann', v: 5.670374419e-8, u: 'W·m⁻²·K⁻⁴' },
    { s: 'ε₀', n: 'Vacuum permittivity', v: 8.8541878128e-12, u: 'F·m⁻¹' },
    { s: 'μ₀', n: 'Vacuum permeability', v: 1.25663706212e-6, u: 'N·A⁻²' },
    { s: 'α', n: 'Fine structure const', v: 7.2973525693e-3, u: '' },
    { s: 'a₀', n: 'Bohr radius', v: 5.29177210903e-11, u: 'm' },
    { s: 'F', n: 'Faraday constant', v: 96485.33212, u: 'C·mol⁻¹' },
    { s: 'atm', n: 'Std atmosphere', v: 101325, u: 'Pa' },
    { s: 'eV', n: 'Electron volt', v: 1.602176634e-19, u: 'J' },
    { s: 'T0', n: 'Zero Celsius', v: 273.15, u: 'K' },
    { s: 'b', n: 'Wien displacement', v: 2.897771955e-3, u: 'm·K' },
    { s: 'lP', n: 'Planck length', v: 1.616255e-35, u: 'm' },
    { s: 'mP', n: 'Planck mass', v: 2.176434e-8, u: 'kg' },
    { s: 'φ₀', n: 'Magnetic flux quantum', v: 2.067833848e-15, u: 'Wb' },
    { s: 'R∞', n: 'Rydberg constant', v: 10973731.56816, u: 'm⁻¹' },
];

/* ═══════════════════════ COMPLEX ═══════════════════════ */
class Cx {
    constructor(re = 0, im = 0) { this.re = +re; this.im = +im }
    add(b) { return new Cx(this.re + b.re, this.im + b.im) }
    sub(b) { return new Cx(this.re - b.re, this.im - b.im) }
    mul(b) { return new Cx(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re) }
    div(b) { const d = b.re ** 2 + b.im ** 2; return new Cx((this.re * b.re + this.im * b.im) / d, (this.im * b.re - this.re * b.im) / d) }
    neg() { return new Cx(-this.re, -this.im) }
    abs() { return Math.hypot(this.re, this.im) }
    arg() { return Math.atan2(this.im, this.re) }
    pow(b) {
        if (this.im === 0 && b.im === 0) return new Cx(Math.pow(this.re, b.re));
        const r = this.abs(), th = this.arg();
        const nr = Math.pow(r, b.re) * Math.exp(-b.im * th);
        const nth = b.re * th + b.im * Math.log(r || 1e-300);
        return new Cx(nr * Math.cos(nth), nr * Math.sin(nth));
    }
    sqrt() { const r = this.abs(), th = this.arg(); return new Cx(Math.sqrt(r) * Math.cos(th / 2), Math.sqrt(r) * Math.sin(th / 2)) }
    exp() { const er = Math.exp(this.re); return new Cx(er * Math.cos(this.im), er * Math.sin(this.im)) }
    log() { return new Cx(0.5 * Math.log(this.re ** 2 + this.im ** 2), this.arg()) }
    sin() { return new Cx(Math.sin(this.re) * Math.cosh(this.im), Math.cos(this.re) * Math.sinh(this.im)) }
    cos() { return new Cx(Math.cos(this.re) * Math.cosh(this.im), -Math.sin(this.re) * Math.sinh(this.im)) }
    fmt(p = 8) {
        const r = fmtN(this.re, p), i = fmtN(this.im, p);
        if (Math.abs(this.im) < 1e-12) return r;
        if (Math.abs(this.re) < 1e-12) return `${i}i`;
        return `${r}${this.im < 0 ? '' : '+'}${i}i`;
    }
}

/* ═══════════════════════ MATH UTILS ═══════════════════════ */
function fact(n) { n = Math.round(Math.abs(n)); if (n > 170) return Infinity; let r = 1; for (let i = 2; i <= n; i++)r *= i; return r }
function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { [a, b] = [b, a % b] } return a }
function nPr(n, r) { let v = 1; for (let i = 0; i < r; i++)v *= (n - i); return v }
function nCr(n, r) { return nPr(Math.round(n), Math.round(r)) / fact(r) }

function fmtN(n, p = 10) {
    if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
    if (isNaN(n)) return 'Math ERROR';
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs < 1e-9 || abs >= 1e11) {
        const s = parseFloat(n.toPrecision(7)).toExponential();
        return s.replace('e+', '×10^').replace('e-', '×10^-');
    }
    return String(parseFloat(n.toPrecision(p)));
}

function tryFrac(n) {
    if (!isFinite(n) || Math.abs(n) > 1e6 || n === Math.round(n)) return null;
    for (let d = 2; d <= 999; d++) {
        const num = Math.round(n * d);
        if (Math.abs(num / d - n) < 1e-10) {
            const g = gcd(Math.abs(num), d);
            if (g === d) return null;
            return `${num / g}/${d / g}`;
        }
    }
    return null;
}

/* ═══════════════════════ EVALUATOR ═══════════════════════ */
function mathEval(raw, vars = {}, angle = 'DEG', cmplx = false) {
    let s = raw
        .replace(/×/g, '*').replace(/÷/g, '/')
        .replace(/−/g, '-').replace(/,/g, '.');

    // Variable substitution (longest first to avoid prefix clash)
    const vkeys = Object.keys(vars).sort((a, b) => b.length - a.length);
    for (const k of vkeys) {
        const safe = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?<![A-Za-z0-9_])${safe}(?![A-Za-z0-9_(])`, 'g');
        const val = vars[k];
        s = s.replace(re, `(${val instanceof Cx ? `__cx(${val.re},${val.im})` : val})`);
    }
    s = s.replace(/(?<![A-Za-z0-9_])π(?![A-Za-z0-9_])/g, `(${Math.PI})`);

    const toR = angle === 'DEG' ? Math.PI / 180 : angle === 'GRA' ? Math.PI / 200 : 1;
    const frR = 1 / toR;
    const __cx = (re, im) => new Cx(re, im);

    let pos = 0;
    const peek = () => s[pos];
    const eat = c => { if (s[pos] === c) pos++ };

    const parseExpr = () => parseAdd();
    function parseAdd() {
        let l = parseMul();
        while (pos < s.length) {
            const c = s[pos];
            if (c !== '+' && c !== '-') break;
            // Check it's not a sign inside exponent
            if (c === '-' && pos > 0 && /[eE]/.test(s[pos - 1])) break;
            pos++;
            const r = parseMul();
            if (cmplx) l = c === '+' ? l.add(r) : l.sub(r);
            else l = c === '+' ? l + r : l - r;
        }
        return l;
    }
    function parseMul() {
        let l = parseUnary();
        while (pos < s.length) {
            const c = s[pos];
            if (c !== '*' && c !== '/' && c !== '%') break;
            pos++;
            const r = parseUnary();
            if (cmplx) {
                if (c === '*') l = l.mul(r);
                else if (c === '/') l = l.div(r);
                else l = new Cx(l.re % r.re);
            } else {
                if (c === '*') l *= r;
                else if (c === '/') l /= r;
                else l %= r;
            }
        }
        return l;
    }
    function parseUnary() {
        if (s[pos] === '-') { pos++; const v = parsePow(); return cmplx ? v.neg() : -v }
        if (s[pos] === '+') pos++;
        return parsePow();
    }
    function parsePow() {
        let b = parsePost();
        if (s[pos] === '^') {
            pos++;
            const e = parseUnary(); // right-associative
            return cmplx ? b.pow(e) : Math.pow(b, e);
        }
        return b;
    }
    function parsePost() {
        let v = parseAtom();
        while (s[pos] === '!') { pos++; v = cmplx ? new Cx(fact(v.re)) : fact(v) }
        return v;
    }
    function parseAtom() {
        // Number literal
        if (/[\d.]/.test(s[pos])) {
            let ns = '';
            while (pos < s.length) {
                const ch = s[pos];
                const nc = s[pos + 1];
                if (/[\d.]/.test(ch)) { ns += ch; pos++ }
                else if ((ch === 'e' || ch === 'E') && /[\d+\-]/.test(nc)) { ns += ch; pos++ }
                else if ((ch === '+' || ch === '-') && pos > 0 && /[eE]/.test(s[pos - 1])) { ns += ch; pos++ }
                else break;
            }
            const n = parseFloat(ns);
            return cmplx ? new Cx(n) : n;
        }
        // Parentheses
        if (s[pos] === '(') { pos++; const v = parseExpr(); eat(')'); return v }

        // Identifier / function
        const rest = s.slice(pos);
        const FNS = ['__cx',
            'asinh', 'acosh', 'atanh', 'asin', 'acos', 'atan2', 'atan',
            'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan',
            'log10', 'log', 'ln', 'exp', 'sqrt', 'cbrt', 'abs',
            'floor', 'ceil', 'round', 'sign', 'nPr', 'nCr', 'gcd', 'lcm',
            'max', 'min', 'random', 'Pol', 'Rec'].sort((a, b) => b.length - a.length);

        for (const fn of FNS) {
            if (!rest.startsWith(fn)) continue;
            const nc = rest[fn.length];
            if (nc !== '(') continue;
            pos += fn.length + 1;

            // Two-argument functions
            const twoArg = ['__cx', 'nPr', 'nCr', 'gcd', 'lcm', 'atan2', 'max', 'min', 'log', 'Pol', 'Rec'];
            if (twoArg.includes(fn)) {
                const a1 = parseExpr(); eat(','); const a2 = parseExpr(); eat(')');
                const av = cmplx ? a1.re : a1, bv = cmplx ? a2.re : a2;
                if (fn === '__cx') return new Cx(av, bv);
                let r;
                if (fn === 'nPr') r = nPr(av, bv);
                else if (fn === 'nCr') r = nCr(av, bv);
                else if (fn === 'gcd') r = gcd(av, bv);
                else if (fn === 'lcm') r = Math.abs(av * bv) / gcd(av, bv);
                else if (fn === 'atan2') r = Math.atan2(av, bv) * frR;
                else if (fn === 'max') r = Math.max(av, bv);
                else if (fn === 'min') r = Math.min(av, bv);
                else if (fn === 'log') r = Math.log(av) / Math.log(bv); // log_b(a)
                else if (fn === 'Pol') r = Math.hypot(av, bv);
                else if (fn === 'Rec') r = av * Math.cos(bv * toR);
                return cmplx ? new Cx(r) : r;
            }

            const arg = parseExpr(); eat(')');
            const a = cmplx ? arg.re : arg;
            let r;
            switch (fn) {
                case 'sin': r = cmplx ? arg.sin() : Math.sin(a * toR); break;
                case 'cos': r = cmplx ? arg.cos() : Math.cos(a * toR); break;
                case 'tan': r = cmplx ? new Cx(Math.tan(a * toR)) : Math.tan(a * toR); break;
                case 'asin': r = cmplx ? new Cx(Math.asin(a) * frR) : Math.asin(a) * frR; break;
                case 'acos': r = cmplx ? new Cx(Math.acos(a) * frR) : Math.acos(a) * frR; break;
                case 'atan': r = cmplx ? new Cx(Math.atan(a) * frR) : Math.atan(a) * frR; break;
                case 'sinh': r = cmplx ? arg.sin() : Math.sinh(a); break; // sinh via Cx.sin
                case 'cosh': r = cmplx ? new Cx(Math.cosh(a)) : Math.cosh(a); break;
                case 'tanh': r = cmplx ? new Cx(Math.tanh(a)) : Math.tanh(a); break;
                case 'asinh': r = Math.asinh(a); break;
                case 'acosh': r = Math.acosh(a); break;
                case 'atanh': r = Math.atanh(a); break;
                case 'log10': r = cmplx ? arg.log().div(new Cx(Math.log(10))) : Math.log10(a); break;
                case 'ln': r = cmplx ? arg.log() : Math.log(a); break;
                case 'exp': r = cmplx ? arg.exp() : Math.exp(a); break;
                case 'sqrt': r = cmplx ? arg.sqrt() : Math.sqrt(a); break;
                case 'cbrt': r = Math.cbrt(a); break;
                case 'abs': r = cmplx ? new Cx(arg.abs()) : Math.abs(a); break;
                case 'floor': r = Math.floor(a); break;
                case 'ceil': r = Math.ceil(a); break;
                case 'round': r = Math.round(a); break;
                case 'sign': r = Math.sign(a); break;
                case 'random': r = Math.random(); break;
                default: r = a;
            }
            return cmplx ? ((r instanceof Cx) ? r : new Cx(r)) : ((r instanceof Cx) ? r.re : r);
        }

        // imaginary unit in complex mode
        if (cmplx && s[pos] === 'i' && !/[A-Za-z0-9_(]/.test(s[pos + 1])) { pos++; return new Cx(0, 1) }

        // Unknown identifier — skip char
        pos++;
        return cmplx ? new Cx(0) : 0;
    }

    const result = parseExpr();
    return result;
}

/* ═══════════════════════ TOKEN SYSTEM ═══════════════════════ */
const E = { tok: [], cur: 0, ctx: null, hist: [], hi: -1 };
function eReset() { E.tok = []; E.cur = 0; E.ctx = null; E.hi = -1 }

function eApp(str) {
    if (E.ctx) { const t = E.tok[E.ctx.idx]; t[E.ctx.f] += str; return void draw() }
    E.tok.splice(E.cur, 0, { k: 'c', v: str }); E.cur++; draw();
}
function eDel() {
    if (E.ctx) {
        const t = E.tok[E.ctx.idx];
        if (t[E.ctx.f].length > 0) { t[E.ctx.f] = t[E.ctx.f].slice(0, -1); return void draw() }
        const fl = { fr: ['n', 'd'], pw: ['e'], sq: ['r'], nr: ['i', 'r'], ab: ['x'] }[E.ctx.type] || [];
        const ci = fl.indexOf(E.ctx.f);
        if (ci > 0) { E.ctx.f = fl[ci - 1] }
        else { E.tok.splice(E.ctx.idx, 1); if (E.cur > E.ctx.idx) E.cur--; E.ctx = null }
        return void draw();
    }
    if (E.cur > 0) { E.cur--; E.tok.splice(E.cur, 1); draw() }
}
function eDelFwd() {
    if (E.ctx) { return eDel() }
    if (E.cur < E.tok.length) { E.tok.splice(E.cur, 1); draw() }
}
function insToken(t, firstField) {
    E.tok.splice(E.cur, 0, t);
    E.ctx = { type: t.k, idx: E.cur, f: firstField };
    E.cur++; draw();
}
function eNext() {
    if (!E.ctx) return;
    const fl = { fr: ['n', 'd'], pw: ['e'], sq: ['r'], nr: ['i', 'r'], ab: ['x'] }[E.ctx.type] || [];
    const ci = fl.indexOf(E.ctx.f);
    if (ci < fl.length - 1) { E.ctx.f = fl[ci + 1]; draw() }
    else { E.ctx = null; draw() }
}
function eL() { if (E.ctx) { E.ctx = null; return void draw() } if (E.cur > 0) { E.cur--; draw() } }
function eR() { if (E.ctx) { return eNext() } if (E.cur < E.tok.length) { E.cur++; draw() } }

function eStr() {
    let s = '';
    for (const t of E.tok) {
        if (t.k === 'c') s += t.v;
        else if (t.k === 'fr') s += `((${t.n || 0})/(${t.d || 1}))`;
        else if (t.k === 'pw') s += `^(${t.e || 0})`;
        else if (t.k === 'sq') s += `sqrt(${t.r || 0})`;
        else if (t.k === 'nr') s += t.i ? `((${t.r || 0})^(1/(${t.i || 1})))` : (`sqrt(${t.r || 0})`);
        else if (t.k === 'ab') s += `abs(${t.x || 0})`;
    }
    return s;
}

/* ═══════════════════════ RENDERER ═══════════════════════ */
function renderToks() {
    let h = '';
    for (let i = 0; i <= E.tok.length; i++) {
        if (E.cur === i && !E.ctx) h += '<span class="cur"></span>';
        if (i >= E.tok.length) break;
        const t = E.tok[i], A = E.ctx && E.ctx.idx === i;
        if (t.k === 'c') { h += esc(t.v) }
        else if (t.k === 'fr') {
            const nc = A && E.ctx.f === 'n', dc = A && E.ctx.f === 'd';
            h += `<span class="frac"><span class="frac-n">${esc(t.n)}${nc ? '<span class="cur"></span>' : ''}</span>` +
                `<span class="frac-d">${esc(t.d)}${dc ? '<span class="cur"></span>' : ''}</span></span>`;
        } else if (t.k === 'pw') {
            const ec = A && E.ctx.f === 'e';
            h += `<span class="pwr">${esc(t.e)}${ec ? '<span class="cur"></span>' : ''}</span>`;
        } else if (t.k === 'sq') {
            const rc = A && E.ctx.f === 'r';
            h += `<span class="rt-wrap"><span class="rt-sym">√</span><span class="rt-rad">${esc(t.r || '□')}${rc ? '<span class="cur"></span>' : ''}</span></span>`;
        } else if (t.k === 'nr') {
            const ic = A && E.ctx.f === 'i', rc = A && E.ctx.f === 'r';
            h += `<span class="rt-wrap"><span class="rt-idx">${esc(t.i || '□')}${ic ? '<span class="cur"></span>' : ''}</span>` +
                `<span class="rt-sym">√</span><span class="rt-rad">${esc(t.r || '□')}${rc ? '<span class="cur"></span>' : ''}</span></span>`;
        } else if (t.k === 'ab') {
            const xc = A && E.ctx.f === 'x';
            h += `|${esc(t.x)}${xc ? '<span class="cur"></span>' : ''}|`;
        }
    }
    return h;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ═══════════════════════ STATE ═══════════════════════ */
const ST = {
    mode: 'COMP', shift: false, alpha: false, hyp: false,
    angle: 'DEG', ans: 0,
    vars: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, M: 0, X: 0, Y: 0 },
    base: 10,
    pendingSto: false, pendingRcl: false,
    afterCalc: false,
};
const MODES = [
    { n: 'COMP', l: 'Calculator' }, { n: 'CMPLX', l: 'Complex' },
    { n: 'BASE', l: 'Base-N' }, { n: 'MATRIX', l: 'Matrix' },
    { n: 'STAT', l: 'Statistics' }, { n: 'EQN', l: 'Equation' }, { n: 'TABLE', l: 'Table f(x)' },
];
function setMode(m) {
    ST.mode = m;
    document.querySelectorAll('.ov').forEach(o => o.classList.remove('open'));
    if (m === 'STAT') OV.open('ov-stat');
    else if (m === 'EQN') OV.open('ov-eqn');
    else if (m === 'MATRIX') OV.open('ov-mat');
    else if (m === 'TABLE') OV.open('ov-tbl');
    eReset(); draw();
}

/* ═══════════════════════ OVERLAY ═══════════════════════ */
const OV = { open: id => qi(id).classList.add('open'), close: id => qi(id).classList.remove('open') };
document.addEventListener('click', e => {
    if (e.target.classList.contains('ov')) e.target.classList.remove('open');
});

/* ═══════════════════════ DRAW ═══════════════════════ */
const qi = id => document.getElementById(id);
function draw() {
    ['S', 'A', 'HYP'].forEach(k => qi(`i-${k}`).className = 'ind' + (ST[k.toLowerCase()] ? ' lit' : ''));
    qi('i-M').className = 'ind' + (ST.vars.M !== 0 ? ' on' : '');
    ['DEG', 'RAD', 'GRA'].forEach(a => qi(`i-${a}`).className = 'ind' + (ST.angle === a ? ' lit' : ''));
    ['CMPLX', 'BASE', 'MAT', 'STAT', 'EQN'].forEach(m => {
        const mKey = { CMPLX: 'CMPLX', BASE: 'BASE', MAT: 'MATRIX', STAT: 'STAT', EQN: 'EQN' }[m];
        qi(`i-${m}`).className = 'ind' + (ST.mode === mKey ? ' lit' : '');
    });
    document.querySelectorAll('.bsh').forEach(b => b.classList.toggle('sh-on', ST.shift));
    document.querySelectorAll('.bal').forEach(b => b.classList.toggle('al-on', ST.alpha));
    qi('expr-disp').innerHTML = renderToks();
    qi('hist-ind').textContent = E.hi >= 0 ? `▲▼ ${E.hi + 1}/${E.hist.length}` : '';
}
function showRes(main, alt = '') {
    const el = qi('res-main');
    el.textContent = main; el.className = '';
    if (/ERROR|Lỗi|undefined/.test(main)) el.className = 'err';
    qi('res-alt').textContent = alt;
}

/* ═══════════════════════ EVALUATE ═══════════════════════ */
function doEquals() {
    const expr = eStr().trim();
    if (!expr) return;
    const vars = { ...ST.vars, Ans: ST.ans };
    try {
        if (ST.mode === 'BASE') {
            const digits = expr.replace(/[^0-9a-fA-F]/g, '');
            const n = parseInt(digits || '0', ST.base);
            if (isNaN(n)) { showRes('Syntax ERROR'); return }
            ST.ans = n;
            showRes(n.toString(ST.base).toUpperCase(),
                `DEC:${n}  HEX:${n.toString(16).toUpperCase()}  OCT:${n.toString(8)}  BIN:${n.toString(2)}`);
            pushHist(expr, n.toString(ST.base).toUpperCase()); return;
        }
        if (ST.mode === 'CMPLX') {
            const r = mathEval(expr, { ...vars }, ST.angle, true);
            const rv = r instanceof Cx ? r : new Cx(r);
            ST.ans = rv.re;
            const polar = `r=${fmtN(rv.abs())}  θ=${fmtN(rv.arg() * 180 / Math.PI)}°`;
            showRes(rv.fmt(), polar);
            pushHist(expr, rv.fmt()); return;
        }
        const result = mathEval(expr, vars, ST.angle, false);
        if (typeof result !== 'number') { showRes('Type ERROR'); return }
        if (isNaN(result)) { showRes('Math ERROR'); return }
        if (!isFinite(result)) { showRes(result > 0 ? '∞' : '-∞'); return }
        ST.ans = result;
        const fmt = fmtN(result);
        const frac = tryFrac(result);
        showRes(fmt, frac ? `= ${frac}` : '');
        pushHist(expr, fmt);
    } catch (ex) { showRes('Math ERROR'); }
    ST.afterCalc = true;
}
function doStoD() {
    const cur = qi('res-main').textContent;
    if (cur.includes('/')) {
        const [n, d] = [parseFloat(cur), parseFloat(cur.split('/')[1])];
        const num = parseFloat(cur.split('/')[0]), den = parseFloat(cur.split('/')[1]);
        if (!isNaN(num) && !isNaN(den)) showRes(fmtN(num / den));
    } else { const f = tryFrac(ST.ans); if (f) showRes(f, fmtN(ST.ans)) }
}
function doEng() {
    if (!isFinite(ST.ans) || ST.ans === 0) return;
    const exp = Math.floor(Math.log10(Math.abs(ST.ans)));
    const eE = Math.floor(exp / 3) * 3;
    showRes(`${fmtN(ST.ans / Math.pow(10, eE), 6)}×10^${eE}`);
}
function pushHist(expr, res) { E.hist.unshift({ tok: E.tok.map(t => ({ ...t })), res }); E.hi = -1 }
function histUp() {
    if (!E.hist.length) return;
    E.hi = Math.min(E.hi + 1, E.hist.length - 1);
    const h = E.hist[E.hi]; E.tok = h.tok.map(t => ({ ...t })); E.cur = E.tok.length; E.ctx = null;
    showRes(h.res); draw();
}
function histDown() {
    if (E.hi <= 0) { E.hi = -1; eReset(); showRes(''); draw(); return }
    E.hi--; const h = E.hist[E.hi];
    E.tok = h.tok.map(t => ({ ...t })); E.cur = E.tok.length; E.ctx = null; showRes(h.res); draw();
}

/* ═══════════════════════ DISPATCH ═══════════════════════ */
function dispatch(act) {
    if (ST.pendingSto) {
        if (['SHIFT', 'ALPHA', 'MODE'].includes(act)) {
            // Cho phép bấm ALPHA để chọn biến, không hủy STO
            if (act === 'ALPHA') ST.alpha = !ST.alpha;
            else if (act === 'SHIFT') ST.shift = !ST.shift;
            return void draw();
        }
        ST.pendingSto = false;
        const v = act.toUpperCase();
        if ('ABCDEFMXY'.includes(v) && v.length === 1) {
            ST.vars[v] = ST.ans;
            showRes(fmtN(ST.ans), `→ ${v}`);
        } else {
            showRes('STO cancelled', '');
        }
        return void draw();
    }
    if (ST.pendingRcl) {
        if (['SHIFT', 'ALPHA', 'MODE'].includes(act)) {
            if (act === 'ALPHA') ST.alpha = !ST.alpha;
            else if (act === 'SHIFT') ST.shift = !ST.shift;
            return void draw();
        }
        ST.pendingRcl = false;
        const v = act.toUpperCase();
        if ('ABCDEFMXY'.includes(v) && v.length === 1) {
            eApp(String(ST.vars[v]));
            showRes(fmtN(ST.vars[v]), `${v} =`);
        } else {
            showRes('RCL cancelled', '');
        }
        return void draw();
    }
    if (ST.afterCalc && !['SHIFT', 'ALPHA', 'MODE', '=', 'AC', 'DEL', 'INS', 'LEFT', 'RIGHT', 'UP', 'DOWN'].includes(act)) {
        const isOp = ['+', '-', '×', '÷'].includes(act);
        if (!isOp) {
            eReset();
            showRes('');
            qi('res-alt').textContent = '';
        }
        ST.afterCalc = false;
    }
    switch (act) {
        case 'SHIFT': ST.shift = !ST.shift; ST.alpha = false; return void draw();
        case 'ALPHA': ST.alpha = !ST.alpha; ST.shift = false; return void draw();
        case 'MODE': OV.open('ov-mode'); ST.shift = false; ST.alpha = false; return void draw();
        case 'LEFT': eL(); break;
        case 'RIGHT': eR(); break;
        case 'UP': histUp(); break;
        case 'DOWN': histDown(); break;
        case 'AC': eReset(); showRes(''); qi('res-alt').textContent = ''; break;
        case 'DEL': eDel(); break;
        case 'INS': eDelFwd(); break;
        case '=': doEquals(); E.hi = -1; break;
        case 'S↔D': doStoD(); break;
        case 'ENG': doEng(); break;
        case 'DRG►':
            ST.angle = ST.angle === 'DEG' ? 'RAD' : ST.angle === 'RAD' ? 'GRA' : 'DEG'; break;
        case 'STO': ST.pendingSto = true; showRes('STO →', 'press A–F,M,X,Y'); break;
        case 'RCL': ST.pendingRcl = true; showRes('RCL', 'press A–F,M,X,Y'); break;
        case 'M+': ST.vars.M += ST.ans; showRes(fmtN(ST.vars.M), 'M+'); break;
        case 'M-': ST.vars.M -= ST.ans; showRes(fmtN(ST.vars.M), 'M−'); break;
        case 'CONST': OV.open('ov-const'); break;
        case 'MAT': OV.open('ov-mat'); break;
        case 'EQN': OV.open('ov-eqn'); break;
        case 'STAT': OV.open('ov-stat'); break;
        case 'TABLE': OV.open('ov-tbl'); break;
        case 'CMPLX': setMode('CMPLX'); return;
        case 'BASE': setMode('BASE'); return;
        /* ── Fraction / Power / Root ── */
        case '□/□': insToken({ k: 'fr', n: '', d: '' }, 'n'); break;
        case 'x²': insToken({ k: 'pw', e: '2' }, 'e'); E.ctx = null; break;
        case 'x³': insToken({ k: 'pw', e: '3' }, 'e'); E.ctx = null; break;
        case 'xʸ': insToken({ k: 'pw', e: '' }, 'e'); break;
        case 'x⁻¹': insToken({ k: 'pw', e: '-1' }, 'e'); E.ctx = null; break;
        case '√': insToken({ k: 'sq', r: '' }, 'r'); break;
        case '∛': insToken({ k: 'nr', i: '3', r: '' }, 'r'); break;
        case 'ʸ√x': insToken({ k: 'nr', i: '', r: '' }, 'i'); break;
        case '|x|': insToken({ k: 'ab', x: '' }, 'x'); break;
        /* ── 10^x: append '10' then power token ── */
        case '10^x': eApp('1'); eApp('0'); insToken({ k: 'pw', e: '' }, 'e'); break;
        /* ── Log/Exp ── */
        case 'log': eApp('log10('); break;
        case 'ln': eApp('ln('); break;
        case 'eˣ': eApp('exp('); break;
        /* ── Trig (with hyp support) ── */
        case 'sin': eApp(ST.hyp ? 'sinh(' : ST.alpha ? 'asin(' : 'sin('); ST.hyp = false; break;
        case 'cos': eApp(ST.hyp ? 'cosh(' : ST.alpha ? 'acos(' : 'cos('); ST.hyp = false; break;
        case 'tan': eApp(ST.hyp ? 'tanh(' : ST.alpha ? 'atan(' : 'tan('); ST.hyp = false; break;
        case 'sin⁻¹': eApp(ST.hyp ? 'asinh(' : 'asin('); ST.hyp = false; break;
        case 'cos⁻¹': eApp(ST.hyp ? 'acosh(' : 'acos('); ST.hyp = false; break;
        case 'tan⁻¹': eApp(ST.hyp ? 'atanh(' : 'atan('); ST.hyp = false; break;
        case 'hyp': ST.hyp = !ST.hyp; return void draw();
        /* ── Combinatorics ── */
        case 'nPr': eApp('nPr('); break;
        case 'nCr': eApp('nCr('); break;
        case 'x!': eApp('!'); break;
        /* ── Misc ── */
        case 'Ans': eApp('Ans'); break;
        case '(−)': eApp('-'); break;
        case 'EXP': eApp('*10'); insToken({ k: 'pw', e: '' }, 'e'); break;
        case 'Rnd': eApp('random()'); break;
        case 'π': eApp('π'); break;
        case 'e': eApp('e'); break;
        case 'i': eApp('i'); break;
        case '%': eApp('%'); break;
        case 'GCD': eApp('gcd('); break;
        case 'LCM': eApp('lcm('); break;
        /* ── Operators ── */
        case '+': case '-': case '×': case '÷':
        case '(': case ')': case ',':
            eApp(act); break;
        default:
            if (/^[\d.]$/.test(act) || /^[A-Fa-f]$/.test(act)) eApp(act);
            else if (act) eApp(act);
    }
    ST.shift = false; ST.alpha = false; draw();
}

/* ═══════════════════════ KEY DEFINITIONS ═══════════════════════
   10 rows × 5 cols = 50 unique buttons. NO duplicates.
   [primary, shift, alpha, mainLabel, shiftLabel, alphaLabel, class]
══════════════════════════════════════════════════════════════ */
const KD = [
    // ── Row 0: Modifiers + Navigation ──────────────────────────
    ['SHIFT', '', '', 'SHIFT', '', '', 'bsh'],
    ['ALPHA', '', '', 'ALPHA', '', '', 'bal'],
    ['MODE', '', '', 'MODE', '', '', 'bf'],
    ['LEFT', 'UP', '', '←', '▲', '', 'bf'],
    ['RIGHT', 'DOWN', '', '→', '▼', '', 'bf'],
    // ── Row 1: Power + Log ─────────────────────────────────────
    ['x²', '√', 'A', 'x²', '√', 'A', 'bf'],
    ['x⁻¹', 'x³', 'B', 'x⁻¹', 'x³', 'B', 'bf'],
    ['log', '10^x', 'C', 'log', '10ˣ', 'C', 'bf'],
    ['ln', 'eˣ', 'D', 'ln', 'eˣ', 'D', 'bf'],
    ['CMPLX', 'BASE', '', 'CMPLX', 'BASE', '', 'bf'],
    // ── Row 2: Trig ────────────────────────────────────────────
    ['sin', 'sin⁻¹', 'E', 'sin', 'sin⁻¹', 'E', 'bf'],
    ['cos', 'cos⁻¹', 'F', 'cos', 'cos⁻¹', 'F', 'bf'],
    ['tan', 'tan⁻¹', 'G', 'tan', 'tan⁻¹', 'G', 'bf'],
    ['S↔D', 'ENG', 'H', 'S↔D', 'ENG', 'H', 'bf'],
    ['hyp', 'DRG►', 'I', 'HYP', 'DRG►', 'I', 'bf'],
    // ── Row 3: Brackets + Memory ───────────────────────────────
    ['(', 'nPr', '{', '(', 'nPr', '{', 'bf'],
    [')', 'nCr', '}', ')', 'nCr', '}', 'bf'],
    ['□/□', '|x|', '', '□/□', '|x|', '', 'bf'],
    ['M+', 'STO', 'M', 'M+', 'STO', 'M', 'bf'],
    ['RCL', 'M-', '', 'RCL', 'M−', '', 'bf'],
    // ── Row 4: Advanced ────────────────────────────────────────
    ['CONST', 'MAT', '', 'CONST', 'MAT', '', 'bf'],
    ['xʸ', 'ʸ√x', 'X', 'xʸ', 'ʸ√', 'X', 'bf'],
    ['√', '∛', 'Y', '√□', '∛□', 'Y', 'bf'],
    ['EQN', 'STAT', '', 'EQN', 'STAT', '', 'bf'],
    ['TABLE', 'Rnd', '', 'TABLE', 'Rnd', '', 'bf'],
    // ── Row 5: Clear + Util ────────────────────────────────────
    ['AC', '', '', 'AC', '', '', 'bc'],
    ['DEL', 'INS', '', 'DEL', 'INS', '', 'bf'],
    ['%', 'x!', '', '%', 'x!', '', 'bf'],
    ['Ans', 'π', '', 'Ans', 'π', '', 'bf'],
    ['(−)', 'e', 'i', '(−)', 'e', 'i', 'bf'],
    // ── Row 6: 7-8-9 + ( ) ─────────────────────────────────────
    ['7', '', '', '7', '', '', 'bn'],
    ['8', '', '', '8', '', '', 'bn'],
    ['9', '', '', '9', '', '', 'bn'],
    ['×', '', '', '×', '', '', 'bo'],
    ['÷', '', '', '÷', '', '', 'bo'],
    // ── Row 7: 4-5-6 + ops ──────────────────────────────────────
    ['4', '', '', '4', '', '', 'bn'],
    ['5', '', '', '5', '', '', 'bn'],
    ['6', '', '', '6', '', '', 'bn'],
    ['+', '', '', '+', '', '', 'bo'],
    ['-', '', '', '−', '', '', 'bo'],
    // ── Row 8: 1-2-3 + ops ──────────────────────────────────────
    ['1', '', '', '1', '', '', 'bn'],
    ['2', '', '', '2', '', '', 'bn'],
    ['3', '', '', '3', '', '', 'bn'],
    ['(', '', '', '(', '', '', 'bf'],
    [')', '', '', ')', '', '', 'bf'],
    // ── Row 9: 0 . EXP DRG► = ──────────────────────────────────
    ['0', '', '', '0', '', '', 'bn'],
    ['.', '', '.', '.', '', '.', 'bn'],
    ['EXP', '×10ⁿ', '', 'EXP', '×10ⁿ', '', 'bn'],
    ['nPr', 'nCr', '', 'nPr', 'nCr', '', 'bf'],
    ['=', '', '', '=', '', '', 'be'],
];

/* ═══════════════════════ BUILD KEYBOARD ═══════════════════════ */
function buildKB() {
    const kb = qi('kb');
    KD.forEach(([pa, sa, aa, pl, sl, al, cls]) => {
        const btn = document.createElement('button');
        btn.className = `btn ${cls}`;
        // Rivets
        ['rv rv-tl', 'rv rv-tr'].forEach(c => { const r = document.createElement('span'); r.className = c; btn.appendChild(r) });
        const mkL = (t, c) => { const d = document.createElement('div'); d.className = c; d.textContent = t || ''; return d };
        const ll = String(pl || '').length;
        btn.appendChild(mkL(sl, 'lsh'));
        const lm = mkL(pl, 'lmn' + (ll >= 7 ? ' xs' : ll >= 5 ? ' sm' : ''));
        btn.appendChild(lm);
        btn.appendChild(mkL(al, 'lal'));
        btn.addEventListener('click', () => {
            const act = ST.shift && sa ? sa : ST.alpha && aa ? aa : pa;
            dispatch(act);
        });
        btn.addEventListener('contextmenu', e => e.preventDefault());
        kb.appendChild(btn);
    });
    draw();
}

/* ═══════════════════════ KEYBOARD SHORTCUTS ═══════════════════════ */
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    const k = e.key;
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const m = {
        'Enter': '=', 'Backspace': 'DEL', 'Delete': 'INS', 'Escape': 'AC',
        'ArrowLeft': 'LEFT', 'ArrowRight': 'RIGHT', 'ArrowUp': 'UP', 'ArrowDown': 'DOWN',
        '/': '÷', '*': '×', '%': '%'
    };
    if (m[k]) { dispatch(m[k]); return }
    if (/^[\d.()+\-,.]$/.test(k)) { dispatch(k); return }
    if (/^[a-fA-F]$/.test(k) && ST.mode === 'BASE') { eApp(k.toUpperCase()); ST.shift = false; ST.alpha = false; draw() }
});

/* ═══════════════════════ MODE GRID ═══════════════════════ */
function buildModeGrid() {
    const g = qi('mode-grid');
    MODES.forEach((m, i) => {
        const c = document.createElement('div');
        c.className = 'mc' + (ST.mode === m.n ? ' on' : '');
        c.innerHTML = `<div class="mc-n">${i + 1}</div><div class="mc-l">${m.l}</div>`;
        c.addEventListener('click', () => { setMode(m.n); OV.close('ov-mode') });
        g.appendChild(c);
    });
}

/* ═══════════════════════ CONSTANTS ═══════════════════════ */
function buildConsts(filter = '') {
    const list = qi('cs-list'); list.innerHTML = '';
    CONSTS.filter(c => !filter || c.n.toLowerCase().includes(filter.toLowerCase()) || c.s.toLowerCase().includes(filter.toLowerCase()))
        .forEach(c => {
            const d = document.createElement('div'); d.className = 'ci';
            d.innerHTML = `<span class="ci-s">${c.s}</span><span class="ci-n">${c.n}<br><span style="font-size:10px;color:#1a4060">${c.u}</span></span><span class="ci-v">${fmtN(c.v, 5)}</span>`;
            d.addEventListener('click', () => { eApp(String(c.v)); OV.close('ov-const'); draw() });
            list.appendChild(d);
        });
}
function filterConsts(q) { buildConsts(q) }

/* ═══════════════════════ MATRIX ═══════════════════════ */
let mdR = 2, mdC = 2;
function buildMatGrid(r, c, id) {
    const g = qi(id); g.innerHTML = '';
    g.style.cssText = `display:inline-grid;grid-template-columns:repeat(${c},1fr);gap:4px;margin-bottom:4px`;
    for (let i = 0; i < r * c; i++) { const inp = document.createElement('input'); inp.className = 'mc-inp'; inp.type = 'number'; inp.value = 0; g.appendChild(inp) }
}
function setMatDim(r, c, el) {
    mdR = r; mdC = c;
    document.querySelectorAll('#ov-mat .db').forEach(b => b.classList.remove('on')); el.classList.add('on');
    buildMatGrid(r, c, 'mg-a'); buildMatGrid(r, c, 'mg-b');
}
function getM(id, r, c) {
    const inp = qi(id).querySelectorAll('input'); const M = [];
    for (let i = 0; i < r; i++) { M.push([]); for (let j = 0; j < c; j++)M[i].push(parseFloat(inp[i * c + j].value) || 0) }
    return M;
}
const mDet = M => { const n = M.length; if (n === 1) return M[0][0]; if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0]; let d = 0; for (let j = 0; j < n; j++) { const sub = M.slice(1).map(r => r.filter((_, ci) => ci !== j)); d += (-1) ** j * M[0][j] * mDet(sub) } return d };
const mTrn = M => M[0].map((_, i) => M.map(r => r[i]));
const mAdd = (A, B) => A.map((r, i) => r.map((v, j) => v + B[i][j]));
const mSub = (A, B) => A.map((r, i) => r.map((v, j) => v - B[i][j]));
const mMul = (A, B) => { const Bt = mTrn(B); return A.map(ra => Bt.map(rb => ra.reduce((s, v, i) => s + v * rb[i], 0))) };
function mInv(M) {
    const n = M.length, d = mDet(M);
    if (Math.abs(d) < 1e-14) throw new Error('Singular matrix');
    if (n === 2) { const [[a, b], [c, dd]] = M; return [[dd / d, -b / d], [-c / d, a / d]] }
    const adj = M.map((r, i) => r.map((_, j) => { const sub = M.filter((_, ri) => ri !== i).map(rr => rr.filter((_, ci) => ci !== j)); return (-1) ** (i + j) * mDet(sub) }));
    return mTrn(adj).map(r => r.map(v => v / d));
}
function mFmt(M, label = '') { return label + '\n' + M.map(r => '[ ' + r.map(v => fmtN(v, 5).padStart(12)).join('  ') + ' ]').join('\n') }
function matOp(op) {
    const A = getM('mg-a', mdR, mdC), B = getM('mg-b', mdR, mdC); let res = '';
    try {
        if (op === 'det') res = `det(A) = ${fmtN(mDet(A))}`;
        else if (op === 'inv') res = mFmt(mInv(A), 'A⁻¹ =');
        else if (op === 'trn') res = mFmt(mTrn(A), 'Aᵀ =');
        else if (op === 'add') res = mFmt(mAdd(A, B), 'A+B =');
        else if (op === 'sub') res = mFmt(mSub(A, B), 'A−B =');
        else if (op === 'mul') res = mFmt(mMul(A, B), 'A×B =');
    } catch (ex) { res = 'Error: ' + ex.message }
    qi('mat-res').textContent = res;
}

/* ═══════════════════════ EQUATION SOLVER ═══════════════════════ */
let eqnType = 'quad';
function setEqnType(t, el) {
    eqnType = t;
    document.querySelectorAll('#ov-eqn .db').forEach(b => b.classList.remove('on')); el.classList.add('on');
    buildEqnForm(t); qi('eq-res').textContent = 'Nhấn SOLVE để giải…';
}
function inp(id, lbl, val) { return `<span class="el">${lbl}</span><input class="ei" id="${id}" type="number" value="${val}">` }
function buildEqnForm(t) {
    const f = qi('eqn-form');
    if (t === 'quad') {
        f.innerHTML = `<div class="ef"><div style="font-size:11px;color:var(--lcd-mid);margin-bottom:6px">ax² + bx + c = 0</div>
<div class="er">${inp('qa', 'a =', '1')}${inp('qb', 'b =', '-5')}${inp('qc', 'c =', '6')}</div></div>`;
    } else if (t === 'cubic') {
        f.innerHTML = `<div class="ef"><div style="font-size:11px;color:var(--lcd-mid);margin-bottom:6px">ax³ + bx² + cx + d = 0</div>
<div class="er">${inp('ca', 'a =', '1')}${inp('cb', 'b =', '-6')}${inp('cc', 'c =', '11')}${inp('cd', 'd =', '-6')}</div></div>`;
    } else if (t === 'sys2') {
        f.innerHTML = `<div class="ef">
<div style="font-size:11px;color:var(--lcd-mid);margin-bottom:6px">a₁x + b₁y = c₁  /  a₂x + b₂y = c₂</div>
<div class="er" style="margin-bottom:6px">${inp('s2a1', 'a₁', '2')}${inp('s2b1', 'b₁', '1')}${inp('s2c1', 'c₁', '8')}</div>
<div class="er">${inp('s2a2', 'a₂', '1')}${inp('s2b2', 'b₂', '3')}${inp('s2c2', 'c₂', '13')}</div></div>`;
    } else {
        f.innerHTML = `<div class="ef">
<div style="font-size:11px;color:var(--lcd-mid);margin-bottom:6px">aᵢx + bᵢy + cᵢz = dᵢ  (i=1,2,3)</div>
${[1, 2, 3].map(i => `<div class="er" style="margin-bottom:4px">
${inp(`s3a${i}`, `a${i}`, i === 1 ? '2' : i === 2 ? '1' : '3')}
${inp(`s3b${i}`, `b${i}`, i === 1 ? '1' : i === 2 ? '3' : '2')}
${inp(`s3c${i}`, `c${i}`, i === 1 ? '1' : i === 2 ? '2' : '1')}
${inp(`s3d${i}`, `= d${i}`, i === 1 ? '9' : i === 2 ? '16' : '10')}</div>`).join('')}</div>`;
    }
}
const gv = id => { const el = qi(id); return el ? parseFloat(el.value) || 0 : 0 };
function solveEqn() {
    try {
        if (eqnType === 'quad') {
            const a = gv('qa'), b = gv('qb'), c = gv('qc');
            if (Math.abs(a) < 1e-14) { qi('eq-res').textContent = `Linear: x = ${fmtN(-c / (b || 1))}`; return }
            const D = b * b - 4 * a * c;
            if (D >= 0) {
                const x1 = (-b + Math.sqrt(D)) / (2 * a), x2 = (-b - Math.sqrt(D)) / (2 * a);
                qi('eq-res').textContent = `Δ = ${fmtN(D)}\n\nx₁ = ${fmtN(x1)}\nx₂ = ${fmtN(x2)}`;
            } else {
                const re = -b / (2 * a), im = Math.sqrt(-D) / (2 * a);
                qi('eq-res').textContent = `Δ = ${fmtN(D)} < 0  (complex roots)\n\nx₁ = ${fmtN(re)} + ${fmtN(im)}i\nx₂ = ${fmtN(re)} − ${fmtN(im)}i`;
            }
        } else if (eqnType === 'cubic') {
            const txt = solveCubic(gv('ca'), gv('cb'), gv('cc'), gv('cd'));
            qi('eq-res').textContent = txt;
        } else if (eqnType === 'sys2') {
            const a1 = gv('s2a1'), b1 = gv('s2b1'), c1 = gv('s2c1');
            const a2 = gv('s2a2'), b2 = gv('s2b2'), c2 = gv('s2c2');
            const D = a1 * b2 - a2 * b1;
            if (Math.abs(D) < 1e-14) { qi('eq-res').textContent = 'No unique solution (D = 0)'; return }
            const x = (c1 * b2 - c2 * b1) / D, y = (a1 * c2 - a2 * c1) / D;
            ST.vars.X = x; ST.vars.Y = y;
            qi('eq-res').textContent = `D = ${fmtN(D)}\n\nx = ${fmtN(x)}\ny = ${fmtN(y)}\n\n(Stored in X, Y)`;
        } else {
            const A = [
                [gv('s3a1'), gv('s3b1'), gv('s3c1'), gv('s3d1')],
                [gv('s3a2'), gv('s3b2'), gv('s3c2'), gv('s3d2')],
                [gv('s3a3'), gv('s3b3'), gv('s3c3'), gv('s3d3')],
            ];
            const sol = gaussian3(A);
            if (!sol) { qi('eq-res').textContent = 'No unique solution'; return }
            ST.vars.X = sol[0]; ST.vars.Y = sol[1];
            qi('eq-res').textContent = `x = ${fmtN(sol[0])}\ny = ${fmtN(sol[1])}\nz = ${fmtN(sol[2])}\n\n(x,y stored in X,Y)`;
        }
    } catch (ex) { qi('eq-res').textContent = 'Error: ' + ex.message }
}
function gaussian3(A) {
    const n = 3;
    for (let col = 0; col < n; col++) {
        let maxR = col; for (let row = col + 1; row < n; row++)if (Math.abs(A[row][col]) > Math.abs(A[maxR][col])) maxR = row;
        [A[col], A[maxR]] = [A[maxR], A[col]];
        if (Math.abs(A[col][col]) < 1e-14) return null;
        for (let row = col + 1; row < n; row++) {
            const f = A[row][col] / A[col][col];
            for (let j = col; j <= n; j++)A[row][j] -= f * A[col][j];
        }
    }
    const x = [0, 0, 0];
    for (let i = n - 1; i >= 0; i--) {
        x[i] = A[i][n];
        for (let j = i + 1; j < n; j++)x[i] -= A[i][j] * x[j];
        x[i] /= A[i][i];
    }
    return x;
}
function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-14) {
        const D = b * b - 4 * c * d; if (D < 0) return 'Quadratic: complex roots';
        return `x₁ = ${fmtN((-b + Math.sqrt(D)) / (2 * c))}\nx₂ = ${fmtN((-b - Math.sqrt(D)) / (2 * c))}`;
    }
    const p = (3 * a * c - b * b) / (3 * a * a), q = (2 * b ** 3 - 9 * a * b * c + 27 * a * a * d) / (27 * a ** 3);
    const D = q * q / 4 + (p) ** 3 / 27;
    const sh = -b / (3 * a);
    let lines = [];
    if (D > 1e-14) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(D)), v = Math.cbrt(-q / 2 - Math.sqrt(D));
        lines.push(`x₁ = ${fmtN(u + v + sh)} (real)`);
        const re = (u + v) / (-2) + sh, im = Math.abs((u - v) * Math.sqrt(3) / 2);
        lines.push(`x₂ = ${fmtN(re)} + ${fmtN(im)}i`);
        lines.push(`x₃ = ${fmtN(re)} − ${fmtN(im)}i`);
    } else if (Math.abs(D) <= 1e-14) {
        const u = Math.cbrt(-q / 2);
        lines.push(`x₁ = ${fmtN(2 * u + sh)}`);
        lines.push(`x₂ = x₃ = ${fmtN(sh - u)}`);
    } else {
        const r = Math.sqrt((-p) ** 3 / 27), th = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
        const m = 2 * Math.cbrt(r);
        for (let k = 0; k < 3; k++)lines.push(`x${k + 1} = ${fmtN(m * Math.cos((th + 2 * Math.PI * k) / 3) + sh)}`);
    }
    return `Δ = ${fmtN(D)}\n\n` + lines.join('\n');
}

/* ═══════════════════════ STATISTICS ═══════════════════════ */
let statType = '1var';
function setStatType(t, el) {
    statType = t;
    document.querySelectorAll('#ov-stat .db').forEach(b => b.classList.remove('on')); el.classList.add('on');
    qi('st-hint').textContent = t === '1var' ? 'Enter x values:' : 'Enter x and y values:';
    clrStat(); for (let i = 0; i < 4; i++)addStatRow();
}
function addStatRow() {
    const c = qi('st-data'), r = document.createElement('div'); r.className = 'sr';
    const xi = document.createElement('input'); xi.className = 'si'; xi.type = 'number'; xi.placeholder = 'x'; r.appendChild(xi);
    if (statType === '2var') { const yi = document.createElement('input'); yi.className = 'si'; yi.type = 'number'; yi.placeholder = 'y'; r.appendChild(yi) }
    const rm = document.createElement('button'); rm.textContent = '✕';
    rm.style.cssText = 'background:#0a1828;border:1px solid #1e3a50;border-radius:4px;color:#4a6a80;padding:4px 8px;cursor:pointer;flex-shrink:0';
    rm.addEventListener('click', () => r.remove()); r.appendChild(rm); c.appendChild(r);
}
function clrStat() { qi('st-data').innerHTML = ''; qi('st-res').innerHTML = '' }
function calcStat() {
    const rows = qi('st-data').querySelectorAll('.sr');
    const xs = [], ys = [];
    rows.forEach(r => { const ins = r.querySelectorAll('input'); const x = parseFloat(ins[0].value); if (!isNaN(x)) { xs.push(x); if (ins[1]) ys.push(parseFloat(ins[1].value) || 0) } });
    if (xs.length < 2) { qi('st-res').innerHTML = '<div style="color:var(--dim);font-size:12px">Need ≥ 2 data points</div>'; return }
    const n = xs.length, sx = xs.reduce((a, b) => a + b, 0), sx2 = xs.reduce((a, b) => a + b * b, 0), mx = sx / n;
    const sdxP = Math.sqrt((sx2 - n * mx * mx) / n), sdxS = Math.sqrt((sx2 - n * mx * mx) / (n - 1));
    const sorted = [...xs].sort((a, b) => a - b); const mdn = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const sv = (k, v) => `<div class="sv"><span class="sk">${k}</span><span>${typeof v === 'number' ? fmtN(v) : v}</span></div>`;
    let h = sv('n', n) + sv('Σx', sx) + sv('Σx²', sx2) + sv('x̄', mx) + sv('σx', sdxP) + sv('sx', sdxS) + sv('Med', mdn) + sv('Min', Math.min(...xs)) + sv('Max', Math.max(...xs));
    if (statType === '2var' && ys.length === n) {
        const sy = ys.reduce((a, b) => a + b, 0), sy2 = ys.reduce((a, b) => a + b * b, 0);
        const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0), my = sy / n;
        const r = (sxy - n * mx * my) / Math.sqrt((sx2 - n * mx * mx) * (sy2 - n * my * my) || 1);
        const bH = (sxy - n * mx * my) / (sx2 - n * mx * mx || 1), aH = my - bH * mx;
        h += sv('ȳ', my) + sv('Σy', sy) + sv('Σy²', sy2) + sv('Σxy', sxy) + sv('r', r) + sv('â', aH) + sv('b̂', bH);
    }
    qi('st-res').innerHTML = h;
}

/* ═══════════════════════ TABLE ═══════════════════════ */
function genTable() {
    const fx = qi('t-fx').value || 'x';
    const st = parseFloat(qi('t-s').value) || 0, en = parseFloat(qi('t-e').value) || 10, dt = parseFloat(qi('t-d').value) || 1;
    const out = qi('tbl-out'); out.innerHTML = '';
    if (dt === 0 || Math.abs((en - st) / dt) > 500) { out.innerHTML = '<div style="color:var(--dim);font-size:12px">Too many rows</div>'; return }
    const rows = [];
    for (let x = st; x <= en + 1e-10; x += dt) {
        try { const v = mathEval(fx, { X: x, x, Ans: ST.ans }, ST.angle, false); rows.push([x, v]) }
        catch { rows.push([x, NaN]) }
    }
    const t = document.createElement('table'); t.className = 'tg';
    t.innerHTML = `<tr><th>x</th><th>f(x)</th></tr>` +
        rows.map(([x, y]) => `<tr><td>${fmtN(x, 5)}</td><td>${isNaN(y) ? '—' : fmtN(y, 6)}</td></tr>`).join('');
    out.appendChild(t);
}

/* ═══════════════════════ INIT ═══════════════════════ */
buildKB();
buildModeGrid();
buildConsts();
buildEqnForm('quad');
buildMatGrid(2, 2, 'mg-a');
buildMatGrid(2, 2, 'mg-b');
clrStat(); for (let i = 0; i < 4; i++)addStatRow();
draw();
qi('i-DEG').className = 'ind lit';