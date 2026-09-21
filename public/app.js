document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('.sidebar')?.classList.toggle('open'));
if(document.querySelector('.details,.section-gap')){const link=document.createElement('link');link.rel='stylesheet';link.href='/assets/integrations.css';document.head.append(link)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b){navigator.clipboard.writeText(b.dataset.copy||'');const old=b.textContent;b.textContent='Tersalin';setTimeout(()=>b.textContent=old,1400)}});
document.querySelectorAll('form[data-confirm]').forEach(f=>f.addEventListener('submit',e=>{if(!confirm(f.dataset.confirm||'Lanjutkan?'))e.preventDefault()}));
document.querySelectorAll('[data-restore-form]').forEach(form=>{
  const file=form.querySelector('[data-backup-file]'),data=form.querySelector('[data-backup-data]'),button=form.querySelector('[data-restore-button]'),status=form.querySelector('[data-restore-status]');
  file?.addEventListener('change',async()=>{
    const selected=file.files?.[0];data.value='';button.disabled=true;
    if(!selected){status.textContent='Pilih file JSON maksimal 5 MB.';return}
    if(selected.size>5_000_000){status.textContent='File terlalu besar. Batas maksimal 5 MB.';return}
    try{const raw=await selected.text();JSON.parse(raw);data.value=raw;button.disabled=false;status.textContent=`${selected.name} siap dipulihkan.`}catch{status.textContent='File bukan JSON yang valid.'}
  });
});
