<script lang="ts">
  import { onMount } from 'svelte';

  let canvasEl: HTMLCanvasElement;
  let containerEl: HTMLDivElement;
  let animId: number;

  interface Vec2 { x: number; y: number }

  function mulberry32(seed: number) {
    return function() {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function proj(x: number, y: number, z: number, cx: number, cy: number, s: number): Vec2 {
    return {
      x: cx + (x * 0.75 - z * 0.45) * s,
      y: cy + (-y + z * 0.18 + x * 0.12) * s,
    };
  }

  function lerpV(a: Vec2, b: Vec2, t: number): Vec2 {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function dimLine(ctx: CanvasRenderingContext2D, p1: Vec2, p2: Vec2, off: number) {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 15) return;
    const nx = -dy / len * off, ny = dx / len * off;
    ctx.beginPath();
    ctx.moveTo(p1.x + nx, p1.y + ny);
    ctx.lineTo(p2.x + nx, p2.y + ny);
    ctx.stroke();
    const tk = 3, ux = -ny / off * tk, uy = nx / off * tk;
    ctx.beginPath();
    ctx.moveTo(p1.x + nx - ux, p1.y + ny - uy); ctx.lineTo(p1.x + nx + ux, p1.y + ny + uy);
    ctx.moveTo(p2.x + nx - ux, p2.y + ny - uy); ctx.lineTo(p2.x + nx + ux, p2.y + ny + uy);
    ctx.stroke();
  }

  interface Element { delay: number; draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, progress: number, alpha: number, time: number) => void; }

  function makeBox(rng: () => number, bx: number, by: number, bz: number, bw: number, bh: number, bd: number, delay: number, feat: { windows?: boolean; crossBrace?: boolean; hatching?: boolean; measure?: boolean }): Element {
    const hw = bw / 2, hd = bd / 2;
    const wCols = 2 + Math.floor(rng() * 4), wRows = 2 + Math.floor(rng() * 6);
    const braceDir = rng() < 0.5 ? 0 : 1;
    const hatchCount = 4 + Math.floor(rng() * 8);
    const measureFace = Math.floor(rng() * 3);
    return { delay, draw(ctx, cx, cy, s, progress, alpha) {
      const c = [
        proj(bx-hw,by,bz-hd,cx,cy,s), proj(bx+hw,by,bz-hd,cx,cy,s),
        proj(bx+hw,by,bz+hd,cx,cy,s), proj(bx-hw,by,bz+hd,cx,cy,s),
        proj(bx-hw,by+bh,bz-hd,cx,cy,s), proj(bx+hw,by+bh,bz-hd,cx,cy,s),
        proj(bx+hw,by+bh,bz+hd,cx,cy,s), proj(bx-hw,by+bh,bz+hd,cx,cy,s),
      ];
      const edges: [number,number,number][] = [[0,1,0],[1,2,0],[2,3,0],[3,0,0],[4,5,1],[5,6,1],[6,7,1],[7,4,1],[0,4,2],[1,5,2],[2,6,2],[3,7,2]];
      const total = edges.length, drawn = Math.floor(progress * total);
      for (let i = 0; i <= drawn && i < total; i++) {
        const [a,b,g] = edges[i]; const frac = i < drawn ? 1 : (progress*total-drawn);
        const pa = c[a], pb = c[b];
        ctx.beginPath(); ctx.moveTo(pa.x,pa.y);
        ctx.lineTo(pa.x+(pb.x-pa.x)*frac, pa.y+(pb.y-pa.y)*frac);
        ctx.lineWidth = g===2 ? 1.0 : 0.6;
        ctx.strokeStyle = g===2 ? `rgba(100,116,139,${alpha*0.55})` : `rgba(148,163,184,${alpha*0.45})`;
        ctx.stroke();
      }
      if (progress < 0.5) return;
      const da = alpha * Math.min(1,(progress-0.5)*4);
      if (feat.windows && bh > 60 && bw > 40) {
        ctx.lineWidth = 0.35; ctx.strokeStyle = `rgba(148,163,184,${da*0.3})`;
        for (let r=0;r<wRows;r++) for (let col=0;col<wCols;col++) {
          const ty=by+bh*0.1+(bh*0.8)*(r/wRows), ty2=by+bh*0.1+(bh*0.8)*((r+0.7)/wRows);
          const tx1=bx-hw+bw*0.1+(bw*0.8)*(col/wCols), tx2=bx-hw+bw*0.1+(bw*0.8)*((col+0.7)/wCols);
          const wa=proj(tx1,ty,bz-hd,cx,cy,s), wb=proj(tx2,ty,bz-hd,cx,cy,s);
          const wc=proj(tx2,ty2,bz-hd,cx,cy,s), wd=proj(tx1,ty2,bz-hd,cx,cy,s);
          ctx.beginPath(); ctx.moveTo(wa.x,wa.y); ctx.lineTo(wb.x,wb.y); ctx.lineTo(wc.x,wc.y); ctx.lineTo(wd.x,wd.y); ctx.closePath(); ctx.stroke();
        }
      }
      if (feat.crossBrace) {
        ctx.lineWidth = 0.4; ctx.strokeStyle = `rgba(148,163,184,${da*0.25})`;
        if (braceDir===0) { ctx.beginPath(); ctx.moveTo(c[0].x,c[0].y); ctx.lineTo(c[5].x,c[5].y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(c[1].x,c[1].y); ctx.lineTo(c[4].x,c[4].y); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(c[1].x,c[1].y); ctx.lineTo(c[6].x,c[6].y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(c[2].x,c[2].y); ctx.lineTo(c[5].x,c[5].y); ctx.stroke(); }
      }
      if (feat.hatching) {
        ctx.lineWidth = 0.25; ctx.strokeStyle = `rgba(148,163,184,${da*0.18})`;
        for (let h=0;h<hatchCount;h++) { const t=h/hatchCount; const a1=lerpV(c[4],c[5],t), b1=lerpV(c[7],c[6],t); ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(b1.x,b1.y); ctx.stroke(); }
      }
      if (feat.measure && progress > 0.85) {
        ctx.setLineDash([2,2]); ctx.lineWidth = 0.35; ctx.strokeStyle = `rgba(100,116,139,${da*0.3})`;
        if (measureFace===0) dimLine(ctx,c[0],c[1],8); else if (measureFace===1) dimLine(ctx,c[1],c[2],-8); else dimLine(ctx,c[1],c[5],-10);
        ctx.setLineDash([]);
      }
    }};
  }

  function makeBridge(rng: () => number, x1: number, x2: number, y: number, z: number, thickness: number, depth: number, delay: number): Element {
    const nTrusses = 3 + Math.floor(rng() * 5);
    return { delay, draw(ctx, cx, cy, s, progress, alpha) {
      const hd = depth/2;
      const rails: [Vec2,Vec2][] = [
        [proj(x1,y,z-hd,cx,cy,s), proj(x2,y,z-hd,cx,cy,s)],
        [proj(x1,y,z+hd,cx,cy,s), proj(x2,y,z+hd,cx,cy,s)],
        [proj(x1,y+thickness,z-hd,cx,cy,s), proj(x2,y+thickness,z-hd,cx,cy,s)],
        [proj(x1,y+thickness,z+hd,cx,cy,s), proj(x2,y+thickness,z+hd,cx,cy,s)],
      ];
      ctx.lineWidth = 0.5; ctx.strokeStyle = `rgba(148,163,184,${alpha*0.4*progress})`;
      for (const [a,b] of rails) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(a.x+(b.x-a.x)*progress, a.y+(b.y-a.y)*progress); ctx.stroke(); }
      if (progress > 0.3) {
        ctx.lineWidth = 0.3; ctx.strokeStyle = `rgba(148,163,184,${alpha*0.25*Math.min(1,(progress-0.3)*3)})`;
        for (let i=0;i<nTrusses;i++) { const t=i/nTrusses; if (t>progress) break;
          const bot=lerpV(rails[0][0],rails[0][1],t), top2=lerpV(rails[2][0],rails[2][1],t+1/nTrusses);
          ctx.beginPath(); ctx.moveTo(bot.x,bot.y); ctx.lineTo(top2.x,top2.y); ctx.stroke();
          const bot2=lerpV(rails[0][0],rails[0][1],t+1/nTrusses);
          ctx.beginPath(); ctx.moveTo(top2.x,top2.y); ctx.lineTo(bot2.x,bot2.y); ctx.stroke();
        }
      }
    }};
  }

  function generateScene(rng: () => number): Element[] {
    const els: Element[] = [];
    // Central towers — spread wide
    for (let i=0;i<10;i++) {
      const x=(rng()-0.5)*1600, z=(rng()-0.5)*600;
      const w=30+rng()*100, h=60+rng()*350, d=25+rng()*70;
      const dl=rng()*2.5;
      els.push(makeBox(rng,x,0,z,w,h,d,dl,{windows:rng()<0.6,crossBrace:rng()<0.35,hatching:rng()<0.4,measure:rng()<0.5}));
      if (rng()<0.5) els.push(makeBox(rng,x+(rng()-0.5)*20,h,z,w*(0.4+rng()*0.4),h*(0.15+rng()*0.35),d*(0.5+rng()*0.4),dl+1.5,{windows:rng()<0.3,crossBrace:rng()<0.2,hatching:rng()<0.5,measure:false}));
    }
    // Far left cluster
    for (let i=0;i<6;i++) {
      const x=-700-rng()*600, z=(rng()-0.5)*700;
      els.push(makeBox(rng,x,0,z,60+rng()*180,15+rng()*80,50+rng()*140,0.3+rng()*3,{windows:false,crossBrace:rng()<0.2,hatching:rng()<0.6,measure:rng()<0.4}));
    }
    // Far right cluster
    for (let i=0;i<6;i++) {
      const x=600+rng()*700, z=(rng()-0.5)*700;
      els.push(makeBox(rng,x,0,z,40+rng()*140,30+rng()*200,30+rng()*90,0.5+rng()*3,{windows:rng()<0.5,crossBrace:rng()<0.4,hatching:rng()<0.3,measure:rng()<0.3}));
    }
    // Foreground low slabs (close to viewer, wide)
    for (let i=0;i<4;i++) {
      const x=(rng()-0.5)*2000, z=-300-rng()*400;
      els.push(makeBox(rng,x,0,z,100+rng()*250,10+rng()*30,80+rng()*160,0.8+rng()*2,{windows:false,crossBrace:false,hatching:rng()<0.7,measure:rng()<0.3}));
    }
    // Background distant forms
    for (let i=0;i<5;i++) {
      const x=(rng()-0.5)*2400, z=300+rng()*500;
      els.push(makeBox(rng,x,0,z,50+rng()*120,40+rng()*180,40+rng()*100,1+rng()*3,{windows:rng()<0.4,crossBrace:rng()<0.3,hatching:rng()<0.4,measure:false}));
    }
    // Bridges spanning across
    for (let i=0;i<5;i++) {
      const x1=-400+rng()*300, x2=100+rng()*400;
      els.push(makeBridge(rng,x1,x2,50+rng()*200,(rng()-0.5)*300,10+rng()*18,12+rng()*20,1.5+rng()*2.5));
    }
    // Floating platforms + columns spread wide
    for (let i=0;i<4;i++) {
      const x=(rng()-0.5)*1600, z=(rng()-0.5)*500, y=200+rng()*250;
      const w=50+rng()*130, d=35+rng()*90, dl=2.5+rng()*2;
      els.push(makeBox(rng,x,y,z,w,6+rng()*12,d,dl,{windows:false,crossBrace:false,hatching:rng()<0.7,measure:rng()<0.3}));
      const nC=2+Math.floor(rng()*3);
      for (let c2=0;c2<nC;c2++) {
        const cx2=x-w/2+(w/(nC+1))*(c2+1), cz=z+(rng()-0.5)*d*0.5;
        els.push(makeBox(rng,cx2,0,cz,5+rng()*7,y,5+rng()*7,dl+0.5,{windows:false,crossBrace:false,hatching:false,measure:false}));
      }
    }
    els.sort((a,b) => a.delay - b.delay);
    return els;
  }

  function drawGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, alpha: number) {
    ctx.lineWidth = 0.25; ctx.strokeStyle = `rgba(229,231,235,${alpha*0.25})`;
    for (let i=-1500;i<=1500;i+=80) {
      let a=proj(i,0,-1500,cx,cy,s), b=proj(i,0,1500,cx,cy,s);
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      a=proj(-1500,0,i,cx,cy,s); b=proj(1500,0,i,cx,cy,s);
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    }
  }

  function drawNodes(ctx: CanvasRenderingContext2D, els: Element[], cx: number, cy: number, s: number, time: number, alpha: number) {
    const rng2 = mulberry32(77);
    for (let i=0;i<els.length;i++) {
      if (rng2()>0.2) continue;
      const pulse = 0.4+0.6*Math.sin(time*1.5+i*1.7);
      const px = cx+(rng2()-0.5)*900*s, py = cy-rng2()*500*s;
      ctx.beginPath(); ctx.arc(px,py,1.2+pulse*1.5,0,Math.PI*2);
      ctx.fillStyle = `rgba(37,99,235,${alpha*0.35*pulse})`; ctx.fill();
    }
  }

  onMount(() => {
    const ctx = canvasEl.getContext('2d')!;
    const scene = generateScene(mulberry32(42));
    const startTime = performance.now();
    function resize() {
      const rect = containerEl.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasEl.width = rect.width*dpr; canvasEl.height = rect.height*dpr;
      canvasEl.style.width = rect.width+'px'; canvasEl.style.height = rect.height+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize(); window.addEventListener('resize', resize);
    function draw(now: number) {
      const elapsed = (now-startTime)/1000;
      const W = canvasEl.width/(window.devicePixelRatio||1), H = canvasEl.height/(window.devicePixelRatio||1);
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H*0.78, s=Math.min(W,H)/380;
      drawGrid(ctx,cx,cy,s,Math.min(1,elapsed/1.5));
      for (const el of scene) {
        const t2=Math.max(0,elapsed-el.delay);
        if (t2>0) el.draw(ctx,cx,cy,s,Math.min(1,t2/2.2),Math.min(1,t2/1.2)*0.7,elapsed);
      }
      if (elapsed>1.5) drawNodes(ctx,scene,cx,cy,s,elapsed,Math.min(1,(elapsed-1.5)/2));
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize',resize); };
  });
</script>

<div class="spread cover" bind:this={containerEl}>
  <canvas class="cover-canvas" bind:this={canvasEl}></canvas>
  <div class="page">
    <div class="cover-content">
      <p class="chapter-label">LACMA Art + Technology Lab 2026</p>
      <h1>Vibrational Codex</h1>
      <p class="subtitle">Making the Physics of Generative Intelligence Legible</p>
      <p class="subtitle-small">Through Multimodal (Light, Sound, and Touch) Interfaces</p>
      <p class="byline">Erick Oduniyi · Cambridge, MA</p>
      <div class="three-words">
        <span>Legibility</span><span class="dot">·</span>
        <span>Vibration</span><span class="dot">·</span>
        <span>Emergence</span>
      </div>
    </div>
  </div>
</div>

<style>
  .cover { position:relative; text-align:center; background:var(--bg); min-height:100vh; overflow:hidden; }
  .cover-canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
  .cover .page { position:relative; z-index:1; }
  .cover-content { padding:6rem 0 4rem; }
  .cover h1 { font-size:3.4rem; letter-spacing:-0.03em; margin-bottom:0.8rem; }
  .cover .subtitle { font-size:1.2rem; max-width:480px; margin:0 auto 0.5rem; }
  .cover .subtitle-small { font-size:0.95rem; color:var(--text-muted); max-width:480px; margin:0 auto 1.5rem; }
  .three-words { font-family:var(--font-sans); font-size:0.9rem; color:var(--accent); letter-spacing:0.06em; margin-top:2rem; }
  .three-words .dot { margin:0 0.5rem; color:var(--text-muted); }
  @media (max-width:640px) {
    .cover h1 { font-size:2rem; }
    .cover .subtitle { font-size:1.05rem; }
    .cover .subtitle-small { font-size:0.85rem; }
    .cover-content { padding:3rem var(--page-padding,1.75rem) 2rem; }
  }
</style>
