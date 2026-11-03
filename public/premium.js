const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const button = document.querySelector('.motion-toggle');
let paused = reduced.matches;
let sceneTween;
function setPaused(value) {
  paused = value;
  button.textContent = paused ? 'Enable ambient motion' : 'Pause ambient motion';
  button.setAttribute('aria-pressed', String(paused));
  if (sceneTween) paused ? sceneTween.pause() : sceneTween.resume();
}
button.addEventListener('click', () => setPaused(!paused));
reduced.addEventListener('change', event => setPaused(event.matches));
setPaused(paused);
if (window.gsap) {
  sceneTween = gsap.to('.software-sculpture', {rotationZ:-18,rotationX:50,y:12,duration:14,ease:'sine.inOut',repeat:-1,yoyo:true,paused});
  if (window.ScrollTrigger && !reduced.matches) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('main .section-head').forEach(head => gsap.from(head,{y:28,duration:1,ease:'power2.out',scrollTrigger:{trigger:head,start:'top 92%',once:true}}));
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1100px)',()=>{
      const head = document.querySelector('#experience .section-head');
      if(head) ScrollTrigger.create({trigger:head,start:'top 120px',end:'+=120',pin:true,pinSpacing:true});
      gsap.utils.toArray('.credential-card').forEach((card,i)=>gsap.from(card,{y:35+i*8,duration:1,scrollTrigger:{trigger:card,start:'top 92%',once:true}}));
    });
  }
}
