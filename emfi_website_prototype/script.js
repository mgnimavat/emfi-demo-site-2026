(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-rotate-words]').forEach((node)=>{
    const words = (node.getAttribute('data-rotate-words')||'').split('|').filter(Boolean);
    if(!words.length || reduceMotion) return;
    let index=0, deleting=false, count=words[0].length;
    node.textContent=words[0];
    const tick=()=>{
      const word=words[index];
      if(!deleting){
        count--;
        node.textContent=word.slice(0,Math.max(0,count));
        if(count<=0){deleting=true;setTimeout(tick,420);return;}
        setTimeout(tick,48);
      }else{
        const next=words[(index+1)%words.length];
        count++;
        node.textContent=next.slice(0,count);
        if(count>=next.length){index=(index+1)%words.length;deleting=false;setTimeout(tick,1900);return;}
        setTimeout(tick,82);
      }
    };
    setTimeout(tick,2200);
  });
  const toggle=document.querySelector('.mobile-toggle');
  const nav=document.querySelector('.nav');
  if(toggle && nav){
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      toggle.textContent=open?'×':'☰';
    });
  }
  const search=document.querySelector('[data-research-search]');
  const country=document.querySelector('[data-research-country]');
  const category=document.querySelector('[data-research-category]');
  const items=[...document.querySelectorAll('[data-research-item]')];
  const empty=document.querySelector('[data-research-empty]');
  function filterResearch(){
    if(!items.length)return;
    const q=(search?.value||'').toLowerCase().trim();
    const c=country?.value||'all';
    const t=category?.value||'all';
    let shown=0;
    items.forEach(item=>{
      const text=(item.textContent+' '+item.dataset.country+' '+item.dataset.category).toLowerCase();
      const matchText=!q||text.includes(q);
      const matchCountry=c==='all'||item.dataset.country===c;
      const matchCategory=t==='all'||item.dataset.category===t;
      const show=matchText&&matchCountry&&matchCategory;
      item.hidden=!show;if(show)shown++;
    });
    if(empty)empty.style.display=shown?'none':'block';
  }
  [search,country,category].forEach(el=>el&&el.addEventListener('input',filterResearch));
  [country,category].forEach(el=>el&&el.addEventListener('change',filterResearch));
})();
