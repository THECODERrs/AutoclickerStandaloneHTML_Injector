process.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const text = await file.text();
  if (!isHtmlExtension(file) || !isHtmlContent(text)) {
    status.textContent = "❌ Invalid HTML file";
    return;
  }

  const activationKey = activationKey.value.trim();
  const usedKeys = findActivationKeys(text);

  if (usedKeys.includes(activationKey) &&
      !confirm(`Activation key "${activationKey}" already exists. Inject anyway?`)) {
    return;
  }

  const cfg = {
    actionType: actionType.value,
    actionKey: actionKey.value,
    activationKey,
    mode: mode.value,
    interval: Number(interval.value),
    showOverlay: overlay.checked,
    stopOnBlur: blurStop.checked
  };

  const outHtml = injectAutoclicker(text, cfg);

  const keys = [...new Set([...usedKeys, activationKey])].join("+");
  const outName = `Processed_${keys}_Autoclicker_${file.name}`;

  const blob = new Blob([outHtml], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = outName;
  a.click();

  status.textContent = "✔ File processed";
};
