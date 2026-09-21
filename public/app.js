document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('.sidebar')?.classList.toggle('open'));
if(document.querySelector('.details,.section-gap')){const link=document.createElement('link');link.rel='stylesheet';link.href='/assets/integrations.css?v=1.6.1';document.head.append(link)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(b){navigator.clipboard.writeText(b.dataset.copy||'');const old=b.textContent;b.textContent='Tersalin';setTimeout(()=>b.textContent=old,1400)}});
document.querySelectorAll('form[data-confirm]').forEach(f=>f.addEventListener('submit',e=>{if(!confirm(f.dataset.confirm||'Lanjutkan?'))e.preventDefault()}));
document.querySelectorAll('[data-message-template]').forEach(select=>select.addEventListener('change',()=>{
  const textarea=select.closest('form')?.querySelector('textarea[name="message"]'),message=select.selectedOptions[0]?.dataset.message||'';
  if(textarea&&message)textarea.value=message;
}));
document.querySelectorAll('[data-image-file]').forEach(input=>input.addEventListener('change',()=>{
  const form=input.closest('form'),hidden=form?.querySelector('[data-image-data]'),status=form?.querySelector('[data-image-status]'),preview=form?.querySelector('[data-image-preview]'),file=input.files?.[0];
  if(hidden)hidden.value='';if(preview){preview.hidden=true;preview.removeAttribute('src')}
  if(!file){if(status)status.textContent='Maksimal 4 MB.';return}
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){if(status)status.textContent='Gunakan JPG, PNG, atau WebP.';input.value='';return}
  if(file.size>4_000_000){if(status)status.textContent='Gambar terlalu besar. Maksimal 4 MB.';input.value='';return}
  if(status)status.textContent='Memproses gambar...';const reader=new FileReader();reader.onload=()=>{if(hidden)hidden.value=String(reader.result||'');if(status)status.textContent=`${file.name} siap dikirim.`;if(preview){preview.src=String(reader.result||'');preview.hidden=false}};reader.onerror=()=>{if(status)status.textContent='Gambar gagal dibaca.'};reader.readAsDataURL(file);
}));
document.querySelectorAll('[data-image-form],[data-broadcast-form]').forEach(form=>form.addEventListener('submit',e=>{
  const file=form.querySelector('[data-image-file]')?.files?.[0],data=form.querySelector('[data-image-data]')?.value,status=form.querySelector('[data-image-status]');
  if(file&&!data){e.preventDefault();if(status)status.textContent='Tunggu sampai gambar selesai diproses, lalu klik kirim kembali.'}
}));
document.querySelectorAll('[data-check-type]').forEach(button=>button.addEventListener('click',()=>{
  const boxes=[...document.querySelectorAll(`[data-recipient-type="${button.dataset.checkType}"]`)],check=!boxes.every(x=>x.checked);boxes.forEach(x=>x.checked=check);button.textContent=check?'Batalkan semua':'Pilih semua';
}));
document.querySelector('[data-broadcast-form]')?.addEventListener('submit',e=>{
  if(!e.submitter?.matches('[data-broadcast-send]'))return;const total=document.querySelectorAll('[data-broadcast-form] input[name="recipientKeys"]:checked').length;
  if(!confirm(`Kirim pesan ke ${total} penerima sekarang?`))e.preventDefault();
});
document.querySelectorAll('[data-restore-form]').forEach(form=>{
  const file=form.querySelector('[data-backup-file]'),data=form.querySelector('[data-backup-data]'),button=form.querySelector('[data-restore-button]'),status=form.querySelector('[data-restore-status]');
  file?.addEventListener('change',async()=>{
    const selected=file.files?.[0];data.value='';button.disabled=true;
    if(!selected){status.textContent='Pilih file JSON maksimal 5 MB.';return}
    if(selected.size>5_000_000){status.textContent='File terlalu besar. Batas maksimal 5 MB.';return}
    try{const raw=await selected.text();JSON.parse(raw);data.value=raw;button.disabled=false;status.textContent=`${selected.name} siap dipulihkan.`}catch{status.textContent='File bukan JSON yang valid.'}
  });
});
