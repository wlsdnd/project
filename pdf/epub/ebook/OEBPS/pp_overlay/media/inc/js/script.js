// playSound 정의
function playSound(url,loop) {
    $('audio').attr('loop',false);
    if (window.audioElem == undefined) {
        window.audioElem = document.createElement("audio");
        window.audioElem.style.visibility = "hidden";
        document.body.appendChild(window.audioElem);
    }
    window.audioElem.src = url;
    
    if (window.audioElem.play) {
       window.audioElem.play();
    }
};

/*모바일 체크*/
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }

};

$(document).ready(function(){
    if(isMobile.any()){
    }
});

