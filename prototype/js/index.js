$(function(){
    let countClass = 1
    let arrVal = []
    $('.agree').click(function(){
        $('.firstBox').hide()
        $('.slectBox').show()
        $('.item1').show()
        $('.area1').toggleClass('area1 area2')
    })
    $('.detail').click(function(){
        $('.policyView').stop().slideToggle()
    })
    $('.slectBox button').click(function(){
        arrVal.push($(this).text())
        countClass++
        $('.selectItem').hide()
        $('.item'+countClass).show()
        if($('.contentArea').hasClass('area'+countClass) && countClass<=6){
            $('.area'+countClass).addClass('area'+(countClass+1))
            $('.area'+countClass).toggleClass('area'+countClass)
        }else{
            alert('마지막임')
        }
        console.log(arrVal)
    })
})