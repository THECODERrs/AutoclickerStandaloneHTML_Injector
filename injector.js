function injectAutoclicker(html, cfg) {
  const id = generateId();

  const injection = `
<!-- === AUTCLICKER INJECTOR START (${id}) === -->
<script>
(function(){
  window.__AUTCLICKER_REGISTRY__ ||= { instances: [], activeKeys: {} };

  const CFG = ${JSON.stringify(cfg)};
  let active=false, timer=null, held=false;

  function act(){
    if(CFG.actionType==="mouse"){
      document.elementFromPoint(innerWidth/2,innerHeight/2)
        ?.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown",{key:CFG.actionKey,bubbles:true}));
      document.dispatchEvent(new KeyboardEvent("keyup",{key:CFG.actionKey,bubbles:true}));
    }
  }

  function start(){ if(timer) return; timer=setInterval(act,CFG.interval); active=true; }
  function stop(){ clearInterval(timer); timer=null; active=false; }

  document.addEventListener("keydown",e=>{
    if(e.key!==CFG.activationKey) return;
    CFG.mode==="toggle" ? (active?stop():start()) :
    (!held && (held=true,start()));
  });

  document.addEventListener("keyup",e=>{
    if(CFG.mode==="hold" && e.key===CFG.activationKey){ held=false; stop(); }
  });

  if(CFG.stopOnBlur) window.addEventListener("blur",stop);

  window.__AUTCLICKER_REGISTRY__.instances.push({ stop });
})();
</script>
<!-- === AUTCLICKER INJECTOR END (${id}) === -->
`;

  return html.includes("</body>")
    ? html.replace(/<\/body>/i, injection + "\n</body>")
    : html + injection;
}
