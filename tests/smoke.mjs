import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stifin-hub-'));
const port=3200+Math.floor(Math.random()*500);
const child=spawn(process.execPath,['server.js'],{cwd:path.resolve('.'),env:{...process.env,PORT:String(port),NODE_ENV:'development',COOKIE_SECURE:'false',DATA_FILE:path.join(dir,'database.json'),APP_KEY:'test-key-with-at-least-thirty-two-characters',APP_ADMIN_EMAIL:'test@stifinmulia.com',APP_ADMIN_PASSWORD:'PasswordKuat123!'},stdio:['ignore','pipe','pipe']});
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
  r=await fetch(`${base}/leads`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf,name:'Peserta Uji',phone:'081234567890',city:'Bandung',type:'Calon tes',need:'Ingin memahami pola belajar',source:'Website',owner:'Admin',status:'Baru',nextFollowUp:'2026-09-22',referralConsent:'Belum'}),redirect:'manual'});assert(r.status===303,'Lead tidak dapat disimpan');
  r=await fetch(`${base}/leads?q=Peserta+Uji`,{headers:{cookie}});assert((await r.text()).includes('Peserta Uji'),'Lead tersimpan tidak ditemukan');
  r=await fetch(`${base}/export/content.csv`,{headers:{cookie}});assert(r.ok&&(await r.text()).includes('SM-001'),'Ekspor CSV gagal');
  r=await fetch(`${base}/backup.json`,{headers:{cookie}});const backup=await r.json();assert(backup.content.length===120&&backup.leads.length===1,'Backup tidak lengkap');
  console.log('Smoke test lulus: login, 120 konten, CRUD lead, CSV, dan backup.');
}finally{child.kill('SIGTERM');fs.rmSync(dir,{recursive:true,force:true})}

function assert(condition,message){if(!condition)throw new Error(message)}
