// Ficha Arcana 0.18 — habilidades editáveis pelo jogador.
// 1) Habilidades próprias (homebrew, itens, mesa) com usos, recuperação e dado.
// 2) Texto personalizado para traços existentes.
// 3) Ajuste de usos/dado/recuperação de poderes de espécie existentes.
// 4) Ajuste numérico por atributo (itens e efeitos), somado ao valor do atributo.

const txt=(v,n=120)=>String(v??'').trim().slice(0,n);
const KINDS=['none','damage','healing','test'];
const RECOVERY=['long','short','none'];
export const validFormula=f=>{const s=String(f||'').replace(/\s/g,'').toLowerCase();if(!s)return true;if(s.length>60||!/^[+-]?(?:\d{0,2}d\d{1,3}|\d{1,4})(?:[+-](?:\d{0,2}d\d{1,3}|\d{1,4}))*$/.test(s))return false;return [...s.matchAll(/(\d*)d(\d+)/g)].every(m=>Number(m[1]||1)>=1&&Number(m[1]||1)<=40&&Number(m[2])>=2&&Number(m[2])<=100);};
const cleanFormula=f=>String(f||'').replace(/\s/g,'').toLowerCase();

export function normalizeCustom018(c){
 const list=Array.isArray(c.customAbilities)?c.customAbilities:[];
 c.customAbilities=list.slice(0,40).filter(x=>x&&typeof x==='object').map(x=>{const max=Math.max(0,Math.min(99,Math.floor(Number(x.max)||0)));return {
  id:txt(x.id,80)||crypto.randomUUID(),name:txt(x.name,80)||'Habilidade',description:txt(x.description,3000),
  max,used:Math.max(0,Math.min(max,Math.floor(Number(x.used)||0))),recovery:RECOVERY.includes(x.recovery)?x.recovery:'long',
  kind:KINDS.includes(x.kind)?x.kind:'none',formula:validFormula(x.formula)?cleanFormula(x.formula):''};});
 const tt=c.traitText&&typeof c.traitText==='object'&&!Array.isArray(c.traitText)?c.traitText:{};
 c.traitText=Object.fromEntries(Object.entries(tt).filter(([k,v])=>/^[a-z0-9-]{1,80}$/.test(k)&&typeof v==='string'&&v.trim()).slice(0,80).map(([k,v])=>[k,txt(v,3000)]));
 const po=c.speciesPowerOverride&&typeof c.speciesPowerOverride==='object'&&!Array.isArray(c.speciesPowerOverride)?c.speciesPowerOverride:{};
 c.speciesPowerOverride=Object.fromEntries(Object.entries(po).filter(([k,v])=>/^[a-z0-9-]{1,80}$/.test(k)&&v&&typeof v==='object').slice(0,40).map(([k,v])=>[k,{
  ...(v.max!==''&&v.max!=null&&Number.isFinite(Number(v.max))?{max:Math.max(0,Math.min(99,Math.floor(Number(v.max))))}:{}),
  ...(validFormula(v.formula)&&cleanFormula(v.formula)?{formula:cleanFormula(v.formula)}:{}),
  ...(RECOVERY.includes(v.recovery)&&v.recovery!=='none'?{recovery:v.recovery}:{})}]).filter(([k,v])=>Object.keys(v).length));
 const ab=c.abilityAdjust&&typeof c.abilityAdjust==='object'?c.abilityAdjust:{};
 c.abilityAdjust=Object.fromEntries(['str','dex','con','int','wis','cha'].map(k=>[k,Math.max(-10,Math.min(10,Math.floor(Number(ab[k])||0)))]));
 return c;
}
export function abilityAdjust018(c,key){return Math.max(-10,Math.min(10,Math.floor(Number(c?.abilityAdjust?.[key])||0)));}
export function applySpeciesOverride018(c,key,action){const o=c?.speciesPowerOverride?.[key];if(!action||!o)return action;return {...action,...('max' in o?{max:o.max}:{}),...(o.formula?{formula:o.formula}:{}),...(o.recovery?{recovery:o.recovery}:{})};}
export function restCustom018(c,long){if(!Array.isArray(c.customAbilities))return c;for(const a of c.customAbilities){if(a.recovery==='short'||(long&&a.recovery==='long'))a.used=0;}return c;}

