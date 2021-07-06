$(document).ready(function () {
    createDATA();   // 저장용 local data 생성
    $('quizArea').each(function () {    // quizArea 확인
        var dType = $(this).data('type');   // quiz type
        if (dType.indexOf('multiple') >= 0) {           // 객관식
            setMultiple(this, dType.substring(dType.indexOf('_')+1, dType.length));
        } else if (dType.indexOf('short') >= 0) {       // 주관식 단답형
            setShort(this, dType.substring(dType.indexOf('_')+1, dType.length));
        } else if (dType.indexOf('hide') >= 0) {
            setHide(this, dType.substring(dType.indexOf('_')+1, dType.length));
        } else if (dType.indexOf('essay') >= 0) {       // 주관식
            setEssay(this, dType.substring(dType.indexOf('_')+1, dType.length));
        } else if (dType.indexOf('selection') >= 0) {   // 양자택일형
            setSelection(this, dType.substring(dType.indexOf('_')+1, dType.length));
        } else if (dType.indexOf('result') >= 0) {      // 결과, 채점
            setResult(this);
        } else {
            console.log("Err> data type: "+dType+", this element ->", $(this));
        }
    });
    
    $('.numberInput').bind('keypress', function (e) {   // 숫자만 입력 되도록
        var keycode = parseInt((e.keyCode ? e.keyCode : e.which));
        if (keycode < 48 || keycode > 57) {
            return false;
        }
    });

    $('input').add('textarea').bind("drop cut copy paste",function(e) { // 복사 붙여넣기 끌어넣기 잘라내기 방지
        e.preventDefault();
    });


	$("#g_replay").on('click', function (e) {	// 기존의 click event off 이후 새로 on
//		media_layer_open("../assets/video/"+event.target.id+".mp4");return false;
		alert('dd');
	});

    setTimeout(function () {
        findAllAnswer();    // 뷰어의 문제 전체를 찾기
        loadPrevDATA();     // data load, 로딩이 되기를 좀 기다렸다가(0.1초) 실행
    }, 100);
});

/**
 * 문제 풀라는 팝업
 */
function showSolveInfoPopup () {
    var popBackEl = document.createElement('div');  // background
    popBackEl.className = "popupBackground";
    popBackEl.style.zIndex = 9999;

    var popupEl = document.createElement('div');    // popup
    popupEl.className = "solveAlert";

    var okBtn = document.createElement('button');   // ok button
    okBtn.className = "okBtn";
    okBtn.style.border = "none";

    popupEl.appendChild(okBtn);
    popBackEl.appendChild(popupEl);

    $('body').append($(popBackEl));

    popupEl.style.top = (window.innerHeight - popupEl.clientHeight) / 2 + "px";
    popupEl.style.left = (window.innerWidth - popupEl.clientWidth) / 2 + "px";  // 정중앙 배치

    okBtn.onclick = function (e) {  // button click event
        $('.popupBackground').remove();
    };
}

/**
 * 문제 풀었는지 확인
 * @param {quizArea} target always quizArea
 */
function checkSolved (target) {
    if (target.find('.answerBtn').hasClass('replay')) { // 다시 풀기 버튼인 경우
        return true;
    }
    if (target.find('input').length > 0) {              // 객관식 & 주관식 단답형
        var check = false;
        target.find('input').each(function () {
            if (check) return;
            check = $(this).val() !== '';               // 한 문제라도 풀었다면 푼 것으로 간주
        });
        return check;
    } else if (target.find('textarea').length > 0) {    // 서술형
        return (target.find('textarea').val() !== '');
    } else if (target.find('.select').length > 0) {     // 양자택일형
        return target.find('.select').hasClass('on');
    } else {
        console.log("Err> cannot find input or textarea tag or div has select class, target -> ", target);
    }
}

/**
 * 문제 정오답 여부 표시 및 데이터 입력 불가 설정
 * @param {quizArea} target always quizArea
 * @param {boolean} isCorrect quiz is corrected
 */
function showAnswer(target, isCorrect) {
    target.find('.correctWindow').show();   // 표시 창 보이기
    target.find('correctResponse').show();  // 정답 보이기
    target.find('.correctWindow').removeClass('correct').removeClass('wrong');  // 기존 추가 된 class 제거
    if (Array.isArray(isCorrect)) { // selection
        target.find('selectArea').each(function (idx) {
            $this = $(this);
            isCorrect[idx] ? $this.find('.correctWindow').addClass('correct') : $this.find('.correctWindow').addClass('wrong'); // 배열 내용 각각 확인
        });
    } else {    // another
        isCorrect ? target.find('.correctWindow').addClass('correct') : target.find('.correctWindow').addClass('wrong');
    }
    inputDisable(target, true); // 정답 표시 후 입력 금지
}

