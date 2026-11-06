const http=require('http'),fs=require('fs'),c=require('crypto'),path=require('path');
const F=process.env.DATA||'data.json',ADMIN=process.env.ADMIN_CODE||'gggrite5',PUB=fs.existsSync(path.join(__dirname,'public','index.html'))?path.join(__dirname,'public'):__dirname,HIDE=['server.js','data.json','Dockerfile','package.json'];
let D={users:{},codes:{},games:[],rooms:{},tok:{}};
try{D=JSON.parse(fs.readFileSync(F))}catch{}
const save=()=>fs.writeFileSync(F,JSON.stringify(D));
const h=(p,s)=>c.scryptSync(String(p),s,32).toString('hex'),rid=n=>c.randomBytes(n).toString('hex');
const pub=u=>({name:u.name,display:u.display,coins:u.coins,premium:u.premium,friends:u.friends});
const TASKS={play:[10,'Play a game'],publish:[50,'Publish a game']};
const need=u=>{if(!u.premium)throw'Premium only'};
const login=n=>{const t=rid(16);D.tok[t]=n;save();return{token:t}};
const mem=(b,u)=>{const r=D.rooms[b.code];if(!r||!r.members.includes(u.name))throw'Not in this room';return r};
const A={
signup(b){const{email,name,password,code}=b;if(!email||!password||!/^\w{2,20}$/.test(name||''))throw'Fill in email, a name (letters/numbers) and password';
 if(!code||D.codes[email.toLowerCase()]!==code)throw'Wrong login code. Email rainslideryoutube@gmail.com to get one';
 if(D.users[name])throw'Name taken';const s=rid(8);D.users[name]={email,name,display:name,salt:s,hash:h(password,s),coins:0,premium:false,friends:[],tasks:[]};
 delete D.codes[email.toLowerCase()];return login(name)},
login(b){const u=D.users[b.name];if(!u||u.hash!==h(b.password||'',u.salt))throw'Wrong name or password';return login(u.name)},
me(b,u){return{user:pub(u)}},
games(){return{games:D.games}},
played(b,u){u.played=1;save();return{}},
publish(b,u){if(!b.title||!Array.isArray(b.world))throw'Need a name and a world';
 D.games.push({id:rid(4),title:String(b.title).slice(0,40),by:u.display,owner:u.name,world:b.world.slice(0,200).map(i=>({t:String(i.t),x:+i.x,y:+i.y}))});
 if(D.games.filter(g=>g.owner==u.name).length<=3)u.coins+=50;save();return{}},
tasks(b,u){return{tasks:Object.entries(TASKS).map(([id,[c,t]])=>({id,coins:c,text:t,done:u.tasks.includes(id)}))}},
claim(b,u){const t=TASKS[b.id];if(!t||u.tasks.includes(b.id))throw'Not available';
 if(b.id=='play'&&!u.played||b.id=='publish'&&!D.games.some(g=>g.owner==u.name))throw'Task not completed yet';u.tasks.push(b.id);u.coins+=t[0];save();return{}},
premium(b,u){if(u.premium)throw'Already premium';if(u.coins<500)throw'You need 500 coins';u.coins-=500;u.premium=true;save();return{}},
rename(b,u){need(u);const n=String(b.name||'').trim().slice(0,20);if(!n)throw'Enter a name';u.display=n;save();return{}},
addf(b,u){need(u);const f=D.users[b.name];if(!f||f==u)throw'User not found';if(!f.premium)throw'Your friend needs premium too';
 [[u,f],[f,u]].forEach(([a,z])=>{if(!a.friends.includes(z.name))a.friends.push(z.name)});save();return{}},
room(b,u){need(u);const code=rid(2).toUpperCase();D.rooms[code]={host:u.name,members:[u.name],msgs:[]};save();return{code}},
join(b,u){need(u);const code=String(b.code).toUpperCase(),r=D.rooms[code];if(!r)throw'Room not found';
 if(r.host!=u.name&&!D.users[r.host].friends.includes(u.name))throw'Only friends of the host can join';
 if(!r.members.includes(u.name))r.members.push(u.name);save();return{code}},
chat(b,u){const r=mem(b,u);r.msgs.push({from:u.display,text:String(b.text).slice(0,200)});r.msgs=r.msgs.slice(-100);save();return{}},
poll(b,u){const r=mem(b,u);return{members:r.members.map(n=>D.users[n]?D.users[n].display:n),msgs:r.msgs}}};
function adm(b){const o={};if(b.op=='delUser')delete D.users[b.id];if(b.op=='delGame')D.games=D.games.filter(g=>g.id!=b.id);
 if(b.op=='coins'){const u=D.users[b.id];if(!u)throw'User not found';const n=Math.floor(+b.amount);if(!n)throw'Enter a number';u.coins=Math.max(0,u.coins+n)}
 if(b.op=='code'){o.code=rid(3);D.codes[String(b.email).toLowerCase()]=o.code}save();
 o.users=Object.values(D.users).map(u=>({name:u.name,email:u.email,coins:u.coins,premium:u.premium}));
 o.games=D.games.map(g=>({id:g.id,title:g.title,by:g.by}));return o}
http.createServer((q,r)=>{const u0=q.url.split('?')[0];
 if(q.method=='POST'&&u0.startsWith('/api/')){let s='';q.on('data',d=>{s+=d;if(s.length>2e5)q.destroy()});
  q.on('end',()=>{let o;try{const b=JSON.parse(s||'{}'),a=u0.slice(5),u=D.users[D.tok[b.token]];
   if(a=='adm'){if(b.admin!==ADMIN)throw'Wrong admin code';o=adm(b)}
   else if(A[a]){if(!['signup','login','games'].includes(a)&&!u)throw'Please log in';o=A[a](b,u)}else throw'Unknown action'}
   catch(e){o={error:String(e)}}r.setHeader('content-type','application/json');r.end(JSON.stringify(o))});return}
 const p=path.join(PUB,u0=='/'?'index.html':decodeURIComponent(u0));
 if(!p.startsWith(PUB)||HIDE.includes(path.basename(p))){r.statusCode=403;return r.end()}
 fs.readFile(p,(e,d)=>{if(e){r.statusCode=404;return r.end('Not found. Put index.html and games.js in a folder called public next to server.js (or next to it directly).')}
  r.setHeader('content-type',{'.html':'text/html','.js':'text/javascript'}[path.extname(p)]||'text/plain');r.end(d)})
}).listen(process.env.PORT||3000,()=>console.log('BlueBox on',process.env.PORT||3000));
