const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const playlistFolder = 'Songs';
let playlist = [];

fs.readdirSync(playlistFolder).forEach(file => {
  if (path.extname(file) === '.mp3') {
    playlist.push(path.join(playlistFolder, file));
  }
});

app.use(express.static('public'));

app.get('/stream', (req, res) => {
  const headers = {
    'Content-Type': 'audio/mpeg',
    'Transfer-Encoding': 'chunked',
  };
  res.writeHead(200, headers);

  const playNextSong = () => {
    const filePath = playlist.shift(); // Remove the first song from the playlist
    if (!filePath) {
      console.log('Playlist finished');
      res.end();
      return;
    }

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res, { end: false });
    readStream.on('end', () => {
      playNextSong(); // Start playing the next song
    });
  };

  playNextSong();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
