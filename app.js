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


// sistema de autenticação
let isRegistering = false;

// elementos do DOM
const authModal = document.getElementById('auth-modal');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');
const closeModal = document.querySelector('.close');
const authForm = document.getElementById('auth-form');
const authSwitch = document.getElementById('auth-switch');
const switchLink = document.getElementById(isRegistering ? 'switch-to-login' : 'switch-to-register');
const modalTitle = document.getElementById('modal-title');
const authSubmit = document.getElementById('auth-submit');
const confirmPasswordGroup = document.getElementById('confirm-password-group');
const userMenu = document.getElementById('user-menu');
const userEmail = document.getElementById('user-email');
const authButtons = document.querySelector('.auth-buttons');

// alterna entre login e registro
function toggleAuthMode() {
    isRegistering = !isRegistering;
    
    if (isRegistering) {
        modalTitle.textContent = 'Criar Conta';
        authSubmit.textContent = 'Registrar';
        authSwitch.innerHTML = 'Já tem uma conta? <a href="#" id="switch-to-login">Faça login</a>';
        confirmPasswordGroup.style.display = 'block';
        document.getElementById('confirm-password').setAttribute('required', 'true');
    } else {
        modalTitle.textContent = 'Entrar na RecicleTech';
        authSubmit.textContent = 'Entrar';
        authSwitch.innerHTML = 'Não tem uma conta? <a href="#" id="switch-to-register">Registre-se</a>';
        confirmPasswordGroup.style.display = 'none';
        document.getElementById('confirm-password').removeAttribute('required');
    }
    
    // reatachar event listeners aos novos links
    document.getElementById(isRegistering ? 'switch-to-login' : 'switch-to-register')
        .addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthMode();
        });
}

// abre modal
function openAuthModal() {
    authModal.style.display = 'block';
}
// fecha modal
function closeAuthModal() {
    authModal.style.display = 'none';
    // resetar formulário
    authForm.reset();
    //vVolta para modo de login
    if (isRegistering) {
        toggleAuthMode();
    }
}

// verifica se usuário está logado
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        // se "usuário logado" - mostra menu do usuário
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userEmail.textContent = user.email;
        
        // carrega dados do user para o painel
        loadUserData(user.email);
    } else {
        // ou "usuário não logado" - mostra botões de autentificação 
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// processar login/registro
function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isRegistering) {
        // modo de registro
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        // verificar se usuário já existe
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.email === email)) {
            alert('Este e-mail já está cadastrado!');
            return;
        }
        
        // criar novo usuário
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        // logar automaticamente
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        
        alert('Conta criada com sucesso!');
        closeAuthModal();
        checkAuth();
        
    } else {
        // modo de login
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({ email }));
            closeAuthModal();
            checkAuth();
        } else {
            alert('E-mail ou senha incorretos!');
        }
    }
}

// fazer logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    checkAuth();
}

// carrega dados do usuário para o painel
function loadUserData(email) {
    // simulação dos dados carregados 
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData[email]) {
        // dados iniciais para novos usuários
        userData[email] = {
            totalReciclado: 0,
            co2Evitado: 0,
            pontosVisitados: 0,
            contribuicoes: []
        };
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // atualiza o painel com os dados do usuário
    updateDashboard(userData[email]);
}
function updateDashboard(data) {
    document.querySelector('.estatistica-valor').textContent = `${data.totalReciclado} kg`;
}

// event listeners
document.addEventListener('DOMContentLoaded', function() {
    // verificar autenticação ao carregar a página
    checkAuth();
    
    // abrir modal ao clicar nos botões
    btnLogin.addEventListener('click', openAuthModal);
    btnRegister.addEventListener('click', function() {
        openAuthModal();
        if (!isRegistering) toggleAuthMode();
    });
    
    // fechar o modal
    closeModal.addEventListener('click', closeAuthModal);
    window.addEventListener('click', function(e) {
        if (e.target === authModal) closeAuthModal();
    });
    
    // alternar entre login/registro
    document.getElementById('switch-to-register').addEventListener('click', function(e) {
        e.preventDefault();
        toggleAuthMode();
    });
    
    // processar formulário
    authForm.addEventListener('submit', handleAuth);
    
    // logout
    btnLogout.addEventListener('click', handleLogout);
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
