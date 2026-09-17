// Web Audio API Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playKeyClick() {
  const sfxOn = document.getElementById('sfx-toggle').checked;
  if (!sfxOn) return;

  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + Math.random() * 400, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

function playAlarmTone() {
  const sfxOn = document.getElementById('sfx-toggle').checked;
  if (!sfxOn) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

// Matrix Background Canvas Loop
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const alphabet = katakana + latin;
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let rainDrops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--main-color').trim() || '#00ff66';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i]++;
  }
}
setInterval(drawMatrix, 30);

// CCTV Camera Noise Generator
function drawCCTV(canvasId) {
  const cctvCanvas = document.getElementById(canvasId);
  if (!cctvCanvas) return;
  const cctx = cctvCanvas.getContext('2d');
  cctvCanvas.width = 140;
  cctvCanvas.height = 100;

  function renderNoise() {
    const imgData = cctx.createImageData(cctvCanvas.width, cctvCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.random() * 255;
      imgData.data[i] = val;
      imgData.data[i+1] = val;
      imgData.data[i+2] = val;
      imgData.data[i+3] = 255;
    }
    cctx.putImageData(imgData, 0, 0);
  }
  setInterval(renderNoise, 100);
}
drawCCTV('cctv1');
drawCCTV('cctv2');

// Theme Switcher Engine
function changeTheme(themeName) {
  document.body.className = themeName;
}

// Terminal CLI Parser
const cliInput = document.getElementById('cli-input');
const termLog = document.getElementById('term-log');

cliInput.addEventListener('keydown', (e) => {
  playKeyClick();
  if (e.key === 'Enter') {
    const cmd = cliInput.value.trim().toLowerCase();
    cliInput.value = '';
    
    if (cmd === '') return;

    appendLog(`user@phantomx:~$ ${cmd}`);
    processCommand(cmd);
  }
});

function appendLog(text) {
  const line = document.createElement('div');
  line.innerHTML = text;
  termLog.appendChild(line);
  termLog.scrollTop = termLog.scrollHeight;
}

function processCommand(cmd) {
  const args = cmd.split(' ');
  switch (args[0]) {
    case 'help':
      appendLog('Available commands: <b>help</b>, <b>scan</b>, <b>theme</b>, <b>clear</b>, <b>status</b>');
      break;
    case 'scan':
      appendLog('[+] Scanning local subnet... Found 4 active nodes.');
      break;
    case 'clear':
      termLog.innerHTML = '';
      break;
    case 'status':
      appendLog('SYS_MAINFRAME: ONLINE | TRACE: 12% | ENCRYPTION: SECURE');
      break;
    case 'theme':
      if (args[1] === 'amber') {
        changeTheme('theme-amber');
        document.getElementById('theme-select').value = 'theme-amber';
        appendLog('Theme set to Retro Amber.');
      } else if (args[1] === 'matrix') {
        changeTheme('theme-matrix');
        document.getElementById('theme-select').value = 'theme-matrix';
        appendLog('Theme set to Matrix Green.');
      } else if (args[1] === 'cyberpunk') {
        changeTheme('theme-cyberpunk');
        document.getElementById('theme-select').value = 'theme-cyberpunk';
        appendLog('Theme set to Cyberpunk Neon.');
      } else {
        appendLog('Usage: theme &lt;matrix | amber | cyberpunk&gt;');
      }
      break;
    default:
      appendLog(`Command not recognized: '${cmd}'. Type <b>help</b> for options.`);
  }
}

// Hotkeys Listener
window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === '1') {
    e.preventDefault();
    triggerBreach();
  }
});

function triggerBreach() {
  playAlarmTone();
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
  
  let downloaded = 0;
  const dlCount = document.getElementById('dl-count');
  
  const timer = setInterval(() => {
    downloaded += 256;
    dlCount.textContent = downloaded;
    if (downloaded >= 4096) {
      clearInterval(timer);
      setTimeout(() => {
        modal.style.display = 'none';
      }, 1000);
    }
  }, 100);
}
