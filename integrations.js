const trimSlash=value=>String(value||'').replace(/\/+$/,'');

function withTimeout(ms=15000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),ms);
  return {signal:controller.signal,done:()=>clearTimeout(timer)};
}

async function requestJson(url,options={}){
  const timeout=withTimeout(Number(process.env.INTEGRATION_TIMEOUT_MS||15000));
  try{
    const response=await fetch(url,{...options,signal:timeout.signal,headers:{accept:'application/json',...(options.headers||{})}});
    const raw=await response.text();
    let data={};
    try{data=raw?JSON.parse(raw):{}}catch{throw new Error(`Respons integrasi bukan JSON (HTTP ${response.status}).`)}
    if(!response.ok){const detail=String(data?.message??data?.error??'').replace(/[\r\n]+/g,' ').slice(0,160);throw new Error(`Integrasi gagal (HTTP ${response.status})${detail?`: ${detail}`:'.'}`)}
    return data;
  }finally{timeout.done()}
}

function firstArray(value){
  if(Array.isArray(value))return value;
  if(!value||typeof value!=='object')return [];
  for(const key of ['Data','data','Result','result','Promotor','promotor'])if(Array.isArray(value[key]))return value[key];
  for(const nested of Object.values(value)){const found=firstArray(nested);if(found.length)return found}
  return [];
}

function cleanPhone(value){return String(value||'').replace(/[^\d+]/g,'')}
function asBoolean(value){return value===true||value===1||String(value||'').toLowerCase()==='true'||String(value||'')==='1'}

export function stifinConfig(){return {base:trimSlash(process.env.STIFIN_API_BASE||'https://apro.stifin.id/api'),branch:String(process.env.STIFIN_BRANCH_CODE||'JML-CAB-62').trim()}}

export async function fetchBranchPromoters(){
  const config=stifinConfig();
  const headers={};
  if(process.env.STIFIN_API_AUTH_HEADER&&process.env.STIFIN_API_AUTH_VALUE)headers[process.env.STIFIN_API_AUTH_HEADER]=process.env.STIFIN_API_AUTH_VALUE;
  const payload=await requestJson(`${config.base}/proGetCab/pro/${encodeURIComponent(config.branch)}`,{headers});
  const rows=firstArray(payload);
  if(!rows.length&&String(payload?.Pesan||payload?.message||'').toLowerCase()!=='success')throw new Error('API STIFIn tidak mengembalikan daftar promotor.');
  return rows.map(row=>({
    stifinCode:String(row.KodeID??row.kodeID??row.kode_id??'').trim(),
    name:String(row.Nama??row.nama??'').trim(),
    phone:cleanPhone(row.Phone??row.phone??row.Telepon??''),
    institution:String(row.Lembaga??row.lembaga??'').trim(),
    city:String(row.Area??row.area??row.Kota??'').trim(),
    province:String(row.Propinsi??row.Provinsi??row.provinsi??'').trim(),
    apiStatus:String(row.Status??row.status??'').trim(),
    apiSub:String(row.Sub??row.sub??'').trim(),
    apiActive:String(row.Aktif??row.aktif??'').trim(),
    membershipUntil:String(row.Masa??row.masa??'').trim()
  })).filter(row=>row.stifinCode||row.name);
}

export async function fetchVoucherBalance(promoterCode){
  const {base}=stifinConfig();
  const payload=await requestJson(`${base}/voucherGet/getTotVoucher/${encodeURIComponent(promoterCode)}`);
  const candidates=[payload?.total,payload?.Total,payload?.voucher,payload?.Voucher,payload?.data?.total,payload?.Data?.Total];
  const direct=candidates.find(value=>Number.isFinite(Number(value)));
  const rows=firstArray(payload);
  const row=rows[0]||{};
  const nested=[row.total,row.Total,row.voucher,row.Voucher,row.Jumlah,row.jumlah].find(value=>Number.isFinite(Number(value)));
  return {balance:Number(direct??nested??0),checkedAt:new Date().toISOString()};
}

export function starSenderConfig(){
  return {enabled:String(process.env.STARSENDER_ENABLED||'false').toLowerCase()==='true',sendUrl:String(process.env.STARSENDER_SEND_URL||'https://api.starsender.online/api/send').trim(),hasApiKey:Boolean(process.env.STARSENDER_API_KEY)};
}

