// Shared features only run when the matching elements exist on the page.
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.navbar-toggler');
const navigation = document.querySelector('#navigation');
const mobileScreen = window.matchMedia('(max-width: 800px)');

if (menuButton && navigation) {
    function closeMenu() {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
    }

    menuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach((link) => {
        if (link.getAttribute('href') === document.body.dataset.page) {
            link.setAttribute('aria-current', 'page');
        }
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
            closeMenu();
            menuButton.focus();
        }
    });

    mobileScreen.addEventListener('change', closeMenu);
}

// Each carousel has its own controls. Slides change only when requested.
document.querySelectorAll('.carousel').forEach((carousel) => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const previous = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const status = carousel.querySelector('.carousel-status');
    let currentSlide = 0;

    if (!slides.length || !previous || !next || !status) return;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.hidden = i !== currentSlide;
        });
        status.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    previous.addEventListener('click', () => showSlide(currentSlide - 1));
    next.addEventListener('click', () => showSlide(currentSlide + 1));
    showSlide(0);
});

// Keep the original Friday promotion without changing any other slide.
const fridayImage = document.querySelector('[data-friday-image]');
if (fridayImage && new Date().getDay() === 5) {
    fridayImage.src = fridayImage.dataset.fridayImage;
    fridayImage.alt = 'Original Friday promotion: 10% off.';
}

const toTop = document.querySelector('.to-top');
if (toTop) {
    function updateTopLink() {
        toTop.classList.toggle('is-visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', updateTopLink, { passive: true });
    updateTopLink();
}
