const W_=400,H_=500,rnd=n=>Math.random()*n|0;
function mk(init){return(cv,onScore)=>{const x=cv.getContext('2d'),k={},m={x:200,y:250,c:0,d:0};
 const kd=e=>{k[e.key]=1;if(e.key.startsWith('Arrow')||e.key==' ')e.preventDefault()},ku=e=>delete k[e.key];
 const mv=e=>{const r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;m.x=(p.clientX-r.left)*W_/r.width;m.y=(p.clientY-r.top)*H_/r.height};
 cv.onmousemove=cv.ontouchmove=e=>{mv(e);e.preventDefault()};cv.onmousedown=cv.ontouchstart=e=>{mv(e);m.c=m.d=1;e.preventDefault()};cv.onmouseup=cv.ontouchend=()=>m.d=0;
 addEventListener('keydown',kd);addEventListener('keyup',ku);const st=init(k,m,x);let id;
 const f=()=>{if(k.ArrowLeft)m.x-=6;if(k.ArrowRight)m.x+=6;x.fillStyle='#0b1e3f';x.fillRect(0,0,W_,H_);const r=st(x);if(r!=null)onScore(r);m.c=0;id=requestAnimationFrame(f)};f();
 return()=>{cancelAnimationFrame(id);removeEventListener('keydown',kd);removeEventListener('keyup',ku)}}}
