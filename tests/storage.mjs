import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'stifin-storage-'));
const port=4600+Math.floor(Math.random()*300);
const env={...process.env,PORT:String(port),NODE_ENV:'development',COOKIE_SECURE:'false',DATA_FILE:path.join(dir,'database.json'),BACKUP_DIR:path.join(dir,'backups'),BACKUP_INTERVAL_MINUTES:'5',APP_KEY:'storage-test-key-with-at-least-thirty-two-characters',APP_ADMIN_EMAIL:'storage@stifinmulia.com',APP_ADMIN_PASSWORD:'PasswordKuat123!'};
const base=`http://127.0.0.1:${port}`;
let child;

async function start(){
  child=spawn(process.execPath,['server.js'],{cwd:path.resolve('.'),env,stdio:['ignore','pipe','pipe']});let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
  for(let i=0;i<60;i++){try{const response=await fetch(`${base}/health`);if(response.ok)return}catch{}await new Promise(resolve=>setTimeout(resolve,100))}
  throw new Error(`Server tidak aktif. ${logs}`);
}
async function stop(){if(!child)return;child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));child=null}
async function login(){const response=await fetch(`${base}/login`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({email:env.APP_ADMIN_EMAIL,password:env.APP_ADMIN_PASSWORD}),redirect:'manual'});assert(response.status===303,'Login gagal');return response.headers.get('set-cookie').split(';')[0]}
async function csrf(cookie){const response=await fetch(`${base}/leads`,{headers:{cookie}});const page=await response.text();return page.match(/name="csrf" value="([^"]+)"/)?.[1]}

try{
  await start();let cookie=await login(),token=await csrf(cookie);
  let response=await fetch(`${base}/leads`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:token,name:'Lead Persisten',phone:'081200000001',type:'Calon tes',status:'Baru'}),redirect:'manual'});assert(response.status===303,'Lead uji gagal disimpan');
  response=await fetch(`${base}/backup-now`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:token}),redirect:'manual'});assert(response.status===303,'Cadangan manual gagal dibuat');
  response=await fetch(`${base}/backup.json`,{headers:{cookie}});const downloadedBackup=await response.text();
  const changed=JSON.parse(downloadedBackup);changed.leads[0].name='Lead dari Cadangan';
  response=await fetch(`${base}/restore-backup`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:token,backupData:JSON.stringify(changed)}),redirect:'manual'});assert(response.status===303&&response.headers.get('location')==='/integrations?restore=success','Pemulihan cadangan dari dashboard gagal');
  response=await fetch(`${base}/leads?q=Lead+dari+Cadangan`,{headers:{cookie}});assert((await response.text()).includes('Lead dari Cadangan'),'Isi cadangan tidak diterapkan');
  const beforeInvalid=fs.readFileSync(env.DATA_FILE,'utf8');
  token=await csrf(cookie);response=await fetch(`${base}/restore-backup`,{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:token,backupData:'{"meta":{}}'}),redirect:'manual'});assert(response.status===303&&response.headers.get('location').startsWith('/integrations?restore=error'),'Cadangan tidak valid seharusnya ditolak');assert(fs.readFileSync(env.DATA_FILE,'utf8')===beforeInvalid,'Cadangan tidak valid mengubah database aktif');
  const installationId=JSON.parse(fs.readFileSync(env.DATA_FILE,'utf8')).meta.installationId;await stop();

  await start();cookie=await login();response=await fetch(`${base}/leads?q=Lead+dari+Cadangan`,{headers:{cookie}});assert((await response.text()).includes('Lead dari Cadangan'),'Lead hilang setelah aplikasi dinyalakan ulang');assert(JSON.parse(fs.readFileSync(env.DATA_FILE,'utf8')).meta.installationId===installationId,'Identitas instalasi berubah setelah restart');await stop();

  fs.writeFileSync(env.DATA_FILE,'{"rusak":');await start();cookie=await login();response=await fetch(`${base}/leads?q=Lead+dari+Cadangan`,{headers:{cookie}});assert((await response.text()).includes('Lead dari Cadangan'),'Pemulihan database dari cadangan gagal');
  console.log('Storage test lulus: restore dashboard tervalidasi, lead bertahan setelah restart, dan database rusak pulih dari cadangan.');
}finally{await stop();fs.rmSync(dir,{recursive:true,force:true})}

function assert(condition,message){if(!condition)throw new Error(message)}
