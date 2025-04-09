document.addEventListener('DOMContentLoaded', function() {
    const megaMenuTriggers = document.querySelectorAll('.mega-menu-trigger');

    function closeAllMegaMenus() {
        megaMenuTriggers.forEach(trigger => {
            trigger.classList.remove('active');
        });
    }
 
    megaMenuTriggers.forEach(trigger => {
        const link = trigger.querySelector('a');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = trigger.classList.contains('active');
            
            closeAllMegaMenus();
            
            if (!isActive) {
                trigger.classList.add('active');
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mega-menu-trigger')) {
            closeAllMegaMenus();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMegaMenus();
        }
    });
});