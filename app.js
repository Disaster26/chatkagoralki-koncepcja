(function(){
var d=document,b=d.body,top=d.getElementById('top');
/* naglowek po przewinieciu */
function sc(){top.classList.toggle('sc',scrollY>40)}
sc();addEventListener('scroll',sc,{passive:true});

/* menu mobilne */
var bu=d.querySelector('.burger'),menu=d.getElementById('menu');
bu.addEventListener('click',function(){var o=b.classList.toggle('mo');bu.setAttribute('aria-expanded',o)});
menu.addEventListener('click',function(e){if(e.target.closest('a')){b.classList.remove('mo');bu.setAttribute('aria-expanded','false')}});

/* aktywna pozycja menu */
var links=[].slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
var secs=links.map(function(a){return d.querySelector(a.getAttribute('href'))}).filter(Boolean);
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
 secs.forEach(function(s){io.observe(s)});
}

/* karuzele: palec, mysz, strzalki, koraliki */
[].forEach.call(d.querySelectorAll('[data-kar]'),function(k){
 var t=k.querySelector('.tor'),it=[].slice.call(t.children),dots=k.querySelector('.kropki'),pv=k.querySelector('.pv'),nx=k.querySelector('.nx');
 it.forEach(function(){dots.appendChild(d.createElement('i'))});
 var di=[].slice.call(dots.children);
 function upd(){
  var max=t.scrollWidth-t.clientWidth,x=t.scrollLeft,idx=0;
  it.forEach(function(el,i){if(el.offsetLeft-t.offsetLeft<=x+8)idx=i});
  if(x>=max-4)idx=it.length-1;
  di.forEach(function(e,i){e.classList.toggle('on',i===idx)});
  pv.disabled=x<=4;nx.disabled=x>=max-4;
  k.querySelector('.ster').style.visibility=max>4?'visible':'hidden';
 }
 function krok(dir){
  var x=t.scrollLeft,cel=null;
  if(dir>0){for(var i=0;i<it.length;i++){var o=it[i].offsetLeft-t.offsetLeft;if(o>x+8){cel=o;break}}}
  else{for(var j=it.length-1;j>=0;j--){var p=it[j].offsetLeft-t.offsetLeft;if(p<x-8){cel=p;break}}}
  if(cel!==null)t.scrollTo({left:cel,behavior:'smooth'});
 }
 pv.addEventListener('click',function(){krok(-1)});nx.addEventListener('click',function(){krok(1)});
 t.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
 addEventListener('resize',upd);upd();
 /* przeciaganie mysza */
 var down=false,sx=0,sl=0,moved=false;
 t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=t.scrollLeft});
 addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;t.classList.add('drag')}if(moved)t.scrollLeft=sl-dx});
 addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){t.classList.remove('drag');var x=t.scrollLeft,best=0,bd=1e9;it.forEach(function(el){var o=el.offsetLeft-t.offsetLeft;if(Math.abs(o-x)<bd){bd=Math.abs(o-x);best=o}});t.scrollTo({left:best,behavior:'smooth'})}});
 t.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();krok(1)}if(e.key==='ArrowLeft'){e.preventDefault();krok(-1)}});
});

/* lightbox */
var lb=d.getElementById('lb'),li=lb.querySelector('img'),lic=lb.querySelector('.lic'),grupa=[],n=0,ost=null;
function pokaz(){var f=grupa[n];li.src=f.getAttribute('data-full');li.alt=f.querySelector('img').alt;lic.textContent=(n+1)+' / '+grupa.length}
function otworz(f){var g=f.closest('.tor,.zdj,.przy,.balia');grupa=[].slice.call((g||d).querySelectorAll('[data-full]'));if(g&&g.classList.contains('balia'))grupa=[f];n=Math.max(0,grupa.indexOf(f));ost=f;pokaz();lb.classList.add('on');b.style.overflow='hidden';lb.querySelector('.x').focus()}
function zamknij(){lb.classList.remove('on');b.style.overflow='';li.removeAttribute('src');if(ost)ost.focus()}
function idz(k){n=(n+k+grupa.length)%grupa.length;pokaz()}
d.addEventListener('click',function(e){var f=e.target.closest('[data-full]');if(f){e.preventDefault();otworz(f)}});
lb.querySelector('.x').addEventListener('click',zamknij);
lb.querySelector('.pv').addEventListener('click',function(){idz(-1)});
lb.querySelector('.nx').addEventListener('click',function(){idz(1)});
lb.addEventListener('click',function(e){if(e.target===lb)zamknij()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')idz(1);if(e.key==='ArrowLeft')idz(-1)});
var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)idz(dx<0?1:-1)});

/* formularz pokazowy */
var fo=d.getElementById('form');
fo.addEventListener('submit',function(e){e.preventDefault();fo.querySelector('.info').textContent='To podgląd strony - formularz zacznie wysyłać zapytania po wdrożeniu.'});

/* mapa po przewinieciu */
var m=d.getElementById('mapa');
function mapa(){if(m.dataset.ok)return;m.dataset.ok=1;var f=d.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Mapa dojazdu do Chatki Góralki';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.innerHTML='';m.appendChild(f)}
if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(en){if(en[0].isIntersecting){mapa();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else mapa();
})();
