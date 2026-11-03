// Motion uses its vanilla API to keep the portfolio framework-free.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let userPaused = preference.matches;
try { userPaused ||= localStorage.getItem('portfolio-motion-paused') === 'true'; } catch {}
let motionAPI;
const ambient = [];
const transient = new Set();
const typeJobs = new Map();
const headingCharacters = new Map();
let frame = 0;
let revealObserver;
const isPaused = () => userPaused || preference.matches || document.hidden;
function finishTitles() {
  typeJobs.clear();
  headingCharacters.forEach(chars => chars.forEach(char => char.classList.add('typed')));
}
function refreshMotion() {
  const pause = isPaused();
  motionButton.textContent = pause ? 'Enable motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(pause));
  document.documentElement.classList.toggle('motion-paused',pause);
  ambient.forEach(animation => pause ? animation.pause() : animation.play());
  if(pause) {
    finishTitles();
    transient.forEach(animation => animation.complete());
    transient.clear();
  }
}
motionButton.addEventListener('click',()=>{
  userPaused = !userPaused;
  // A user's OS reduced-motion preference always takes precedence.
  if(preference.matches) userPaused = true;
  try{localStorage.setItem('portfolio-motion-paused',String(userPaused));}catch{}
  refreshMotion();
});
preference.addEventListener('change',refreshMotion);
document.addEventListener('visibilitychange',refreshMotion);
refreshMotion();

// Wrap words separately to preserve natural wrapping and the full accessible name.
function prepareHeading(heading) {
  heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
  const walker = document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  for(const node of nodes) {
    const fragment=document.createDocumentFragment();
    for(const word of node.textContent.split(/(\s+)/)) {
      if(!word) continue;
      if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));continue;}
      const span=document.createElement('span'); span.className='type-word';span.setAttribute('aria-hidden','true');
      for(const letter of Array.from(word)) {const char=document.createElement('span');char.className='type-char';char.textContent=letter;span.append(char);}
      fragment.append(span);
    }
    node.replaceWith(fragment);
  }
  const chars=[...heading.querySelectorAll('.type-char')];
  headingCharacters.set(heading,chars);
  if(isPaused()) chars.forEach(char=>char.classList.add('typed'));
}
function tickTitles(now) {
  frame=0;
  for(const [heading,job] of typeJobs) {
    const count=Math.min(job.chars.length,Math.floor((now-job.start)/job.interval)+1);
    for(let i=job.shown;i<count;i++) job.chars[i].classList.add('typed');
    job.shown=count;
    if(count>=job.chars.length)typeJobs.delete(heading);
  }
  if(typeJobs.size)frame=requestAnimationFrame(tickTitles);
}
const titleObserver = new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
    const chars=headingCharacters.get(entry.target);
    if(!isPaused()) {typeJobs.set(entry.target,{chars,shown:0,start:performance.now(),interval:Math.min(38,1200/Math.max(1,chars.length))});if(!frame)frame=requestAnimationFrame(tickTitles);}
    else chars.forEach(char=>char.classList.add('typed'));
    titleObserver.unobserve(entry.target);
  }
},{threshold:0,rootMargin:'0px 0px -3% 0px'});
document.querySelectorAll('h1,h2,h3').forEach(heading=>{prepareHeading(heading);titleObserver.observe(heading);});
function observeHeadings(root) {
  const headings=[];
  if(root.nodeType===Node.ELEMENT_NODE&&root.matches('h1,h2,h3'))headings.push(root);
  if(root.querySelectorAll)headings.push(...root.querySelectorAll('h1,h2,h3'));
  headings.forEach(heading=>{
    if(headingCharacters.has(heading))return;
    prepareHeading(heading);
    titleObserver.observe(heading);
  });
}
function observeReveals(root) {
  if(!revealObserver)return;
  const items=[];
  if(root.nodeType===Node.ELEMENT_NODE&&root.matches('[data-reveal]'))items.push(root);
  if(root.querySelectorAll)items.push(...root.querySelectorAll('[data-reveal]'));
  items.forEach(item=>revealObserver.observe(item));
}
const contentObserver=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>{
    if(node.nodeType!==Node.ELEMENT_NODE)return;
    observeHeadings(node);
    observeReveals(node);
  }));
});
contentObserver.observe(document.body,{childList:true,subtree:true});

