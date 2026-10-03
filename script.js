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

let calcScrollValue = ()=>{
    let scrollProgress = document.getElementById("progress");
    let pos = document.documentElement.scrollTop;

    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100)/calcHeight);
    
    if(pos > 100){
        scrollProgress.style.display = "grid";
    }else{
        scrollProgress.style.display = "none";
    }

    scrollProgress.addEventListener("click",()=>{
        document.documentElement.scrollTop = 0;
    });

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
    menuLi.forEach(sec => sec.classList.remove("active"));
    menuLi[len].classList.add("active");
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

ScrollReveal().reveal('.hero-info,.main-text,.proposal,.heading', { origin: "top" });
ScrollReveal().reveal('.about-img,.fillter-buttons,.contact-info', { origin: "left" });
ScrollReveal().reveal('.about-content,.skills', { origin: "right" });
ScrollReveal().reveal('.international-student,.student-img', { origin: "top" });
ScrollReveal().reveal('.allServices,.portfolio-gallery,.blog-box,footer,.img-hero', { origin: "bottom" });
ScrollReveal().reveal('.container', { origin: "bottom", interval: 200 });


    //preloader
var loader = document.getElementById("preloader");

window.addEventListener("load", function(){
    loader.classList.add("fade-out");

    setTimeout(() => {
        loader.style.display = "none";
    }, 600); 
});


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