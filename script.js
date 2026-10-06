// Tema: aplicado assim que o script carrega (ele fica no <head>),
// antes da página ser desenhada, para não piscar o tema errado.
(function () {
    try {
        const saved = localStorage.getItem('ts-theme');
        if (saved === 'light' || saved === 'dark') {
            document.documentElement.setAttribute('data-theme', saved);
        }
    } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Links para seções param logo abaixo do menu fixo
    // (a altura do menu muda conforme a largura da tela)
    const navbar = document.querySelector('.navbar');

    function updateScrollPadding() {
        root.style.scrollPaddingTop = navbar.offsetHeight + 'px';
    }

    updateScrollPadding();
    if ('ResizeObserver' in window) {
        new ResizeObserver(updateScrollPadding).observe(navbar);
    } else {
        window.addEventListener('resize', updateScrollPadding);
    }

    // Alternar tema claro/escuro (os ícones são trocados pelo CSS)
    document.getElementById('themeToggle').addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('ts-theme', next); } catch (e) {}
    });

    // Animação de entrada ao rolar a página
    const reveals = document.querySelectorAll('.reveal');

    // Ao terminar a animação as classes saem, para não interferirem
    // no hover e nas transições próprias de cada elemento.
    function finishReveal(element) {
        element.classList.remove('reveal', 'reveal-d1', 'reveal-d2', 'visible');
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach(finishReveal);
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const onEnd = (event) => {
                    if (event.target !== element || event.propertyName !== 'transform') return;
                    element.removeEventListener('transitionend', onEnd);
                    finishReveal(element);
                };

                element.addEventListener('transitionend', onEnd);
                element.classList.add('visible');
                observer.unobserve(element);
            });
        }, { threshold: 0.1 });

        reveals.forEach(element => observer.observe(element));
    }

    // Vídeos: a capa vira o player do YouTube só quando o visitante clica.
    // Sem JavaScript, a capa é um link normal para o vídeo no YouTube.
    let youtubeWarmedUp = false;

    function warmUpYouTube() {
        if (youtubeWarmedUp) return;
        youtubeWarmedUp = true;
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://www.youtube.com';
        document.head.appendChild(link);
    }

    document.querySelectorAll('.yt-facade').forEach(facade => {
        const thumb = facade.querySelector('img');

        // Vídeos sem miniatura em HD: cai para a miniatura padrão
        thumb.addEventListener('error', () => {
            thumb.src = thumb.src.replace('maxresdefault', 'hqdefault');
        }, { once: true });

        facade.addEventListener('pointerenter', warmUpYouTube, { once: true });
        facade.addEventListener('focus', warmUpYouTube, { once: true });

        facade.addEventListener('click', (event) => {
            event.preventDefault();

            const url = new URL(facade.dataset.embed);
            url.searchParams.set('autoplay', '1');

            const iframe = document.createElement('iframe');
            iframe.src = url.href;
            iframe.title = facade.getAttribute('aria-label');
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.allowFullscreen = true;

            facade.replaceWith(iframe);
            iframe.focus();
        });
    });

    // Linha do tempo (página Trajetória)
    const timeline = document.querySelector('.timeline');

    if (timeline) {
        const items = timeline.querySelectorAll('.tl-item');
        const filtros = document.querySelectorAll('.filtro');

        // O item em foco (o ponto mais perto do meio da tela) tem o ponto preenchido
        function updateTimeline() {
            const middle = window.innerHeight / 2;
            let closest = null;
            let closestDistance = Infinity;

            items.forEach(item => {
                if (!item.offsetParent) return; // escondido pelo filtro
                const marker = item.querySelector('.tl-marker').getBoundingClientRect();
                const distance = Math.abs(marker.top + marker.height / 2 - middle);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closest = item;
                }
            });

            items.forEach(item => item.classList.toggle('tl-foco', item === closest));
        }

        timeline.classList.add('tl-js');
        updateTimeline();
        window.addEventListener('scroll', updateTimeline, { passive: true });
        window.addEventListener('resize', updateTimeline);

        filtros.forEach(button => {
            button.addEventListener('click', () => {
                filtros.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
                timeline.dataset.filtro = button.dataset.filtro;
                updateTimeline();
            });
        });
    }

    // Filtro de cursos por tecnologia (página Cursos)
    const cursos = document.querySelectorAll('.aula-item[data-tecnologias]');

    if (cursos.length) {
        const filtros = document.querySelectorAll('.filtro');
        const vazio = document.querySelector('.cursos-vazio');

        filtros.forEach(button => {
            button.addEventListener('click', () => {
                const tecnologia = button.dataset.filtro;
                let ultimo = null;

                filtros.forEach(b => b.setAttribute('aria-pressed', String(b === button)));

                cursos.forEach(curso => {
                    const mostrar = tecnologia === 'todos' || curso.dataset.tecnologias.split(' ').includes(tecnologia);
                    curso.hidden = !mostrar;
                    curso.classList.remove('aula-ultima');
                    if (mostrar) ultimo = curso;
                });

                // O último curso visível fica sem a linha divisória embaixo
                if (ultimo) ultimo.classList.add('aula-ultima');
                vazio.hidden = ultimo !== null;
            });
        });
    }

    // Botão voltar ao topo
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function updateScrollTopBtn() {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }

    updateScrollTopBtn();
    window.addEventListener('scroll', updateScrollTopBtn, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
});
