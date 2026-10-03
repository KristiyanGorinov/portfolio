// active hamburger menu 
let menuIcon = document.querySelector(".menu-icon");
let navlist = document.querySelector(".navlist")
menuIcon.addEventListener("click",()=>{
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
});

// remove navlist
navlist.addEventListener("click",()=>{
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
})

// tapping the dimmed page behind the open menu closes it too
document.querySelector(".overlay").addEventListener("click",()=>{
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
})



// rotate text js code 
let text = document.querySelector(".text p");

text.innerHTML = text.innerHTML.split("").map((char,i)=>
    `<b style="transform:rotate(${i * 6.3}deg")>${char}</b>`
).join("");


// switch between about buttons 

const buttons = document.querySelectorAll('.about-btn button');
const contents = document.querySelectorAll('.content');

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    contents.forEach(content => content.style.display = 'none');
    contents[index].style.display = 'block';
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});



// portfolio fillter 

var mixer = mixitup('.portfolio-gallery',{
    selectors: {
        target: '.portfolio-box'
    },
    animation: {
        duration: 500
    }
});


// Initialize swiperjs 

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay:{
        delay:3000,
        disableOnInteraction:false,
    },

    breakpoints: {
        576:{
            slidesPerView:2,
            spaceBetween:10,
        },
        1200:{
            slidesPerView:3,
            spaceBetween:20,
        },
    }
  });
  
// Blog Swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay:{
    delay:3000,
    disableOnInteraction:false,
  },
  breakpoints: {
    576:{
      slidesPerView:2,
      spaceBetween:10,
    },
    1200:{
      slidesPerView:3,
      spaceBetween:20,
    },
  }
});



// About Swiper
var aboutSwiper = new Swiper(".aboutSwiper", {
  slidesPerView: 1,
  pagination: {
    el: ".aboutSwiper .swiper-pagination",
    clickable: true,
  },
  autoplay:{
    delay:4000,
    disableOnInteraction:false,
  }
});




//   skill Progress bar 

const first_skill = document.querySelector(".skill:first-child");
const sk_counters = document.querySelectorAll(".counter span");
const progress_bars = document.querySelectorAll(".skills svg circle");

window.addEventListener("scroll",()=>{
    if(!skillsPlayed)
    skillsCounter();
})


function hasReached(el){
    let topPosition = el.getBoundingClientRect().top;
    if(window.innerHeight >= topPosition + el.offsetHeight)return true;
    return false;
}

function updateCount(num,maxNum){
    let currentNum = +num.innerText;
    
    if(currentNum < maxNum){
        num.innerText = currentNum + 1;
        setTimeout(()=>{
            updateCount(num,maxNum)
        },12)
    }
}


let skillsPlayed = false;

function skillsCounter(){
    if(!hasReached(first_skill))return;
    skillsPlayed = true;
    sk_counters.forEach((counter,i)=>{
        let target = +counter.dataset.target;
        let strokeValue = 465 - 465 * (target / 100);

        progress_bars[i].style.setProperty("--target",strokeValue);

        setTimeout(()=>{
            updateCount(counter,target);
        },400)
    });

    progress_bars.forEach(p => p.style.animation = "progress 2s ease-in-out forwards");
}


// side progress bar 

let scrollProgress = document.getElementById("progress");
scrollProgress.addEventListener("click",()=>{
    document.documentElement.scrollTop = 0;
});

let calcScrollValue = ()=>{
    let pos = document.documentElement.scrollTop;

    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100)/calcHeight);
    
    if(pos > 100){
        scrollProgress.style.display = "grid";
    }else{
        scrollProgress.style.display = "none";
    }

    scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%,#e6006d ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;


// active menu 

let menuLi = document.querySelectorAll("header ul li a");
let section = document.querySelectorAll('section');

function activeMenu(){
    let len = section.length;
    while(--len && window.scrollY + 97 < section[len].offsetTop){}
    // match by id: not every section has its own menu item
    let current = document.querySelector('header ul li a[href="#' + section[len].id + '"]');
    if(!current) return;
    menuLi.forEach(sec => sec.classList.remove("active"));
    current.classList.add("active");
}
activeMenu();
window.addEventListener("scroll",activeMenu);

// scroll reveal

ScrollReveal({ 
    distance:"90px",
    duration:2000,
    delay:200,
    // reset: true ,
});

// the hero is revealed in hidePreloader, so its entrance isn't hidden behind the loader
ScrollReveal().reveal('.main-text,.proposal,.heading', { origin: "top" });
ScrollReveal().reveal('.about-img,.fillter-buttons,.contact-info', { origin: "left" });
ScrollReveal().reveal('.about-content,.skills', { origin: "right" });
ScrollReveal().reveal('.international-student,.student-img', { origin: "top" });
ScrollReveal().reveal('.portfolio-gallery,.blog-box,footer', { origin: "bottom" });
ScrollReveal().reveal('.container', { origin: "bottom", interval: 200 });
// service cards rise one after another; each icon ring turns once as its card arrives
ScrollReveal().reveal('.servicesItem', {
    origin: "bottom",
    interval: 150,
    beforeReveal: (card) => card.classList.add("in-view"),
});