/**
 * 문제 정오답 여부 숨김 및 입력 가능 설정
 * @param {quizArea} target always quizArea
 */
function hideAnswer(target) {
    target.find('.correctWindow').hide();   // 정답 표시창 숨기기
    target.find('correctResponse').hide();  // 정답 숨기기
	target.find('.select.on').removeClass('on');  // 입력한 정답 숨기기 181109 김영진 추가
    inputDisable(target, false);            // 입력 금지 해제

    inputClear(target);
	
	$('#replay').click();

}


function testHide() {
	//alert("aaa");
	//$('.btnReplay').click();
	
	$('#replay1').click();
	$('#replay2').click();

}


function globalHideAnswer() {	
	$('#replay').click();
}

function showAnswerHide(target) {

	if(!target.find('.hide').is(':hidden')){
		target.find('.hide').hide();		
	}else{
		target.find('.hide').show();
	}
    //target.find('hide').hide();
}

/**
 * 입력 못하게 막기용
 * @param {quizArea} target always quizArea
 * @param {boolean} isDisabled disabled : true, undisabled : false
 */
function inputClear(target) {
    //target = $target;
    //console.log("inputDisable ", target);
    if (target.data('type').indexOf('multiple') >= 0) {     // 객관식
        target.find('.exArea').children().each(function (idx) {
            $(this).data('disabled', isDisabled);
        });
    } else if (target.data('type').indexOf('short') >= 0) { // 단답형
        target.find('.numberInput').prop('value', "");
        target.find('.stringInput').prop('value', "");
    } else if (target.data('type').indexOf('essay') >= 0) { // 서술형
        target.find('textarea').prop('value', "");
    } else if (target.data('type').indexOf('selection') >= 0) { // 양자선택형
        target.find('.select').prop('checked', false);
    }
}

/**
 * 입력 못하게 막기용
 * @param {quizArea} target always quizArea
 * @param {boolean} isDisabled disabled : true, undisabled : false
 */
function inputDisable(target, isDisabled) {
    //target = $target;
    //console.log("inputDisable ", target);
    if (target.data('type').indexOf('multiple') >= 0) {     // 객관식
        target.find('.exArea').children().each(function (idx) {
            $(this).data('disabled', isDisabled);
        });
    } else if (target.data('type').indexOf('short') >= 0) { // 단답형
        target.find('.numberInput').prop('disabled', isDisabled);
        target.find('.stringInput').prop('disabled', isDisabled);
    } else if (target.data('type').indexOf('essay') >= 0) { // 서술형
        target.find('textarea').prop('disabled', isDisabled);
    } else if (target.data('type').indexOf('selection') >= 0) { // 양자선택형
        target.find('.select').prop('disabled', isDisabled);
    }
}

/**
 * 객관식 문제 설정
 * @param {object} target quizArea
 * @param {string} type multiple quiz type, now only 'a'
 */
function setMultiple(target, type) {
    target = $(target); // get jquery object
    target.find('input').each(function (idx) {
        $(this).data('idx', idx);   // input에 index data 부여
    });
    switch (type) {
        case 'a':
            target.find('.numberInput').prop('disabled', true);
            target.find('.exArea').children().each(function (idx) {         // 지문 영역 자식 노드 확인
                $(this).off('click');                                       // 기존 클릭 이벤트 삭제
                $(this).on('click', function (e) {                          // 클릭 이벤트 신규 등록
                    if ($(this).data('disabled')) {                         // 입력 불가 상태면 return
                        return;
                    }
                    $(this).parent().find('.on').remove();      // 기존 체크 표시 삭제
                    var chkEl = document.createElement('div');  // 선택한 답안 체크 표시 div 생성
                    chkEl.className = 'on';
                    $(this).append($(chkEl));
                    chkEl.style.top = ((this.clientHeight - chkEl.clientHeight) - (this.clientHeight / 2)) + 'px';
                    var inputEl = target.find('.numberInput');
                    inputEl.val($(this).attr('id'));    // 답안 표시 영역에 현재 선택한 답안의 보기 번호 입력, id가 보기 번호
                    saveDATA(inputEl);                  // 입력된 데이터 저장
                    checkCorrect(inputEl, 'multiple');  // 정답 확인
                });
            });
            target.find('.answerBtn').on('click', function (e) {    // 정답 보기 버튼 event listener
                answerBtnClickFunc(this, true, 'multiple');
            });
            break;
        default:
            console.log("Err> type is: "+type+", target quizArea ->", target);  // 예외처리, 이하 동일 동작 생략
            break;
    }
}



