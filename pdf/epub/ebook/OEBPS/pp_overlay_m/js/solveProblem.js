/**
 * 데이터 저장 공간 설정
 */
function createDATA() {
    window.parent.localData = new Object() || {};
    
	if (window.parent.localData === undefined) {
        window.parent.localData = new Object();
    }

    $('quizArea').each(function () {
        var sep = $(this).attr('name') + $(this).attr('id');
        //window.parent.localData[sep] = new Object() || {};
        //window.parent.localData[sep].isCorrect = false || {};
        
		if (window.parent.localData[sep] === undefined) {
            window.parent.localData[sep] = new Object();
            window.parent.localData[sep].isCorrect = false;
        }
    });


	$('assessmentItem').each(function () {
        var sep = $(this).attr('data-qid');
        //window.parent.localData[sep] = new Object() || {};
        //window.parent.localData[sep].isCorrect = false || {};
        
		if (window.parent.localData[sep] === undefined) {
            window.parent.localData[sep] = new Object();
			window.parent.localData[sep].isCorrect = false;
        }
    });
}

/**
 * 해당 데이터 저장
 * @param {element} target input or textarea element
 */
function saveDATA(target) {
    var $scope = findQuizArea(target);
    if ($scope === null) {
        console.log("Err> cannot find quizArea, this element ->", target);
        return;
    }
    var sep = $scope.attr('name') + $scope.attr('id');
    target = $(target);
    var tName = target.prop('tagName');
    if (tName !== 'input' && tName !== 'textarea') {
        console.log("Err> cannot save this data, this element ->", target);
    //    return;
    }

    if (tName.indexOf("div")>=0) {       
		
    }
    else {
        saveStorage(sep, sep + '_' + tName + target.data('idx'), target.val());
    }

	saveDATALine();
}

function saveStorage(seq, id, value){
	try{
		//window.parent.localData[sep][id] = value;
		var url = window.location.href;
		url = url.replace(":","").replace("/","");
		var key = url+"_"+id;
		localStorage[key] = value;
	}catch(err){
		console.log(err);
	}
}

function getStorage(seq, id){
	var val2 = "";
	try{
		//var val1 = window.parent.localData[sep][id];

		var url = window.location.href;
		url = url.replace(":","").replace("/","");
		var key = url+"_"+id;
		val2 = localStorage[key];
		
	}catch(err){
		console.log(err);
	}

	return val2;
}

function setCorrected(sep, correct) {
	try{
	    window.parent.localData[sep].isCorrect = correct;
	}catch(e){}
}

function getCorrected(sep) {
    if (window.parent.localData[sep])
        return window.parent.localData[sep].isCorrect;
    else
        return false;
}

/**
 * 정답 보기 버튼을 누른 경우 호출
 * @param {string} sep 구분자
 * @param {boolean} isShow true: 정답 보기, false: 정답 보기 X
 */
function setIsShow(sep, isShow) {
	try{
		window.parent.localData[sep].checkAnswer = isShow;
	}catch(e){}
}

/**
 * 정답 보기 버튼을 누른건지 아닌지 확인
 * @param {string} sep 구분자
 * @return true: 눌림, false: 안눌림
 */
function getIsShow(sep) {
    return window.parent.localData[sep].checkAnswer;
}

/**
 * 정답 여부 return
 * @param {element} target 확인할 대상
 * @param {boolean} isShow 정답 확인 버튼인지 replay 인지
 * @return 정답이냐 아니냐
 */
function checkNgetCorrected(target, isShow) {
    var $scope = findQuizArea(target);
    var sep = $scope.attr('name') + $scope.attr('id');
    setIsShow(sep, isShow);

    return getCorrected(sep);
}


/**
 * 기존에 저장된 데이터가 있는지 확인 후 있으면 load
 */
