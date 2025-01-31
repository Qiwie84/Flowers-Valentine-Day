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
      
      // Cargar la canción
      function loadSong(songIndex) {
        const song = songs[songIndex];
        audio.src = song.src;
        document.querySelector('.title-1').textContent = song.title;
        document.querySelector('.title-2').textContent = song.artist;
        
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
      
      // Eventos
      playPauseButton.addEventListener('click', togglePlayPause);
      nextButton.addEventListener('click', nextSong);
      prevButton.addEventListener('click', prevSong);
      audio.addEventListener('timeupdate', updateProgressBar);
      
      // Cargar y reproducir la primera canción al inicio
      window.addEventListener('load', () => {
        loadSong(currentSongIndex);
      });
      
