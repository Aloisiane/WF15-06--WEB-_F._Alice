/* =========================
   Commun à TOUTES les pages
   ========================= */
const $ = (sel, root=document) => root.querySelector(sel);
const fmtEUR = n => new Intl.NumberFormat('ja-JP',{style:'currency',currency:'EUR'}).format(n);

// Année de footer (optionnel)
$('#year') && ($('#year').textContent = new Date().getFullYear());

// Bouton haut de page (optionnel)
(() => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;
  window.addEventListener('scroll', () => {
    const y = document.documentElement.scrollTop || document.body.scrollTop;
    scrollBtn.style.display = (y > 300) ? 'block' : 'none';
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Navigation douce pour les ancres internes (si cible existe)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Détection de page
const page = document.body.dataset.page || '';

/* ================
   PAGE: INDEX
   ================ */
if (page === 'index') {
  const NEWS = [
    { title: "独占公開：新MVメイキング", date: "2025-08-10", tag: "クリップ", img: "image/AngeleMakingOfMamy.png", href: "Store.html" },
    { title: "ブリュッセル公演を追加", date: "2025-08-02", tag: "ツアー", img: "image/BruxellesAngele.png", href:"Store.html" },
    { title: "アコースティック・ライブ配信開始", date: "2025-07-20", tag: "ライブ", img: "image/AngeleConcertNime.png", href: "Store.html" },
    { title: "衣装制作の舞台裏", date: "2025-07-05", tag: "バックステージ", img: "image/couturiere.png", href:"Store.html" }
  ];

  const EVENTS = [
    { id: "bru25a", city: "ブリュッセル", venue: "フォレ・ナショナル", date: "2025-10-12", base: 59 },
    { id: "par25a", city: "パリ", venue: "アコー・アリーナ", date: "2025-10-18", base: 65 },
    { id: "lyo25a", city: "リヨン", venue: "アール・トニー・ガルニエ", date: "2025-10-25", base: 55 },
    { id: "nam25a", city: "ナミュール", venue: "ル・デルタ", date: "2025-11-02", base: 49 }
  ];

  function renderNews(){
    const grid = $('#news-grid');
    if (!grid) return; // ← garde-fou
    grid.innerHTML = '';
    NEWS.sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(n=>{
      const card = document.createElement('a');
      card.className = 'news-card'; card.href = n.href; card.setAttribute('aria-label', n.title);
      card.innerHTML = `
        <img class="news-thumb" src="${n.img}" alt="ニュースのイメージ" loading="lazy" />
        <div>
          <div class="news-meta">${new Date(n.date).toLocaleDateString('ja-JP',{year:'numeric',month:'short',day:'2-digit'})} · <span class="tag">${n.tag}</span></div>
          <div class="news-title">${n.title}</div>
          <div class="news-meta">続きを読む →</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function setupTickets(){
    const select = $('#event');       // ← doit exister sur la page index
    const dateInput = $('#date');
    const qtyInput = $('#qty');
    const pricePill = $('#price-pill');
    const total = $('#total');
    const form = $('#ticket-form');

    // garde-fou si la section tickets n’est pas présente sur l’index
    if (!select || !dateInput || !qtyInput || !pricePill || !total || !form) return;

    EVENTS.forEach(ev=>{
      const opt = document.createElement('option');
      opt.value = ev.id;
      opt.textContent = `${ev.city} — ${ev.venue}`;
      opt.dataset.date = ev.date;
      opt.dataset.base = ev.base;
      select.appendChild(opt);
    });

    function recalc(){
      const chosen = EVENTS.find(e=>e.id===select.value);
      if(!chosen) return;
      dateInput.value = chosen.date;
      pricePill.textContent = fmtEUR(chosen.base);
      const qty = Math.min(Math.max(Number(qtyInput.value||1),1),6);
      qtyInput.value = qty;
      total.textContent = fmtEUR(qty * chosen.base);
    }

    if (EVENTS[0]) { select.value = EVENTS[0].id; recalc(); }

    select.addEventListener('change', recalc);
    qtyInput.addEventListener('input', recalc);
    dateInput.addEventListener('change', recalc);

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const chosen = EVENTS.find(e=>e.id===select.value);
      const qty = Number(qtyInput.value||1);
      const msg = `✅ 予約の事前確認:\n\n都市: ${chosen.city}\n会場: ${chosen.venue}\n日付: ${new Date(chosen.date).toLocaleDateString('ja-JP')}\n枚数: ${qty}\n合計: ${fmtEUR(qty*chosen.base)}\n\n（デモ表示：実際の決済は外部チケットサービスと連携してください）`;
      alert(msg);
    });
  }

  renderNews();
  setupTickets();
  $('#year') && ($('#year').textContent = new Date().getFullYear());
}

/* ================
   PAGE: STORE
   ================ */
if (page === 'store') {
  // Produits
  const MERCH = [
    { id:"tee-yellow",  name:"BxlTシャツ",               cat:"apparel",   price: 28, img:"image/TshirtAngele.png",  sizes:["S","M","L","XL"], colors:["イエロー"] },
    { id:"hoodie-vert", name:"フーディー（グリーン）",    cat:"apparel",   price: 59, img:"image/legging2.png",     sizes:["S","M","L"],     colors:["グリーン"] },
    { id:"totebag",     name:"水道",                     cat:"accessory", price: 18, img:"image/Gourde.png",        sizes:[],                colors:["ナチュラル"] },
    { id:"cap",         name:"ワッフル",                 cat:"accessory", price: 24, img:"image/gauffre.png",       sizes:[],                colors:["イエロー","ブラック"] },
    { id:"vinyl",       name:"『La Thune』ビニール盤",    cat:"vinyl",     price: 29, img:"image/LaThuneVinil.png",  sizes:[],                colors:["—"] },
    { id:"stickers",    name:"ノートブック",             cat:"accessory", price: 8,  img:"image/carnet.png",        sizes:[],                colors:["ミックス"] },
  ];

  // Événements (tickets)
  const EVENTS = [
    { id: "bru25a", city: "ブリュッセル", venue: "フォレ・ナショナル",     date: "2025-10-12", base: 59 },
    { id: "par25a", city: "パリ",         venue: "アコー・アリーナ",       date: "2025-10-18", base: 65 },
    { id: "lyo25a", city: "リヨン",       venue: "アール・トニー・ガルニエ", date: "2025-10-25", base: 55 },
    { id: "nam25a", city: "ナミュール",   venue: "ル・デルタ",             date: "2025-11-02", base: 49 }
  ];

  // Rendu produits + filtres
  (function initMerch(){
    const grid = $('#merch-grid');
    const filterButtons = document.querySelectorAll('.filters .pill');
    if (!grid) return;

    function renderMerchStore(filter='all'){
      grid.innerHTML = '';
      MERCH.filter(m => filter==='all' || m.cat===filter).forEach(m=>{
        const card = document.createElement('article');
        card.className = 'prod';
        card.setAttribute('aria-label', m.name);
        card.innerHTML = `
          <img class="thumb" src="${m.img}" alt="${m.name}のイメージ" loading="lazy">
          <div class="meta">
            <h4>${m.name}</h4>
            <div class="price">${fmtEUR(m.price)}</div>
            <div class="opts">
              ${m.sizes.length ? `<select class="select" data-kind="size" aria-label="サイズ">${m.sizes.map(s=>`<option>${s}</option>`).join('')}</select>` : `<span class="selectlike" style="padding:.6rem .7rem;border-radius:12px;border:1px solid color-mix(in oklab, var(--primary) 30%, #0000);">サイズ：フリー</span>`}
              ${m.colors.length ? `<select class="select" data-kind="color" aria-label="カラー">${m.colors.map(c=>`<option>${c}</option>`).join('')}</select>` : ``}
              <input class="qty" type="number" min="1" max="9" value="1" aria-label="数量">
            </div>
            <div class="add">
              <button class="btn btn-primary" data-add="${m.id}">カートに追加</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    filterButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        filterButtons.forEach(b=>b.setAttribute('aria-pressed','false'));
        btn.setAttribute('aria-pressed','true');
        renderMerchStore(btn.dataset.filter);
      });
    });

    renderMerchStore();
  })();

  // Panier
  (function initCart(){
    const cart = [];
    const cartList  = $('#cart-items');
    const cartEmpty = $('#cart-empty');
    const cartCount = $('#cart-count');
    const cartTotal = $('#cart-total');
    if (!cartList || !cartEmpty || !cartCount || !cartTotal) return;

    function syncCartUI(){
      cartList.innerHTML = '';
      if(cart.length===0){
        cartEmpty.style.display = 'block';
      } else {
        cartEmpty.style.display = 'none';
        cart.forEach(item=>{
          const row = document.createElement('div');
          row.className = 'cart-item';
          row.innerHTML = `
            <img class="cart-thumb" src="${item.img}" alt="${item.name}">
            <div class="cart-meta">
              <strong>${item.name}</strong>
              <div>${item.size ? `サイズ：${item.size} · ` : ''}${item.color ? `カラー：${item.color} · ` : ''}${fmtEUR(item.price)}</div>
            </div>
            <div class="cart-controls">
              <input type="number" min="1" max="9" value="${item.qty}" aria-label="${item.name}の数量" data-qty="${item.entryId}">
              <button class="btn btn-ghost" aria-label="削除" data-del="${item.entryId}">✕</button>
            </div>
          `;
          cartList.appendChild(row);
        });
      }
      cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
      cartTotal.textContent = fmtEUR(cart.reduce((s,i)=>s+i.qty*i.price,0));
    }

    document.addEventListener('click', (e)=>{
      const addId = e.target.closest?.('[data-add]')?.getAttribute('data-add');
      if(addId){
        const card = e.target.closest('.prod');
        const sizeSel = card.querySelector('select[data-kind="size"]');
        const colorSel = card.querySelector('select[data-kind="color"]');
        const qtyInput = card.querySelector('.qty');
        const m = MERCH.find(x=>x.id===addId);
        if(!m) return;
        const entryId = addId + '|' + (sizeSel?.value||'free') + '|' + (colorSel?.value||'');
        const existing = cart.find(x=>x.entryId===entryId);
        const qty = Math.min(Math.max(Number(qtyInput.value||1),1),9);
        if(existing){ existing.qty = Math.min(existing.qty + qty, 9); }
        else{
          cart.push({ entryId, id:m.id, name:m.name, img:m.img, price:m.price,
                      size:sizeSel?.value||'', color:colorSel?.value||'', qty });
        }
        syncCartUI();
      }

      const delId = e.target.closest?.('[data-del]')?.getAttribute('data-del');
      if(delId){
        const idx = cart.findIndex(x=>x.entryId===delId);
        if(idx>-1){ cart.splice(idx,1); syncCartUI(); }
      }
    });

    document.addEventListener('input', (e)=>{
      const key = e.target.getAttribute('data-qty');
      if(key){
        const item = cart.find(x=>x.entryId===key);
        if(item){
          item.qty = Math.min(Math.max(Number(e.target.value||1),1),9);
          syncCartUI();
        }
      }
    });
  })();

  // Tickets (#eventj)
  (function initTickets(){
    const selectEv = $('#eventj');
    const dateInput = $('#date');
    const qtyInput = $('#qty');
    const pricePill = $('#price-pill');
    const totalEl = $('#total');
    const form = $('#ticket-form');
    if (!selectEv || !dateInput || !qtyInput || !pricePill || !totalEl || !form) return;

    EVENTS.forEach(ev=>{
      const opt = document.createElement('option');
      opt.value = ev.id;
      opt.textContent = `${ev.city} — ${ev.venue}`;
      opt.dataset.date = ev.date;
      opt.dataset.base = ev.base;
      selectEv.appendChild(opt);
    });

    function recalc(){
      const chosen = EVENTS.find(e=>e.id===selectEv.value);
      if(!chosen) return;
      dateInput.value = chosen.date;
      pricePill.textContent = fmtEUR(chosen.base);
      const qty = Math.min(Math.max(Number(qtyInput.value||1),1),6);
      qtyInput.value = qty;
      totalEl.textContent = fmtEUR(qty * chosen.base);
    }

    if (EVENTS[0]) { selectEv.value = EVENTS[0].id; recalc(); }

    selectEv.addEventListener('change', recalc);
    qtyInput.addEventListener('input', recalc);
    dateInput.addEventListener('change', recalc);

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const chosen = EVENTS.find(e=>e.id===selectEv.value);
      const qty = Number(qtyInput.value||1);
      const msg = `✅ 予約の事前確認:\n\n都市: ${chosen.city}\n会場: ${chosen.venue}\n日付: ${new Date(chosen.date).toLocaleDateString('ja-JP')}\n枚数: ${qty}\n合計: ${fmtEUR(qty*chosen.base)}\n\n（デモ表示：実際の決済は外部チケットサービスと連携してください）`;
      alert(msg);
    });
  })();
}

