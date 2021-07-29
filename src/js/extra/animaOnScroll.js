const animationOnScroll = () => {
    const animItems = document.querySelectorAll('.animation-on-scroll');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);
        
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight; 
                // высоты объекта
                const animItemOffset = offset(animItem).top; 
                // позиция объекта относительно верха
                const animStart = 4; 
                // коэффицента старта анимации (после прохождения скроллом 1/4 анимации)
    
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }
    
                if (pageYOffset > (animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('activate-animation');
                } else {
                    if (!animItem.classList.contains('animate-once')) {
                        animItem.classList.remove('activate-animation');
                    }
                }
            }
        }




        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }
    
        // setTimeout(() => {
        //     animOnScroll();
        // }, 3000);
    }


}

export default animationOnScroll