// decorative shapes drift a little as their section scrolls past
let shapes = document.querySelectorAll('.about-img .showcase-ring img, .services .showcase img, .blog .showcase img');
let shapesQueued = false;

function driftShapes(){
    shapesQueued = false;
    shapes.forEach((shape, index) => {
        let home = shape.closest('section').getBoundingClientRect();
        if(home.bottom < 0 || home.top > window.innerHeight) return;
        // 0 when the section is centred on screen, about 1 when it is a full screen above the centre
        let passed = (window.innerHeight / 2 - (home.top + home.height / 2)) / window.innerHeight;
        // neighbouring shapes move in opposite directions and by different amounts
        let reach = (index % 2 ? -1 : 1) * (30 + (index % 3) * 20);
        shape.style.transform = 'translate3d(0,' + (passed * reach).toFixed(1) + 'px,0)';
    });
}

if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener("scroll",()=>{
        if(shapesQueued) return;
        shapesQueued = true;
        requestAnimationFrame(driftShapes);
    });
    driftShapes();
}


    //preloader: wait for the hero photo only, not for every image on the page
var loader = document.getElementById("preloader");

function hidePreloader(){
    if(loader.classList.contains("fade-out")) return;
    loader.classList.add("fade-out");
    document.body.classList.remove("loading");

    setTimeout(() => {
        loader.style.display = "none";
    }, 600); 

    // hero comes in as the loader clears: text line by line, then the photo
    ScrollReveal().reveal('.hero-info > *', { origin: "bottom", distance: "40px", interval: 150 });
    ScrollReveal().reveal('.img-hero', { origin: "bottom", delay: 500 });
    document.querySelector(".bg-icon").classList.add("in-view");
}

let heroImg = document.querySelector(".img-hero img");
if(heroImg.complete){
    hidePreloader();
}else{
    heroImg.addEventListener("load", hidePreloader);
    heroImg.addEventListener("error", hidePreloader);
}
window.addEventListener("load", hidePreloader);
setTimeout(hidePreloader, 4000); // never hold a slow connection hostage


// Student
const slides = document.querySelectorAll(".slide");
let current = 0;
let autoSlideInterval;
const intervalTime = 4000;

document.getElementById("next").addEventListener("click", () => {
  changeSlide(1);
  resetAutoSlide();
});


function changeSlide(direction) {
  const nextIndex = (current + direction + slides.length) % slides.length;

  slides.forEach(slide =>
    slide.classList.remove("active", "to-left", "from-right", "to-right", "from-left")
  );

  if (direction === 1) {
    slides[current].classList.add("to-left");
    slides[nextIndex].classList.add("from-right", "active");
  } else {
    slides[current].classList.add("to-right");
    slides[nextIndex].classList.add("from-left", "active");
  }

  current = nextIndex;
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => changeSlide(1), intervalTime);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

startAutoSlide();

// Mobile flag interaction
function toggleFlagInfo(flagElement) {
    // Check if it's a mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Close all other open flags first
        document.querySelectorAll('.flag-item.active').forEach(item => {
            if (item !== flagElement) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current flag
        flagElement.classList.toggle('active');
    }
}

// Close flags when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isFlag = e.target.closest('.flag-item');
        if (!isFlag) {
            document.querySelectorAll('.flag-item.active').forEach(flag => {
                flag.classList.remove('active');
            });
        }
    }
});

// Also update your existing flag hover JavaScript:
document.querySelectorAll('.flag-item').forEach(flag => {
    flag.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) { // Only on desktop
            flag.style.transform = 'translateY(-5px)';
        }
    });
    
    flag.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) { // Only on desktop
            flag.style.transform = 'translateY(0)';
        }
    });
});

// Notification system
function showNotification(type, title, message, duration = 4000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                hideNotification(notification);
            }
        }, duration);
    }
    
    return notification;
}

function hideNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

// Updated form submission handling
const contactForm = document.querySelector('#contact form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Show sending notification
    const sendingNotification = showNotification('info', 'Sending Message', 'Your message is being sent...', 0);
    
    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Remove sending notification
        hideNotification(sendingNotification);
        
        if (response.ok) {
            // Success notification
            showNotification('success', 'Message Sent!', 'Thank you! I\'ll get back to you soon.', 5000);
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Remove sending notification
        hideNotification(sendingNotification);
        
        // Error notification
        showNotification('error', 'Sending Failed', 'Please try again or email me directly at kris_gorinov@abv.bg', 6000);
        console.error('Form submission error:', error);
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});