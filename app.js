//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');
let countDom = document.querySelector('.carousel .slide-count');
let timelineDom = document.querySelector('.carousel .timeline');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeRunningCompact = 700; // phones and tablets use a short crossfade
let timeAutoNext = 7000;

// phones and tablets: same breakpoint as the crossfade layout in awards.css
let compactQuery = window.matchMedia('(max-width: 1200px)');
let totalSlides = thumbnailItemsDom.length;
let currentSlide = 0;

nextDom.onclick = function(){
    showSlider('next');
}

prevDom.onclick = function(){
    showSlider('prev');
}
let runTimeOut;
let runNextAuto;
let autoProgress;
let carouselOnScreen = true;

// steps > 1 jumps straight to a slide further away (year timeline)
// swiped: a finger already dragged the slide into place, so there is nothing left to fade in
function showSlider(type, steps = 1, swiped = false){
    // phones crossfade over the slide that is going away
    SliderDom.querySelectorAll('.leaving').forEach((item) => item.classList.remove('leaving'));
    let leavingDom = SliderDom.firstElementChild;
    if(!swiped) leavingDom.classList.add('leaving');

    for(let step = 0; step < steps; step++){
        if(type === 'next'){
            SliderDom.appendChild(SliderDom.firstElementChild);
            thumbnailBorderDom.appendChild(thumbnailBorderDom.firstElementChild);
        }else{
            SliderDom.prepend(SliderDom.lastElementChild);
            thumbnailBorderDom.prepend(thumbnailBorderDom.lastElementChild);
        }
    }
    carouselDom.classList.toggle('swiped', swiped);
    if(!swiped) carouselDom.classList.add(type);
    currentSlide = (currentSlide + (type === 'next' ? steps : totalSlides - steps)) % totalSlides;

    showCount();
    showTimeline();
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
        leavingDom.classList.remove('leaving');
    }, compactQuery.matches ? timeRunningCompact : timeRunning);

    startAutoNext();
}

function showCount(){
    let pad = (number) => String(number).padStart(2, '0');
    countDom.textContent = pad(currentSlide + 1) + ' / ' + pad(totalSlides);
}
showCount();

// year timeline: one stop per year, built from the years on the slides
let timelineYears = []; // { year, first slide of that year, how many slides }
SliderDom.querySelectorAll('.item .author').forEach((author, index) => {
    let year = author.textContent.trim().slice(0, 4);
    let last = timelineYears[timelineYears.length - 1];
    if(last && last.year === year){
        last.count++;
    }else{
        timelineYears.push({ year: year, first: index, count: 1 });
    }
});

timelineDom.style.setProperty('--years', timelineYears.length);
timelineDom.innerHTML = '<div class="track"><div class="fill"></div></div>' +
    timelineYears.map((entry) => `<button class="year" type="button" aria-label="Awards from ${entry.year}">${entry.year}</button>`).join('');
let timelineFillDom = timelineDom.querySelector('.fill');
let timelineButtonsDom = timelineDom.querySelectorAll('.year');

timelineButtonsDom.forEach((button, index) => {
    button.addEventListener('click', () => {
        if(carouselBusy()) return;
        let steps = (timelineYears[index].first - currentSlide + totalSlides) % totalSlides;
        if(steps) showSlider('next', steps);
    });
});

function showTimeline(){
    let yearIndex = timelineYears.findIndex((entry) => currentSlide < entry.first + entry.count);
    let entry = timelineYears[yearIndex];
    // the line creeps towards the next year with every award inside the current one
    let progress = yearIndex + (currentSlide - entry.first) / entry.count;
    timelineFillDom.style.transform = 'scaleX(' + Math.min(progress / Math.max(timelineYears.length - 1, 1), 1) + ')';
    timelineButtonsDom.forEach((button, index) => {
        button.classList.toggle('past', index < yearIndex);
        button.classList.toggle('current', index === yearIndex);
    });
}
showTimeline();

// auto slide, paused while the carousel is scrolled away or the tab is in the background
function stopAutoNext(){
    clearTimeout(runNextAuto);
    if(autoProgress) autoProgress.cancel();
}

