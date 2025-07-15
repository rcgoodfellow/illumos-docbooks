/**
 * Minimal Scroll-Spy for illumos Documentation
 * Progressive enhancement - works without JavaScript, enhanced with it
 */

(function() {
  'use strict';
  
  // Feature detection
  if (!window.IntersectionObserver || !document.querySelector) {
    return;
  }
  
  // Add enhancement class to body
  document.body.classList.add('js-enabled');
  
  // Get all TOC links and headings
  const tocLinks = document.querySelectorAll('#toc a[href^="#"]');
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  
  if (!tocLinks.length || !headings.length) {
    return;
  }
  
  // Keep track of currently active section
  let currentActiveId = null;
  
  // Function to scroll TOC to show active item
  function scrollTocToActive(tocLink) {
    const toc = document.querySelector('#toc');
    if (!toc || !tocLink) return;
    
    // Get the TOC container bounds
    const tocRect = toc.getBoundingClientRect();
    const linkRect = tocLink.getBoundingClientRect();
    
    // Check if the link is outside the visible TOC area
    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
      // Calculate the scroll position to center the active item
      const tocScrollTop = toc.scrollTop;
      const linkOffsetFromToc = linkRect.top - tocRect.top + tocScrollTop;
      const targetScrollTop = linkOffsetFromToc - tocRect.height / 2;
      
      // Smooth scroll to the target position
      toc.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    // Find the topmost intersecting section
    const intersectingEntries = entries.filter(entry => entry.isIntersecting);
    
    if (intersectingEntries.length > 0) {
      // Sort by position on page (top to bottom)
      intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      
      const topEntry = intersectingEntries[0];
      const id = topEntry.target.id;
      const tocLink = document.querySelector(`#toc a[href="#${id}"]`);
      
      if (tocLink && currentActiveId !== id) {
        currentActiveId = id;
        
        // Remove active class from all TOC links
        tocLinks.forEach(link => link.classList.remove('active', 'active-parent'));
        
        // Add active class to current TOC link
        tocLink.classList.add('active');
        
        // Scroll TOC to show the active item (only if user isn't manually scrolling)
        setTimeout(() => scrollTocToActive(tocLink), 100);
        
        // Highlight parent sections for nested TOC
        let parentLi = tocLink.closest('li');
        while (parentLi && parentLi.parentElement) {
          const parentUl = parentLi.parentElement;
          const grandParentLi = parentUl.closest('li');
          if (grandParentLi) {
            const parentLink = grandParentLi.querySelector('a');
            if (parentLink && parentLink !== tocLink) {
              parentLink.classList.add('active-parent');
            }
          }
          parentLi = grandParentLi;
        }
      }
    }
  }, {
    // Trigger when heading is 20% visible
    threshold: 0.2,
    // Adjust margins for better detection - this means the top 20% and bottom 60% are ignored
    rootMargin: '-20% 0px -60% 0px'
  });
  
  // Observe all headings
  headings.forEach(heading => {
    observer.observe(heading);
  });
  
  // Handle manual TOC clicks
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all links
      tocLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Optional: prevent default and handle smooth scrolling manually
      // if you want more control over the scroll behavior
    });
  });
  
  // Handle browser back/forward navigation
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash;
    if (currentHash) {
      const currentTocLink = document.querySelector(`#toc a[href="${currentHash}"]`);
      if (currentTocLink) {
        tocLinks.forEach(link => link.classList.remove('active'));
        currentTocLink.classList.add('active');
        
        // Scroll TOC to show the active item
        setTimeout(() => scrollTocToActive(currentTocLink), 100);
      }
    }
  });
  
  // Set initial active state based on URL hash
  const initialHash = window.location.hash;
  if (initialHash) {
    const initialTocLink = document.querySelector(`#toc a[href="${initialHash}"]`);
    if (initialTocLink) {
      initialTocLink.classList.add('active');
      
      // Scroll TOC to show the active item on page load
      setTimeout(() => scrollTocToActive(initialTocLink), 500);
    }
  }
  
  // Make headings clickable for easy link sharing
  headings.forEach(heading => {
    heading.addEventListener('click', () => {
      // Update URL hash
      const newHash = `#${heading.id}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, null, newHash);
        
        // Update TOC active state
        tocLinks.forEach(link => link.classList.remove('active', 'active-parent'));
        const tocLink = document.querySelector(`#toc a[href="${newHash}"]`);
        if (tocLink) {
          tocLink.classList.add('active');
          
          // Scroll TOC to show the active item
          setTimeout(() => scrollTocToActive(tocLink), 100);
        }
      }
    });
  });
  
})();