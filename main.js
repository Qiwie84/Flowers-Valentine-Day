onload = () => {
  document.body.classList.remove("container");
};

// Obtener los elementos del DOM
const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('play_pause_button');
const nextButton = document.getElementById('next_button');
const prevButton = document.getElementById('prev_button');
const progressBar = document.getElementById('progress');
const currentTimeText = document.getElementById('current_time');
const totalTimeText = document.getElementById('total_time');

// Lista de canciones
const songs = [
  { title: 'Flores Amarillas', artist: 'Floricienta', src: 'img/Flores Amarillas.mp3' },
  { title: 'Enchanted', artist: 'Taylor Swift', src: 'img/Enchanted.mp3' },
  { title: 'Yellow', artist: 'Coldplay', src: 'img/Yellow.mp3' },
  { title: 'Ocean Eyes', artist: 'Billie Eilish', src: 'img/Ocean Eyes.mp3' },
  { title: 'Car´s Outside', artist: 'James Arthur', src: 'img/Car´s Outside.mp3' },
  { title: 'Time After Time', artist: 'Cyndi Lauper', src: 'img/Time After Time.mp3' },
];

// Índice de la canción actual
let currentSongIndex = 0;

// Imágenes de cada canción
const images = [
  'img/Flores Amarillas.png',
  'img/Enchanted.png',
  'img/Yellow.png',
  'img/Ocean Eyes.png',
  'img/Car´s Outside.png',
  'img/Time After Time.png',
];

// Contenedor de letras
const lyricsContainer = document.querySelector('.lyrics-container');
let currentLyricIndex = 0; // Control de las letras sincronizadas

// Función para limpiar la letra antes de cargar una nueva canción
function clearLyrics() {
  lyricsContainer.textContent = ''; // Limpia el contenedor de letras
  currentLyricIndex = 0; // Reinicia la sincronización
}

// Función para cargar la letra de la canción
function loadLyrics(songIndex) {
  const songTitle = songs[songIndex].title;
  const lrcFile = `lrc/${songTitle}.lrc`;

  fetch(lrcFile)
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el archivo de la letra');
      return response.text();
    })
    .then(lyrics => {
      const lyricsArray = parseLyrics(lyrics);
      displayLyrics(lyricsArray);
    })
    .catch(error => {
      console.error('Error al cargar la letra:', error);
      lyricsContainer.textContent = 'Letra no disponible'; // Mensaje si no hay letra
    });
}

// Función para parsear el archivo LRC
function parseLyrics(lyrics) {
  return lyrics.split('\n').map(line => {
    const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const text = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, '').trim();
      return { time: minutes * 60 + seconds, text };
    }
  }).filter(Boolean);
}

// Función para mostrar la letra en el momento correcto
function displayLyrics(lyricsArray) {
  clearLyrics(); // Limpiar antes de mostrar la nueva letra

  audio.removeEventListener('timeupdate', syncLyrics); // Eliminar el evento previo
  audio.addEventListener('timeupdate', syncLyrics);

  function syncLyrics() {
    if (currentLyricIndex < lyricsArray.length && audio.currentTime >= lyricsArray[currentLyricIndex].time) {
      lyricsContainer.textContent = lyricsArray[currentLyricIndex].text;
      currentLyricIndex++;
    }
  }
}

// Función para cambiar la imagen de la canción
function changeImage(songIndex) {
  document.getElementById('musicImage').src = images[songIndex];
}

// Función para cargar una nueva canción
function loadSong(songIndex) {
  const song = songs[songIndex];
  audio.src = song.src;
  document.querySelector('.title-1').textContent = song.title;
  document.querySelector('.title-2').textContent = song.artist;

  changeImage(songIndex);
  clearLyrics(); // Borrar letras anteriores
  loadLyrics(songIndex); // Cargar la nueva letra

  audio.load();
  audio.play();
}

// Reproducir o pausar la canción
function togglePlayPause() {
  audio.paused ? audio.play() : audio.pause();
}

// Cambiar a la siguiente canción
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
}

// Cambiar a la canción anterior
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
}

// Actualizar la barra de progreso y el tiempo de la canción
function updateProgressBar() {
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  currentTimeText.textContent = formatTime(audio.currentTime);
  totalTimeText.textContent = formatTime(audio.duration);
}

// Formatear el tiempo en minutos y segundos
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Cuando la canción termine, pasar a la siguiente
audio.addEventListener('ended', nextSong);

// Reiniciar letra cuando se retrocede la canción
audio.addEventListener('seeked', () => {
  clearLyrics();
  loadLyrics(currentSongIndex);
});

// Eventos de botones
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgressBar);

// Hacer que la barra de progreso sea interactiva
progressBar.addEventListener('input', event => {
  audio.currentTime = (event.target.value / 100) * audio.duration;
});

// Cargar la primera canción al inicio
window.addEventListener('load', () => {
  loadSong(currentSongIndex);
});