export function createCustom018(api){
 const {current,openModal,closeModal,render,toast,btn,esc,field,selectField,roll,log,showDice}=api;
 const recLabel=r=>r==='short'?'descanso curto ou longo':r==='long'?'descanso longo':'sem recuperação automática';
 function panel(c){normalizeCustom018(c);const list=c.customAbilities;
  return `<section class="card custom018-panel"><div class="card-title"><h2>Habilidades personalizadas</h2>${btn('+ Nova habilidade','custom018-new',{cls:'small primary'})}</div><p class="hint">Crie habilidades de itens, da mesa ou homebrew, com usos, recuperação e dado próprios. Para mudar o texto ou os usos de um poder já existente, use "Editar" no próprio poder.</p>${list.length?`<div class="arcana093-list">${list.map(a=>{const left=a.max?a.max-a.used:null;return `<article class="arcana093-entry"><div><strong>${esc(a.name)}</strong>${a.description?`<p>${esc(a.description)}</p>`:''}<small>${a.max?`Usos restantes: ${left}/${a.max} · ${recLabel(a.recovery)}`:'Usos ilimitados'}${a.formula?` · ${a.kind==='healing'?'Cura':a.kind==='test'?'Teste':'Dano'}: ${esc(a.formula)}`:''}</small></div><div class="arcana093-actions">${btn(a.formula&&a.kind!=='none'?'Rolar':'Usar','custom018-use',{cls:'small primary',attrs:`data-id="${esc(a.id)}" ${a.max&&left<=0?'disabled':''}`})}${a.max?btn('Restaurar 1','custom018-restore',{cls:'small ghost',attrs:`data-id="${esc(a.id)}" ${a.used<=0?'disabled':''}`}):''}${btn('Editar','custom018-edit',{cls:'small ghost',attrs:`data-id="${esc(a.id)}"`})}</div></article>`}).join('')}</div>`:'<p class="hint">Nenhuma habilidade personalizada ainda.</p>'}</section>`;}
 function editor(a){const isNew=!a;a=a||{id:'',name:'',description:'',max:0,recovery:'long',kind:'none',formula:''};
  openModal(isNew?'Nova habilidade':'Editar habilidade','Nome, texto, usos e dado são livres. Deixe usos em 0 para ilimitado.',
  `${field('Nome','custom018-name',a.name)}<div class="field"><label for="custom018-desc">Descrição</label><textarea id="custom018-desc" rows="4" maxlength="3000">${esc(a.description)}</textarea></div><div class="field-row">${field('Usos (0 = ilimitado)','custom018-max',a.max,'number','min="0" max="99"')}${selectField('Recupera em','custom018-recovery',[['long','Descanso longo'],['short','Descanso curto ou longo'],['none','Não recupera sozinho']].map(([v,l])=>`<option value="${v}" ${a.recovery===v?'selected':''}>${l}</option>`).join(''))}</div><div class="field-row">${selectField('Ao usar','custom018-kind',[['none','Só registrar o uso'],['damage','Rolar dano'],['healing','Rolar cura'],['test','Rolar teste']].map(([v,l])=>`<option value="${v}" ${a.kind===v?'selected':''}>${l}</option>`).join(''))}${field('Fórmula (ex.: 2d6+3)','custom018-formula',a.formula,'text','maxlength="60"')}</div>`,
  `${isNew?'':btn('Excluir','custom018-delete',{cls:'ghost',attrs:`data-id="${esc(a.id)}"`})}${btn('Cancelar','modal-close',{cls:'ghost'})}${btn('Salvar','custom018-save',{cls:'primary',attrs:`data-id="${esc(a.id)}"`})}`);}
 function traitEditor(id,name,defaultText,action){const c=current();normalizeCustom018(c);const o=c.speciesPowerOverride[id]||{};const cur=c.traitText[id]||defaultText||'';
  openModal('Editar '+esc(name),'Mude o texto e, se for um poder com usos, a quantidade, a recuperação e o dado.',
  `<div class="field"><label for="custom018-trait-text">Texto mostrado na ficha</label><textarea id="custom018-trait-text" rows="6" maxlength="3000">${esc(cur)}</textarea></div>${action?`<div class="field-row">${field('Usos máximos (vazio = padrão '+(action.max||'sem limite')+')','custom018-trait-max',o.max??'','number','min="0" max="99"')}${selectField('Recupera em','custom018-trait-recovery',[['','Padrão'],['long','Descanso longo'],['short','Descanso curto ou longo']].map(([v,l])=>`<option value="${v}" ${(o.recovery||'')===v?'selected':''}>${l}</option>`).join(''))}</div>${action.formula||action.kind==='damage'?field('Dado/fórmula (vazio = padrão '+(action.formula||'—')+')','custom018-trait-formula',o.formula||'','text','maxlength="60"'):''}`:''}<p class="hint">Para voltar ao original, use "Restaurar original".</p>`,
  `${btn('Restaurar original','custom018-trait-reset',{cls:'ghost',attrs:`data-id="${esc(id)}"`})}${btn('Cancelar','modal-close',{cls:'ghost'})}${btn('Salvar','custom018-trait-save',{cls:'primary',attrs:`data-id="${esc(id)}" data-default="${esc(defaultText||'')}"`})}`);}
 const $=s=>document.querySelector(s);
 const actions={
  'custom018-new':()=>editor(null),
  'custom018-edit':e=>{const c=current();normalizeCustom018(c);editor(c.customAbilities.find(x=>x.id===e.dataset.id));},
  'custom018-save':e=>{const c=current();normalizeCustom018(c);const name=$('#custom018-name').value.trim();if(!name)throw Error('Dê um nome à habilidade.');const formula=$('#custom018-formula').value;if(!validFormula(formula))throw Error('Fórmula inválida. Use algo como 1d8, 2d6+3 ou 4.');const kind=$('#custom018-kind').value;if(kind!=='none'&&!cleanFormula(formula))throw Error('Informe a fórmula para rolar.');
   const data={id:e.dataset.id||crypto.randomUUID(),name,description:$('#custom018-desc').value,max:Number($('#custom018-max').value)||0,recovery:$('#custom018-recovery').value,kind,formula};
   const at=c.customAbilities.findIndex(x=>x.id===data.id);if(at>=0)c.customAbilities[at]={...c.customAbilities[at],...data};else c.customAbilities.push({...data,used:0});normalizeCustom018(c);closeModal();render();toast('Habilidade salva.');},
  'custom018-delete':e=>{const c=current();if(!confirm('Excluir esta habilidade?'))return;c.customAbilities=(c.customAbilities||[]).filter(x=>x.id!==e.dataset.id);closeModal();render();toast('Habilidade excluída.');},
  'custom018-restore':e=>{const c=current();const a=(c.customAbilities||[]).find(x=>x.id===e.dataset.id);if(!a)return;a.used=Math.max(0,a.used-1);render();},
  'custom018-use':e=>{const c=current();normalizeCustom018(c);const a=c.customAbilities.find(x=>x.id===e.dataset.id);if(!a)return;if(a.max&&a.used>=a.max)throw Error('Sem usos restantes.');if(a.max)a.used++;
   if(a.kind!=='none'&&a.formula){const r=roll(a.formula);log(a.name,r.total,a.formula,a.kind==='healing'?'heal':a.kind==='damage'?'damage':'roll');render();showDice(r,a.name,()=>openModal(esc(a.name),a.kind==='healing'?'Cura':a.kind==='test'?'Teste':'Dano',`<div class="roll-result"><div class="result-num">${r.total}</div><p>${esc(a.formula)}</p>${a.max?`<small>Usos restantes: ${a.max-a.used}/${a.max}</small>`:''}</div>`,btn('Fechar','modal-close',{cls:'primary'})));}
   else{render();toast(a.max?`${a.name}: uso registrado (${a.max-a.used}/${a.max}).`:`${a.name} usado.`);}},
  'custom018-trait-edit':e=>{const d=e.dataset;traitEditor(d.id,d.name,d.default,d.hasAction==='1'?{max:Number(d.max)||0,formula:d.formula||'',kind:d.kind}:null);},
  'custom018-trait-save':e=>{const c=current();normalizeCustom018(c);const id=e.dataset.id,t=$('#custom018-trait-text').value.trim();if(t&&t!==e.dataset.default)c.traitText[id]=t;else delete c.traitText[id];
   if($('#custom018-trait-max')){const max=$('#custom018-trait-max').value,rec=$('#custom018-trait-recovery').value,f=$('#custom018-trait-formula')?.value||'';if(f&&!validFormula(f))throw Error('Fórmula inválida.');const o={};if(max!=='')o.max=Number(max);if(rec)o.recovery=rec;if(cleanFormula(f))o.formula=f;if(Object.keys(o).length)c.speciesPowerOverride[id]=o;else delete c.speciesPowerOverride[id];}
   normalizeCustom018(c);closeModal();render();toast('Habilidade atualizada.');},
  'custom018-trait-reset':e=>{const c=current();normalizeCustom018(c);delete c.traitText[e.dataset.id];delete c.speciesPowerOverride[e.dataset.id];closeModal();render();toast('Texto e usos originais restaurados.');}
 };
 return {panel,actions};
}
