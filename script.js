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
