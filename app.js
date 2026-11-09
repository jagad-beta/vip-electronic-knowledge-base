/* VIP Electronic Knowladge Base
 * Static, dependency-free GitHub Pages app. Never place credentials in this file.
 * User generated text is only rendered with textContent/createTextNode (no dynamic HTML).
 */
'use strict';
(() => {
  const ARTICLE_KEY = 'vip-ekb-articles-v1';
  const FAV_KEY = 'vip-ekb-favorites-v1';
  const ACTIVITY_KEY = 'vip-ekb-activity-v1';
  const MAX_ARTICLES = 1000;
  const MAX_IMPORT_SIZE = 5 * 1024 * 1024;
  const PAGES = new Set(['beranda','pengetahuan','kategori','favorit','riwayat','pengaturan','bantuan','tentang']);
  const $ = id => document.getElementById(id);
  const state = { articles: [], published: [], favorites: [], activity: [], currentPage: 'beranda', activeArticle: null, localStorageAvailable: true };
  let toastTimer = null;
  const Fallback = [
    {id:'selamat-datang',title:'Selamat Datang di VIP Electronic Knowladge Base',category:'Panduan Sistem',summary:'Pusat panduan, dokumentasi, dan pengetahuan operasional.',content:'## Apa itu VIP EKB?\nVIP Electronic Knowladge Base memudahkan tim menemukan dan mengelola artikel dalam satu tempat.\n\n## Fitur utama\n- Cari berdasarkan judul, kategori, dan isi.\n- Tambah atau sunting artikel pada browser ini.\n- Simpan favorit dan ekspor arsip JSON.\n\n## Penting\nData dari GitHub Pages bersifat publik. Jangan terbitkan informasi sensitif atau kredensial.',tags:['panduan','awal','VIP'],source:'Artikel contoh aplikasi',updatedAt:'2026-11-09'},
    {id:'sop-proses-tiket',title:'Contoh SOP Pengelolaan Tiket Harian',category:'SOP & Prosedur',summary:'Alur umum penerimaan, validasi, penugasan, dan penyelesaian tiket.',content:'## Tujuan\nMenetapkan langkah pengelolaan tiket agar pencatatan mudah diperiksa.\n\n## Tahapan\n1. Terima dan catat tiket yang masuk.\n2. Periksa kelengkapan informasi dan kategori.\n3. Tentukan penanggung jawab dan prioritas.\n4. Dokumentasikan tindakan serta hasil.\n5. Tutup tiket setelah verifikasi.\n\n## Catatan\nIni hanya contoh, bukan SOP resmi organisasi.',tags:['tiket','operasional','SOP'],source:'Contoh alur; sesuaikan dengan kebijakan internal',updatedAt:'2026-11-08'},
    {id:'lark-web-app',title:'Panduan Membuka Knowledge Base melalui Lark',category:'Integrasi Lark',summary:'Cara menjalankan aplikasi dari menu Web app di Lark.',content:'## Konfigurasi awal\n- Unggah berkas ke GitHub dan aktifkan GitHub Pages.\n- Buka Lark Developer Console lalu buat Custom App.\n- Tambahkan fitur Web app.\n- Isikan URL situs HTTPS pada homepage desktop serta mobile.\n- Terbitkan versi aplikasi sesuai proses persetujuan admin.\n\n## Keamanan\nMembuka halaman di Lark belum berarti pengguna telah login ke aplikasi. Untuk SSO dan pembatasan akses, gunakan backend khusus.',tags:['Lark','website','integrasi'],source:'Dokumentasi aplikasi contoh',updatedAt:'2026-11-07'},
    {id:'standar-artikel',title:'Standar Menulis Artikel Pengetahuan',category:'Dokumentasi',summary:'Format judul, ringkasan, isi, sumber, dan kata kunci agar mudah ditemukan.',content:'## Komponen artikel\n- Judul yang jelas dan spesifik.\n- Ringkasan singkat mengenai manfaat.\n- Kategori konsisten.\n- Tahapan atau penjelasan yang mudah diikuti.\n- Informasi sumber dan tanggal pembaruan.\n\n## Tinjau ulang\nPeriksa akurasi, keterbacaan, serta kerahasiaan data sebelum diterbitkan.',tags:['artikel','dokumentasi'],source:'Template internal contoh',updatedAt:'2026-11-06'},
    {id:'mutu-data',title:'Checklist Kualitas Data Laporan',category:'Operasional',summary:'Daftar pengecekan sebelum data laporan digunakan atau dibagikan.',content:'## Sebelum memproses\n- Periksa format tanggal dan kolom wajib.\n- Pastikan tidak ada nomor tiket ganda.\n- Verifikasi kesesuaian nilai dan identitas yang berwenang.\n- Simpan riwayat koreksi jika prosedur mengharuskannya.\n\n## Setelah memproses\n- Cek jumlah baris sebelum dan sesudah transformasi.\n- Tinjau nilai kosong dan data tidak konsisten.\n- Bagikan hasil hanya melalui kanal yang disetujui.\n\nIni adalah contoh checklist.',tags:['laporan','excel','validasi'],source:'Contoh checklist kualitas data',updatedAt:'2026-11-05'},
    {id:'eskalasi-kendala',title:'Alur Eskalasi Kendala Layanan',category:'SOP & Prosedur',summary:'Langkah awal ketika masalah belum bisa ditangani pada tingkat pertama.',content:'## Langkah eskalasi\n1. Identifikasi dampak, urgensi, dan kategori masalah.\n2. Dokumentasikan bukti yang aman dibagikan.\n3. Hubungi penanggung jawab sesuai matriks eskalasi organisasi.\n4. Catat tindak lanjut dan status penyelesaian.\n\n## Perhatian\nJangan mencantumkan password atau token akses dalam log tiket.',tags:['eskalasi','layanan','kendala'],source:'Contoh prosedur; memerlukan persetujuan internal',updatedAt:'2026-11-04'}
  ];
  function node(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  }
  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    svg.setAttribute('aria-hidden','true');
    return svg;
  }
  function button(label, className, action, id) {
    const el = node('button', className, label); el.type = 'button';
    if (action) el.dataset.action = action;
    if (id) el.dataset.id = id;
    return el;
  }
  function cleanText(value, max) { return typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0,max) : ''; }
  function slug(value) {
    return cleanText(value,160).toLocaleLowerCase('id').normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,84) || 'artikel';
  }
  function normalizeDate(value) {
    const s = cleanText(value,10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date().toISOString().slice(0,10);
    const d = new Date(s+'T00:00:00Z');
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===s ? s : new Date().toISOString().slice(0,10);
  }
  function makeArticle(raw, used = new Set()) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Artikel harus berupa objek.');
    const title = cleanText(raw.title,160);
    const category = cleanText(raw.category,65);
    const content = cleanText(raw.content,50000);
    if (!title || !category || !content) throw new Error('Judul, kategori, dan isi artikel wajib diisi.');
    const originalId = cleanText(raw.id,90);
    let id = /^[a-z0-9][a-z0-9-]{0,89}$/.test(originalId) ? originalId : slug(title);
    if (used.has(id)) throw new Error('ID artikel duplikat: ' + id);
    used.add(id);
    const rawTags = Array.isArray(raw.tags) ? raw.tags : [];
    return { id, title, category, summary:cleanText(raw.summary,450), content,
      tags:rawTags.slice(0,12).map(t=>cleanText(t,36)).filter(Boolean),
      source:cleanText(raw.source,500), updatedAt:normalizeDate(raw.updatedAt) };
  }
  function parseCollection(raw) {
    const items = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? raw.articles : null;
    if (!Array.isArray(items)) throw new Error('Format JSON tidak valid: harus ada daftar articles.');
    if (items.length > MAX_ARTICLES) throw new Error('Maksimal 1.000 artikel per koleksi.');
    const used = new Set();
    return items.map((item,i)=>{
      try {return makeArticle(item,used);} catch(error) {throw new Error('Artikel ke-' + (i+1) + ': ' + error.message);}
    });
  }
  function storageRead(key, fallback) {
    try { const v=window.localStorage.getItem(key); return v===null?fallback:JSON.parse(v); }
    catch(error) {state.localStorageAvailable=false;return fallback;}
  }
  function storageWrite(key, value) {
    try {window.localStorage.setItem(key,JSON.stringify(value));state.localStorageAvailable=true;return true;}
    catch(error){state.localStorageAvailable=false;toast('Penyimpanan browser penuh atau diblokir. Ekspor JSON agar perubahan tidak hilang.',true);return false;}
  }
  function persistArticles() { return storageWrite(ARTICLE_KEY,{version:1,articles:state.articles}); }
  function persistFavorites() { return storageWrite(FAV_KEY,state.favorites); }
  function record(action, detail) {
    const item={action:cleanText(action,80),detail:cleanText(detail,180),at:new Date().toISOString()};
    state.activity=[item,...state.activity].slice(0,80);
    storageWrite(ACTIVITY_KEY,state.activity);
    renderActivity();
  }
  function formatDate(dateStr) {
    try {return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(dateStr+'T00:00:00Z'));}
    catch(error){return dateStr;}
  }
  function formatDateTime(iso) {
    try {return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));}
    catch(error){return iso;}
  }
  function toast(message,isError=false) {
    const el=$('toast');el.textContent=message;el.classList.toggle('error',isError);el.hidden=false;
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{el.hidden=true;},4100);
  }
  function categories() {
    const m = new Map();
    state.articles.forEach(a=>m.set(a.category,(m.get(a.category)||0)+1));
    return [...m.entries()].sort(([a],[b])=>a.localeCompare(b,'id'));
  }
  function countFavorites() {const ids=new Set(state.articles.map(a=>a.id));return state.favorites.filter(id=>ids.has(id)).length;}
  function filtered(options={}) {
    const query=cleanText(options.search||'',200).toLocaleLowerCase('id').normalize('NFKC');
    let list=state.articles.filter(a=> (!options.category||a.category===options.category) &&
      (!options.favoritesOnly||state.favorites.includes(a.id)) &&
      (!query||[a.title,a.summary,a.category,a.content,a.source,...a.tags].join(' ').normalize('NFKC').toLocaleLowerCase('id').includes(query)) );
    const mode=options.sort||'new';
    list.sort((a,b)=>mode==='title'?a.title.localeCompare(b.title,'id'):mode==='old'?a.updatedAt.localeCompare(b.updatedAt):b.updatedAt.localeCompare(a.updatedAt));
    return list;
  }
  function changePage(page, hashUpdate=true) {
    if(!PAGES.has(page))page='beranda';
    state.currentPage=page;
    document.querySelectorAll('.page').forEach(el=>{const selected=el.id==='page-'+page;el.classList.toggle('is-current',selected);el.hidden=!selected;});
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
    const names={beranda:'Beranda',pengetahuan:'Pusat Pengetahuan',kategori:'Kategori',favorit:'Artikel Favorit',riwayat:'Riwayat Aktivitas',pengaturan:'Pengaturan Data',bantuan:'Bantuan',tentang:'Tentang'};
    $('header-page').textContent='/ '+names[page];
    if(hashUpdate && location.hash !== '#'+page) { location.hash=page; }
    closeMobile();
    window.scrollTo({top:0,behavior:'instant'});
    render();
  }
  function closeMobile(){$('sidebar').classList.remove('open');$('mobile-overlay').hidden=true;}
  function categoryOptions(select) {
    const current=select.value;
    const base=select.options[0];
    select.replaceChildren(base);
    categories().forEach(([label])=>{const option=node('option','',label);option.value=label;select.append(option);});
    select.value=[...select.options].some(o=>o.value===current)?current:'';
  }
  function renderStats(){ $('stat-total').textContent=String(state.articles.length);$('stat-category').textContent=String(categories().length);$('stat-favorite').textContent=String(countFavorites()); }
  function makeFavoriteButton(article) {
    const saved=state.favorites.includes(article.id);
    const el=button('','icon-only'+(saved?' favorited':''),'favorite',article.id);
    el.append(icon('star'));
    el.setAttribute('aria-label',saved?'Hapus favorit: '+article.title:'Tambah favorit: '+article.title);
    el.setAttribute('title',saved?'Hapus dari favorit':'Tambah ke favorit');
    el.setAttribute('aria-pressed',String(saved));
    return el;
  }
  function compactEntry(a) {
    const e=node('div','compact-entry');
    const symbol=node('div','entry-icon');symbol.append(icon('file'));
    const main=node('div','entry-main');const title=button(a.title,'entry-title','open',a.id);
    const meta=node('span','entry-meta',a.category+' · '+formatDate(a.updatedAt));main.append(title,meta);
    const actions=node('div','entry-actions');actions.append(makeFavoriteButton(a));
    e.append(symbol,main,actions);return e;
  }
  function articleCard(a) {
    const card=node('div','article-card');
    const top=node('div','card-heading');const symbol=node('div','card-icon');symbol.append(icon('book'));top.append(symbol,makeFavoriteButton(a));
    const category=node('div','card-category',a.category);
    const title=button(a.title,'card-title','open',a.id);
    const summary=node('p','card-summary',a.summary||a.content.slice(0,155));
    const foot=node('div','card-foot');const time=node('time','',formatDate(a.updatedAt));time.dateTime=a.updatedAt;
    const read=button('Baca Artikel','outline-btn','open',a.id);read.append(icon('arrow'));foot.append(time,read);
    card.append(top,category,title,summary,foot);return card;
  }
  function renderHome(){
    categoryOptions($('home-category'));
    const list=filtered({search:$('home-search').value,category:$('home-category').value}).slice(0,5);
    $('home-articles').replaceChildren(...list.map(compactEntry));$('home-empty').hidden=list.length!==0;
  }
  function renderLibrary(){
    categoryOptions($('library-category'));
    const list=filtered({search:$('library-search').value,category:$('library-category').value,sort:$('library-sort').value});
    $('library-count').textContent=list.length+' dari '+state.articles.length+' artikel tersedia';
    $('library-grid').replaceChildren(...list.map(articleCard));$('library-empty').hidden=list.length!==0;
  }
  function renderFavorites(){const items=filtered({favoritesOnly:true});$('favorite-grid').replaceChildren(...items.map(articleCard));$('favorite-empty').hidden=items.length!==0;}
  function renderCategories(){
    const all=categories();const nodes=all.map(([name,count])=>{
      const card=button('','category-card','category',name);const glyph=node('div','category-glyph');glyph.append(icon('folder'));
      const h=node('strong','',name),c=node('small','',count+' artikel'),action=node('span','', 'Jelajahi Kategori');action.append(icon('arrow'));
      card.append(glyph,h,c,action);return card;
    });
    $('category-grid').replaceChildren(...nodes);
    if(!all.length)$('category-grid').append(node('div','empty-state','Belum ada kategori. Tambahkan artikel baru untuk memulai.'));
    $('category-options').replaceChildren(...all.map(([category])=>{const o=node('option','');o.value=category;return o;}));
  }
  function activityItem(item){
    const e=node('div','activity-item');const mark=node('span','activity-mark');mark.append(icon('clock'));
    const body=node('div','activity-body');body.append(node('strong','',item.action+(item.detail?' — '+item.detail:'')),node('small','',formatDateTime(item.at)));
    e.append(mark,body);return e;
  }
  function renderActivity(){
    const recent=state.activity.slice(0,5);
    $('home-activity').replaceChildren(...(recent.length?recent.map(activityItem):[node('div','activity-empty','Belum ada aktivitas. Buka atau sunting artikel untuk memulai.') ]));
    $('activity-all').replaceChildren(...(state.activity.length?state.activity.map(activityItem):[node('div','activity-empty','Belum ada aktivitas yang tercatat pada browser ini.') ]));
  }
  function render(){renderStats();renderHome();renderLibrary();renderFavorites();renderCategories();renderActivity();}
  function safeArticleContent(parent,content){
    parent.replaceChildren();let list=null,listType='';let para=[];
    const flush=()=>{if(para.length){parent.append(node('p','',para.join(' ')));para=[];}};
    for(const line of content.split(/\r?\n/)){
      const s=line.trim();if(!s){flush();list=null;listType='';continue;}
      const head=/^(#{1,3})\s+(.+)$/.exec(s);
      if(head){flush();list=null;listType='';parent.append(node(head[1].length===3?'h3':'h2','',head[2]));continue;}
      const bullet=/^[-*]\s+(.+)$/.exec(s);const numbered=/^\d+[.)]\s+(.+)$/.exec(s);
      if(bullet||numbered){flush();const needed=bullet?'ul':'ol';if(!list||listType!==needed){list=node(needed);parent.append(list);listType=needed;}list.append(node('li','',(bullet||numbered)[1]));continue;}
      list=null;listType='';para.push(s);
    }
    flush();
  }
  function showArticle(id,updateUrl=true){
    const a=state.articles.find(item=>item.id===id);if(!a){toast('Artikel tidak ditemukan pada browser ini.',true);return;}
    state.activeArticle=id;
    $('article-category').textContent=a.category;
    $('article-title').textContent=a.title;
    $('article-summary').textContent=a.summary;
    $('article-date').textContent='Diperbarui '+formatDate(a.updatedAt);
    $('article-tags').textContent=a.tags.length?'Kata kunci: '+a.tags.join(', '):'';
    $('article-source').textContent=a.source?'Sumber: '+a.source:'';
    safeArticleContent($('article-content'),a.content);
    updateModalFavorite();
    if(!$('article-dialog').open)$('article-dialog').showModal();
    if(updateUrl){const url=new URL(location.href);url.searchParams.set('article',id);history.replaceState(null,'',url);}
    record('Membuka artikel',a.title);
  }
  function removeArticleUrl(){const url=new URL(location.href);url.searchParams.delete('article');history.replaceState(null,'',url);}
  function closeArticle(){if($('article-dialog').open)$('article-dialog').close();removeArticleUrl();}
  function updateModalFavorite(){
    const a=$('article-favorite');a.replaceChildren(icon('star'),document.createTextNode(state.favorites.includes(state.activeArticle)?' Hapus Favorit':' Favorit'));
    a.setAttribute('aria-pressed',String(state.favorites.includes(state.activeArticle)));
  }
  function toggleFavorite(id){
    const a=state.articles.find(x=>x.id===id);if(!a)return;
    const has=state.favorites.includes(id);
    state.favorites=has?state.favorites.filter(x=>x!==id):[...state.favorites,id];const saved=persistFavorites();
    record(has?'Menghapus favorit':'Menambah favorit',a.title);render();
    if(state.activeArticle===id && $('article-dialog').open)updateModalFavorite();
    toast(!saved?'Favorit belum tersimpan permanen. Periksa izin penyimpanan browser.':has?'Artikel dihapus dari favorit.':'Artikel ditambahkan ke favorit.',!saved);
  }
  function showEditor(id=''){
    const a=state.articles.find(x=>x.id===id);$('editor-title').textContent=a?'Sunting Artikel':'Tambah Artikel';
    $('edit-id').value=a?.id||'';$('edit-title').value=a?.title||'';$('edit-category').value=a?.category||'';
    $('edit-summary').value=a?.summary||'';$('edit-tags').value=a?.tags.join(', ')||'';$('edit-content').value=a?.content||'';$('edit-source').value=a?.source||'';
    if($('article-dialog').open)closeArticle();
    $('editor-dialog').showModal();$('edit-title').focus();
  }
  function saveEditor(event){
    event.preventDefault();
    if(!$('article-form').reportValidity())return;
    const prior=$('edit-id').value;
    const title=$('edit-title').value.trim();
    let id=prior||slug(title);
    if(!prior){let candidate=id,append=2;while(state.articles.some(x=>x.id===candidate)){candidate=id+'-'+append++;}id=candidate;}
    const raw={id,title,category:$('edit-category').value,summary:$('edit-summary').value,
      tags:$('edit-tags').value.split(',').map(x=>x.trim()).filter(Boolean),
      content:$('edit-content').value,source:$('edit-source').value,updatedAt:new Date().toISOString().slice(0,10)};
    let article;
    try{article=makeArticle(raw);}catch(error){toast(error.message,true);return;}
    if(!prior && state.articles.length>=MAX_ARTICLES){toast('Batas maksimal 1.000 artikel sudah tercapai.',true);return;}
    if(prior){state.articles=state.articles.map(x=>x.id===prior?article:x);}else{state.articles=[article,...state.articles];}
    const saved=persistArticles();record(prior?'Menyunting artikel':'Membuat artikel',article.title);
    $('editor-dialog').close();render();showArticle(id);toast(saved?'Artikel berhasil disimpan. Ekspor JSON untuk dipublikasikan ke GitHub.':'Perubahan hanya ada dalam sesi ini. Ekspor JSON agar tidak hilang.',!saved);
  }
  function ask(title,message,label='Ya, Lanjutkan'){
    const dialog=$('confirm-dialog');dialog.returnValue='no';$('confirm-title').textContent=title;$('confirm-message').textContent=message;$('confirm-yes').textContent=label;
    return new Promise(resolve=>{
      const onClose=()=>resolve(dialog.returnValue==='yes');
      dialog.addEventListener('close',onClose,{once:true});
      dialog.showModal();
    });
  }
  async function deleteArticle(){
    const id=state.activeArticle;const a=state.articles.find(x=>x.id===id);if(!a)return;
    if(!await ask('Hapus artikel?','Artikel "'+a.title+'" akan dihapus dari koleksi pada browser ini. Buat cadangan JSON jika diperlukan.','Hapus Artikel'))return;
    state.articles=state.articles.filter(x=>x.id!==id);state.favorites=state.favorites.filter(x=>x!==id);
    const saved=persistArticles();persistFavorites();closeArticle();record('Menghapus artikel',a.title);render();toast(saved?'Artikel telah dihapus dari data lokal.':'Penghapusan belum disimpan permanen. Ekspor data terbaru.',!saved);
  }
  function downloadJson(obj,filename){
    const data=JSON.stringify(obj,null,2)+'\n';
    const blob=new Blob([data],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const link=node('a');link.href=url;link.download=filename;
    document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function exportData(){downloadJson({version:1,articles:state.articles},'articles.json');record('Mengekspor data',state.articles.length+' artikel');toast('Data berhasil diekspor sebagai articles.json.');}
  function exportTemplate(){downloadJson({version:1,articles:[{id:'contoh-artikel',title:'Judul Contoh',category:'Panduan Sistem',summary:'Ringkasan singkat',content:'## Pengantar\nTuliskan isi di sini.\n\n## Langkah\n- Langkah pertama',tags:['contoh'],source:'Contoh referensi',updatedAt:new Date().toISOString().slice(0,10)}]},'template-vip-ekb.json');toast('Template JSON berhasil disiapkan.');}
  async function importData(file){
    if(!file)return;
    try{
      if(file.size>MAX_IMPORT_SIZE)throw new Error('Ukuran file maksimal 5 MB.');
      const raw=JSON.parse(await file.text());const articles=parseCollection(raw);
      if(!await ask('Ganti koleksi pengetahuan?','Data lokal saat ini akan diganti dengan '+articles.length+' artikel dari berkas JSON. Ekspor cadangan terlebih dahulu jika diperlukan.','Ya, Impor Data'))return;
      state.articles=articles;
      const ids=new Set(articles.map(a=>a.id));state.favorites=state.favorites.filter(id=>ids.has(id));
      const saved=persistArticles();persistFavorites();record('Mengimpor data',articles.length+' artikel');
      $('home-search').value='';$('library-search').value='';$('home-category').value='';$('library-category').value='';
      render();changePage('pengetahuan');toast(saved?articles.length+' artikel berhasil diimpor.':'Data berhasil dimuat tetapi belum tersimpan permanen. Ekspor JSON.',!saved);
    }catch(error){toast('Gagal impor: '+error.message,true);}
    finally{$('file-upload').value='';}
  }
  async function restorePublished(){
    if(!await ask('Pulihkan koleksi awal?','Semua perubahan artikel lokal akan diganti dengan versi yang diterbitkan di GitHub. Artikel yang belum diekspor akan hilang.','Pulihkan Sekarang'))return;
    state.articles=state.published.map(a=>({...a,tags:[...a.tags]}));
    const ids=new Set(state.articles.map(a=>a.id));state.favorites=state.favorites.filter(id=>ids.has(id));
    const saved=persistArticles();persistFavorites();record('Memulihkan data awal',state.articles.length+' artikel');
    $('home-search').value='';$('library-search').value='';$('home-category').value='';$('library-category').value='';
    render();toast(saved?'Koleksi dikembalikan ke versi publikasi.':'Koleksi dipulihkan, tetapi penyimpanan browser gagal.',!saved);
  }
  async function clearActivity(){
    if(!state.activity.length){toast('Belum ada riwayat untuk dihapus.');return;}
    if(!await ask('Hapus semua riwayat?','Catatan aktivitas browser ini akan dihapus. Artikel dan favorit tidak berubah.','Hapus Riwayat'))return;
    state.activity=[];storageWrite(ACTIVITY_KEY,[]);renderActivity();toast('Riwayat lokal sudah dibersihkan.');
  }
  async function copyLink(){
    const a=state.articles.find(x=>x.id===state.activeArticle);if(!a)return;
    const url=new URL(location.href);url.searchParams.set('article',a.id);
    const value=url.toString();
    try{
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(value);}
      else {const input=node('textarea');input.value=value;input.style.position='fixed';input.style.left='-9999px';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('Penyalinan tidak didukung.');}
      toast(location.protocol==='file:'?'Tautan lokal tersalin. Gunakan URL GitHub Pages untuk berbagi.':'Tautan artikel berhasil disalin.');
    }catch(error){toast('Tidak dapat menyalin otomatis. Salin alamat di bilah browser.',true);}
  }
  function bind(){
    document.addEventListener('click',event=>{
      const nav=event.target.closest('[data-page]');
      if(nav){event.preventDefault();changePage(nav.dataset.page);return;}
      const action=event.target.closest('[data-action]');if(!action)return;
      const {action:kind,id}=action.dataset;
      if(kind==='create')showEditor();
      else if(kind==='open')showArticle(id);
      else if(kind==='favorite')toggleFavorite(id);
      else if(kind==='category'){$('library-category').value=id;changePage('pengetahuan');}
    });
    $('menu-btn').addEventListener('click',()=>{$('sidebar').classList.add('open');$('mobile-overlay').hidden=false;});
    $('mobile-overlay').addEventListener('click',closeMobile);
    $('brand-link').addEventListener('click',event=>{event.preventDefault();changePage('beranda');});
    $('top-about').addEventListener('click',()=>changePage('tentang'));
    $('home-search').addEventListener('input',renderHome);$('home-category').addEventListener('change',renderHome);
    $('library-search').addEventListener('input',renderLibrary);$('library-category').addEventListener('change',renderLibrary);$('library-sort').addEventListener('change',renderLibrary);
    $('clear-library-filter').addEventListener('click',()=>{$('library-search').value='';$('library-category').value='';$('library-sort').value='new';renderLibrary();});
    $('article-favorite').addEventListener('click',()=>toggleFavorite(state.activeArticle));$('article-copy').addEventListener('click',copyLink);
    $('article-edit').addEventListener('click',()=>showEditor(state.activeArticle));$('article-delete').addEventListener('click',deleteArticle);
    $('article-form').addEventListener('submit',saveEditor);
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.close;if(id==='article-dialog')closeArticle();else $(id).close();}));
    $('article-dialog').addEventListener('close',removeArticleUrl);
    $('confirm-no').addEventListener('click',()=>$('confirm-dialog').close('no'));
    $('confirm-x').addEventListener('click',()=>$('confirm-dialog').close('no'));
    $('confirm-yes').addEventListener('click',()=>$('confirm-dialog').close('yes'));
    $('export-data').addEventListener('click',exportData);$('template-data').addEventListener('click',exportTemplate);
    $('import-data').addEventListener('click',()=>$('file-upload').click());$('file-upload').addEventListener('change',event=>importData(event.target.files?.[0]));
    $('restore-data').addEventListener('click',restorePublished);
    $('clear-activity').addEventListener('click',clearActivity);$('clear-all-activity').addEventListener('click',clearActivity);
    window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(PAGES.has(page))changePage(page,false);});
    document.addEventListener('keydown',event=>{
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
        event.preventDefault();if($('article-dialog').open||$('editor-dialog').open||$('confirm-dialog').open)return;
        if(state.currentPage==='beranda')$('home-search').focus();else{changePage('pengetahuan');$('library-search').focus();}
      }
    });
  }
  async function initialize(){
    $('year').textContent=String(new Date().getFullYear());bind();
    let downloaded;
    try{
      const response=await fetch('./data/articles.json',{cache:'no-cache'});
      if(!response.ok)throw new Error('Status '+response.status);
      downloaded=parseCollection(await response.json());
    }catch(error){downloaded=parseCollection(Fallback);toast('Data online tidak tersedia; menggunakan contoh bawaan. Upload ke GitHub Pages untuk koleksi lengkap.');}
    state.published=downloaded;
    const stored=storageRead(ARTICLE_KEY,null);
    try{state.articles=stored===null?downloaded:parseCollection(stored);}catch(error){state.articles=downloaded;toast('Data lokal rusak atau tidak kompatibel; memakai data bawaan.',true);}
    const validIds=new Set(state.articles.map(a=>a.id));
    const favorites=storageRead(FAV_KEY,[]);state.favorites=Array.isArray(favorites)?[...new Set(favorites.filter(x=>typeof x==='string'&&validIds.has(x)))]:[];
    const history=storageRead(ACTIVITY_KEY,[]);
    state.activity=Array.isArray(history)?history.slice(0,80).filter(x=>x&&typeof x.action==='string'&&typeof x.at==='string'&&typeof x.detail==='string').map(x=>({action:cleanText(x.action,80),detail:cleanText(x.detail,180),at:x.at})):[];
    render();changePage(location.hash.slice(1)||'beranda',false);
    const linkArticle=new URLSearchParams(location.search).get('article');
    if(linkArticle&&state.articles.some(x=>x.id===linkArticle))showArticle(linkArticle,false);
  }
  initialize();
})();
