const carousel = () => {
    let position = 0
    let slidesToShow = 2
    const slidesToScroll = 1
    const container = document.querySelector('.slider__container')
    const track = document.querySelector('.slider__track')
    const items = document.querySelectorAll('.slider__testimonial')
    const nextBtn = document.querySelector('.buttons__next')
    const prevBtn = document.querySelector('.buttons__prev')
    const itemsCount = items.length
    let itemWidth = container.clientWidth / slidesToShow
    let movePosition = slidesToScroll * itemWidth

    function setMinWidth() {
        items.forEach((item) => {
            item.style.minWidth = `${itemWidth}px`
        })
    }

    setMinWidth()

    nextBtn.addEventListener('click', () => {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;
        position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth
        setPosition()
        checkBtns()
    })
    prevBtn.addEventListener('click', () => {
        const itemsLeft = Math.abs(position) / itemWidth;
        position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth
        setPosition()
        checkBtns()
    })

    const setPosition = () => {
        track.style.transform = `translateX(${position}px)`
    }

    function checkBtns() {
        prevBtn.disabled = !!(position === 0)
        nextBtn.disabled = position <= -(itemsCount - slidesToShow) * itemWidth
    }

    checkBtns()
    setNewData()
    
    function setNewData() {
        if (window.innerWidth < 769) {
            slidesToShow = 1
        } else {
            slidesToShow = 2
        }
        itemWidth = container.clientWidth / slidesToShow
        movePosition = slidesToScroll * itemWidth
        position = 0
        setPosition()
        setMinWidth()
    }
      
    window.addEventListener('resize', setNewData)
}

export default carousel