function startAutoNext(){
    stopAutoNext();
    if(!carouselOnScreen || document.hidden) return;

    runNextAuto = setTimeout(() => {
        showSlider('next');
    }, timeAutoNext);

    // phones and tablets: the bar under the header fills up until the next slide
    if(compactQuery.matches && timeDom.animate){
        autoProgress = timeDom.animate(
            [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
            { duration: timeAutoNext, easing: 'linear' }
        );
    }
}
startAutoNext();

if('IntersectionObserver' in window){
    new IntersectionObserver((entries) => {
        carouselOnScreen = entries[0].isIntersecting;
        startAutoNext();
    }, { threshold: 0.25 }).observe(carouselDom);
}
document.addEventListener('visibilitychange', startAutoNext);

// touch: on phones and tablets the slide follows the finger, bigger touch screens just swipe
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let dragState = ''; // '' -> 'pending' -> 'dragging' -> 'settling'
let dragWidth = 0;

function carouselBusy(){
    return carouselDom.classList.contains('next') || carouselDom.classList.contains('prev') || dragState === 'settling';
}

carouselDom.addEventListener('touchstart', (e) => {
    if(dragState === 'settling') return;
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    touchStartTime = e.timeStamp;
    dragWidth = carouselDom.offsetWidth;
    dragState = e.touches.length === 1 && !carouselBusy() ? 'pending' : '';
}, { passive: true });

carouselDom.addEventListener('touchmove', (e) => {
    if(!compactQuery.matches || (dragState !== 'pending' && dragState !== 'dragging')) return;
    let moveX = e.changedTouches[0].clientX - touchStartX;
    let moveY = e.changedTouches[0].clientY - touchStartY;

    if(dragState === 'pending'){
        if(Math.abs(moveX) < 8 && Math.abs(moveY) < 8) return;
        if(Math.abs(moveX) <= Math.abs(moveY)){
            dragState = ''; // vertical: leave it to the page scroll
            return;
        }
        dragState = 'dragging';
        carouselDom.classList.add('dragging');
        stopAutoNext();
    }
    carouselDom.style.setProperty('--drag', moveX + 'px');
}, { passive: true });

function endTouch(e){
    let moveX = e.changedTouches[0].clientX - touchStartX;
    let moveY = e.changedTouches[0].clientY - touchStartY;

    if(dragState === 'dragging'){
        // far enough, or a quick flick: go to the neighbour, otherwise slide back
        let flick = Math.abs(moveX) > 30 && Math.abs(moveX) / Math.max(e.timeStamp - touchStartTime, 1) > 0.5;
        let type = '';
        if(e.type !== 'touchcancel' && (Math.abs(moveX) > dragWidth * 0.25 || flick)){
            type = moveX < 0 ? 'next' : 'prev';
        }

        dragState = 'settling';
        carouselDom.classList.add('settling');
        carouselDom.style.setProperty('--drag', (type === 'next' ? -dragWidth : type === 'prev' ? dragWidth : 0) + 'px');

        setTimeout(() => {
            carouselDom.classList.remove('dragging');
            carouselDom.classList.remove('settling');
            carouselDom.style.removeProperty('--drag');
            dragState = '';
            if(type){
                showSlider(type, 1, true);
            }else{
                startAutoNext();
            }
        }, 300);
        return;
    }

    if(dragState === 'pending' && !compactQuery.matches && e.type !== 'touchcancel'){
        if(Math.abs(moveX) >= 50 && Math.abs(moveX) >= Math.abs(moveY) * 1.5){
            showSlider(moveX < 0 ? 'next' : 'prev');
        }
    }
    dragState = '';
}
carouselDom.addEventListener('touchend', endTouch, { passive: true });
carouselDom.addEventListener('touchcancel', endTouch, { passive: true });


// the phone and tablet layouts position the slide below the fixed header
let headerDom = document.querySelector('header');
function setHeaderHeight(){
    document.documentElement.style.setProperty('--header-h', headerDom.offsetHeight + 'px');
}
setHeaderHeight();
if('ResizeObserver' in window){
    new ResizeObserver(setHeaderHeight).observe(headerDom);
}else{
    window.addEventListener('resize', setHeaderHeight);
}


// active hamburger menu
let menuIcon = document.querySelector(".menu-icon");
let navlist = document.querySelector(".navlist");
let overlay = document.querySelector(".overlay");

function closeMenu(){
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
}
menuIcon.addEventListener("click",()=>{
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
});
navlist.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);


// preloader: wait for the first slide only, not for every image on the page
var loader = document.getElementById("preloader");

function hidePreloader(){
    if(loader.classList.contains("fade-out")) return;
    loader.classList.add("fade-out");
    document.body.classList.remove("loading");

    setTimeout(() => {
        loader.style.display = "none";
    }, 600);
}

let firstSlideImg = SliderDom.querySelector('.item img');
if(firstSlideImg.complete){
    hidePreloader();
}else{
    firstSlideImg.addEventListener("load", hidePreloader);
    firstSlideImg.addEventListener("error", hidePreloader);
}
window.addEventListener("load", hidePreloader);
setTimeout(hidePreloader, 4000); // never hold a slow connection hostage


// fade up on scroll (stat strip and certificates)
let revealObserver = null;
if('IntersectionObserver' in window){
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -40px 0px' });
}

function revealOnScroll(element){
    if(!revealObserver) return;
    element.classList.add('reveal');
    revealObserver.observe(element);
}

let certificates = Array.from(document.querySelectorAll('.dream img'));
certificates.forEach(revealOnScroll);


// stat strip: the numbers come from the page itself and count up when it scrolls into view
let statsDom = document.querySelector('.stats');
let statNumbers = {
    awards: totalSlides,
    certificates: certificates.length,
    years: Number(timelineYears[timelineYears.length - 1].year) - Number(timelineYears[0].year),
};