function setHide(target, type) {
	
    target = $(target);
    target.find('input').each(function (idx) {
        $(this).data('idx', idx);
    });
    switch (type) {
        case 'a':
            target.find('.numberInput').off('focusout').on('focusout', function() { saveDATA(this); checkCorrect(this, 'short'); });
            target.find('.stringInput').off('focusout').on('focusout', function() { saveDATA(this); checkCorrect(this, 'short'); });
            target.find('.answerBtn').on('click', function (e) {
                answerBtnClickFunc(this, true, 'hide');
            });
            break;
        default:
            console.log("Err> type is: "+type+", target quizArea ->", target);
            break;
    }
}


/**
 * 주관식 단답형 문제 설정
 * @param {object} target quizArea
 * @param {string} type 단답형 문제 유형, now only 'a'
 */
function setShort(target, type) {
    target = $(target);

	var sep = target.attr('name') + target.attr('id');

    target.find('input').each(function (idx) {  // input 객체에 index 설정
        $(this).data('idx', idx);

		$(this).val(getStorage(sep, sep+'_input'+$(this).data('idx')));
    });

    switch (type) {
        case 'a':
            // 포커스를 잃을 시 무조건 저장 & 정답 확인
            target.find('.numberInput').off('focusout').on('focusout', function() { saveDATA(this); checkCorrect(this, 'short'); });
            target.find('.stringInput').off('focusout').on('focusout', function() { saveDATA(this); checkCorrect(this, 'short'); });
            target.find('.answerBtn').on('click', function (e) {    // 정답 보기 버튼 event listener
                answerBtnClickFunc(this, true, 'short');
            });
            break;
        default:
            console.log("Err> type is: "+type+", target quizArea ->", target);
            break;
    }
}

/**
 * 서술형 문제 설정
 * @param {object} target quizArea
 * @param {string} type 역시나 현재는 'a' 하나만
 */
function setEssay(target, type) {
    target = $(target);
    target.find('textarea').each(function (idx) {
        $(this).data('idx', idx);   // 역시나 index
    });
    switch (type) {
        case 'a':
            target.find('textarea').off('focusout').on('focusout', function () {    // 포커스 아웃 시 무조건 저장
                saveDATA(this);
            });
            {   // button setting
                var aBtn = target.find('.answerBtn');   // 답안 보기 버튼
                var cBtn = document.createElement('button');    // create button element
                cBtn.className = "essayCorrectBtn";             // class 정답 버튼으로 설정
                cBtn.style.top = (parseInt(aBtn[0].style.top) - (48 - parseInt(aBtn[0].style.height))) + 'px';
                cBtn.style.left = (parseInt(aBtn[0].style.left) - 120 - 120 - 20) + 'px';
                cBtn.style.display = "none";                    // 위치 설정 및 display none
                var wBtn = document.createElement('button');
                wBtn.className = "essayWrongBtn";               // class 오답 버튼으로
                wBtn.style.top = (parseInt(aBtn[0].style.top) - (48 - parseInt(aBtn[0].style.height))) + 'px';
                wBtn.style.left = (parseInt(aBtn[0].style.left) - 120 - 10) + 'px';
                wBtn.style.display = "none";                    // 상동
                // answer image
                var aImg = document.createElement('img');       // 답은 이미지로 저장되어 있음
                var imgPos = target.find('data').data('pos').split(",");
                var imgSize = target.find('data').data('size').split(",");
                var imgSrc = target.find('data').data('src');
                aImg.className = "essayAnswer";
                aImg.style.top = imgPos[0] + "px";
                aImg.style.left = imgPos[1] + "px";
                aImg.style.width = imgSize[0] + "px";
                aImg.style.height = imgSize[1] + "px";
                aImg.style.zIndex = 999;
                aImg.src = imgSrc;
                aImg.style.display = "none";    // 이미지 위치,크기,경로 등 설정

                aBtn.parent().append($(wBtn));
                aBtn.parent().append($(cBtn));
                aBtn.parent().append($(aImg));

                $(cBtn).on('click', function () {   //맞음
                    checkCorrect(this, 'essay', true);      // 정답 처리
                    setEssayButtonVisible(target, false);   // 서술형은 버튼 관리 별도
                    showAnswer(target, checkNgetCorrected(target, true));   // 답 보이기
                });
                $(wBtn).on('click', function () {   //틀림
                    checkCorrect(this, 'essay', false);     // 오답 처리
                    setEssayButtonVisible(target, false);
                    showAnswer(target, checkNgetCorrected(target, true));
                });
            }
            target.find('.answerBtn').on('click', function (e) {    // 정답보기 버튼
                answerBtnClickFunc(this, true, 'essay');
            });
            break;
        default:
            console.log("Err> type is: "+type+", target quizArea ->", target);
            break;
    }
}

