// Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// Metronome
let bpm = 60;
let subdivision = 1; // 1 = quarter, 2 = eighth, 4 = sixteenth
let beatsPerMeasure = 4; // Default beats per measure
let interval;
let beatCount = 0;
let isPlaying = false;
const clickDownbeat = document.getElementById('click-downbeat');
const clickUpbeat = document.getElementById('click-upbeat');
const clickSubdivision = document.getElementById('click-subdivision');

// Set quieter volume for the upbeat and subdivision sounds
clickUpbeat.volume = 0.5;
clickSubdivision.volume = 0.3;

// Create dots based on beats per measure
function createDots() {
  const dotsContainer = document.getElementById('dots-container');
  dotsContainer.innerHTML = ''; // Clear existing dots

  for (let i = 1; i <= beatsPerMeasure; i++) {
    const mainDot = document.createElement('div');
    mainDot.classList.add('dot', 'main');
    mainDot.id = `dot${i}`;
    mainDot.textContent = '•';
    dotsContainer.appendChild(mainDot);

    if (subdivision > 1) {
      for (let j = 1; j < subdivision; j++) {
        const subDot = document.createElement('div');
        subDot.classList.add('dot', 'subdivision');
        subDot.textContent = '•';
        dotsContainer.appendChild(subDot);
      }
    }
  }
}

// Start metronome
function startMetronome() {
  const beatInterval = (60 / bpm) * 1000 / subdivision;
  interval = setInterval(() => {
    beatCount++;
    const currentBeat = (beatCount - 1) % (beatsPerMeasure * subdivision) + 1;

    // Highlight the current dot
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    const currentDot = document.querySelector(`.dot:nth-child(${currentBeat})`);
    if (currentDot) currentDot.classList.add('active');

    // Play click sound
    if (currentBeat % subdivision === 1) {
      if ((currentBeat - 1) / subdivision % beatsPerMeasure === 0) {
        clickDownbeat.currentTime = 0;
        clickDownbeat.play(); // Downbeat
      } else {
        clickUpbeat.currentTime = 0;
        clickUpbeat.play(); // Upbeat
      }
    } else {
      clickSubdivision.currentTime = 0;
      clickSubdivision.play(); // Subdivision
    }

    console.log(`Beat: ${currentBeat}`);
  }, beatInterval);
}

// Stop metronome
function stopMetronome() {
  clearInterval(interval);
  document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
}

// Play/Pause Button
const playPauseButton = document.getElementById('play-pause');
playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    stopMetronome();
    playPauseButton.textContent = 'Play';
  } else {
    startMetronome();
    playPauseButton.textContent = 'Pause';
  }
  isPlaying = !isPlaying;
});

// BPM Controls
const bpmSlider = document.getElementById('bpm');
const bpmValue = document.getElementById('bpm-value');
const bpmMinus = document.getElementById('bpm-minus');
const bpmPlus = document.getElementById('bpm-plus');

bpmSlider.addEventListener('input', (e) => {
  bpm = e.target.value;
  bpmValue.textContent = bpm;
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

bpmMinus.addEventListener('click', () => {
  bpm = Math.max(40, bpm - 1);
  bpmSlider.value = bpm;
  bpmValue.textContent = bpm;
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

bpmPlus.addEventListener('click', () => {
  bpm = Math.min(200, bpm + 1);
  bpmSlider.value = bpm;
  bpmValue.textContent = bpm;
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

// Beats per Measure Controls
const beatsSlider = document.getElementById('beats');
const beatsValue = document.getElementById('beats-value');
const beatsMinus = document.getElementById('beats-minus');
const beatsPlus = document.getElementById('beats-plus');

beatsSlider.addEventListener('input', (e) => {
  beatsPerMeasure = e.target.value;
  beatsValue.textContent = beatsPerMeasure;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

beatsMinus.addEventListener('click', () => {
  beatsPerMeasure = Math.max(1, beatsPerMeasure - 1);
  beatsSlider.value = beatsPerMeasure;
  beatsValue.textContent = beatsPerMeasure;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

beatsPlus.addEventListener('click', () => {
  beatsPerMeasure = Math.min(12, beatsPerMeasure + 1);
  beatsSlider.value = beatsPerMeasure;
  beatsValue.textContent = beatsPerMeasure;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

// Subdivision Buttons
document.getElementById('quarter').addEventListener('click', () => {
  subdivision = 1;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

document.getElementById('eighth').addEventListener('click', () => {
  subdivision = 2;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

document.getElementById('sixteenth').addEventListener('click', () => {
  subdivision = 4;
  createDots();
  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

// Initialize
createDots();