import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stifin-hub-'));
const port=3200+Math.floor(Math.random()*500);
const mockPort=3900+Math.floor(Math.random()*500);let starSenderPayload=null,starSenderAuth='';
const mock=http.createServer(async(req,res)=>{res.setHeader('content-type','application/json');if(req.url==='/proGetCab/pro/JML-CAB-62')return res.end(JSON.stringify({Pesan:'Success',Data:[{KodeID:'JML-HRP-01',Nama:'Promotor API',Phone:'08111111111',Area:'Pekalongan',Propinsi:'Jawa Tengah',Aktif:'1',PassID:'RAHASIA',TanggalLahir:'1990-01-01'}]}));if(req.url==='/voucherGet/getTotVoucher/JML-HRP-01')return res.end(JSON.stringify({Data:[{Total:7}]}));if(req.url==='/send'&&req.method==='POST'){const chunks=[];for await(const c of req)chunks.push(c);starSenderPayload=JSON.parse(Buffer.concat(chunks));starSenderAuth=String(req.headers.authorization||'');return res.end(JSON.stringify({id:'msg-123'}))}res.statusCode=404;res.end('{}')});
await new Promise(resolve=>mock.listen(mockPort,'127.0.0.1',resolve));
const child=spawn(process.execPath,['server.js'],{cwd:path.resolve('.'),env:{...process.env,PORT:String(port),NODE_ENV:'development',COOKIE_SECURE:'false',DATA_FILE:path.join(dir,'database.json'),APP_KEY:'test-key-with-at-least-thirty-two-characters',APP_ADMIN_EMAIL:'test@stifinmulia.com',APP_ADMIN_PASSWORD:'PasswordKuat123!',STIFIN_API_BASE:`http://127.0.0.1:${mockPort}`,STIFIN_BRANCH_CODE:'JML-CAB-62',STARSENDER_ENABLED:'true',STARSENDER_SEND_URL:`http://127.0.0.1:${mockPort}/send`,STARSENDER_API_KEY:'test-secret',STARSENDER_WEBHOOK_SECRET:'webhook-secret'},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
const base=`http://127.0.0.1:${port}`;
try{
  for(let i=0;i<50;i++){try{const r=await fetch(`${base}/health`);if(r.ok)break}catch{}await new Promise(r=>setTimeout(r,100));if(i===49)throw new Error(`Server tidak aktif. ${logs}`)}
  let r=await fetch(`${base}/login`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({email:'test@stifinmulia.com',password:'PasswordKuat123!'}),redirect:'manual'});
  assert(r.status===303,'Login tidak mengarahkan ke dashboard');
  const cookie=r.headers.get('set-cookie')?.split(';')[0];assert(cookie,'Cookie sesi tidak dibuat');
  r=await fetch(`${base}/`,{headers:{cookie}});const dashboard=await r.text();assert(r.ok&&dashboard.includes('Marketing Hub'),'Dashboard gagal dibuka');
  r=await fetch(`${base}/content`,{headers:{cookie}});const content=await r.text();assert(r.ok&&content.includes('120 data ditemukan')&&content.includes('Bank Konten'),'Bank konten 120 item tidak termuat');
  const csrf=content.match(/name="csrf" value="([^"]+)"/)?.[1];assert(csrf,'Token CSRF tidak ditemukan');
  r=await fetch(`${base}/leads`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,name:'Peserta Uji',phone:'081234567890',city:'Bandung',type:'Calon tes',need:'Ingin memahami pola belajar',source:'Website',owner:'Admin',status:'Baru',nextFollowUp:'2026-09-22',consentWhatsApp:'Ya',referralConsent:'Belum'}),redirect:'manual'});assert(r.status===303,'Lead tidak dapat disimpan');
  r=await fetch(`${base}/leads?q=Peserta+Uji`,{headers:{cookie}});assert((await r.text()).includes('Peserta Uji'),'Lead tersimpan tidak ditemukan');
  r=await fetch(`${base}/crm`,{headers:{cookie}});assert(r.ok&&(await r.text()).includes('Perjalanan Calon Peserta'),'Growth CRM gagal dibuka');
  r=await fetch(`${base}/copylab`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,contentId:'1',audience:'orang tua remaja',goal:'konsultasi'})});assert(r.ok&&(await r.text()).includes('HASIL REPURPOSING'),'Copywriting Lab gagal membuat turunan');
  r=await fetch(`${base}/campaigns`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,code:'IG-BDG-01',name:'Instagram Bandung',channel:'Instagram',objective:'Tes STIFIn',region:'Bandung',contentCode:'SM-001',whatsappMessage:'Ingin konsultasi',startDate:'2026-09-21',clicks:'0',leads:'0',bookings:'0',active:'on'}),redirect:'manual'});assert(r.status===303,'Kampanye gagal dibuat');
  r=await fetch(`${base}/go/IG-BDG-01`,{redirect:'manual'});assert(r.status===303&&r.headers.get('location')?.includes('/forms/consultation'),'Tracking link kampanye gagal');
  r=await fetch(`${base}/forms/consultation?campaign=IG-BDG-01`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({campaignCode:'IG-BDG-01',name:'Lead Kampanye',phone:'089999999999',city:'Bandung',type:'Calon tes',urgency:'Segera',need:'Ingin tes untuk anak',consentWhatsApp:'on'})});assert(r.ok&&(await r.text()).includes('Permintaan berhasil diterima'),'Form lead publik gagal');
  r=await fetch(`${base}/integrations`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf})});assert(r.ok&&(await r.text()).includes('Sinkronisasi selesai'),'Sinkronisasi promotor gagal');
  r=await fetch(`${base}/backup.json`,{headers:{cookie}});let backup=await r.json();const apiPromoter=backup.promoters.find(x=>x.stifinCode==='JML-HRP-01');assert(apiPromoter&&!JSON.stringify(apiPromoter).includes('RAHASIA'),'Data sensitif API ikut tersimpan');
  r=await fetch(`${base}/promoters/${apiPromoter.id}/voucher`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf}),redirect:'manual'});assert(r.status===303,'Saldo voucher gagal diperiksa');
  const leadId=backup.leads[0].id;
  r=await fetch(`${base}/messages`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,leadId:String(leadId),message:'Halo {nama}',action:'send'})});assert(r.ok&&(await r.text()).includes('berhasil diteruskan'),'Pesan StarSender gagal');assert(starSenderPayload?.to==='6281234567890'&&starSenderPayload?.messageType==='text'&&starSenderPayload?.body==='Halo Peserta Uji','Payload StarSender salah');assert(starSenderAuth==='test-secret','Authorization StarSender salah');
  r=await fetch(`${base}/webhooks/starsender/webhook-secret`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:'incoming-123',from:'6281234567890',message:'Saya ingin jadwal tes',timestamp:'1665408510000',device:'WA Utama',rawSecret:'jangan-simpan'})});assert(r.ok,'Webhook StarSender gagal');
  r=await fetch(`${base}/webhooks/starsender/webhook-secret`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:'incoming-123',from:'6281234567890',message:'Saya ingin jadwal tes',timestamp:'1665408510000',device:'WA Utama'})});assert(r.ok,'Deduplikasi webhook gagal');
  r=await fetch(`${base}/export/content.csv`,{headers:{cookie}});assert(r.ok&&(await r.text()).includes('SM-001'),'Ekspor CSV gagal');
  r=await fetch(`${base}/backup.json`,{headers:{cookie}});backup=await r.json();assert(backup.content.length===120&&backup.leads.length===2&&backup.promoters[0].voucherBalance===7&&backup.messages.filter(x=>x.direction==='Masuk'&&x.message==='Saya ingin jadwal tes').length===1&&backup.campaigns[0].clicks===1&&backup.campaigns[0].leads===1&&backup.copyDrafts.length===1&&!JSON.stringify(backup.webhookEvents).includes('jangan-simpan'),'Backup atau modul Growth OS gagal');
  console.log('Smoke test lulus: Growth CRM, Copy Lab, kampanye, form publik, API STIFIn, StarSender dua arah, CSV, dan backup.');
}finally{child.kill('SIGTERM');await new Promise(resolve=>mock.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}

function assert(condition,message){if(!condition)throw new Error(message)}
