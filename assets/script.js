// script.js — lightweight interactions
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

  document.addEventListener('DOMContentLoaded', function(){
    revealMeters();
    staggerIn('.skill-card');
    staggerIn('.project');
  });
})();