function loadPrevDATA() {
    try {
        var d = window.parent.localData;
        $('quizArea').each(function () {
            var $scope = $(this);
            var sep = $(this).attr('name') + $(this).attr('id');
            var type = $(this).data('type');
            $scope.find('input').each(function (idx) {
                //console.log("this: ", $(this), "idx data: ", $(this).data('idx'));


				/*
				var _localData = getStorage(sep, sep+'_input'+$(this).data('idx'));

                if (_localData) {                    
					//$(this).val(_localData);

                    if (type.indexOf("multiple") >= 0) {
                        $scope.find('.exArea').find('#'+_localData).trigger('click');
                        //setTimeout(function () { $scope.find('.exArea').find('#'+d[sep][sep+'_input'+$(this).data('idx')]).trigger('click'); }, 50);
                    }
                }
				*/

				//localStorage
				/*
				var saveData = getL;
				var value = getStorage(sep, sep+'_input'+$(this).data('idx'));
				
				if (value) {                 					
					$(this).val(value);
                }
				*/

            });

            $scope.find('selectArea').each(function (idx) {
                //console.log("this: ", $(this), "idx data: ", $(this).data('idx'));
                if (d[sep][sep + '_input' + $(this).data('idx')]) {
                    $(this).val(d[sep][sep + '_input' + $(this).data('idx')]);

                    if (type.indexOf("multiple") >= 0) {
                        $scope.find('.exArea').find('#' + d[sep][sep + '_input' + $(this).data('idx')]).trigger('click');
                        //setTimeout(function () { $scope.find('.exArea').find('#'+d[sep][sep+'_input'+$(this).data('idx')]).trigger('click'); }, 50);
                    }
                }

                //var chkEl = $(this).find('.select');   // 선택 객체 find
                //chkEl.data('idx', idx);
                //chkEl.removeClass('select').removeClass('select on').addClass(claVal);


                var selectAradIdx = idx;

                $(this).find('.select').each(function (idx) {

                    var clsName = $(this).attr('class');

                    //var claVal = getStorage(sep, sep + '_div' + selectAradIdx);

                    //$(this).removeClass('select').removeClass('select on').addClass(claVal);
                    //$(this).removeClass('select').removeClass('select on').addClass(claVal);
                });


                /*
                $(this).find('div').each(function (idx) {

                    var clsName = $(this).attr('class');
                    if (clsName.indexOf("select") >= 0) {
                        var claVal = localStorage[sep + '_div' + $(this).data('idx')];

                        //$(this).removeClass('select').removeClass('select on').addClass(claVal);
                        $(this).removeClass('select').removeClass('select on').addClass(claVal);
                        
                    }
                });
                */


            });

            $(this).find('textarea').each(function (idx) {
                if (d[sep][sep+'_textarea'+$(this).data('idx')]) {
                    $(this).val(d[sep][sep+'_textarea'+$(this).data('idx')]);
                }

				//localStorage
				var valText = getStorage(sep, sep+'_textarea'+$(this).data('idx'));
				if (valText) {
                    $(this).val(valText);
                }
            });
            showSolvedAnswer(this);
        });



		$('assessmentItem').each(function () {

			var sep = $(this).attr('data-qid');
			
			var aaa = JSON.parse(getStorage(sep, sep));

			//aaa = aaa.replace("\"\"", "\"");

			//var aaa =  JSON.parse($.cookie(sep));

			if(sep.indexOf("line")>=0)
			{
				modDrawline.setStatus(aaa);
			}

			if(sep.indexOf("drag")>=0)
			{
				modDragdrop.setStatus(aaa);
			}

			//modDrawline.setStatus(localStorage[sep]);

			//modDrawline.setStatus(localStorage.getItem(sep));

			//modDrawline.setStatus(Storage.prototype.getObjec(sep));


		});

    } catch (e) {
        console.log(e);
    }
}

function saveDATALine() {
	$('assessmentItem').each(function () {
        var sep = $(this).attr('data-qid');       
	
		//var aaa = JSON.stringify(modDrawline.getStatus());
		//window.parent.localData[sep] = modDrawline.getStatus();

		//$("page023").data(sep, modDrawline.getStatus());

		var aaa = "";

		if(sep.indexOf("line")>=0)
		{
			aaa = JSON.stringify(modDrawline.getStatus());
		}

		if(sep.indexOf("drag")>=0)
		{
			aaa = JSON.stringify(modDragdrop.getStatus());
			
		}

		saveStorage(sep, sep, aaa);

		//$.cookie(sep, aaa);

		//bake_cookie(sep, aaa);

		

		//localStorage[sep] = modDrawline.getStatus();
		//localStorage.setItem(sep, modDrawline.getStatus());

		

    });
}

/**
 * 정답보기 버튼을 누른 경우 보여줄라고 만듦 & 답안 모두 보기에서도 써야 할 듯?
 * @param {element} target 대상
 */
function showSolvedAnswer(target) {
    var $scope = findQuizArea(target);
    var sep = $scope.attr('name') + $scope.attr('id');

    //console.log("target: ", target, " checkAnswer: ", window.parent.localData[sep].checkAnswer);
    if (getIsShow(sep)) {
        answerBtnClickFunc($scope.find(".answerBtn"), true, $scope.data('type').substring(0, $scope.data('type').indexOf('_')));
    }
}

/**
 * 해당 문제의 quizArea 찾기용
 * @param {element} target 확인할 대상
 * @return quizArea Object
 */
function findQuizArea (target) {
    target = $(target);
    if (target.prop('tagName') === 'quizArea') {
        return target;
    }

    var p = target.parent();

    while (p.prop('tagName') !== 'quizArea') {
        if (p.prop('tagName') === 'body') {
            return null;
        }
        p = p.parent();
    }

    return p;
}


