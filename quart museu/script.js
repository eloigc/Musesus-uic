window.ARTWORKS = {
  hokusai: {
    title: "La gran onada de Kanagawa",
    artistYear: "Katsushika Hokusai, 1831",
    room: "Sala 1 (Nord-Oest) - Ukiyo-e",
    techSheet: "La gran onada de Kanagawa (de la sèrie 36 vistes del Mont Fuji), Hokusai, 1831 (Ukiyo-e, Període Edo), Xilografia sobre paper.",
    description: "Aquesta gravadura mostra una onada gegant que amenaça uns pescadors que viatgen en barca. Al fons de la imatge, molt petit i serè, es veu el Mont Fuji, la muntanya sagrada del Japó. Hokusai utilitza el blau intens per transmetre la força incontrolable de la natura enfront de la petitesa humana.",
    discussion: "Quina sensació us transmet la forma de l'onada: por, energia o bellesa? Heu viscut mai una tempesta o un dia de mar fons que us hagi quedat gravat a la memòria?",
    audioText: "Escolteu la força del mar: una gran onada s'alça mentre el Mont Fuji roman immòbil al fons. Una xilografia tradicional que simbolitza la potència de la natura."
  },
  leonardo: {
    title: "Mona Lisa / La Gioconda",
    artistYear: "Leonardo da Vinci, c. 1503–1519",
    room: "Sala 2 (Nord-Est) - Renaixement",
    techSheet: "Retrat de Lisa Gherardini (Mona Lisa), Leonardo da Vinci, c. 1503–1519 (Renaixement italià), Oli sobre taula de xop.",
    description: "Aquest retrat mostra una dona de la ciutat de Florència anomenada Lisa. L'obra és famosa a tot el món pel seu somriure misteriós i pel fons de paisatge difuminat. Leonardo va utilitzar la tècnica del sfumato, que consisteix a barrejar les ombres amb molta suauesa perquè no es notin les línies del dibuix.",
    discussion: "Creieu que la dona de la pintura està somrient o està pensativa? Què us transmet la seva mirada? Si us haguessin de fer un retrat avui, quina expressió us agradaria posar?",
    audioText: "Mireu fixament els seus ulls i la seva boca: sembla que us estigui mirant a vosaltres? El seu somriure enigmàtic ha fascinat el món durant més de 500 anys."
  },
  vangogh: {
    title: "La nit estelada",
    artistYear: "Vincent van Gogh, 1889",
    room: "Sala 3 (Sud-Oest) - Postimpressionisme",
    techSheet: "La nit estelada, Vincent van Gogh, 1889 (Postimpressionisme), Oli sobre tela.",
    description: "Van Gogh va pintar aquesta escena nocturna des de la finestra de la seva habitació a l'asil de Saint-Rémy-de-Provence. El cel no és negre, sinó que està ple de remolins blaus i estrelles grogues brillants que semblen tenir vida pròpia. La pintura té una textura gruixuda i pinzellades molt enèrgiques.",
    discussion: "Com us agrada mirar el cel a la nit? Us recorda algun lloc tranquil o algun viatge del pastat? Els colors groc i blau intens us fan sentir calma o ganes de moure-us?",
    audioText: "Un cel nocturn vibrant de llum i moviment. Van Gogh va utilitzar pinzellades corbes i colors vius per expressar les meves emocions més profundes."
  },
  klimt: {
    title: "El petó (Der Kuss)",
    artistYear: "Gustav Klimt, 1907–1908",
    room: "Sala 4 (Sud-Est) - Modernisme / Art Nouveau",
    techSheet: "El petó (Der Kuss), Gustav Klimt, 1907–1908 (Modernisme / Art Nouveau vienès), Oli i fulla d'or sobre tela.",
    description: "Aquesta obra pertany al 'període daurat' de Klimt. Representa una parella abraçada sobre un prat de flors, envoltats per mantells decorats amb fulla d'or real i formes geomètriques. L'obra simbolitza l'amor, la unió afectiva i la tendresa humana.",
    discussion: "Fixeu-vos en els detalls daurats i les flors a terra. Quin sentiment us provoca aquesta abraçada? Quin color o metall associeu a les coses o records més valuosos de la vostra vida?",
    audioText: "Un fons daurat i brillant on dos amants s'abracen. Klimt combina l'or real amb la pintura per crear un símbol universal d'amor."
  }
};

window.currentAudioText = '';

window.reproduirAudioguia = function(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ca-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("El teu navegador no suporta la lectura per veu en directe.");
  }
};

window.openArtwork = function(id) {
  const art = window.ARTWORKS[id];
  if (!art) return;

  document.getElementById('modal-title').textContent = art.title;
  document.getElementById('modal-artist-year').textContent = art.artistYear;
  document.getElementById('modal-room').textContent = art.room;
  document.getElementById('modal-tech-sheet').textContent = art.techSheet;
  document.getElementById('modal-description').textContent = art.description;
  document.getElementById('modal-discussion').textContent = art.discussion;
  window.currentAudioText = art.audioText;

  const modal = document.getElementById('artwork-modal');
  modal.classList.remove('hidden');
};

window.closeArtworkModal = function() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  const modal = document.getElementById('artwork-modal');
  modal.classList.add('hidden');
};

window.teleportTo = function(x, z, roomName) {
  const cameraRig = document.querySelector('#cameraRig');
  if (cameraRig) {
    cameraRig.setAttribute('animation', {
      property: 'position',
      to: x + ' 0 ' + z,
      dur: 800,
      easing: 'easeInOutCubic'
    });
  }
  const roomText = document.getElementById('current-room-text');
  if (roomText && roomName) {
    roomText.textContent = roomName;
  }
  const badge = document.getElementById('minimap-room-badge');
  if (badge && roomName) {
    badge.textContent = roomName;
  }
};

// CÀLCUL EN TEMPS REAL DE LA POSICIÓ DEL VISITANT AL MINIMAPA
window.updateMinimapPointer = function() {
  const cameraRig = document.querySelector('#cameraRig');
  const pointer = document.getElementById('minimap-pointer');
  const badge = document.getElementById('minimap-room-badge');
  const roomText = document.getElementById('current-room-text');

  if (!cameraRig || !pointer) return;

  const pos = cameraRig.getAttribute('position');
  if (!pos) return;

  // Transformar la posició 3D (X: -20 a +20, Z: -15 a +15) a percentatges del minimapa SVG
  const leftPercent = Math.max(8, Math.min(92, 49 + (pos.x / 32) * 74));
  const topPercent = Math.max(12, Math.min(88, 52.8 + (pos.z / 21.5) * 63));

  pointer.style.left = leftPercent + '%';
  pointer.style.top = topPercent + '%';

  // Identificació automàtica de la sala segons la posició
  let roomName = "Hall d'Entrada";
  if (pos.x < -11) {
    roomName = "Hall d'Entrada";
  } else if (pos.x > 11) {
    roomName = "Sala Gran Final";
  } else if (pos.z > 7) {
    roomName = "Passadís de Sortida";
  } else if (pos.z < -3) {
    if (pos.x < 0) roomName = "Sala 1 (Hokusai)";
    else roomName = "Sala 2 (Leonardo)";
  } else {
    if (pos.x < 0) roomName = "Sala 3 (Van Gogh)";
    else roomName = "Sala 4 (Klimt)";
  }

  if (badge) badge.textContent = roomName;
  if (roomText) roomText.textContent = roomName;
};

window.toggleFullscreen = function() {
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
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeArtworkModal();
});