const dot=(x,a,b,r)=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()};
const GAMES={
snake:mk((k,m,x)=>{let s,d,f,t,n;const R=()=>{s=[[10,12]];d=[1,0];f=[5,5];t=0;n=0};R();
 return()=>{if(k.ArrowUp&&d[1]==0)d=[0,-1];if(k.ArrowDown&&d[1]==0)d=[0,1];if(k.ArrowLeft&&d[0]==0)d=[-1,0];if(k.ArrowRight&&d[0]==0)d=[1,0];
 if(m.c){const dx=m.x-s[0][0]*20,dy=m.y-s[0][1]*20;d=Math.abs(dx)>Math.abs(dy)?[Math.sign(dx)||1,0]:[0,Math.sign(dy)||1]}
 if(++t%7==0){const q=[s[0][0]+d[0],s[0][1]+d[1]];if(q[0]<0||q[1]<0||q[0]>19||q[1]>24||s.some(p=>p[0]==q[0]&&p[1]==q[1]))R();else{s.unshift(q);if(q[0]==f[0]&&q[1]==f[1]){n++;f=[rnd(20),rnd(25)]}else s.pop()}}
 x.fillStyle='#4f8';s.forEach(p=>x.fillRect(p[0]*20,p[1]*20,19,19));x.fillStyle='#f55';x.fillRect(f[0]*20,f[1]*20,19,19);return n}}),
pong:mk((k,m,x)=>{let b,v,n=0,a=200;const R=()=>{b=[200,250];v=[3,4]};R();
 return()=>{a+=Math.sign(b[0]-a)*3;b[0]+=v[0];b[1]+=v[1];if(b[0]<0||b[0]>400)v[0]*=-1;
 if(b[1]>460&&b[1]<475&&Math.abs(b[0]-m.x)<45&&v[1]>0){v[1]*=-1.05;v[0]+=(b[0]-m.x)/15}
 if(b[1]<30&&Math.abs(b[0]-a)<45&&v[1]<0)v[1]*=-1;if(b[1]>500){n=0;R()}if(b[1]<0){n++;R()}
 x.fillStyle='#fff';x.fillRect(m.x-40,470,80,8);x.fillRect(a-40,22,80,8);dot(x,b[0],b[1],6);return n}}),
brick:mk((k,m,x)=>{let b,v,B,n=0;const R=()=>{b=[200,350];v=[3,-4];B=[];for(let i=0;i<40;i++)B.push([i%8*50,60+(i/8|0)*22])};R();
 return()=>{b[0]+=v[0];b[1]+=v[1];if(b[0]<0||b[0]>400)v[0]*=-1;if(b[1]<0)v[1]*=-1;
 if(b[1]>470&&b[1]<480&&Math.abs(b[0]-m.x)<45&&v[1]>0){v[1]*=-1;v[0]=(b[0]-m.x)/10}
 B=B.filter(r=>{const h=b[0]>r[0]&&b[0]<r[0]+48&&b[1]>r[1]&&b[1]<r[1]+20;if(h){v[1]*=-1;n++}return!h});if(!B.length)R();if(b[1]>500){n=0;R()}
 x.fillStyle='#fa4';B.forEach(r=>x.fillRect(r[0]+1,r[1]+1,48,20));x.fillStyle='#fff';x.fillRect(m.x-40,475,80,8);dot(x,b[0],b[1],6);return n}}),
flap:mk((k,m,x)=>{let y,v,P,t,n,was=0;const R=()=>{y=250;v=0;P=[];t=0;n=0};R();
 return()=>{const j=k[' ']||k.ArrowUp;if((j&&!was)||m.c)v=-7;was=j;v+=.45;y+=v;if(++t%90==0)P.push([400,rnd(250)+80]);P.forEach(p=>p[0]-=3);
 if(P[0]&&P[0][0]<-50){P.shift();n++}if(y<0||y>500||P.some(p=>p[0]<112&&p[0]>38&&Math.abs(y-p[1])>60))R();
 x.fillStyle='#4c8';P.forEach(p=>{x.fillRect(p[0],0,50,p[1]-60);x.fillRect(p[0],p[1]+60,50,500)});x.fillStyle='#ff4';dot(x,100,y,12);return n}}),
dodge:mk((k,m,x)=>{let E,t;const R=()=>{E=[];t=0};R();
 return()=>{t++;if(t%25==0)E.push([rnd(380),0,3+t/600]);E.forEach(e=>e[1]+=e[2]);E=E.filter(e=>e[1]<500);
 if(E.some(e=>e[1]>450&&e[1]<490&&Math.abs(e[0]+10-m.x)<25))R();
 x.fillStyle='#f55';E.forEach(e=>x.fillRect(e[0],e[1],20,20));x.fillStyle='#4af';x.fillRect(m.x-15,460,30,30);return t/60|0}}),
grab:mk((k,m,x)=>{let C,t,n,l;const R=()=>{C=[];t=0;n=0;l=3};R();
 return()=>{if(++t%40==0)C.push([rnd(380)+10,0]);C.forEach(c=>c[1]+=3+n/20);
 C=C.filter(c=>{if(c[1]>470&&Math.abs(c[0]-m.x)<35){n++;return 0}if(c[1]>500){l--;return 0}return 1});if(l<=0)R();
 x.fillStyle='#fd3';C.forEach(c=>dot(x,c[0],c[1],10));x.fillStyle='#4af';x.fillRect(m.x-35,480,70,12);x.fillStyle='#fff';x.fillText('Lives: '+l,10,20);return n}}),
whack:mk((k,m,x)=>{let T,t,n,l;const R=()=>{T=[];t=0;n=0;l=5};R();
 return()=>{if(++t%45==0)T.push([rnd(340)+30,rnd(400)+50,90]);
 if(m.c)T=T.filter(a=>{const h=Math.hypot(a[0]-m.x,a[1]-m.y)<28;if(h)n++;return!h});
 T.forEach(a=>a[2]--);T=T.filter(a=>a[2]>0||(l--,0));if(l<=0)R();
 x.fillStyle='#f6a';T.forEach(a=>dot(x,a[0],a[1],a[2]/4+5));x.fillStyle='#fff';x.fillText('Lives: '+l,10,20);return n}}),
jump:mk((k,m,x)=>{let y,v,O,t;const R=()=>{y=440;v=0;O=[];t=0};R();
 return()=>{t++;if((k[' ']||k.ArrowUp||m.c)&&y>=440)v=-12;v+=.7;y=Math.min(440,y+v);if(t%70==0)O.push(400);O=O.map(o=>o-4-t/900).filter(o=>o>-30);
 if(O.some(o=>o<80&&o>25&&y>410))R();
 x.fillStyle='#4c8';x.fillRect(0,470,400,30);x.fillStyle='#f55';O.forEach(o=>x.fillRect(o,440,25,30));x.fillStyle='#4af';x.fillRect(50,y,30,30);return t/20|0}}),
shoot:mk((k,m,x)=>{let B,E,t,n;const R=()=>{B=[];E=[];t=0;n=0};R();
 return()=>{t++;if(t%12==0)B.push([m.x,460]);if(t%30==0)E.push([rnd(370)+15,0]);B.forEach(b=>b[1]-=8);E.forEach(e=>e[1]+=1.5+n/30);
 E=E.filter(e=>{const h=B.find(b=>Math.abs(b[0]-e[0])<18&&Math.abs(b[1]-e[1])<18);if(h){h[1]=-99;n++}return!h});B=B.filter(b=>b[1]>0);
 if(E.some(e=>e[1]>470))R();
 x.fillStyle='#ff4';B.forEach(b=>x.fillRect(b[0]-2,b[1],4,10));x.fillStyle='#f55';E.forEach(e=>x.fillRect(e[0]-15,e[1]-15,30,30));x.fillStyle='#4af';x.fillRect(m.x-15,470,30,20);return n}}),
stack:mk((k,m,x)=>{let S,p,w,d,n,was;const R=()=>{S=[[100,200]];p=0;w=200;d=4;n=0};R();
 return()=>{p+=d;if(p<0||p+w>400)d*=-1;const j=k[' ']||m.c;
 if(j&&!was){const l=S[S.length-1],o=Math.min(p+w,l[0]+l[1])-Math.max(p,l[0]);if(o<=0)R();else{S.push([Math.max(p,l[0]),o]);w=o;n++;d=Math.sign(d)*(4+n/5)}}was=j;
 x.fillStyle='#8cf';S.slice(-18).forEach((s,i,a)=>x.fillRect(s[0],470-(a.length-i)*22,s[1],20));x.fillStyle='#fff';x.fillRect(p,470-(Math.min(S.length,18)+1)*22,w,20);return n}})};
