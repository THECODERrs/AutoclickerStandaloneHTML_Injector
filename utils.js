function generateId() { 
  return "ac_" + Math.random().toString(36).slice(2); 
}

function isHtmlExtension(file) {
  return /\.html?$/i.test(file.name);
}

function isHtmlContent(text) {
  return /<!doctype html>|<html[\s>]/i.test(text);
}

function findActivationKeys(html) {
  const regex = /activationKey\s*:\s*["'`](.*?)["'`]/g;
  const keys = [];
  let m;
  while ((m = regex.exec(html))) keys.push(m[1]);
  return keys;
}
