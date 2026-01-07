const fileInput = document.getElementById("fileInput");
const processBtn = document.getElementById("processBtn");
const status = document.getElementById("status");

processBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Select a file");

  const text = await file.text();

  const activationKey = document.getElementById("activationKey").value.trim();
  const cfg = {
    actionType: document.getElementById("actionType").value,
    actionKey: document.getElementById("actionKey").value.trim(),
    activationKey,
    mode: document.getElementById("mode").value,
    interval: Number(document.getElementById("interval").value),
    showOverlay: document.getElementById("overlay").checked,
    stopOnBlur: document.getElementById("blurStop").checked
  };

  const patchedHtml = window.patchClient(text, cfg);

  const outName = `Processed_${activationKey}_Autoclicker_${file.name}`;
  const blob = new Blob([patchedHtml], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = outName;
  a.click();

  status.textContent = "✔ File processed";
};