const BUILT=[['snake','Snake','🐍'],['pong','Pong','🏓'],['brick','Breakout','🧱'],['flap','Flappy','🐤'],['dodge','Dodge','🟥'],['grab','Coin Catch','🪙'],['whack','Whack-a-dot','🎯'],['jump','Runner','🏃'],['shoot','Space Shooter','🚀'],['stack','Stack','🗼']];
const EM={house:'🏠',car:'🚗',tree:'🌳',coin:'🪙',enemy:'👾'};
function world(items){return mk((k,m,x)=>{let px,py,I,n;const R=()=>{px=20;py=20;I=items.map(i=>({...i}));n=0};R();
 const S=i=>i.t=='house'||i.t=='car'||i.t=='tree';
 return()=>{const ox=px,oy=py;if(k.ArrowLeft)px-=3;if(k.ArrowRight)px+=3;if(k.ArrowUp)py-=3;if(k.ArrowDown)py+=3;
 if(m.d){if(Math.abs(m.x-px)>3)px+=Math.sign(m.x-px)*3;if(Math.abs(m.y-py)>3)py+=Math.sign(m.y-py)*3}
 px=Math.max(15,Math.min(385,px));py=Math.max(15,Math.min(485,py));
 if(I.some(i=>S(i)&&Math.abs(i.x-px)<28&&Math.abs(i.y-py)<28)){px=ox;py=oy}
 I=I.filter(i=>{const h=Math.abs(i.x-px)<24&&Math.abs(i.y-py)<24;if(h&&i.t=='coin')n++;return!(h&&i.t=='coin')});if(I.some(i=>i.t=='enemy'&&Math.abs(i.x-px)<24&&Math.abs(i.y-py)<24))R();
 x.font='30px serif';x.textAlign='center';x.textBaseline='middle';I.forEach(i=>x.fillText(EM[i.t]||'?',i.x,i.y));x.fillText('🧍',px,py);return n}})}
