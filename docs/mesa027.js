// Ficha Arcana 0.27 — Mesa online.
// O mestre cria uma sala com código; os jogadores entram com suas fichas.
// Conexão direta entre navegadores (WebRTC) com PeerJS (vendor/peerjs-1.5.4.min.js, licença MIT).
// O mestre é o "anfitrião": guarda o estado da mesa e repassa para todos.
// Jogador: barra lateral à direita (não cobre a ficha) com iniciativa, pedidos e o registro ao vivo.
// Mestre: aba "Mesa online" com código, jogadores e pedidos; combate e painéis ficam na aba Encontros.
import {ABILITIES,SKILLS} from './data.js?v=0.27';

const CFG_KEY='arcana-mesa',HOST_KEY='arcana-mesa-host',SERVER_KEY='arcana-mesa-server',DRAWER_KEY='arcana-mesa-drawer';
const ALPHABET='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
const clip=(v,n=200)=>String(v??'').slice(0,n);
const num=(v,min=-9999,max=9999,def=0)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):def;};
const uid=()=>(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36));
const sgn=n=>(n>=0?'+':'')+n;
const time=t=>{try{return new Date(t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}catch{return '';}};
const hostPeerId=code=>'arcana-mesa-'+code.toLowerCase();
export const normalizeCode=v=>String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
const readJSON=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??def;}catch{return def;}};
const writeJSON=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const ABIL=Object.fromEntries(ABILITIES.map(a=>[a[0],a]));
const KINDS=['pc','npc'],STATUS=['Ileso','Ferido','Ensanguentado','Caído',''];
const stClass=s=>'mesa-st-'+String(s||'').normalize('NFD').replace(/[^a-zA-Z]/g,'');

export function monsterStatus(hp,maxHp){hp=Number(hp)||0;maxHp=Math.max(1,Number(maxHp)||1);if(hp<=0)return 'Caído';if(hp<=maxHp/2)return 'Ensanguentado';if(hp<maxHp)return 'Ferido';return 'Ileso';}
export function requestLabel(r){if(!r)return '';if(r.kind==='initiative')return 'Iniciativa';if(r.kind==='save')return 'Salvaguarda de '+(ABIL[r.key]?.[2]||r.key);if(r.kind==='skill')return 'Teste de '+r.skill;return 'Teste de '+(ABIL[r.key]?.[2]||r.key);}

let libPromise=null;
function loadLib(){if(window.Peer)return Promise.resolve();if(libPromise)return libPromise;libPromise=new Promise((ok,fail)=>{const s=document.createElement('script');s.src='vendor/peerjs-1.5.4.min.js?v=0.27';s.onload=()=>window.Peer?ok():fail(Error('Biblioteca de conexão não carregou.'));s.onerror=()=>{libPromise=null;fail(Error('Não foi possível carregar a biblioteca de conexão. Verifique a internet.'));};document.head.appendChild(s);});return libPromise;}
function peerOptions(){const o={debug:1};const s=readJSON(SERVER_KEY,null);if(s&&typeof s==='object')for(const k of ['host','port','path','secure','key','config'])if(k in s)o[k]=s[k];return o;}
function errorText(e){const t=e?.type||'';if(t==='peer-unavailable')return 'Sala não encontrada. Confira o código e peça ao mestre para abrir a Área do Mestre › Mesa online.';if(t==='network'||t==='server-error'||t==='socket-error'||t==='socket-closed')return 'Sem conexão com o serviço de salas. Tentando de novo…';if(t==='browser-incompatible')return 'Este navegador não permite a conexão direta (WebRTC). Use Chrome, Edge, Firefox ou Safari atualizados.';if(t==='unavailable-id')return 'O código da sala ainda está ocupado. Tentando de novo…';return e?.message||'Erro de conexão.';}

function cleanSummary(s){s=s&&typeof s==='object'?s:{};const out={charName:clip(s.charName,80),classLine:clip(s.classLine,120),hp:num(s.hp,0,9999),hpMax:num(s.hpMax,0,9999),temp:num(s.temp,0,9999),ac:num(s.ac,0,99),life:clip(s.life,20),conditions:Array.isArray(s.conditions)?s.conditions.slice(0,20).map(x=>clip(x,40)):[],mods:{},saves:{},passive:num(s.passive,0,99),initiative:num(s.initiative,-20,40),speed:clip(s.speed,40),concentration:clip(s.concentration,80)};for(const [k] of ABILITIES){out.mods[k]=num(s.mods?.[k],-10,20);out.saves[k]=num(s.saves?.[k],-10,30);}return out;}
// Tudo o que vem do mestre é limpo antes de aparecer na tela (números viram números, textos são cortados).
function cleanState(st){const arr=v=>Array.isArray(v)?v:[];const init=st.init&&typeof st.init==='object'?st.init:{};const order=arr(init.order).slice(0,80).map(o=>({id:clip(o?.id,130),name:clip(o?.name,80),kind:KINDS.includes(o?.kind)?o.kind:'npc',pid:clip(o?.pid,60),value:o?.value==null||o.value===''?null:num(o.value,-50,99),status:STATUS.includes(o?.status)?o.status:''}));
 return {code:normalizeCode(st.code),players:arr(st.players).slice(0,30).map(p=>({pid:clip(p?.pid,60),name:clip(p?.name,60),charName:clip(p?.charName,80),online:!!p?.online,summary:cleanSummary(p?.summary)})),
  log:arr(st.log).slice(0,80).map(e=>({id:clip(e?.id,80),t:num(e?.t,0,9e15,0),who:clip(e?.who,80),label:clip(e?.label,160),total:clip(e?.total,60),detail:clip(e?.detail,400),kind:clip(String(e?.kind||'roll').replace(/[^a-z]/g,''),20),hidden:false})),
  init:{active:!!init.active,order,turn:num(init.turn,-1,Math.max(0,order.length-1),-1),round:num(init.round,1,999,1)},
  monsters:arr(st.monsters).slice(0,80).map(m=>({id:clip(m?.id,80),name:clip(m?.name,80),status:STATUS.includes(m?.status)?m.status:''})),
  pending:arr(st.pending).slice(0,60).map(r=>({id:clip(r?.id,80),pid:clip(r?.pid,60),kind:['save','check','skill','initiative'].includes(r?.kind)?r.kind:'check',key:ABIL[r?.key]?r.key:'dex',skill:SKILLS.some(x=>x[0]===r?.skill)?r.skill:'',dc:num(r?.dc,0,40,0),label:clip(r?.label,80)}))};}

