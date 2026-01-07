window.patchClient = function(html, cfg) {
  const marker = "<!-- AUTCLICKER_INJECTOR -->";
  if (html.includes(marker)) return html; // Prevent double injection

  const injection = `
${marker}
<script>
(function(){
  const CFG = ${JSON.stringify(cfg)};
  let active=false, timer=null, held=false;

  function act(){
    if(CFG.actionKey==="mouse"){
      document.elementFromPoint(innerWidth/2,innerHeight/2)
        ?.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown",{key:CFG.actionKey,bubbles:true}));
      document.dispatchEvent(new KeyboardEvent("keyup",{key:CFG.actionKey,bubbles:true}));
    }
  }

  function start(){ if(timer) return; timer=setInterval(act,CFG.interval); active=true; updateOverlay(); }
  function stop(){ clearInterval(timer); timer=null; active=false; updateOverlay(); }

  document.addEventListener("keydown", e => {
    if(e.key !== CFG.activationKey) return;
    if(CFG.mode==="toggle") active?stop():start();
    else if(CFG.mode==="hold" && !held){ held=true; start(); }
  });

  document.addEventListener("keyup", e => {
    if(CFG.mode==="hold" && e.key===CFG.activationKey){ held=false; stop(); }
  });

  if(CFG.stopOnBlur) window.addEventListener("blur", stop);

  // Overlay
  let overlay;
  function updateOverlay(){
    if(!overlay) return;
    overlay.textContent = \`Autoclicker (\${CFG.activationKey}): \${active?"ON":"OFF"}\`;
  }

  if(CFG.showOverlay){
    overlay = document.createElement("div");
    overlay.style="position:fixed;bottom:10px;right:10px;background:#000;color:#0f0;padding:6px;font:12px monospace;z-index:999999;";
    overlay.textContent = \`Autoclicker (\${CFG.activationKey}): OFF\`;
    document.body.appendChild(overlay);
  }

})();
</script>
${marker}
`;

  return html.includes("</body>") ? html.replace(/<\/body>/i, injection + "\n</body>") : html + injection;
};
