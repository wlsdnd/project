$(function(){
    var swiper = new Swiper(".mySwiper", {
        direction: "vertical", // swiper 방향 (현재 수직)
        loop: true, // 무한반복 false시 다시 처음부터 올라감
        slidesPerView: 10, // 보여지는 갯수
        autoplay:{ // 시간 설정
            delay: 1500, // 1.5초
        }
    });
})