// Real, keyboard-operable project filtering.
document.querySelectorAll('.project-filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.project-filter').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let count=0;
  document.querySelectorAll('.project-card').forEach(card=>{
    const shown=button.dataset.filter==='all'||card.dataset.category.includes(button.dataset.filter);
    card.hidden=!shown;if(shown)count++;
  });
  document.querySelector('.project-count').textContent=`${count} project${count===1?'':'s'}`;
}));
document.querySelectorAll('.skill-card').forEach((card,index)=>{
  const title=card.querySelector('h3');const tags=card.querySelector('.skill-tags');
  const button=document.createElement('button');button.type='button';button.className='skill-toggle';
  const label=document.createElement('span');while(title.firstChild)label.append(title.firstChild);button.append(label);title.append(button);
  button.setAttribute('aria-label',title.getAttribute('aria-label'));title.removeAttribute('aria-label');
  tags.id=`skill-panel-${index}`;button.setAttribute('aria-controls',tags.id);button.setAttribute('aria-expanded',String(index===0));tags.hidden=index!==0;
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));tags.hidden=open;});
});

async function startMotion() {
  try {
    motionAPI=await import('https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm');
    const {animate}=motionAPI;
    const visual=document.querySelector('.hero-visual');
    if(visual)ambient.push(animate(visual,{y:[0,-7,0]},{duration:12,repeat:Infinity,ease:'easeInOut'}));
    refreshMotion();
    revealObserver=new IntersectionObserver(entries=>{
      for(const entry of entries) if(entry.isIntersecting){
        if(!isPaused()) {
          const animation=animate(entry.target,{y:[25,0]},{type:'spring',duration:.75,bounce:.1});
          transient.add(animation);animation.then(()=>transient.delete(animation));
        }
        revealObserver.unobserve(entry.target);
      }
    },{threshold:0,rootMargin:'0px 0px -4% 0px'});
    document.querySelectorAll('[data-reveal]').forEach(item=>revealObserver.observe(item));
    observeReveals(document.body);
    if(matchMedia('(hover:hover) and (pointer:fine)').matches){
      document.querySelectorAll('.project-image-wrap,.profile-visual,.btn').forEach(element=>{
        const target=element.querySelector('img')||element;let current;
        const move=(scale)=>{if(isPaused())return;current?.stop();current=animate(target,{scale},{type:'spring',stiffness:180,damping:24});transient.add(current);current.then(()=>transient.delete(current));};
        element.addEventListener('pointerenter',()=>move(element.classList.contains('btn')?1.035:1.035));
        element.addEventListener('pointerleave',()=>move(1));
      });
      if(visual){
        let tilt;
        const setTilt=(rotateX,rotateY)=>{
          if(isPaused())return;
          if(tilt){tilt.stop();transient.delete(tilt);}
          const animation=animate(visual,{rotateX,rotateY},{type:'spring',stiffness:150,damping:24});
          tilt=animation;
          transient.add(animation);
          animation.then(()=>transient.delete(animation));
        };
        visual.addEventListener('pointermove',event=>{
          const bounds=visual.getBoundingClientRect();
          const x=(event.clientX-bounds.left)/bounds.width-.5;
          const y=(event.clientY-bounds.top)/bounds.height-.5;
          setTilt(-y*7,x*7);
        });
        visual.addEventListener('pointerleave',()=>setTilt(0,0));
      }
    }
  }catch(error){console.warn('Motion library unavailable; native interactions remain active.',error);}
}
startMotion();
addEventListener('pagehide',event=>{if(event.persisted)return;ambient.forEach(a=>a.stop());transient.forEach(a=>a.stop());cancelAnimationFrame(frame);titleObserver.disconnect();contentObserver.disconnect();revealObserver?.disconnect();});
