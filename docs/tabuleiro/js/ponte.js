// ponte.js — Arcana RPG 2.0: liga as partes do site abertas no MESMO navegador
// (a ficha, a Área do Mestre e o Tabuleiro), em abas diferentes ou uma dentro da outra.
// Usa o BroadcastChannel do navegador: uma aba avisa, as outras do mesmo site escutam.
// As fichas prontas para o tabuleiro ficam guardadas no IndexedDB ("arcana-rpg" › "fichas"),
// assim o Tabuleiro usa as fichas do site sem precisar exportar arquivo.

const NOME_CANAL = 'arcana-rpg-ponte';
const canal = typeof BroadcastChannel === 'function' ? new BroadcastChannel(NOME_CANAL) : null;
const ouvintes = new Set();
canal?.addEventListener('message', ev => {
  const m = ev.data;
  if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
  for (const fn of ouvintes) { try { fn(m); } catch (e) { console.warn('ponte:', e); } }
});
const novoId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

export const ponteDisponivel = !!canal;
export function avisar(msg) { try { canal?.postMessage(msg); } catch (e) { console.warn('ponte:', e); } }
export function ouvir(fn) { ouvintes.add(fn); return () => ouvintes.delete(fn); }
// manda e espera a resposta de outra aba; null se ninguém respondeu (ex.: a aba não está aberta)
export function perguntar(msg, ms = 600) {
  if (!canal) return Promise.resolve(null);
  const pid = novoId();
  return new Promise(ok => {
    const fim = setTimeout(() => { ouvintes.delete(ver); ok(null); }, ms);
    const ver = m => { if (m.t === 'resposta' && m.pid === pid) { clearTimeout(fim); ouvintes.delete(ver); ok(m); } };
    ouvintes.add(ver);
    avisar({ ...msg, pid });
  });
}
export function responder(pergunta, extra = {}) { if (pergunta?.pid) avisar({ t: 'resposta', pid: pergunta.pid, ...extra }); }

// ---------- fichas prontas para o tabuleiro (IndexedDB) ----------
let bancoP = null;
function banco() {
  if (bancoP) return bancoP;
  bancoP = new Promise((ok, erro) => {
    if (typeof indexedDB === 'undefined') { erro(Error('sem IndexedDB')); return; }
    const r = indexedDB.open('arcana-rpg', 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('fichas')) r.result.createObjectStore('fichas'); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => erro(r.error);
  });
  bancoP.catch(() => { bancoP = null; });
  return bancoP;
}
async function operar(modo, fn) {
  const db = await banco();
  return new Promise((ok, erro) => {
    const tx = db.transaction('fichas', modo), st = tx.objectStore('fichas');
    const r = fn(st);
    tx.oncomplete = () => ok(r?.result);
    tx.onerror = () => erro(tx.error);
  });
}
// guarda as fichas (lista de { id, ficha }) e avisa as outras abas
export async function guardarFichas(lista, apagarOutras = false) {
  try {
    await operar('readwrite', st => {
      if (apagarOutras) st.clear();
      for (const { id, ficha } of lista) st.put({ id, ficha, t: Date.now() }, id);
    });
    for (const { id } of lista) avisar({ t: 'ficha-mudou', id });
  } catch (e) { console.warn('ponte: não guardei as fichas', e); }
}
export async function apagarFicha(id) { try { await operar('readwrite', st => st.delete(id)); avisar({ t: 'ficha-mudou', id, apagada: true }); } catch {} }
export async function lerFichas() {
  try { return (await operar('readonly', st => st.getAll())) || []; } catch { return []; }
}
export async function lerFicha(id) {
  try { return (await operar('readonly', st => st.get(id))) || null; } catch { return null; }
}

// ---------- o mesmo código para a Mesa online e o Tabuleiro ----------
const CHAVE_CODIGO = 'arcana-rpg-codigo';
export function codigoDaMesa() { try { const c = String(localStorage.getItem(CHAVE_CODIGO) || ''); return /^[A-Z0-9]{6}$/.test(c) ? c : ''; } catch { return ''; } }
export function guardarCodigoDaMesa(c) { try { if (/^[A-Z0-9]{6}$/.test(c)) localStorage.setItem(CHAVE_CODIGO, c); } catch {} }