function countUp(numberDom, target){
    let startTime = performance.now();
    let duration = 2000;

    function frame(now){
        let progress = Math.min((now - startTime) / duration, 1);
        numberDom.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if(progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

revealOnScroll(statsDom);
statsDom.querySelectorAll('.number').forEach((numberDom) => {
    numberDom.textContent = 'IntersectionObserver' in window ? 0 : statNumbers[numberDom.dataset.stat];
});
if('IntersectionObserver' in window){
    let statsObserver = new IntersectionObserver((entries) => {
        if(!entries[0].isIntersecting) return;
        statsObserver.disconnect();
        statsDom.querySelectorAll('.number').forEach((numberDom) => {
            countUp(numberDom, statNumbers[numberDom.dataset.stat]);
        });
    }, { threshold: 0.4 });
    statsObserver.observe(statsDom);
}


// certificate filters: whatever stays glides to its new place, whatever joins grows in
let filterButtons = document.querySelectorAll('.cert-filters button');

function shownCertificates(){
    return certificates.filter((certificate) => !certificate.classList.contains('filtered-out'));
}

function filterCertificates(category){
    // from here on the filter does the animating, not the scroll reveal
    certificates.forEach((certificate) => {
        certificate.classList.remove('reveal');
        certificate.classList.remove('is-visible');
        if(revealObserver) revealObserver.unobserve(certificate);
    });

    let placeBefore = new Map();
    shownCertificates().forEach((certificate) => {
        placeBefore.set(certificate, certificate.getBoundingClientRect());
    });

    certificates.forEach((certificate) => {
        let match = category === 'all' || certificate.dataset.category === category;
        certificate.classList.toggle('filtered-out', !match);
    });

    shownCertificates().forEach((certificate) => {
        if(!certificate.animate) return;
        let place = certificate.getBoundingClientRect();
        let before = placeBefore.get(certificate);
        let frames = before
            ? [{ transform: `translate(${before.left - place.left}px, ${before.top - place.top}px)` }, { transform: 'none' }]
            : [{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }];
        certificate.animate(frames, { duration: 800, easing: 'cubic-bezier(.2,.7,.2,1)' });
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if(button.classList.contains('active')) return;
        filterButtons.forEach((other) => other.classList.toggle('active', other === button));
        filterCertificates(button.dataset.filter);
    });
});


// certificate zoom, with previous / next through the certificates currently shown
let lightbox = document.getElementById('lightbox');
let lightboxImg = lightbox.querySelector('img');
let lightboxCountDom = lightbox.querySelector('.lightbox-count');
let lightboxList = [];
let lightboxIndex = 0;

function showInLightbox(index, direction = 0){
    lightboxIndex = (index + lightboxList.length) % lightboxList.length;
    let certificate = lightboxList[lightboxIndex];

    // show what is already loaded, then swap in the sharp version
    lightboxImg.src = certificate.currentSrc || certificate.src;
    let full = new Image();
    full.onload = () => {
        if(lightbox.dataset.showing === certificate.dataset.full) lightboxImg.src = full.src;
    };
    lightbox.dataset.showing = certificate.dataset.full;
    full.src = certificate.dataset.full;

    lightboxCountDom.textContent = (lightboxIndex + 1) + ' / ' + lightboxList.length;
    if(direction && lightboxImg.animate){
        lightboxImg.animate(
            [{ opacity: 0, transform: `translateX(${direction * 40}px)` }, { opacity: 1, transform: 'none' }],
            { duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
    }
}

function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.dataset.showing = '';
}

certificates.forEach((certificate) => {
    certificate.addEventListener('click', () => {
        lightboxList = shownCertificates();
        showInLightbox(lightboxList.indexOf(certificate));
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    });
});

lightbox.addEventListener('click', (e) => {
    if(e.target.closest('.lightbox-pager')) return;
    closeLightbox();
});
document.getElementById('lightbox-prev').addEventListener('click', () => showInLightbox(lightboxIndex - 1, -1));
document.getElementById('lightbox-next').addEventListener('click', () => showInLightbox(lightboxIndex + 1, 1));

document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showInLightbox(lightboxIndex - 1, -1);
    if(e.key === 'ArrowRight') showInLightbox(lightboxIndex + 1, 1);
});

// swipe between certificates (not while pinch-zoomed in)
let lightboxTouchX = 0;
lightbox.addEventListener('touchstart', (e) => {
    lightboxTouchX = e.changedTouches[0].clientX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
    let moveX = e.changedTouches[0].clientX - lightboxTouchX;
    let zoomedIn = window.visualViewport && window.visualViewport.scale > 1.05;
    if(Math.abs(moveX) < 50 || zoomedIn) return;
    showInLightbox(lightboxIndex + (moveX < 0 ? 1 : -1), moveX < 0 ? 1 : -1);
}, { passive: true });
