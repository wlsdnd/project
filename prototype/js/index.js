$(function(){
    let countClass = 1
    let arrVal = [];
    let firstSize = $('.content img').height()
    $('.contentArea').css('height', firstSize+'px')
    $(window).resize(function (){
        let resize = $('.content img').height()
        $('.contentArea').css('height', resize+'px')
    })
    $('.agree').click(function(){
        $('.firstBox').hide()
        $('.slectBox').show()
        $('.item1').show()
        
        $('.content img').attr('src', 'img/img_02.jpeg')
    })
    $('.detail').click(function(){
        $('.policyView').stop().slideToggle()
    })
    $('.slectBox .item').click(function(){
        console.log('img/img_0'+countClass+'.jpeg')
        arrVal.push($(this).text())
        countClass++
        $('.selectItem').hide()
        $('.item'+countClass).show()
        $('.content img').attr('src', 'img/img_0'+(countClass+1)+'.jpeg')
        console.log(arrVal)
    })
    $('.complete').click(function(){
        alert('신청이 완료되었습니다. '+'선택 값 : '+arrVal.toString())
    })
})