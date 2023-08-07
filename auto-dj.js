const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const icecastUrl = 'http://localhost:8000/dj';
const audioFolder = 'Songs';

function getRandomAudioFile() {
  const audioFiles = fs.readdirSync(audioFolder).filter(file => file.endsWith('.mp3'));
  if (audioFiles.length > 0) {
    return audioFiles[Math.floor(Math.random() * audioFiles.length)];
  } else {
    return null;
  }
}

function startStreaming(audioFile) {
  const ffmpeg = spawn('ffmpeg', [
    '-i', `${audioFolder}/${audioFile}`,
    '-f', 'mp3',
    '-content_type', 'audio/mpeg',
    icecastUrl
  ]);

  ffmpeg.on('close', (code) => {
    console.log(`Streaming process exited with code ${code}`);
  });

  return ffmpeg;
}

function mainLoop() {
  const audioFile = getRandomAudioFile();
  if (audioFile) {
    console.log(`Playing: ${audioFile}`);
    const streamProcess = startStreaming(audioFile);
    setTimeout(() => {
      streamProcess.kill('SIGINT'); // Terminate the streaming process
    }, 5000); // Play each file for 5 seconds
  } else {
    console.log('No audio files found.');
  }

  setTimeout(mainLoop, 10000); // Wait for 10 seconds before checking for new files
}

mainLoop();
