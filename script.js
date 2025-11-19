// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') {
            return;
        }

        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// FORM SUBMISSION
// ==========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !email || !mensagem) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        console.log('Formulário enviado:', {
            nome,
            email,
            mensagem
        });

        alert('Obrigado! Sua mensagem foi enviada com sucesso. Entrarei em contato em breve.');

        contactForm.reset();
    });
}

// ==========================================
// NAVBAR ACTIVE LINK HIGHLIGHTING
// ==========================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ==========================================
// ADD ACTIVE CLASS STYLING
// ==========================================

const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-blue);
        background-color: rgba(70, 130, 160, 0.2);
    }
`;
document.head.appendChild(style);

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 99;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseover', () => {
    scrollTopBtn.style.backgroundColor = '#343746';
    scrollTopBtn.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseout', () => {
    scrollTopBtn.style.backgroundColor = 'var(--primary-blue)';
    scrollTopBtn.style.transform = 'scale(1)';
});

// ==========================================
// ANIMATION ON SCROLL
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.tech-card, .aula-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%cTiago Segato - Clone', 'font-size: 20px; color: #4682A0; font-weight: bold;');
console.log('%cDesenvolvido com HTML5, CSS3 e JavaScript Puro', 'font-size: 12px; color: #666;');


// ==========================================
// GUIA.HTML SPECIFIC SCRIPTS
// ==========================================

// Função para alternar o acordeão (tool-card)
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.tool-card-icon');

    // Fecha todos os outros acordeões (opcional, mas mantém a página limpa)
    document.querySelectorAll('.tool-card-header').forEach(h => {
        if (h !== header && h.classList.contains('active')) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('open');
            h.querySelector('.tool-card-icon').style.transform = 'rotate(0deg)';
        }
    });

    // Abre/Fecha o acordeão clicado
    header.classList.toggle('active');
    content.classList.toggle('open');
    icon.style.transform = header.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
}

// Anexa event listeners para todos os cabeçalhos de acordeão
document.querySelectorAll('.tool-card-header').forEach(header => {
    header.addEventListener('click', function() {
        toggleAccordion(this);
    });
});

// Função para rolagem suave dos cards de navegação
document.querySelectorAll('.nav-cards-grid .nav-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Ajuste para o navbar fixo (70px)
            const offset = 70; 
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Adiciona o script para o botão "Voltar ao Topo" (Back to Top)
// Nota: O script original do index.html já tem um botão de scroll-to-top,
// mas o CSS e a lógica do guia.html são diferentes. Vamos usar a lógica
// do guia.html e o CSS que foi movido para styles.css.

// Criação do botão (se já não existir um com a mesma lógica)
if (!document.querySelector('.back-to-top')) {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(backToTopButton);

    window.onscroll = function() {
        // Usa document.documentElement.scrollTop para maior compatibilidade
        if (document.documentElement.scrollTop > 200) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
}
