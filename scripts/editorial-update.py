from pathlib import Path
import re
p=Path('public/index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r'<style>.*?</style>', '<style>\n'+Path('public/editorial.css').read_text(encoding='utf-8')+'\n</style>', s, count=1, flags=re.S)
s=s.replace('<link rel="stylesheet" href="/premium.css">','')
s=re.sub(r'https://fonts.googleapis.com/css2\?family=Outfit[^" ]+', 'https://fonts.googleapis.com/css2?family=Anton&family=Onest:wght@400;500;600&display=swap',s)
s=s.replace('▲</span>','MC</span>')
a=s.index('        <div class="hero-inner">')
b=s.index('</header>',a)
hero='''
<div class="hero-top">
  <h2 class="hero-role">Full-stack.<br>Frontend.<br>AI developer.<br>Computer engineer.</h2>
  <div class="hero-intro"><p class="hero-sub">From the interface to the intelligence behind it. I build practical software and connected systems in Cebu, Philippines.</p>
  <div class="hero-actions"><a class="btn btn-primary" href="#projects">Explore my work <span aria-hidden="true">↗</span></a><a class="btn btn-outline" href="#contact">Let's talk</a></div></div>
</div>
<div class="hero-grid" aria-hidden="true"></div>
<div class="engineering-stage" aria-hidden="true">
 <div class="engineering-rig"><div class="engineering-plane base"></div><div class="engineering-plane logic"></div><div class="engineering-plane compute"><span class="compute-glyph">&lt;/&gt;</span></div></div>
 <div class="engineering-rig rig-secondary"><div class="engineering-plane base"></div><div class="engineering-plane logic"></div><div class="engineering-plane compute"><span class="compute-glyph">AI</span></div></div>
</div>
<h1 class="hero-title"><span class="hero-name-line">Mark Lloyd</span><span class="hero-name-line">Cuizon</span></h1>
<img class="hero-portrait" src="/media/mark-cinematic.jpg" width="832" height="1248" alt="Mark Lloyd Cuizon" fetchpriority="high">
<div class="hero-bottom"><a href="#about">Scroll to explore</a><span>Based in Cebu · Building everywhere</span></div>
'''
s=s[:a]+hero+s[b:]
words=''.join('<span>'+w+'<i aria-hidden="true">/</i></span>' for w in ['Build with intent','Design for people','Connect the systems','Make AI useful'])
s=s.replace('<main id="main">','<main id="main">\n<div class="discipline-strip" aria-label="Build with intent. Design for people. Connect the systems. Make AI useful."><div class="discipline-track" aria-hidden="true">'+words+words+'</div></div>')
for old,new in [('An engineer who builds across disciplines','Built across disciplines.'),('Building with code, circuits, and intelligence','Code meets the real world.'),('Work shaped by hands-on building','Learning by shipping.'),('Selected work across software and AI','Selected work.'),('Tools and areas I work with','A connected toolkit.'),('Learning through study and practice','Always building forward.')]:s=s.replace(old,new)
s=s.replace('The earlier portfolio lists professional work with teams and clients, plus an internship project with Connext.','Product development with teams and clients, alongside practical AI work during my Connext internship.')
s=s.replace('Built software with teams and clients. The previous portfolio did not identify specific employers or employment dates, so they are not inferred here.','Building product interfaces, backend services, and AI workflows with teams and clients.')
s=s.replace('1 year and 7 months of professional  experience','Software development · Product engineering')
s=s.replace('<div class="projects-grid" id="project-grid" aria-live="polite"></div>','''<div class="project-toolbar" role="group" aria-label="Filter projects"><button class="project-filter" data-filter="all" aria-pressed="true">All work</button><button class="project-filter" data-filter="web" aria-pressed="false">Web</button><button class="project-filter" data-filter="ai" aria-pressed="false">AI</button><button class="project-filter" data-filter="mobile" aria-pressed="false">Mobile</button><span class="project-count" role="status" aria-live="polite">14 projects</span></div><div class="projects-grid" id="project-grid"></div>''')
s=s.replace('<img class="project-image"', '<div class="project-image-wrap"><img class="project-image"')
s=s.replace('loading="lazy" decoding="async">','loading="lazy" decoding="async"></div>')
s=s.replace('<article class="project-card interactive-surface" data-reveal>', '<article class="project-card interactive-surface" data-category="${escapeHTML(project.category.toLowerCase())}" data-reveal>')
s=s.replace('<div class="hero-actions" data-reveal style="--rd:300ms">','<a class="contact-email" href="mailto:cmark7781@gmail.com">cmark7781@gmail.com <span aria-hidden="true">↗</span></a><div class="hero-actions" data-reveal style="--rd:300ms">')
s=re.sub(r'<script src="https://cdnjs[^\n]+\n','',s)
s=s.replace('<script src="/premium.js" defer></script>','<script type="module">\n'+Path('public/editorial.js').read_text(encoding='utf-8')+'\n</script>')
s=s.replace('Pause ambient motion','Pause motion')
p.write_text(s,encoding='utf-8')