/**
 * 서술형 버튼 관리 함수
 * @param {object} target quizArea
 * @param {boolean} isVisible 버튼 가시 여부
 */
function setEssayButtonVisible (target, isVisible) {
    isVisible ? target.find('.essayCorrectBtn').show() : target.find('.essayCorrectBtn').hide();
    isVisible ? target.find('.essayWrongBtn').show() : target.find('.essayWrongBtn').hide();
    isVisible ? target.find('.essayAnswer').show() : target.find('.essayAnswer').hide();
    isVisible ? null : target.find('.answerBtn').removeClass('showAnswer').addClass('replay');
}

/**
 * 채점 및 전체 문제 정오답 표시
 * @param {object} target 
 */
function setResult(target) {
    target = $(target);

    target.find('.answerBtn').on('click', function (e) {    // 전체 채점하기 버튼 event listener
        var correctCnt = 0;                                 // 정답 개수
        var name = target.attr('name');                     // 해당 영역의 문제들을 갖고 오기 위한 이름
        var cnt = target.find('data').data('question-count');   // 전체 문제의 수
        var unitScore = target.find('data').data('unit-score'); // 모든 문제의 점수가 동일 하다는 전제 하 문제 하나당 점수
    
        for (var i=1; i<=cnt; i++) {    // 문제 전체 확인
            var sep = name+i;                           // 저장 데이터 확인을 위한 문제 구분자
            getCorrected(sep) ? correctCnt++ : null;    // 맞은 개수 확인
            setIsShow(sep, true);                       // 모든 문제 정답 보여주는 상태로 설정
        }
        console.log("correct count: "+correctCnt, "unit score: "+unitScore, "total score: "+correctCnt*unitScore);

        target.find('#count').val(correctCnt);              // 정답 개수 입력
        target.find('#score').val(correctCnt*unitScore);    // 채점 점수 입력

        showAllAnswer();    // 모든 문제 정오답 보여주기
    });
}

var allAnswerBtnArr = new Array();  // 모든 정답보기 버튼 get
/**
 * 뷰어에 존재하는 정답 보기 버튼 갖고 오기
 */
function findAllAnswer() {
	var g = window.parent;
    var gfs = $(g.document).find("iframe");
    
	for (var i=0; i<gfs.length; i++)
	{
		try{
			var answerBtnArr = $(gfs[i].contentWindow.document).find(".answerBtn");
			for (var j=0; j<answerBtnArr.length; j++)
			{
				findQuizArea(answerBtnArr[j]).data('type') === "result" ? null : allAnswerBtnArr.push(answerBtnArr[j]); // 결과 보기인 경우만 빼고 전부 push
			}
		}catch(err){
			console.log(err);
		}
	}
}
/**
 * 모든 문제 정오답 보여주기
 */
function showAllAnswer() {
    for (var i=0; i<allAnswerBtnArr.length; i++) {
        var $scope = findQuizArea(allAnswerBtnArr[i]);
        var sep = $scope.attr('name') + $scope.attr('id');                  // 문제 구분자
        //$(allAnswerBtnArr[i]).removeClass('showAnswer').addClass('replay'); // 다시 풀기로 버튼 모양 변경
        showAnswer($scope, getCorrected(sep));  // 정오답 표시
    }
}

/**
 * 답안 버튼을 누르는 경우 동작하는 function
 * @param {element} target target element
 * @param {boolean} force is force?
 * @param {string} type multiple, short, essay
 */
function answerBtnClickFunc (target, force, type) {
    //console.log("answerBtnClickFunc, target: ", target, " force: ", force, " type: ", type);
    var $scope = findQuizArea(target);

    if (force || checkSolved($scope)) { // 강제로 하거나 문제를 푼 경우
        switch (type) {
            case "multiple":
            case "short":
            case "selection":   // 객관식, 단답형, 양자선택형은 동일
                if ($(target).hasClass('showAnswer')) {     // 현재 정답 보기 버튼인 경우
                    showAnswer($scope, checkNgetCorrected(target, true));
                    //$(target).removeClass('showAnswer').addClass('replay');
                } else if ($(target).hasClass('replay')) {  // 현재 다시 풀기 버튼인 경우
                    hideAnswer($scope, checkNgetCorrected(target, false));
                    //$(target).removeClass('replay').addClass('showAnswer');
                }
                break;
            case "essay":       // 서술형
                if (force) {    // 강제라면 동작이 조금 다름
                    setEssayButtonVisible($scope, false);
                    showAnswer($scope, checkNgetCorrected(target, true));
                } else {
                    if ($(target).hasClass('showAnswer')) { // 현재 정답 보기
                        setEssayButtonVisible($scope, true);
                    } else if ($(target).hasClass('replay')) {  // 다시 풀기
                        hideAnswer($scope, checkNgetCorrected(target, false));
                        //$(target).removeClass('replay').addClass('showAnswer');
                    }
                }
                break;
                
                case "hide":
									showAnswerHide($scope);
                break;
            default:
                break;
        }
    } else {
        showSolveInfoPopup();   // 문제 풀라는 안내 팝업
    }
}

