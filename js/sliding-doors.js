document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les images des portes soient chargées
    const doorLeft = new Image();
    const doorRight = new Image();
    let loadedImages = 0;

    function checkImagesLoaded() {
        loadedImages++;
        if (loadedImages === 2) {
            startDoorAnimation();
        }
    }

    doorLeft.onload = checkImagesLoaded;
    doorRight.onload = checkImagesLoaded;

    doorLeft.src = '../img/portegauche.webp';
    doorRight.src = '../img/portedroite.webp';

    function startDoorAnimation() {
        const doorsContainer = document.querySelector('.doors-container');
        
        // Petite pause avant de commencer l'animation
        setTimeout(() => {
            // Déclencher l'animation d'ouverture
            doorsContainer.classList.remove('doors-closed');
            doorsContainer.classList.add('doors-opening');
            
            // Ajouter la classe pour faire disparaître les portes
            setTimeout(() => {
                doorsContainer.classList.add('fade-out');
            }, 1800);
            
            // Supprimer le conteneur des portes après l'animation complète
            setTimeout(() => {
                doorsContainer.remove();
            }, 3000);
        }, 500);
    }
}); 