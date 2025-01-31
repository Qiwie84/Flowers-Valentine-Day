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

// Rutas de las canciones directamente en el HTML
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

// Rutas de las imágenes para cada canción
const images = [
  'img/Flores Amarillas.png',
  'img/Enchanted.png',
  'img/Yellow.png',
  'img/Ocean Eyes.png',
  'img/Car´s Outside.png',
  'img/Time After Time.png',
];

// Obtener el contenedor para la letra
const lyricsContainer = document.querySelector('.lyrics-container');

// Limpiar la letra antes de cargar una nueva
function clearLyrics() {
  lyricsContainer.textContent = ''; // Limpia el contenedor de la letra
}

// Función para cargar la letra y sincronizarla
function loadLyrics(songIndex) {
  const songTitle = songs[songIndex].title;
  const lrcFile = `lrc/${songTitle}.lrc`; // Ruta del archivo .lrc

  fetch(lrcFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo de la letra');
      }
      return response.text();
    })
    .then(lyrics => {
      const lyricsArray = parseLyrics(lyrics); // Parsear las letras
      displayLyrics(lyricsArray);
    })
    .catch(error => {
      console.error('Error al cargar la letra:', error);
    });
}

// Función para parsear el archivo LRC
function parseLyrics(lyrics) {
  const lines = lyrics.split('\n');
  const parsedLyrics = [];

  lines.forEach(line => {
    const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseFloat(timeMatch[2]);
      const text = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, '').trim();
      parsedLyrics.push({ time: minutes * 60 + seconds, text });
    }
  });

  return parsedLyrics;
}

// Función para mostrar la letra en el momento adecuado
function displayLyrics(lyricsArray) {
  let currentLyricIndex = 0;
  lyricsContainer.textContent = ''; // Limpiar antes de comenzar

  // Cada vez que el tiempo cambia en la canción
  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;

    // Si el índice es menor que la longitud de la letra y el tiempo actual es mayor o igual que el tiempo de la letra, mostrar la letra
    if (currentLyricIndex < lyricsArray.length && currentTime >= lyricsArray[currentLyricIndex].time) {
      lyricsContainer.textContent = lyricsArray[currentLyricIndex].text; // Mostrar el verso
      currentLyricIndex++;
    }
  });
}

// Función para cambiar la imagen
function changeImage(songIndex) {
  const musicImage = document.getElementById('musicImage');
  musicImage.src = images[songIndex]; // Cambiar la imagen según el índice de la canción
}

// Cargar la canción y cambiar la imagen
function loadSong(songIndex) {
  const song = songs[songIndex];
  audio.src = song.src;
  document.querySelector('.title-1').textContent = song.title;
  document.querySelector('.title-2').textContent = song.artist;

  // Cambiar la imagen cuando cargamos la canción
  changeImage(songIndex);

  // Limpiar la letra anterior y cargar la nueva
  clearLyrics(); // Limpiar cualquier letra de la canción anterior
  loadLyrics(songIndex); // Cargar la letra de la canción actual

  // Asegurarse de cargar el audio y reproducirlo directamente
  audio.load();
  audio.play();
}

// Reproducir o pausar la canción
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
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

// Actualizar la barra de progreso
function updateProgressBar() {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;

  // Actualizar el tiempo
  currentTimeText.textContent = formatTime(audio.currentTime);
  totalTimeText.textContent = formatTime(audio.duration);
}

// Formatear el tiempo en minutos y segundos
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Cuando la canción termine, cargar la siguiente
audio.addEventListener('ended', nextSong);

// Si la canción es retrocedida, reiniciar la letra
audio.addEventListener('seeked', () => {
  clearLyrics(); // Limpiar la letra antes de sincronizar nuevamente
  loadLyrics(currentSongIndex); // Volver a cargar la letra desde el nuevo tiempo
});

// Eventos
playPauseButton.addEventListener('click', togglePlayPause);
nextButton.addEventListener('click', nextSong);
prevButton.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgressBar);

// Hacer que la barra de progreso sea interactiva
progressBar.addEventListener('input', (event) => {
  const value = event.target.value;
  const duration = audio.duration;
  audio.currentTime = (value / 100) * duration; // Cambiar el tiempo de la canción
});

// Cargar y reproducir la primera canción al inicio
window.addEventListener('load', () => {
  loadSong(currentSongIndex);
});
