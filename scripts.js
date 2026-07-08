document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Fetch and Routing
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navPlaceholder.innerHTML = data;
            let currentUrl = window.location.pathname.split('/').pop() || 'index.html';
            let navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentUrl) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
    }

    // 2. Viewport Scaling Logic (For Index and Artifact1)
    function fitToFrame() {
        const wrapper = document.getElementById('scale-wrapper') || document.getElementById('scale-container');
        if (!wrapper) return;

        const containerWidth = document.body.clientWidth || window.innerWidth;
        const isTimelineGraphic = document.getElementById('scale-container') !== null;
        
        // Use different base constraints based on which page is scaling
        const designWidth = isTimelineGraphic ? 1400 : 1200; 
        const designHeight = isTimelineGraphic ? 750 : 720;
        
        const scale = containerWidth / designWidth;
        wrapper.style.transform = `scale(${scale})`;
        
        if (!isTimelineGraphic) {
            document.body.style.height = `${designHeight * scale}px`;
        }
    }

    if (document.getElementById('scale-wrapper') || document.getElementById('scale-container')) {
        window.addEventListener('resize', fitToFrame);
        setTimeout(fitToFrame, 50);
        setTimeout(fitToFrame, 500);
    }

    // 3. Artifact Details Tab Logic
    window.openTab = function(evt, tabId) {
        const tabContent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].classList.remove("active");
        }

        const tabBtns = document.getElementsByClassName("tab-btn");
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].classList.remove("active");
        }

        document.getElementById(tabId).classList.add("active");
        evt.currentTarget.classList.add("active");
    };
});
