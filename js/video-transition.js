document.addEventListener('DOMContentLoaded', () => {
    const ANIMATION_DURATION = 4000;
    
    // On ne crée le conteneur de transition que si on est sur la page projet
    const isProjectPage = document.querySelector('.project-detail-page') !== null;
    
    if (isProjectPage) {
        const transitionContainer = document.createElement('div');
        transitionContainer.className = 'video-transition';
        
        const transitionImage = document.createElement('img');
        transitionImage.src = '../img/transition.gif';
        
        transitionContainer.appendChild(transitionImage);
        document.body.appendChild(transitionContainer);
        
        // Afficher la page projet
        const projectPage = document.querySelector('.project-detail-page');
        if (projectPage) {
            projectPage.classList.add('visible');
        }
        
        // Démarrer l'animation
        requestAnimationFrame(() => {
            transitionContainer.classList.add('active');
            
            // Supprimer le conteneur après la fin de l'animation
            setTimeout(() => {
                transitionContainer.remove();
            }, ANIMATION_DURATION + 500);
        });
    }
}); 