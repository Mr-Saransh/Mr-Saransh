// script.js — lightweight interactions + Lottie micro-animation loader
(function(){
  function prefersReduced(){
    try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}
  }

  function revealMeters(){
    if(prefersReduced()) return;
    document.querySelectorAll('.meter span').forEach(function(el, i){
      var w = getComputedStyle(el).getPropertyValue('--w') || '80%';
      setTimeout(function(){ el.style.width = w; }, 150 + i*120);
    });
  }

  function staggerIn(selector){
    if(prefersReduced()) return;
    document.querySelectorAll(selector).forEach(function(el, i){
      var d = parseInt(el.getAttribute('data-delay') || 0,10);
      el.style.transform = 'translateY(12px)';
      el.style.opacity = '0';
      setTimeout(function(){ el.style.transition = 'transform 420ms cubic-bezier(.2,.9,.2,1),opacity 420ms'; el.style.transform='none'; el.style.opacity='1'; }, d+150);
    });
  }

  function loadLottie(){
    if(prefersReduced()) return;
    if(!window.lottie) return; // lottie lib not loaded
    var container = document.getElementById('hero-lottie');
    if(!container) return;
    try{
      // Using a lightweight public Lottie JSON; we set renderer to 'svg' so it matches page coloring in many cases
      var anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets5.lottiefiles.com/packages/lf20_0yfsb3a1.json' // neutral loader animation
      });
      // apply a tint if possible after DOM loaded
      anim.addEventListener('DOMLoaded', function(){
        try{
          container.querySelectorAll('svg *').forEach(function(el){
            if(el.getAttribute('fill') && el.getAttribute('fill')!=='none'){
              el.setAttribute('fill', getComputedStyle(document.documentElement).getPropertyValue('--gold') || '#D4AF37');
            }
            if(el.getAttribute('stroke') && el.getAttribute('stroke')!=='none'){
              el.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--gold') || '#D4AF37');
            }
          });
        }catch(e){/* not critical */}
      });
    }catch(e){console.warn('Lottie load failed',e)}
  }

  document.addEventListener('DOMContentLoaded', function(){
    revealMeters();
    staggerIn('.skill-card');
    staggerIn('.project');
    // try to load lottie if available; it may be loaded via CDN in the page header
    // If lottie isn't loaded yet, poll a few times
    var attempts=0;
    var poll = setInterval(function(){ attempts++; if(window.lottie){ clearInterval(poll); loadLottie(); } if(attempts>10){ clearInterval(poll);} },200);
  });
})();
