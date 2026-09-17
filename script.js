// Audio Engine (Web Audio API)
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let sirenOsc = null;

function initAudio() { 
  if (!audioCtx) audioCtx = new AudioCtx(); 
}

function playKeyClick() {
  if (!document.getElementById('sfx-toggle').checked) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600 + Math.random() * 500, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  osc.connect(gain); 
  gain.connect(audioCtx.destination);
  osc.start(); 
  osc.stop(audioCtx.currentTime + 0.04);
}

function toggleSiren(active) {
  if (!document.getElementById('sfx-toggle').checked) return;
  initAudio();
  if (active && !sirenOsc) {
    sirenOsc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    sirenOsc.type = 'sawtooth';
    sirenOsc.frequency.setValueAtTime(300, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    
    // LFO Pitch Pulse
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 3;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(sirenOsc.frequency);
    lfo.start();

    sirenOsc.connect(gain); 
    gain.connect(audioCtx.destination);
    sirenOsc.start();
  } else if (!active && sirenOsc) {
    sirenOsc.stop(); 
    sirenOsc.disconnect(); 
    sirenOsc = null;
  }
}

// Matrix Rain Background
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;
const chars = '0123456789ABCDEF';
const drops = Array(Math.floor(canvas.width / 16)).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--main-color');
  ctx.font = '14px monospace';
  drops.forEach((y, i) => {
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
    if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 33);

// CCTV Simulated Vectors
function drawCCTV(id) {
  const cvs = document.getElementById(id); 
  if (!cvs) return;
  const c = cvs.getContext('2d');
  cvs.width = 140; 
  cvs.height = 100;
  setInterval(() => {
    c.fillStyle = '#000'; 
    c.fillRect(0,0,140,100);
    c.strokeStyle = getComputedStyle(document.body).getPropertyValue('--main-color');
    c.lineWidth = 1;
    c.beginPath(); 
    c.arc(70, 50, Math.random()*30 + 10, 0, Math.PI*2); 
    c.stroke();
    c.strokeRect(Math.random()*40, Math.random()*30, 60, 40);
  }, 150);
}
drawCCTV('cctv1'); 
drawCCTV('cctv2');

// Auto Code Streamer on Keypress
const exploitCode = [
  "sys.connect('192.168.1.104', port=8080)",
  "bypassing PAM authentication tokens...",
  "payload = '\\x90'*64 + shellcode",
  "executing stack overflow exploit...",
  "root access granted on target node",
  "dumping /etc/shadow hashes..."
];
let codeIdx = 0;

window.addEventListener('keydown', (e) => {
  if (e.altKey) return;
  playKeyClick();
  const term = document.getElementById('term-log');
  const speed = document.getElementById('speed-slider').value;
  
  for(let i = 0; i < speed; i++) {
    const line = document.createElement('div');
    line.innerText = `> ${exploitCode[codeIdx % exploitCode.length]}`;
    term.appendChild(line);
    codeIdx++;
  }
  term.scrollTop = term.scrollHeight;
});

// Director's Panel Updates
function updateTarget(val) {
  document.getElementById('target-header').innerText = `TARGET: [${val}]`;
}

// Hotkey Controls (ALT+1 & ALT+2)
let lockdownActive = false;
let dlInterval = null;

window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('modal');
  const text = document.getElementById('modal-text');
  const sub = document.getElementById('modal-sub');

  // ALT+1: BREACH MODE
  if (e.altKey && e.key === '1') {
    document.body.classList.add('flash-screen');
    setTimeout(() => document.body.classList.remove('flash-screen'), 300);

    document.getElementById('trace-val').innerText = '99%';
    document.getElementById('trace-status').innerText = '[CRITICAL BREACH]';
    
    text.innerText = 'EXTRACTING INTEL...';
    sub.style.display = 'block';
    modal.classList.add('active');

    let count = 0;
    clearInterval(dlInterval);
    dlInterval = setInterval(() => {
      count += 128;
      document.getElementById('dl-count').innerText = count;
      if (count >= 4096) {
        clearInterval(dlInterval);
        setTimeout(() => modal.classList.remove('active'), 1000);
      }
    }, 100);
  }

  // ALT+2: EMERGENCY LOCKDOWN
  if (e.altKey && e.key === '2') {
    lockdownActive = !lockdownActive;
    if (lockdownActive) {
      document.body.classList.add('lockdown');
      document.getElementById('status-tag').innerText = 'TERMINATED';
      text.innerText = 'COUNTER-TRACE DETECTED\nCONNECTION TERMINATED';
      sub.style.display = 'none';
      modal.classList.add('active');
      toggleSiren(true);
    } else {
      document.body.classList.remove('lockdown');
      document.getElementById('status-tag').innerText = 'ONLINE';
      modal.classList.remove('active');
      toggleSiren(false);
    }
  }
});
