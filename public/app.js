document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('.sidebar')?.classList.toggle('open'));
if(document.querySelector('.details,.section-gap')){const link=document.createElement('link');link.rel='stylesheet';link.href='/assets/integrations.css';document.head.append(link)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b){navigator.clipboard.writeText(b.dataset.copy||'');const old=b.textContent;b.textContent='Tersalin';setTimeout(()=>b.textContent=old,1400)}});
document.querySelectorAll('form[data-confirm]').forEach(f=>f.addEventListener('submit',e=>{if(!confirm(f.dataset.confirm||'Lanjutkan?'))e.preventDefault()}));