export async function sendStarSender({phone,message}){
  const config=starSenderConfig();
  if(!config.enabled)throw new Error('StarSender belum diaktifkan.');
  if(!config.sendUrl||!process.env.STARSENDER_API_KEY)throw new Error('URL kirim atau API key StarSender belum lengkap.');
  const header=String(process.env.STARSENDER_AUTH_HEADER||'Authorization');
  const scheme=String(process.env.STARSENDER_AUTH_SCHEME??'').trim();
  const headers={'content-type':'application/json',[header]:`${scheme?`${scheme} `:''}${process.env.STARSENDER_API_KEY}`};
  const payload={messageType:'text',to:cleanPhone(phone).replace(/^0/,'62'),body:message};
  const result=await requestJson(config.sendUrl,{method:'POST',headers,body:JSON.stringify(payload)});
  return {externalId:String(result?.id??result?.data?.id??result?.message_id??''),result};
}

function starSenderHeaders(){
  const header=String(process.env.STARSENDER_AUTH_HEADER||'Authorization');
  const scheme=String(process.env.STARSENDER_AUTH_SCHEME??'').trim();
  if(!process.env.STARSENDER_API_KEY)throw new Error('Device API Key StarSender belum diisi.');
  return {'content-type':'application/json',[header]:`${scheme?`${scheme} `:''}${process.env.STARSENDER_API_KEY}`};
}

export async function fetchWhatsAppGroups(){
  const config=starSenderConfig();
  if(!config.enabled)throw new Error('StarSender belum diaktifkan.');
  const url=String(process.env.STARSENDER_GROUPS_URL||'https://api.starsender.online/api/whatsapp/groups').trim();
  const result=await requestJson(url,{headers:starSenderHeaders()});
  let rows=firstArray(result);
  if(!rows.length&&result?.data&&typeof result.data==='object'&&!Array.isArray(result.data))rows=Object.entries(result.data).map(([id,value])=>typeof value==='object'?{id,...value}:{id,name:value});
  return rows.map((row,index)=>({
    groupId:String(row.id??row.group_id??row.groupId??row.jid??row.value??row.remoteJid??'').trim(),
    name:String(row.name??row.subject??row.group_name??row.groupName??row.label??`Grup ${index+1}`).trim(),
    participants:Number(row.participants_count??row.participantCount??row.size??0)||0
  })).filter(row=>row.groupId||row.name);
}

export async function sendStarSenderGroup({group,message}){
  const config=starSenderConfig();
  if(!config.enabled)throw new Error('StarSender belum diaktifkan.');
  const url=String(process.env.STARSENDER_GROUP_SEND_URL||'https://api.starsender.online/api/send/grup').trim();
  const payload={messageType:'text',to:String(group||'').trim(),body:String(message||'').trim()};
  const result=await requestJson(url,{method:'POST',headers:starSenderHeaders(),body:JSON.stringify(payload)});
  return {externalId:String(result?.id??result?.data?.id??result?.message_id??''),result};
}

export function sanitizeStarSenderWebhook(payload){
  const source=payload&&typeof payload==='object'?payload:{};
  const rawAddress=String(source.from??source.phone??source.to??source.number??source.data?.phone??'').trim();
  const isGroup=asBoolean(source.is_group??source.data?.is_group)||String(source.chat_type??source.data?.chat_type??'').toLowerCase()==='group';
  return {
    externalId:String(source.id??source.message_id??source.data?.id??'').slice(0,160),
    phone:cleanPhone(rawAddress).slice(0,80),
    address:rawAddress.slice(0,160),
    message:String(source.message??source.body??source.text??source.data?.message??'').slice(0,4000),
    device:String(source.device??source.data?.device??'').slice(0,160),
    chatType:String(source.chat_type??source.data?.chat_type??(isGroup?'group':'personal')).toLowerCase().slice(0,20),
    isGroup,
    isMe:asBoolean(source.is_me??source.data?.is_me),
    isMentioned:asBoolean(source.is_mentioned??source.data?.is_mentioned),
    pushName:String(source.push_name??source.data?.push_name??'').slice(0,160),
    file:String(source.file??source.data?.file??'').slice(0,1000),
    quotedMessage:String(source.quoted_message??source.data?.quoted_message??'').slice(0,2000),
    event:String(source.event??source.status??source.type??source.data?.status??'unknown').slice(0,80),
    sourceTimestamp:String(source.timestamp??source.data?.timestamp??'').slice(0,80),
    receivedAt:new Date().toISOString()
  };
}