/* =================
   PAGE: EMPOWERMENT
   ================= */
if (page === 'empowerment') {
  (function(){
    const buttons = Array.from(document.querySelectorAll('.imgbtn'));
    const panels  = Array.from(document.querySelectorAll('.panel'));
    if (!buttons.length) return;

    function collapseAll(){
      buttons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        const imgDefault = btn.dataset.img;
        if (imgDefault) btn.style.backgroundImage = `url("${imgDefault}")`;
      });
      panels.forEach(p => p.hidden = true);
    }

    buttons.forEach(btn => {
      const imgDefault = btn.dataset.img;
      const imgHover   = btn.dataset.imgHover;
      const imgActive  = btn.dataset.imgActive;

      if (imgDefault) btn.style.backgroundImage = `url("${imgDefault}")`;

      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(targetId);
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (!isOpen){
          collapseAll();
          btn.setAttribute('aria-expanded', 'true');
          if (imgActive) btn.style.backgroundImage = `url("${imgActive}")`;
          if (panel) panel.hidden = false;
          panel?.setAttribute('tabindex', '-1');
          panel?.focus({ preventScroll: true });
          panel?.removeAttribute('tabindex');
        } else {
          btn.setAttribute('aria-expanded', 'false');
          if (imgDefault) btn.style.backgroundImage = `url("${imgDefault}")`;
          if (panel) panel.hidden = true;
        }
      });

      btn.addEventListener('mouseenter', () => {
        if (btn.getAttribute('aria-expanded') === 'true') return;
        if (imgHover) btn.style.backgroundImage = `url("${imgHover}")`;
      });
      btn.addEventListener('mouseleave', () => {
        if (btn.getAttribute('aria-expanded') === 'true') return;
        if (imgDefault) btn.style.backgroundImage = `url("${imgDefault}")`;
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Ouvrir le premier par défaut (optionnel)
    //buttons[0]?.click();
  })();
}
