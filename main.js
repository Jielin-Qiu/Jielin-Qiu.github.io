var mobileMenuBtn = document.querySelector("#mobile-menu-btn");
var mobileMenu = document.querySelector(".mobile-menu");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    if (mobileMenu.style.display === "none") {
      mobileMenu.style.display = "flex";
      mobileMenuBtn.innerHTML = "Close";
    } 
    else {
      mobileMenu.style.display = "none";
      mobileMenuBtn.innerHTML = "Menu";
    }
  });
}

// Publication Filtering Logic
let allPubs = [];

function initFiltering() {
    const container = document.getElementById('publications-container');
    if (container && allPubs.length === 0) {
        allPubs = Array.from(container.querySelectorAll('.pub-item'));
    }
    // Always run filterSelected to ensure UI is in correct state
    if (allPubs.length > 0) {
        filterSelected();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFiltering);
} else {
    initFiltering();
}

function clearContainer() {
    const container = document.getElementById('publications-container');
    container.innerHTML = '';
}

function updateActiveFilter(id) {
    document.querySelectorAll('.publication-filter a').forEach(a => a.classList.remove('active'));
    if (id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }
}

function scrollToPubs() {
    const container = document.getElementById('publications-container');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function filterSelected() {
    updateActiveFilter('filter-selected');
    document.getElementById('topic-menu').style.display = 'block';
    clearContainer();
    
    const container = document.getElementById('publications-container');
    allPubs.forEach(pub => {
        if (pub.getAttribute('data-selected') === 'true') {
            container.appendChild(pub.cloneNode(true));
            container.appendChild(document.createElement('br'));
        }
    });
}

function filterByDate() {
    updateActiveFilter('filter-date');
    document.getElementById('topic-menu').style.display = 'block';
    clearContainer();
    
    const container = document.getElementById('publications-container');
    // Sort by year descending
    const sortedPubs = [...allPubs].sort((a, b) => {
        return parseInt(b.getAttribute('data-year')) - parseInt(a.getAttribute('data-year'));
    });
    
    let currentYear = '';
    sortedPubs.forEach(pub => {
        const year = pub.getAttribute('data-year');
        if (year !== currentYear) {
            currentYear = year;
            const yearHeader = document.createElement('div');
            yearHeader.className = 'year-header';
            yearHeader.innerText = year;
            container.appendChild(yearHeader);
        }
        container.appendChild(pub.cloneNode(true));
        container.appendChild(document.createElement('br'));
    });
}

function filterByTopicMenu() {
    updateActiveFilter('filter-topic');
    const topicMenu = document.getElementById('topic-menu');
    topicMenu.style.display = 'block';
    
    // Reset topic menu active states
    document.querySelectorAll('.topic-menu a').forEach(a => a.classList.remove('active'));
    
    // Default to show all grouped by topic
    clearContainer();
    const container = document.getElementById('publications-container');
    const topics = ["Multimodal", "LLM Agent", "Healthcare", "Robustness", "Others"];
    
    topics.forEach(topic => {
        const topicPubs = allPubs.filter(pub => pub.getAttribute('data-topic') === topic);
        if (topicPubs.length > 0) {
            const topicHeader = document.createElement('div');
            topicHeader.className = 'topic-header';
            topicHeader.innerText = topic;
            container.appendChild(topicHeader);
            
            topicPubs.forEach(pub => {
                container.appendChild(pub.cloneNode(true));
                container.appendChild(document.createElement('br'));
            });
        }
    });
}

function filterByTopic(topic, event) {
    // Update active state in topic menu
    document.querySelectorAll('.topic-menu a').forEach(a => a.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    clearContainer();
    const container = document.getElementById('publications-container');
    
    const topicHeader = document.createElement('div');
    topicHeader.className = 'topic-header';
    topicHeader.innerText = topic;
    container.appendChild(topicHeader);
    
    const topicPubs = allPubs.filter(pub => pub.getAttribute('data-topic') === topic);
    if (topicPubs.length === 0) {
        const noPubs = document.createElement('p');
        noPubs.innerText = 'No papers in this category yet.';
        noPubs.style.padding = '20px';
        container.appendChild(noPubs);
    } else {
        topicPubs.forEach(pub => {
            container.appendChild(pub.cloneNode(true));
            container.appendChild(document.createElement('br'));
        });
    }
}
