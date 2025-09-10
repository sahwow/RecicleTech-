// animação de scroll para links 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
          });
          
          // atualiza navegação ativa
          document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
          this.classList.add('active');
      }
  });
});

// navegação
let timeout;
window.addEventListener('scroll', function() {
    // debounce para melhoria de performance
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100);
});

// interação do mapa
function inicializarMapa() {
    const mapa = L.map('mapa-placeholder').setView([-23.5505, -46.6333], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // marcadores de pontos de coleta (exemplo) 
    const locaisReciclagem = [
        { nome: "Ecoponto Parque Villa-Lobos", lat: -23.5440, lng: -46.7305 },
        { nome: "Ecoponto Shopping Center Norte", lat: -23.5110, lng: -46.6250 },
        { nome: "Posto de Coleta - Av. Paulista", lat: -23.5614, lng: -46.6560 },
        { nome: "Centro de Reciclagem - Zona Leste", lat: -23.5500, lng: -46.4830 },
        { nome: "Ecoponto - Praça da Sé", lat: -23.5503, lng: -46.6339 }
    ];
    
    // adiciona os marcadores
    locaisReciclagem.forEach(local => {
        L.marker([local.lat, local.lng])
            .addTo(mapa)
            .bindPopup(`<b>${local.nome}</b><br>Ponto de coleta de eletrônicos`);
    });
    
    return mapa;
}

// esconde o "loading" quando o mapa carregar
document.addEventListener('DOMContentLoaded', function() {
    const mapaContainer = document.getElementById('mapa-placeholder');
    const loadingElement = mapaContainer.querySelector('.mapa-carregando');
});

// inicializa o mapa quando carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const map = inicializarMapa();
    
    // ajusta o mapa quando a janela for redimensionada
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
});

// anima as barras do progresso 
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progresso');
  progressBars.forEach(bar => {
      const barPosition = bar.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if(barPosition < screenPosition) {
          bar.style.width = bar.style.width;
      }
  });
}

window.addEventListener('scroll', animateProgressBars);
// executa uma vez quando carregar a página
setTimeout(animateProgressBars, 500);