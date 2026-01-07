document.getElementById("process").onclick = async () => {
  const file = document.getElementById("fileInput").files[0];
  if(!file) return alert("Select a file");

  const text = await file.text();

  if(!isHtmlExtension(file) || !isHtmlContent(text)){
    return alert("Invalid HTML file");
  }

  const activationKey = document.getElementById("activationKey").value.trim();
  const usedKeys = findActivationKeys(text);

  if(usedKeys.includes(activationKey) && 
     !confirm(`Activation key "${activationKey}" already exists. Inject anyway?`)) return;

  const cfg = {
    actionType: document.getElementById("actionType").value,
    actionKey: document.getElementById("actionKey").value,
    activationKey,
    mode: document.getElementById("mode").value,
    interval: Number(document.getElementById("interval").value),
    showOverlay: document.getElementById("overlay").checked,
    stopOnBlur: document.getElementById("blurStop").checked
  };

  const outHtml = injectAutoclicker(text, cfg);
  const keys = [...new Set([...usedKeys, activationKey])].join("+");
  const outName = `Processed_${keys}_Autoclicker_${file.name}`;

  const blob = new Blob([outHtml], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = outName;
  a.click();

  document.getElementById("status").textContent = "✔ File processed";
};