/**
 * 정답 여부 확인 및 해당 정보 저장
 * @param {element} target 정답인지 아닌지 확인할 문제의 답안 입력 공간 (input or textarea tag) 은 꼭 아니고 quizArea의 자식 객체면 됨
 * @param {string} type multiple or short or essay
 * @param {boolean} correct is correct? essay only
 */
function checkCorrect(target, type, correct) {
    var $scope = findQuizArea(target);  //quizArea
    if ($scope === null) {  // quizArea 가 없다면
        console.log("Err> cannot find quizArea, this element ->", target);
        return;
    }
    var isCorrect = true;
    switch (type) {
        case "multiple":
        case "short":
            $scope.find('input').each(function (idx) {
                // 정답 체크, 문제는 여러개의 가능성 존재하므로 전부 다 확인...
                var p = $(this).parent();       // qWrap
                var userAnswer = $(this).val(); // get input value
                var correctAnswer = p.find('correctResponse').text(); // get correct answer
                if (userAnswer !== correctAnswer) {
                    isCorrect = false;
                }
            });
            break;
        case "essay":
            isCorrect = correct;    // 서술형은 직접 전달 받음
            break;
        case "selection":
            isCorrect = new Array();    // 선택형은 여러개 존재 가능하므로 배열로 저장
            
            $scope.find('selectArea').each(function (idx) { // 선택 영역 수에 맞추어 확인
                $this = $(this);
                
                chkEl = $this.find('.select');   // 선택 객체 find
                
                console.log('chkEl: ', chkEl, ', data(correct): ', chkEl.data('correct'));
                // 보기를 선택했다면 그 보기의 정오답 여부를 push, 아니면 무조건 false push
				
                chkEl.length ? isCorrect.push(chkEl.data('correct')) : isCorrect.push(false);

				//chkEl.data('idx', idx);
                //saveDATA(chkEl);
                
            });
            break;
            
        case "hide":
            isCorrect = correct;
          	break;
            
        default:
            console.log("Err> type is: "+type+", this quizArea -> ", $scope);
            break;
    }
    setCorrected($scope.attr('name') + $scope.attr('id'), isCorrect);   // 정답 여부 local storage에 저장
}

// 2018. 5. 16, yonsei korean class
/**
 * 연세 어학당 요청으로 제작, 양자 선택형
 * @param {object} target quizArea
 * @param {string} type only 'a'
 */
function setSelection(target, type) {
    //console.log('setSelection, target: ', target, ', type: ', type);
    target = $(target);


	var sep = target.attr('name') + target.attr('id');
	

    target.find('.select').each(function (idx) {  // input 객체에 index 설정
        $(this).data('idx', idx);
		
		var val = getStorage(sep, sep + '_' + $(this).data('idx'));

		if(val){
			$(this).removeClass('select').removeClass('select on').addClass(val);
		}
    });

    target.find('.select').on('click', function (e) {   // 문제 보기 click event listener
        var $this = $(this);
        if ($this.prop('disabled')) return;     // 입력 불가면 return

        
		// 다른 select 클리어 저장
		target.find('.select').each(function (idx) {  
			saveStorage(sep, sep + '_' + idx, "select");
	    });

		$this.removeClass('on').addClass('on').siblings().removeClass('on');    // 현재꺼 빼고 나머진 선택 삭제

		saveStorage(sep, sep + '_' + $this.data('idx'), $this.attr("class"));

		//saveDATA(this);
    });
    switch (type) {
        case "a":
            target.find('.answerBtn').on('click', function (e) {    // 정답 보기 버튼
                checkCorrect(target, 'selection');
                answerBtnClickFunc(this, true, 'selection');
            });
            break;
        default:
            console.log("Err> type is: "+type+", target quizArea ->", target);
            break;
    }
}