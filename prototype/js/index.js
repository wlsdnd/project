$(function(){
    // 카운팅 준비
    let countClass = 1
    // 임시 배열
    let arrVal = [];
    // for문으로 이미지 로드 한 바퀴
    // 다음으로 넘어갈 때 이미지 로딩시간 단축
    // 이미지가 총 7장이라 7개입니다. 이미지가 늘어나면 수정해주세요.
    for(let img=1; img<=7; img++){
        $('.content img').attr('src', 'img/img_0'+img+'.jpeg')
    }
    // for문으로 7로 끝난 이미지 1로 변경
    $('.content img').attr('src', 'img/img_01.jpeg')
    // 이미지의 height 저장
    let firstSize = $('.content img').height()
    // contentArea height 값 재설정
    $('.contentArea').css('height', firstSize+'px')
    // contentArea 의 유동적 움직임을 위해 리사이즈시 height 변경
    $(window).resize(function (){
        let resize = $('.content img').height()
        $('.contentArea').css('height', resize+'px')
    })
    // 설문시작 클릭 시 이벤트
    $('.agree').click(function(){
        // 설문 선택 숨기고 설문지 노출
        $('.firstBox').hide() 
        $('.slectBox').show()
        $('.item1').show()
        // 설문지 그림 다음으로 변경
        $('.content img').attr('src', 'img/img_02.jpeg')
    })
    // 개인정보처리방침 자세히 보기 클릭 시 이벤트
    $('.detail').click(function(){
        // 자세히보기 콘텐츠 펼치고 닫기
        $('.policyView').stop().slideToggle()
    })
    // 설문 선택지 클릭 시 이벤트
    $('.slectBox .item').click(function(){
        // 임시로 만들어 둔 배열에 선택 값 담기
        arrVal.push($(this).text())
        // 카운팅
        countClass++
        // 선택한 현재 설문지 감추기
        $('.selectItem').hide()
        // 카운팅 한 숫자로 다음 설문지 노출
        $('.item'+countClass).show()
        // 카운팅 한 숫자로 설문지 그림 다음으로 변경
        $('.content img').attr('src', 'img/img_0'+(countClass+1)+'.jpeg')
    })
    // 완료
    $('.complete').click(function(){
        alert('신청이 완료되었습니다. '+'선택 값 : '+arrVal.toString())
    })
})