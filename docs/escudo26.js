// Arcana RPG 2.6: Calabouço e Escudo do Mestre.
// Aqui ficam as partes novas que não dependem do resto da Área do Mestre:
//  - anotações e homebrews (título + partes com subtítulo e texto);
//  - a pesquisa do Escudo (sem acento, várias palavras, com trecho do texto achado);
//  - as janelas do Escudo (posição e tamanho guardados neste aparelho; arrastar pelo título, redimensionar pelo canto).
const clip=(v,n)=>String(v??'').slice(0,n);
const norm=v=>String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const uid=()=>crypto.randomUUID();
const numero=(v,a,b,d)=>{const n=Number(v);return Number.isFinite(n)?Math.min(b,Math.max(a,n)):d;};

export const TIPOS_HOMEBREW=[['item','Item'],['magia','Magia'],['regra','Regra'],['criatura','Criatura'],['especie','Espécie'],['classe','Classe ou subclasse'],['talento','Talento'],['lugar','Lugar'],['outro','Outro']];
export const nomeTipo26=t=>(TIPOS_HOMEBREW.find(x=>x[0]===t)||TIPOS_HOMEBREW[TIPOS_HOMEBREW.length-1])[1];
export const LIMITE_TEXTOS=300, LIMITE_PARTES=60;

// anotações (homebrew=false) e homebrews (homebrew=true): limpa o que veio do navegador ou de um backup
export function normalizarTextos26(arr,homebrew=false){
 const vistos=new Set();
 return (Array.isArray(arr)?arr:[]).slice(0,LIMITE_TEXTOS).filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).map(x=>{
  let id=clip(x.id,90)||uid();if(vistos.has(id))id=uid();vistos.add(id);
  const partes=(Array.isArray(x.partes)?x.partes:[]).slice(0,LIMITE_PARTES).filter(p=>p&&typeof p==='object').map(p=>({id:clip(p.id,90)||uid(),subtitulo:clip(p.subtitulo,120),texto:clip(p.texto,12000)}));
  const o={id,titulo:clip(x.titulo,120),partes,em:clip(x.em,40)};
  if(homebrew){o.tipo=TIPOS_HOMEBREW.some(t=>t[0]===x.tipo)?x.tipo:'outro';o.resumo=clip(x.resumo,300);}
  return o;});
}
export function novoTexto26(homebrew=false){const o={id:uid(),titulo:homebrew?'Nova homebrew':'Nova anotação',partes:[{id:uid(),subtitulo:'',texto:''}],em:new Date().toLocaleDateString('pt-BR')};if(homebrew){o.tipo='item';o.resumo='';}return o;}
// junta os textos de um backup aos que já existem (ids repetidos ganham id novo)
export function juntarTextos26(atuais,novos,homebrew=false){const a=normalizarTextos26(atuais,homebrew),ids=new Set(a.map(x=>x.id));for(const x of normalizarTextos26(novos,homebrew)){if(ids.has(x.id))x.id=uid();ids.add(x.id);a.push(x);}if(a.length>LIMITE_TEXTOS)throw Error('A mesclagem passa de '+LIMITE_TEXTOS+(homebrew?' homebrews.':' anotações.'));return a;}

// ---------- pesquisa ----------
// fontes: [{tipo, id, titulo, sub, campos: [texto, ...]}]. Todas as palavras precisam aparecer (sem ligar para acento).
const ORDEM={encontro:0,nota:1,npc:2,homebrew:3,monstro:4};
export function pesquisar26(q,fontes,{maxMonstros=12,max=60}={}){
 const t=norm(q).trim();if(t.length<2)return [];
 const termos=t.split(/\s+/).filter(Boolean),out=[];let monstros=0;
 for(const f of fontes){
  const campos=(f.campos||[]).map(c=>String(c??''));
  const tudo=norm([f.titulo,f.sub,...campos].join(' \n '));
  if(!termos.every(x=>tudo.includes(x)))continue;
  const nt=norm(f.titulo),pontos=nt===t?0:nt.startsWith(t)?1:termos.every(x=>nt.includes(x))?2:3;
  if(f.tipo==='monstro'&&pontos===3)continue; // monstro só pelo nome (são 500: o resto vira barulho)
  let trecho='';
  if(pontos===3)for(const c of campos){if(c&&f.sub&&String(f.sub).includes(c))continue;const i=norm(c).indexOf(termos[0]);if(i>=0){const s=Math.max(0,i-60),fim=Math.min(c.length,i+110);trecho=(s?'…':'')+c.slice(s,fim).replace(/\s+/g,' ').trim()+(fim<c.length?'…':'');break;}}
  out.push({...f,pontos,trecho});
 }
 out.sort((a,b)=>a.pontos-b.pontos||(ORDEM[a.tipo]??9)-(ORDEM[b.tipo]??9)||String(a.titulo).localeCompare(String(b.titulo),'pt-BR'));
 return out.filter(x=>x.tipo!=='monstro'||++monstros<=maxMonstros).slice(0,max);
}

