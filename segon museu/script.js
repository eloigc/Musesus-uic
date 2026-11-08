// =========================================================================
// 1. DICCIONARI D'OBRES D'ART (SENSE PROBLEMES D'APÒSTROFS A L'HTML)
// =========================================================================
const ARTWORKS = {
  hokusai: {
    title: 'La gran onada de Kanagawa',
    artistYear: 'Katsushika Hokusai, 1831',
    room: 'Sala 1 - Ukiyo-e',
    description: "Aquesta gravadura mostra una onada gegant que amenaça uns pescadors que viatgen en barca. Al fons de la imatge, molt petit i serè, es veu el Mont Fuji, la muntanya sagrada del Japó.",
    audioText: "Escolteu la força del mar: una gran onada s'alça mentre el Mont Fuji roman immòbil al fons. Una xilografia tradicional que simbolitza la potència de la natura."
  },
  leonardo: {
    title: 'Mona Lisa / La Gioconda',
    artistYear: 'Leonardo da Vinci, 1503-1519',
    room: 'Sala 2 - Renaixement',
    description: "Aquest retrat mostra una dona de Florència anomenada Lisa. És famosa pel seu somriure misteriós i el domini de la tècnica del sfumato.",
    audioText: "Mireu fixament els seus ulls i la seva boca: sembla que us estigui mirant a vosaltres? El seu somriure enigmàtic ha fascinat el món durant més de 500 anys."
  },
  vangogh: {
    title: 'La nit estelada',
    artistYear: 'Vincent van Gogh, 1889',
    room: 'Sala 3 - Postimpressionisme',
    description: "Pintat des de la finestra del seu asil a Saint-Rémy-de-Provence. Un cel nocturn ple de remolins blaus i estrelles grogues vibrants.",
    audioText: "Un cel nocturn vibrant de llum i moviment. Van Gogh va utilitzar pinzellades corbes i colors vius per expressar les meves emocions més profundes."
  },
  klimt: {
    title: 'El petó (Der Kuss)',
    artistYear: 'Gustav Klimt, 1907-1908',
    room: 'Sala 4 - Art Nouveau',
    description: "Aquesta obra pertany al període daurat de Klimt. Representa una parella abraçada sobre un prat de flors, envoltats per mantells de fulla d'or.",
    audioText: "Un fons daurat i brillant on dos amants s'abracen. Klimt combina l'or real amb la pintura per crear un símbol universal d'amor."
  }
};

function openArtwork(id) {
  const art = ARTWORKS[id];
  if (art) {
    showArtworkModal(art.title, art.artistYear, art.room, art.description, art.audioText);
  }
}

// =========================================================================
// 2. COMPONENT D'A-FRAME PER AL ZOOM AMB LA RODETA DEL RATOLÍ (WHEEL ZOOM)
// =========================================================================
AFRAME.registerComponent('wheel-zoom', {
  schema: {
    minFov: { type: 'number', default: 20 },
    maxFov: { type: 'number', default: 85 },
    speed: { type: 'number', default: 0.05 }
  },
  init: function () {
    this.onWheel = this.onWheel.bind(this);
    window.addEventListener('wheel', this.onWheel, { passive: false });
  },
  remove: function () {
    window.removeEventListener('wheel', this.onWheel);
  },
  onWheel: function (event) {
    event.preventDefault();
    var camera = this.el.getAttribute('camera');
    if (!camera) return;
    let currentFov = camera.fov;
    let delta = event.deltaY * this.data.speed;
    let newFov = Math.max(this.data.minFov, Math.min(this.data.maxFov, currentFov + delta));
    this.el.setAttribute('camera', 'fov', newFov);

    // Actualitza l'indicador de zoom a la interfície
    const zoomIndicator = document.getElementById('zoom-level-indicator');
    if (zoomIndicator) {
      zoomIndicator.textContent = `FOV: ${Math.round(newFov)}°`;
    }
  }
});

// =========================================================================
// 3. REPRODUCCIÓ PER VEU DE LES AUDIOGUIES (WEB SPEECH API EN CATALÀ)
// =========================================================================
let currentAudioText = '';

function reproduirAudioguia(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Atura locucions anteriors
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ca-ES'; // Idioma català
    utterance.rate = 0.9;     // Velocitat pausada de museu
    
    window.speechSynthesis.speak(utterance);
  } else {
    alert("El teu navegador no suporta la lectura per veu en directe.");
  }
}

// =========================================================================
// 4. CONTROL DE LA FINESTRA MODAL I NAVEGACIÓ
// =========================================================================
function closeArtworkModal() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const modal = document.getElementById('artwork-modal');
  modal.classList.add('hidden');
}

window.showArtworkModal = function(title, artistYear, room, desc, audioText) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-artist-year').textContent = artistYear;
  document.getElementById('modal-room').textContent = room;
  document.getElementById('modal-description').textContent = desc;
  currentAudioText = audioText;
  
  const modal = document.getElementById('artwork-modal');
  modal.classList.remove('hidden');
};

function teleportTo(x, z, roomName) {
  const cameraRig = document.querySelector('#cameraRig');
  if (cameraRig) {
    cameraRig.setAttribute('animation', {
      property: 'position',
      to: `${x} 0 ${z}`,
      dur: 800,
      easing: 'easeInOutCubic'
    });
  }
  const roomText = document.getElementById('current-room-text');
  if (roomText && roomName) {
    roomText.textContent = roomName;
  }
}

// =========================================================================
// 5. PANTALLA COMPLETA PERSONALITZADA (SERVEIX PER A TOTS ELS NAVEGADORS I CODEPEN)
// =========================================================================
function toggleFullscreen() {
  const container = document.getElementById('app-container') || document.documentElement;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Tancar modal en prémer la tecla ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeArtworkModal();
});