export function createMesa({toast=()=>{},rerender=()=>{},player={},dm={}}={}){
 let cfg=readJSON(CFG_KEY,{});if(typeof cfg!=='object'||!cfg)cfg={};
 cfg.pid=cfg.pid||uid();
 let role=null,status='off',lastError='',peer=null,conn=null,retryTimer=null,room=null,activeReq=null,stashed=null,lastSheetHash='',sheetTimer=null,lastTurnKey='',seenPending=new Set(),closing=false;
 let drawerOpen=readJSON(DRAWER_KEY,false)===true,inSheet=false,drawerRoot=null,drawerFrame=0,flashIds=new Set();
 let host=normalizeHost(readJSON(HOST_KEY,null));const conns=new Map();let lastPublic='',pulse=null,rerenderTimer=null,lastStatus={};
 const saveCfg=()=>writeJSON(CFG_KEY,cfg);saveCfg();
 function normalizeHost(h){h=h&&typeof h==='object'?h:{};return {code:normalizeCode(h.code),players:h.players&&typeof h.players==='object'?h.players:{},log:Array.isArray(h.log)?h.log.slice(0,150):[],pending:Array.isArray(h.pending)?h.pending.slice(0,60):[],showDmRolls:h.showDmRolls!==false};}
 const saveHost=()=>writeJSON(HOST_KEY,host);
 const softRerender=()=>{clearTimeout(rerenderTimer);rerenderTimer=setTimeout(()=>rerender(),40);};
 function destroyPeer(){clearTimeout(retryTimer);retryTimer=null;try{conn?.close();}catch{}conn=null;for(const c of conns.values()){try{c.close();}catch{}}conns.clear();try{peer?.destroy();}catch{}peer=null;}

 // =============== MESTRE ===============
 function newCode(){let s='';const a=new Uint32Array(6);crypto.getRandomValues(a);for(const n of a)s+=ALPHABET[n%ALPHABET.length];return s;}
 async function hostStart(code){await loadLib();closing=false;role='dm';cfg.role='dm';if(!code||code!==host.code)host=normalizeHost({code:code||newCode(),showDmRolls:host.showDmRolls});for(const p of Object.values(host.players))p.online=false;cfg.code=host.code;saveCfg();saveHost();connectHost(0);startPulse();rerender();}
 function connectHost(attempt){destroyPeer();status=attempt?'reconnecting':'connecting';lastError='';const p=new window.Peer(hostPeerId(host.code),peerOptions());peer=p;
  p.on('open',()=>{if(peer!==p)return;status='online';lastError='';rerender();broadcast(true);});
  p.on('connection',c=>{c.on('data',d=>{try{hostReceive(c,d);}catch(e){console.warn('Mesa: mensagem ignorada',e);}});c.on('close',()=>hostClosed(c));c.on('error',()=>hostClosed(c));});
  p.on('disconnected',()=>{if(peer!==p||closing)return;status='reconnecting';rerender();retryTimer=setTimeout(()=>{try{p.reconnect();}catch{connectHost(attempt+1);}},2000);});
  p.on('error',e=>{if(peer!==p||closing)return;lastError=errorText(e);if(e.type==='peer-unavailable')return;if(attempt<40&&['unavailable-id','network','server-error','socket-error','socket-closed','disconnected'].includes(e.type)){status='reconnecting';rerender();clearTimeout(retryTimer);retryTimer=setTimeout(()=>connectHost(attempt+1),e.type==='unavailable-id'?3000:4000);return;}status='error';rerender();});
 }
 function hostClosed(c){for(const [pid,x] of conns)if(x===c){conns.delete(pid);if(host.players[pid])host.players[pid].online=false;broadcast(true);}}
 function addLog(e){host.log.unshift({id:uid(),t:Date.now(),who:clip(e.who,80),label:clip(e.label,160),total:clip(e.total,60),detail:clip(e.detail,400),kind:clip(e.kind||'roll',20),hidden:!!e.hidden});host.log=host.log.slice(0,150);}
 function hostReceive(c,d){if(!d||typeof d!=='object'||JSON.stringify(d).length>30000)return;
  if(d.t==='hello'){const pid=clip(d.pid,60);if(!pid)return;const old=conns.get(pid);if(old&&old!==c){try{old.close();}catch{}}conns.set(pid,c);c._pid=pid;const sum=cleanSummary(d.sheet);host.players[pid]={pid,name:clip(d.name,60)||sum.charName,charName:sum.charName,summary:sum,online:true};saveHost();broadcast(true);return;}
  const pid=c._pid,pl=pid&&host.players[pid];if(!pl)return;
  if(d.t==='sheet'){const before=pl.summary;pl.summary=cleanSummary(d.sheet);pl.charName=pl.summary.charName||pl.charName;if(before&&before.life!==pl.summary.life&&pl.summary.life==='morrendo')addLog({who:pl.charName,label:'Caiu a 0 PV',total:'',detail:'Salvaguardas contra a morte',kind:'damage'});broadcast(true);return;}
  if(d.t==='roll'){const e=d.entry||{};addLog({who:pl.charName,label:e.label,total:e.total,detail:e.detail,kind:e.kind});broadcast(true);return;}
  if(d.t==='answer'){const req=host.pending.find(r=>r.id===d.reqId&&r.pid===pid);if(!req)return;host.pending=host.pending.filter(r=>r!==req);const total=num(d.total,-99,999);let outcome='';if(req.dc)outcome=d.autoFail?'Falha automática':total>=req.dc?'Sucesso':'Falha';addLog({who:pl.charName,label:requestLabel(req)+(req.dc?' (CD '+req.dc+')':''),total:String(total)+(outcome?' · '+outcome:''),detail:clip(d.detail,300),kind:'answer'});if(req.kind==='initiative'){try{dm.setPlayerInitiative?.(pid,pl.charName,total);}catch(e){console.warn(e);}}saveHost();broadcast(true);return;}
 }
 function combatState(){try{return dm.combat?.()||null;}catch{return null;}}
 function encounterMonsters(){try{return (dm.snapshot?.()||[]).slice(0,80);}catch{return [];}}
 function publicState(){const monsters=encounterMonsters().map(m=>({id:m.id,name:clip(m.name,80),status:monsterStatus(m.hp,m.maxHp)}));const c=combatState();const order=(c?.order||[]).map(o=>({id:o.id,name:o.name,kind:o.kind,pid:o.pid||'',value:o.value??null,status:o.status||''}));
  return {code:host.code,players:Object.values(host.players).map(p=>({pid:p.pid,name:p.name,charName:p.charName,summary:p.summary,online:!!p.online})),log:host.log.filter(e=>!e.hidden).slice(0,80),init:{active:!!c?.active,order,turn:c?.active?order.findIndex(o=>o.id===c.current):-1,round:c?.round||1},monsters,pending:host.pending.map(r=>({id:r.id,pid:r.pid,kind:r.kind,key:r.key,skill:r.skill,dc:r.dc,label:requestLabel(r)}))};}
 // Avisos de estado dos monstros (sem números): "Abolete está Ensanguentado".
 function trackMonsterStatus(st){for(const m of st.monsters){const before=lastStatus[m.id];if(before&&before!==m.status&&m.status!=='Ileso')addLog({who:m.name,label:m.status==='Caído'?'caiu':'está '+m.status,total:'',detail:'',kind:m.status==='Caído'?'down':'status'});lastStatus[m.id]=m.status;}for(const k of Object.keys(lastStatus))if(!st.monsters.some(m=>m.id===k))delete lastStatus[k];}
 function broadcast(force){if(role!=='dm')return;let st=publicState();const before=host.log.length?host.log[0].id:'';trackMonsterStatus(st);if((host.log[0]?.id||'')!==before)st=publicState();const json=JSON.stringify(st);if(!force&&json===lastPublic)return;lastPublic=json;saveHost();const msg={t:'state',state:st};for(const c of conns.values()){try{if(c.open)c.send(msg);}catch{}}softRerender();}
 function startPulse(){clearInterval(pulse);pulse=setInterval(()=>{if(role==='dm')broadcast(false);},1500);}
 function hostSend(pid,msg){const c=conns.get(pid);if(c?.open){try{c.send(msg);return true;}catch{}}return false;}
 function hostStop(){closing=true;for(const c of conns.values()){try{c.send({t:'closed'});}catch{}}setTimeout(()=>destroyPeer(),300);clearInterval(pulse);role=null;status='off';cfg.role=null;saveCfg();for(const p of Object.values(host.players))p.online=false;saveHost();rerender();}
 function askInitiative(){if(role!=='dm')return 0;let n=0;for(const p of Object.values(host.players)){if(!p.online)continue;host.pending=host.pending.filter(r=>!(r.pid===p.pid&&r.kind==='initiative'));host.pending.push({id:uid(),pid:p.pid,kind:'initiative',key:'dex',dc:0});n++;}if(n){addLog({who:'Mestre',label:'Pediu iniciativa',total:'',detail:n+' jogador(es)',kind:'system'});broadcast(true);}return n;}

 // =============== JOGADOR ===============
 function summaryNow(){try{return cleanSummary(player.summary?.(cfg.charId)||{});}catch{return cleanSummary({});}}
 async function join(code,charId,name){code=normalizeCode(code);if(code.length<4)throw Error('Digite o código da sala (6 letras/números).');if(!player.exists?.(charId))throw Error('Escolha um personagem.');await loadLib();closing=false;role='player';cfg.role='player';cfg.code=code;cfg.charId=charId;cfg.name=clip(name,60);saveCfg();room=null;seenPending=new Set();connectPlayer(0);drawUpdate();}
 function connectPlayer(attempt){destroyPeer();if(role!=='player')return;status=attempt?'reconnecting':'connecting';const p=new window.Peer(undefined,peerOptions());peer=p;
  p.on('open',()=>{if(peer!==p)return;const c=p.connect(hostPeerId(cfg.code),{reliable:true,serialization:'json'});conn=c;
   const timeout=setTimeout(()=>{if(conn===c&&!c.open){lastError='O mestre não respondeu. Tentando de novo…';retry(attempt);}},15000);
   c.on('open',()=>{clearTimeout(timeout);if(conn!==c)return;status='online';lastError='';lastSheetHash='';c.send({t:'hello',pid:cfg.pid,name:cfg.name,sheet:summaryNow()});drawUpdate();});
   c.on('data',d=>{try{playerReceive(d);}catch(e){console.warn('Mesa: mensagem ignorada',e);}});
   c.on('close',()=>{if(conn===c&&role==='player'&&!closing){status='reconnecting';drawUpdate();retry(attempt);}});
   c.on('error',()=>{if(conn===c)retry(attempt);});});
  p.on('error',e=>{if(peer!==p||closing)return;lastError=errorText(e);status=e.type==='peer-unavailable'?'error':'reconnecting';drawUpdate();retry(attempt,e.type==='peer-unavailable'?8000:4000);});
  p.on('disconnected',()=>{if(peer!==p||closing)return;try{p.reconnect();}catch{retry(attempt);}});
 }
 function retry(attempt,delay=4000){clearTimeout(retryTimer);if(role!=='player')return;retryTimer=setTimeout(()=>connectPlayer(attempt+1),delay);}
 function playerReceive(d){if(!d||typeof d!=='object')return;
  if(d.t==='state'&&d.state&&typeof d.state==='object'){if(JSON.stringify(d.state).length>250000)return;const old=new Set((room?.log||[]).map(e=>e.id));room=cleanState(d.state);if(old.size)for(const e of room.log)if(!old.has(e.id))flashIds.add(e.id);
   const mine=room.pending.filter(r=>r.pid===cfg.pid);for(const r of mine)if(!seenPending.has(r.id)){seenPending.add(r.id);toast('O mestre pediu: '+r.label+(r.dc?' (CD '+r.dc+')':'')+'.');if(inSheet&&!drawerOpen)setDrawer(true);}
   const cur=room.init.turn>=0?room.init.order[room.init.turn]:null;const key=cur?cur.id+'#'+room.init.round:'';if(key&&key!==lastTurnKey){lastTurnKey=key;if(cur.pid===cfg.pid)toast('É a sua vez! (rodada '+room.init.round+')');}
   drawUpdate();return;}
  if(d.t==='hp'){const amount=num(d.amount,0,999);if(amount>0)player.applyHp?.(cfg.charId,amount,!!d.heal);return;}
  if(d.t==='closed'){toast('O mestre encerrou a mesa.');leave(true);return;}
  if(d.t==='kicked'){toast('O mestre removeu você da mesa.');leave(true);return;}
 }
 function leave(silent){closing=true;destroyPeer();role=null;status='off';room=null;cfg.role=null;saveCfg();if(!silent)toast('Você saiu da mesa.');drawUpdate();}
 function send(msg){if(role==='player'&&conn?.open){try{conn.send(msg);return true;}catch{}}return false;}

 // =============== ganchos do app ===============
 function onPlayerLog(entry){if(role!=='player')return;if(activeReq){stashed=entry;return;}send({t:'roll',entry:{label:clip(entry.label,160),total:clip(entry.total,60),detail:clip(entry.detail,300),kind:clip(entry.kind,20)}});}
 function onSheetChange(){if(role!=='player'||status!=='online')return;clearTimeout(sheetTimer);sheetTimer=setTimeout(()=>{const s=summaryNow(),h=JSON.stringify(s);if(h!==lastSheetHash&&send({t:'sheet',sheet:s}))lastSheetHash=h;},120);}
 function onDmLog(label,result,details){if(role!=='dm')return;const turn=/^Turno de /.test(label),end=label==='Combate encerrado';addLog(turn||end?{who:'⚔',label:turn?label:'Combate encerrado',total:'',detail:result,kind:'turn'}:{who:'Mestre',label,total:result,detail:details,kind:'dm',hidden:!host.showDmRolls});broadcast(true);}
 function onDmChange(){if(role==='dm')broadcast(false);}
 function resume(){if(cfg.role==='player'&&cfg.code&&player.exists?.(cfg.charId)){loadLib().then(()=>{role='player';closing=false;connectPlayer(0);drawUpdate();}).catch(e=>{lastError=e.message;drawUpdate();});}else if(cfg.role==='dm'&&host.code){hostStart(host.code).catch(e=>{lastError=e.message;rerender();});}}

 // =============== barra lateral do jogador ===============
 function setDrawer(v){drawerOpen=!!v;writeJSON(DRAWER_KEY,drawerOpen);drawUpdate();}
 function afterRender(ctx){inSheet=!!ctx?.inSheet;drawUpdate(true);}
 function drawUpdate(now){if(now){cancelAnimationFrame(drawerFrame);drawRender();return;}cancelAnimationFrame(drawerFrame);drawerFrame=requestAnimationFrame(drawRender);}
 function drawRender(){if(!drawerRoot){drawerRoot=document.createElement('div');drawerRoot.id='mesa-root';document.body.appendChild(drawerRoot);}
  const show=inSheet&&drawerOpen;document.body.classList.toggle('mesa-open',show);
  const keep={};for(const id of ['mesa-code','mesa-name','mesa-char']){const el=document.getElementById(id);if(el)keep[id]=el.value;}const focused=document.activeElement?.id;
  drawerRoot.innerHTML=!inSheet?'':show?drawerHtml():fabHtml();
  for(const [id,v] of Object.entries(keep)){const el=document.getElementById(id);if(el)el.value=v;}if(focused&&keep[focused]!=null)document.getElementById(focused)?.focus();
  flashIds.clear();}
 const pill=()=>`<span class="mesa-status mesa-${status}">${({off:'Desconectado',connecting:'Conectando…',online:'Online',reconnecting:'Reconectando…',error:'Erro'})[status]}</span>`;
 function fabHtml(){const pend=(room?.pending||[]).filter(r=>r.pid===cfg.pid).length;if(role!=='player')return '';return `<button type="button" class="mesa-fab ${pend?'has-pending':''}" data-action="mesa-drawer-open" aria-label="Abrir Mesa online"><span class="mesa-dot ${status==='online'?'on':''}"></span>Mesa ${esc(cfg.code)}${pend?`<b>${pend}</b>`:''}</button>`;}
 const kindClass=k=>'mesa-k-'+String(k||'roll').replace(/[^a-z]/g,'');
 const feedHtml=list=>list.length?`<ol class="mesa-feed">${list.slice(0,60).map(e=>`<li class="${kindClass(e.kind)}${flashIds.has(e.id)?' mesa-new':''}"><div><b>${esc(e.who)}</b> <span>${esc(e.label)}</span>${e.total!==''&&e.total!=null?` <strong>${esc(e.total)}</strong>`:''}</div>${e.detail?`<small>${esc(e.detail)}</small>`:''}<time>${esc(time(e.t))}</time></li>`).join('')}</ol>`:'<p class="hint">As rolagens de todos aparecem aqui.</p>';
 const initHtml=init=>{const o=init?.order||[];if(!init?.active||!o.length)return '<p class="hint">Fora de combate.</p>';return `<p class="mesa-round">Rodada <b>${esc(init.round)}</b></p><ol class="mesa-init">${o.map((r,i)=>`<li class="${i===init.turn?'mesa-turn':''} mesa-${esc(r.kind)} ${r.pid&&r.pid===cfg.pid?'mesa-me':''}"><b class="mesa-init-num">${esc(r.value??'—')}</b><span>${esc(r.name)}</span>${r.status?`<em class="mesa-chip ${stClass(r.status)}">${esc(r.status)}</em>`:''}</li>`).join('')}</ol>`;};
 function drawerHtml(){const chars=player.list?.()||[];const cur=player.current?.();
  const head=`<div class="mesa-dr-head"><div><strong>Mesa online</strong>${role==='player'?` <span class="mesa-dr-code">${esc(cfg.code)}</span> ${pill()}`:''}</div><button type="button" class="icon-btn mesa-dr-close" data-action="mesa-drawer-close" aria-label="Fechar barra da mesa">✕</button></div>`;
  if(role!=='player')return `<aside class="mesa-drawer" aria-label="Mesa online">${head}<div class="mesa-dr-body"><p>Peça o código ao mestre (Área do Mestre › Mesa online) e entre com a sua ficha. Depois é só rolar normalmente nas abas da ficha: tudo aparece aqui e para o mestre.</p><label class="mesa-field">Código da sala<input id="mesa-code" autocomplete="off" autocapitalize="characters" maxlength="8" placeholder="Ex.: K7PX2M" value="${esc(cfg.code||'')}"></label><label class="mesa-field">Personagem<select id="mesa-char">${chars.map(ch=>`<option value="${esc(ch.id)}" ${ch.id===cur?'selected':''}>${esc(ch.name)}</option>`).join('')}</select></label><label class="mesa-field">Seu nome (opcional)<input id="mesa-name" maxlength="40" value="${esc(cfg.name||'')}" placeholder="Como o mestre te chama"></label><button type="button" class="btn primary" data-action="mesa-join">Entrar na mesa</button>${lastError?`<p class="mesa-error">${esc(lastError)}</p>`:''}<p class="hint">Precisa de internet. A conexão é direta entre os aparelhos.</p></div></aside>`;
  const r=room,mine=(r?.pending||[]).filter(x=>x.pid===cfg.pid),name=chars.find(ch=>ch.id===cfg.charId)?.name||'';const t=r?.init,curTurn=t?.active&&t.turn>=0?t.order[t.turn]:null,myTurn=curTurn?.pid===cfg.pid;
  return `<aside class="mesa-drawer" aria-label="Mesa online">${head}<div class="mesa-dr-body">
  ${lastError&&status!=='online'?`<p class="mesa-error">${esc(lastError)}</p>`:''}
  ${curTurn?`<div class="mesa-turnbar ${myTurn?'mine':''}">${myTurn?'É a sua vez!':'Vez de <b>'+esc(curTurn.name)+'</b>'} <small>Rodada ${esc(t.round)}</small></div>`:''}
  ${mine.length?`<section class="mesa-dr-sec mesa-requests"><h3>O mestre pediu</h3>${mine.map(q=>`<div class="mesa-req"><span><b>${esc(q.label)}</b>${q.dc?` · CD ${esc(q.dc)}`:''}</span><button type="button" class="btn primary small" data-action="mesa-answer" data-id="${esc(q.id)}">Rolar</button></div>`).join('')}</section>`:''}
  <section class="mesa-dr-sec"><h3>Iniciativa</h3>${initHtml(t)}</section>
  <section class="mesa-dr-sec mesa-dr-feed"><h3>Ao vivo</h3>${feedHtml(r?.log||[])}</section>
  ${r?.monsters?.length?`<section class="mesa-dr-sec"><h3>Monstros</h3><ul class="mesa-monsters">${r.monsters.map(m=>`<li><span>${esc(m.name)}</span><em class="mesa-chip ${stClass(m.status)}">${esc(m.status)}</em></li>`).join('')}</ul></section>`:''}
  ${r?.players?.length?`<section class="mesa-dr-sec"><h3>Grupo</h3><ul class="mesa-party-mini">${r.players.map(p=>{const s=p.summary,pct=s.hpMax?Math.round(100*Math.min(s.hp,s.hpMax)/s.hpMax):0;return `<li class="${p.online?'':'mesa-offline'}"><span class="mesa-dot ${p.online?'on':''}"></span><span class="mesa-pm-name">${esc(s.charName||p.charName)}</span><span class="mesa-pm-bar"><i style="width:${pct}%" class="${pct<=50?'low':''}"></i></span><small>${esc(s.hp)}/${esc(s.hpMax)} · CA ${esc(s.ac)}</small></li>`;}).join('')}</ul></section>`:''}
  <p class="hint">Jogando com <b>${esc(name)}</b>. Role nas abas da ficha (ataques, dano, magias, testes): aparece aqui na hora.</p><button type="button" class="btn ghost small" data-action="mesa-leave">Sair da mesa</button></div></aside>`;}

 // =============== tela do mestre ===============
 function button(label,action,cls='',data=''){return `<button type="button" class="btn ${cls}" data-action="${action}" ${data}>${esc(label)}</button>`;}
 const logHtml=list=>list.length?`<ol class="mesa-feed mesa-feed-dm">${list.slice(0,60).map(e=>`<li class="${kindClass(e.kind)}${e.hidden?' mesa-hidden':''}"><div><b>${esc(e.who)}</b> <span>${esc(e.label)}</span>${e.total!==''&&e.total!=null?` <strong>${esc(e.total)}</strong>`:''}${e.hidden?' <em>(só você vê)</em>':''}</div>${e.detail?`<small>${esc(e.detail)}</small>`:''}<time>${esc(time(e.t))}</time></li>`).join('')}</ol>`:'<p class="hint">Nenhuma rolagem ainda.</p>';
 function dmPlayerPanel(pid){const p=host.players[pid];if(!p)return '';const s=p.summary||{};const reqOptions=reqSelect('mesa-preq-kind-'+pid);
  return `<div class="mesa-pp"><p class="hint">${esc(s.classLine||'')}${p.name&&p.name!==s.charName?' · jogador: '+esc(p.name):''} · ${p.online?'<span class="mesa-online-t">online</span>':'offline'}</p><div class="dm-side-hp"><div><b class="dm-side-hpnum">${esc(s.hp)}</b><span>/${esc(s.hpMax)} PV${s.temp?' + '+esc(s.temp)+' temp.':''}</span><small>CA ${esc(s.ac)} · Inic. ${sgn(s.initiative||0)} · Perc. passiva ${esc(s.passive)} · Desl. ${esc(s.speed)}</small></div><div class="dm-side-hptools"><input id="mesa-amt-${esc(pid)}" type="number" min="1" max="999" placeholder="Valor" aria-label="Valor de dano ou cura">${button('Dano','mesa-hp','small','data-pid="'+esc(pid)+'"')}${button('Cura','mesa-hp','small ghost','data-heal="1" data-pid="'+esc(pid)+'"')}</div></div>
  ${s.life&&s.life!=='consciente'?`<p class="mesa-life">${esc(({morrendo:'Morrendo (salvaguardas contra a morte)',estavel:'Estável',morto:'Morto'})[s.life]||s.life)}</p>`:''}${s.conditions?.length?`<p>${s.conditions.map(x=>`<em class="mesa-chip">${esc(x)}</em>`).join(' ')}</p>`:''}${s.concentration?`<p class="hint">Concentrando: ${esc(s.concentration)}</p>`:''}
  <table class="mesa-attr"><tr><th></th>${ABILITIES.map(a=>`<th>${a[1]}</th>`).join('')}</tr><tr><th>Mod.</th>${ABILITIES.map(a=>`<td>${sgn(s.mods?.[a[0]]||0)}</td>`).join('')}</tr><tr><th>Salv.</th>${ABILITIES.map(a=>`<td>${sgn(s.saves?.[a[0]]||0)}</td>`).join('')}</tr></table>
  <h3>Pedir teste</h3><div class="mesa-preq">${reqOptions}<input id="mesa-preq-dc-${esc(pid)}" type="number" min="1" max="40" placeholder="CD" aria-label="CD">${button('Pedir','mesa-request-one','small primary','data-pid="'+esc(pid)+'"')}</div></div>`;}
 const reqSelect=id=>`<select id="${esc(id)}" aria-label="Tipo de teste"><optgroup label="Salvaguardas">${ABILITIES.map(a=>`<option value="save:${a[0]}">Salvaguarda de ${a[2]}</option>`).join('')}</optgroup><optgroup label="Testes de atributo">${ABILITIES.map(a=>`<option value="check:${a[0]}">Teste de ${a[2]}</option>`).join('')}</optgroup><optgroup label="Perícias">${SKILLS.map(s=>`<option value="skill:${esc(s[1])}:${esc(s[0])}">${esc(s[0])}</option>`).join('')}</optgroup><option value="initiative">Iniciativa</option></select>`;
 function dmView(){
  if(role!=='dm')return `<section class="card mesa-join"><h2>Jogar online com seus jogadores</h2><p>Crie uma sala e passe o código. Cada jogador abre a própria ficha, toca em <b>Mesa online</b> no menu e digita o código; uma barra lateral mostra as rolagens de todos ao vivo.</p><p>Os jogadores aparecem na aba <b>Encontros</b>, junto com os monstros, na ordem de iniciativa. Clique em qualquer nome para abrir o painel dele.</p><div class="flex">${button('Criar sala','mesa-host-create','primary')}${host.code?button('Reabrir sala '+host.code,'mesa-host-reopen','ghost'):''}</div>${lastError?`<p class="mesa-error">${esc(lastError)}</p>`:''}<p class="hint">Mantenha esta página aberta durante a sessão. Se recarregar, os jogadores reconectam sozinhos.</p></section>`;
  const players=Object.values(host.players).sort((a,b)=>(b.online-a.online)||String(a.charName).localeCompare(b.charName));
  return `<section class="card mesa-top"><div class="mesa-top-row"><div><p class="eyebrow">CÓDIGO DA SALA</p><p class="mesa-code">${esc(host.code)}</p></div><div class="mesa-top-info">${pill()}<span>${players.filter(p=>p.online).length} de ${players.length} online</span></div><div class="flex">${button('Copiar código','mesa-copy','ghost small')}${button('Encerrar sala','mesa-host-close','ghost small')}</div></div>${lastError&&status!=='online'?`<p class="mesa-error">${esc(lastError)}</p>`:''}<label class="mesa-toggle"><input type="checkbox" id="mesa-show-dm" ${host.showDmRolls?'checked':''}> Jogadores veem minhas rolagens</label></section>
  <div class="mesa-dm-grid"><section class="card"><h2>Jogadores</h2>${players.length?`<ul class="mesa-plist">${players.map(p=>{const s=p.summary||{},pct=s.hpMax?Math.round(100*Math.min(s.hp,s.hpMax)/s.hpMax):0;return `<li class="${p.online?'':'mesa-offline'}"><span class="mesa-dot ${p.online?'on':''}" title="${p.online?'Online':'Offline'}"></span><button type="button" class="mesa-plink" data-action="mesa-open-player" data-pid="${esc(p.pid)}"><b>${esc(s.charName||p.charName)}</b><small>${esc(s.classLine||'')}</small></button><span class="mesa-pm-bar"><i style="width:${pct}%" class="${pct<=50?'low':''}"></i></span><small class="mesa-pnum">${esc(s.hp)}/${esc(s.hpMax)} · CA ${esc(s.ac)}</small>${s.conditions?.length?`<em class="mesa-chip">${esc(s.conditions[0])}${s.conditions.length>1?' +'+(s.conditions.length-1):''}</em>`:''}<button type="button" class="btn ghost small" data-action="mesa-kick" data-pid="${esc(p.pid)}" aria-label="Remover ${esc(s.charName||p.charName)}">✕</button></li>`;}).join('')}</ul><p class="hint">Clique no nome para abrir o painel do jogador na aba Encontros.</p>`:'<p class="hint">Ninguém entrou ainda. Passe o código para os jogadores.</p>'}
  <h3>Pedir teste para vários</h3><div class="mesa-preq">${reqSelect('mesa-req-kind')}<input id="mesa-req-dc" type="number" min="1" max="40" placeholder="CD" aria-label="CD"></div><fieldset class="mesa-targets"><legend>Quem rola</legend>${players.length?players.map(p=>`<label><input type="checkbox" class="mesa-req-target" value="${esc(p.pid)}" ${p.online?'checked':''}> ${esc(p.charName)}</label>`).join(''):'<span class="hint">Nenhum jogador.</span>'}</fieldset>${button('Enviar pedido','mesa-request','primary small')}${host.pending.length?`<h3>Aguardando</h3><ul class="mesa-pending">${host.pending.map(r=>`<li><span>${esc(host.players[r.pid]?.charName||'?')}: ${esc(requestLabel(r))}${r.dc?' (CD '+esc(r.dc)+')':''}</span><button type="button" class="btn small ghost" data-action="mesa-pending-cancel" data-id="${esc(r.id)}">Cancelar</button></li>`).join('')}</ul>`:''}</section>
  <section class="card"><h2>Registro da mesa</h2>${logHtml(host.log)}</section></div>`;}

 // =============== ações ===============
 const val=id=>document.getElementById(id)?.value;
 function makeRequest(pid,v,dc){const [kind,key,skill]=String(v||'').split(':');const base=kind==='initiative'?{kind:'initiative',key:'dex'}:kind==='skill'?{kind:'skill',key,skill}:{kind,key};host.pending=host.pending.filter(r=>!(r.pid===pid&&r.kind===base.kind&&r.key===base.key&&r.skill===base.skill));host.pending.push({id:uid(),pid,...base,dc});host.pending=host.pending.slice(-60);return base;}
 async function handleAction(a,el){
  if(a==='mesa-drawer-toggle'){setDrawer(!drawerOpen);return true;}
  if(a==='mesa-drawer-open'){setDrawer(true);return true;}
  if(a==='mesa-drawer-close'){setDrawer(false);return true;}
  if(a==='mesa-join'){await join(val('mesa-code'),val('mesa-char'),val('mesa-name'));return true;}
  if(a==='mesa-leave'){leave();return true;}
  if(a==='mesa-answer'){const q=(room?.pending||[]).find(x=>x.id===el.dataset.id&&x.pid===cfg.pid);if(!q)throw Error('Pedido não encontrado.');activeReq=q;stashed=null;let info={};try{info=await player.rollRequest?.(cfg.charId,q)||{};}finally{const e=stashed;activeReq=null;stashed=null;if(e)send({t:'answer',reqId:q.id,total:e.total,detail:e.detail,autoFail:!!info.autoFail});}room.pending=room.pending.filter(x=>x.id!==q.id);drawUpdate();return true;}
  if(a==='mesa-host-create'){if(host.code&&Object.keys(host.players).length&&!confirm('Criar uma sala nova? O código antigo deixa de funcionar e o registro é limpo.'))return true;await hostStart(newCode());return true;}
  if(a==='mesa-host-reopen'){await hostStart(host.code);return true;}
  if(a==='mesa-host-close'){if(confirm('Encerrar a sala? Os jogadores serão desconectados.'))hostStop();return true;}
  if(a==='mesa-copy'){try{await navigator.clipboard.writeText(host.code);toast('Código copiado: '+host.code);}catch{toast('Código da sala: '+host.code);}return true;}
  if(role!=='dm')return false;
  if(a==='mesa-open-player'){dm.select?.('p:'+el.dataset.pid);return true;}
  if(a==='mesa-hp'){const pid=el.dataset.pid,amount=num(val('mesa-amt-'+pid),0,999);if(!amount)throw Error('Digite o valor.');const heal=!!el.dataset.heal;if(!hostSend(pid,{t:'hp',amount,heal}))throw Error('Jogador offline.');const inp=document.getElementById('mesa-amt-'+pid);if(inp)inp.value='';broadcast(true);return true;}
  if(a==='mesa-kick'){const pid=el.dataset.pid;if(!confirm('Remover '+(host.players[pid]?.charName||'jogador')+' da mesa?'))return true;hostSend(pid,{t:'kicked'});const c=conns.get(pid);conns.delete(pid);setTimeout(()=>{try{c?.close();}catch{}},300);delete host.players[pid];host.pending=host.pending.filter(r=>r.pid!==pid);broadcast(true);rerender();return true;}
  if(a==='mesa-request'){const dc=num(val('mesa-req-dc'),0,40,0),targets=[...document.querySelectorAll('.mesa-req-target:checked')].map(x=>x.value).filter(p=>host.players[p]);if(!targets.length)throw Error('Marque ao menos um jogador.');let base;for(const pid of targets)base=makeRequest(pid,val('mesa-req-kind'),dc);addLog({who:'Mestre',label:'Pediu '+requestLabel(base)+(dc?' (CD '+dc+')':''),total:'',detail:targets.map(p=>host.players[p].charName).join(', '),kind:'system'});broadcast(true);toast('Pedido enviado.');return true;}
  if(a==='mesa-request-one'){const pid=el.dataset.pid;if(!host.players[pid])throw Error('Jogador não encontrado.');const dc=num(val('mesa-preq-dc-'+pid),0,40,0),base=makeRequest(pid,val('mesa-preq-kind-'+pid),dc);addLog({who:'Mestre',label:'Pediu '+requestLabel(base)+(dc?' (CD '+dc+')':''),total:'',detail:host.players[pid].charName,kind:'system'});broadcast(true);toast('Pedido enviado.');return true;}
  if(a==='mesa-pending-cancel'){host.pending=host.pending.filter(r=>r.id!==el.dataset.id);broadcast(true);rerender();return true;}
  return false;}
 function handleChange(t){if(role!=='dm')return false;if(t.id==='mesa-show-dm'){host.showDmRolls=t.checked;broadcast(true);return true;}return false;}

 return {dmView,dmPlayerPanel,handleAction,handleChange,onPlayerLog,onSheetChange,onDmLog,onDmChange,resume,afterRender,askInitiative,
  players:()=>role==='dm'?Object.values(host.players):[],
  get role(){return role;},get status(){return status;},get drawerOpen(){return drawerOpen;},
  boundCharId:()=>role==='player'?cfg.charId:null,
  _debug:()=>({role,status,cfg,host,room})};
}