// ---------- janelas do Escudo ----------
const CHAVE='arcana-escudo-26';
export const MAX_JANELAS=8;
export const TIPOS_JANELA=['combate','encontros','npcs','anotacoes','homebrews','historico','mesa','encontro','npc','monstro','nota','homebrew'];
const TAMANHO={combate:[860,620],mesa:[780,620],historico:[420,520],encontros:[520,560],npcs:[560,600],anotacoes:[560,600],homebrews:[560,600]};
export function carregarJanelas26(){
 try{const v=JSON.parse(localStorage.getItem(CHAVE)||'[]');if(!Array.isArray(v))return [];
  const vistas=new Set();
  return v.slice(0,MAX_JANELAS).filter(w=>w&&TIPOS_JANELA.includes(w.tipo)).map(w=>({id:/^[A-Za-z0-9-]{1,40}$/.test(String(w.id))?w.id:uid(),tipo:w.tipo,ref:clip(w.ref,90),x:numero(w.x,-2000,4000,40),y:numero(w.y,0,3000,90),w:numero(w.w,300,2400,460),h:numero(w.h,180,1800,520),min:!!w.min,sel:clip(w.sel,90),filtro:clip(w.filtro,80)})).filter(w=>{const k=w.tipo+':'+w.ref;if(vistas.has(k))return false;vistas.add(k);return true;});
 }catch{return [];}
}
export function guardarJanelas26(lista){try{localStorage.setItem(CHAVE,JSON.stringify(lista.map(({id,tipo,ref,x,y,w,h,min,sel,filtro})=>({id,tipo,ref,x,y,w,h,min,sel,filtro}))));}catch{}}
// abre (ou traz para a frente) a janela do tipo+ref; devolve a lista nova
// base: {x, y} = canto onde as janelas novas começam (no computador, à direita da coluna do Escudo)
export function abrirJanela26(lista,tipo,ref='',base=null){
 if(!TIPOS_JANELA.includes(tipo))throw Error('Janela desconhecida.');
 const ja=lista.find(w=>w.tipo===tipo&&w.ref===ref);
 if(ja){ja.min=false;return [...lista.filter(w=>w!==ja),ja];}
 let l=[...lista];if(l.length>=MAX_JANELAS){const velha=l.find(w=>w.min)||l[0];l=l.filter(w=>w!==velha);}
 // base.direita: até onde as janelas novas podem ir (a gaveta "Feed de dados" da Mesa online ocupa a direita)
 const n=l.length,[w,h]=TAMANHO[tipo]||[460,540],vw=base?.direita||(typeof innerWidth==='number'?innerWidth:1366),vh=typeof innerHeight==='number'?innerHeight:900;
 // cada janela nova abre um pouco mais para baixo e para a direita (em cascata), sem passar da tela
 const passo=(n%6)*28;let x=base?base.x+passo:40+(n*36)%288,y=base?base.y+passo:96+(n*32)%256;
 const larg=Math.max(300,Math.min(w,vw-x-12));if(x+larg>vw-8)x=Math.max(8,vw-larg-8);
 const alt=Math.max(220,Math.min(h,vh-y-72));if(y+alt>vh-8)y=Math.max(8,vh-alt-72);
 return [...l,{id:uid(),tipo,ref,x:Math.round(x),y:Math.round(y),w:Math.round(larg),h:Math.round(alt),min:false,sel:'',filtro:''}];
}
export const janelaDoTopo26=lista=>[...lista].reverse().find(w=>!w.min)?.id||'';

// arrastar pela barra de título, trazer para a frente ao tocar, guardar o tamanho depois de redimensionar.
// Liga uma vez só; os callbacks recebem o id da janela.
let instalado=false;
export function instalarJanelas26({aoMover,aoFrente}){
 if(instalado||typeof document==='undefined')return;instalado=true;
 document.addEventListener('pointerdown',e=>{
  const win=e.target.closest?.('.dm-win');if(!win)return;
  aoFrente(win.dataset.win,win);
  const cab=e.target.closest('.dm-win-head');
  if(!cab||e.target.closest('button,a,input,select,textarea,label')||matchMedia('(max-width:700px)').matches)return;
  e.preventDefault();
  const r=win.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;
  try{cab.setPointerCapture(e.pointerId);}catch{}
  win.classList.add('is-arrastando');
  const mover=ev=>{const x=Math.max(120-r.width,Math.min(innerWidth-120,ev.clientX-dx)),y=Math.max(0,Math.min(innerHeight-44,ev.clientY-dy));win.style.left=x+'px';win.style.top=y+'px';};
  const soltar=()=>{cab.removeEventListener('pointermove',mover);cab.removeEventListener('pointerup',soltar);cab.removeEventListener('pointercancel',soltar);win.classList.remove('is-arrastando');aoMover(win.dataset.win,{x:parseFloat(win.style.left)||0,y:parseFloat(win.style.top)||0});};
  cab.addEventListener('pointermove',mover);cab.addEventListener('pointerup',soltar);cab.addEventListener('pointercancel',soltar);
 });
 // o canto de redimensionar é do próprio navegador (CSS resize): ao soltar, guarda o tamanho novo
 document.addEventListener('pointerup',e=>{
  const win=e.target.closest?.('.dm-win');if(!win||matchMedia('(max-width:700px)').matches)return;
  const w=win.offsetWidth,h=win.offsetHeight;
  if(Math.abs(w-(Number(win.dataset.w)||0))>2||Math.abs(h-(Number(win.dataset.h)||0))>2){win.dataset.w=w;win.dataset.h=h;aoMover(win.dataset.win,{w,h});}
 });
}
