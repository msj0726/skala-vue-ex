<template>
  <div class="scene" aria-hidden="true">
    <div class="speed-lines"><i v-for="n in 6" :key="n"></i></div>
    <div class="ball-wrap">
      <div class="ball">
        <span class="seam seam-a"></span>
        <span class="seam seam-b"></span>
      </div>
      <div class="ball-shadow"></div>
    </div>
    <div class="strike-zone"><span></span><span></span><span></span></div>
    <div class="field-grid"></div>
    <div class="metric metric-speed"><small>PITCH VELOCITY</small><strong>98.7</strong><em>MPH</em></div>
    <div class="metric metric-spin"><small>SPIN RATE</small><strong>2,481</strong><em>RPM</em></div>
  </div>
</template>

<style scoped>
.scene { position: relative; min-height: 500px; perspective: 900px; overflow: hidden; }
.field-grid { position: absolute; width: 520px; height: 520px; left: 50%; top: 56%; transform: translate(-50%,-20%) rotateX(69deg) rotateZ(45deg); border: 1px solid rgba(138,199,174,.24); background: repeating-linear-gradient(0deg,transparent 0 38px,rgba(138,199,174,.1) 39px 40px),repeating-linear-gradient(90deg,transparent 0 38px,rgba(138,199,174,.1) 39px 40px); mask-image: linear-gradient(#000,transparent 76%); }
.strike-zone { position: absolute; width: 180px; height: 230px; left: 50%; top: 52%; transform: translate(-50%,-50%) rotateY(-7deg); border: 1px solid rgba(255,255,255,.26); box-shadow: 0 0 45px rgba(58,137,255,.09); }
.strike-zone::before,.strike-zone::after,.strike-zone span { content:''; position:absolute; background:rgba(255,255,255,.12); }
.strike-zone::before { left: 33.3%; top: 0; bottom: 0; width: 1px; } .strike-zone::after { right:33.3%; top:0; bottom:0; width:1px; }
.strike-zone span { left:0; right:0; height:1px; } .strike-zone span:nth-child(1){top:33.3%}.strike-zone span:nth-child(2){top:66.6%}.strike-zone span:nth-child(3){display:none}
.ball-wrap { position:absolute; z-index:3; width:230px; height:250px; left:50%; top:48%; transform:translate(-50%,-50%) rotate(-11deg); animation: hover 4.2s ease-in-out infinite; }
.ball { position:relative; width:220px; height:220px; overflow:hidden; border-radius:50%; background:radial-gradient(circle at 33% 28%,#fff 0,#f7f3e9 33%,#d8d2c5 73%,#969184 100%); box-shadow:inset -22px -26px 34px rgba(17,26,35,.32),inset 12px 10px 18px rgba(255,255,255,.8),0 36px 70px rgba(0,0,0,.5); animation: spin-ball 9s linear infinite; }
.ball::after { content:''; position:absolute; inset:5%; border-radius:50%; background:linear-gradient(105deg,rgba(255,255,255,.48),transparent 30% 70%,rgba(10,18,26,.12)); }
.seam { position:absolute; width:230px; height:230px; border:5px dashed #bd332d; border-radius:50%; filter:drop-shadow(0 1px 0 rgba(0,0,0,.25)); }
.seam-a { left:-147px; top:-5px; }.seam-b { right:-147px; bottom:-5px; }
.ball-shadow { width:165px; height:25px; margin:-1px auto 0; border-radius:50%; background:rgba(0,0,0,.5); filter:blur(16px); transform:rotate(8deg); }
.speed-lines i { position:absolute; height:1px; width:clamp(130px,25vw,330px); right:52%; top:var(--y); background:linear-gradient(90deg,transparent,rgba(255,255,255,.42)); transform:rotate(-18deg); animation: streak 2.8s ease-in-out infinite var(--d); }
.speed-lines i:nth-child(1){--y:23%;--d:0s}.speed-lines i:nth-child(2){--y:31%;--d:.2s}.speed-lines i:nth-child(3){--y:42%;--d:.4s}.speed-lines i:nth-child(4){--y:59%;--d:.1s}.speed-lines i:nth-child(5){--y:70%;--d:.5s}.speed-lines i:nth-child(6){--y:79%;--d:.3s}
.metric { position:absolute; z-index:5; padding:12px 14px; min-width:116px; border-left:2px solid #e4473d; background:rgba(8,14,24,.7); backdrop-filter:blur(10px); color:#fff; }
.metric small,.metric em { display:block; color:rgba(255,255,255,.5); font:700 9px/1.4 -apple-system,sans-serif; font-style:normal; } .metric strong { font:800 25px/1.2 -apple-system,sans-serif; }
.metric-speed { right:7%; top:24%; }.metric-spin { left:8%; bottom:17%; }
@keyframes hover { 50% { transform:translate(-50%,-55%) rotate(-7deg) scale(1.03); } }
@keyframes spin-ball { to { transform:rotate(360deg); } }
@keyframes streak { 50% { opacity:.25; transform:translateX(35px) rotate(-18deg); } }
@media (max-width:900px){.scene{min-height:420px}.ball-wrap{transform:translate(-50%,-50%) scale(.82)}.metric-speed{right:3%}.metric-spin{left:3%}}
@media (max-width:600px){.scene{min-height:330px}.ball-wrap{top:49%;transform:translate(-50%,-50%) scale(.62)}.strike-zone{transform:translate(-50%,-50%) scale(.78)}.metric{transform:scale(.84)}.metric-speed{right:0;top:17%}.metric-spin{left:0;bottom:9%}}
@media (prefers-reduced-motion:reduce){.ball-wrap,.ball,.speed-lines i{animation:none}}
</style>
