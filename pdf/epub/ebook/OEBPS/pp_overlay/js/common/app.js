// 모바일 지원 드래그 앤 드랍 & 선그리기
// 라이브러리 이용 : jquery-3.3.1.min.js, jquery-ui.min.js, jquery.ui.touch-punch.min.js

// 선 모양 설정
var line_normal = { strokeStyle: 'blue', lineWidth: 4, lineCap: 'round' };
var line_answer = { strokeStyle: 'red', lineWidth: 4, lineCap: 'round' };

// 초기화
var modDragdrop;
var modDrawline;
$(document).ready(function () {
        // 드래그 앤 드랍 모듈
        modDragdrop = new mod_dragdrop();
        modDragdrop.init();

        // 선 그리기 모듈
        modDrawline = new mod_drawline();
        modDrawline.init();
});

// 모듈 : 드래그 드랍
var mod_dragdrop = function () {

        ///// variables

        // reference
        var _this; // 클래스

        // object
        var _dragBox; // dragBox 딕셔너리 [drag_num] 으로 접근
        var _dropBox; // dropBox 딕셔... 상동





        ///// function
        return {

                ///// initialize

                // 초기화
            init: function () {
                var drg = $('.dragBox');
                if (drg.length == 0) {
                    return;
                }
                        // 참조 연결
                        _this = this;

                        // 초기화
                        _dragBox = {};
                        _dropBox = {};

                        // ID 설정
                        $('.dragBox').each(function () {
                                // 기준 엘리먼트 검색(상위의 assessmentItem. 여기의 data-qid 가 이 모듈의 ID 가 됨)
                                var ele_base = $(this).closest("assessmentItem")[0];
                                this.modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");
                                this.drag_num = $(this).data("drag");
                                _dragBox[this.drag_num] = this;
                        });
                        $('.dropBox').each(function () {
                                var ele_base = $(this).closest("assessmentItem")[0];
                                this.modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");
                                this.drop_num = $(this).data("drop");
                                _dropBox[this.drop_num] = this;
                        });
                        // 버튼은 data-target 으로 귀속되는 모듈을 찾음
                        $('.resetDrag').each(function () { this.modid = ($(this).data("target") == null) ? "onlyone" : $(this).data("target"); });

                        // 드래그 엘리먼트 : dragBox 클래스로 지정
                        $('.dragBox').draggable({
                                // 헬퍼 클론 생성(이하 헬퍼)
                                helper: "clone",

                                // 드래그 시작 이벤트
                                start: function (event, ui) {
                                        // 준비
                                        var ele_helper = ui.helper;

                                        // 클론 클래스 추가
                                        $(ui.helper).addClass("clone");
                                }
                        });

                        // 드랍 엘리먼트 : dropBox 클래스로 지정
                        $('.dropBox').droppable({
                                // 드랍 이벤트
                                drop: function (event, ui) {
                                        // 준비
                                        var ele_drop = event.target; // dropBox
                                        var ele_drag = ui.draggable[0]; // dragBox

                                        // 조건검사
                                        if (ele_drop.modid != ele_drag.modid) { return; }

                                        // 같은 droppable 을 갖는 클론 제거
                                        $('.clone').each(function () {
                                                // 조건검사
                                                if (this.modid == ele_drop.modid && this.drop_num == ele_drop.drop_num) { this.parentNode.removeChild(this); }
                                        });

                                        // 클론
                                        var ele_clone = ele_drag.cloneNode(true); // 생성
                                        ele_drop.parentElement.appendChild(ele_clone); // 붙이기
                                        $(ele_clone).addClass("clone"); // 클래스 추가
                                        $(ele_clone).addClass("offDrag");
                                        ele_clone.style.left = ele_drop.offsetLeft + "px"; // 위치
                                        ele_clone.style.top = ele_drop.offsetTop + "px";
                                        ele_clone.modid = ele_drop.modid; // modid 지정
                                        ele_clone.drag_num = ele_drag.drag_num; // drag_num
                                        ele_clone.drop_num = ele_drop.drop_num; // drop_num

										saveDATALine();
                                }
                        });

                        ///// 리셋 버튼
                        $('.resetDrag').click(function () { _this.onReset(this.modid) });
                },

                // 리셋
                onReset: function (id_mod) {
                        // 해당 ID 의 클론 엘리먼트 제거
                        $('.clone').each(function () { if (this.modid == id_mod) { this.parentNode.removeChild(this); } });
                },

                // 외부 접근 메서드
                getBtn: function (str_type, str_modid) { // 버튼 전달
                        // 준비
                        var modid = (str_modid == null) ? "onlyone" : str_modid;
                        var ref = "";

                        // 타입
                        switch (str_type) {
                                case "reset": ref = ".resetDrag"; break;
                        }

                        // 검색과 반환
                        var rtn;
                        $(ref).each(function () {
                                // 조건검사
                                if (this.modid != modid) { return; }

                                // 반환
                                rtn = this;
                        });

                        // 반환
                        return rtn;
                },
                callFunction: function (str_type, str_modid) {
                        // 준비
                        var modid = (str_modid == null) ? "onlyone" : str_modid;

                        // 분기
                        switch (str_type) {
                                case "reset": _this.onReset(modid); break;
                        }
                },
                getStatus: function () { // 상태 저장
                        // 준비
                        var rtn;
                        var target = $(document).find('.clone');
                        
                        // 정보 가공
                        for (var ii = 0 ; ii < target.length ; ii++) {
                                // 반환 배열 초기화
                                if (rtn == null) { rtn = []; }

                                // 준비
                                var ele = target[ii];
                                var obj = {};

                                // 정보 입력
                                obj.left = ele.offsetLeft;
                                obj.top = ele.offsetTop;
                                obj.modid = ele.modid;
                                obj.drag_num = ele.drag_num;
                                obj.drop_num = ele.drop_num;
                                
                                // 삽입
                                rtn.push(obj);
                        }
                        
                        // 반환
                        return rtn;
                },
                setStatus: function (stored) { // 상태 복원
                        // 조건검사
                        if (stored == null) { return; }

                        // 클론 만들기
                        for (var ii = 0 ; ii < stored.length ; ii++) {
                                // 준비
                                var current = stored[ii];
                                var ele_drag = _dragBox[current.drag_num];
                                var ele_drop = _dropBox[current.drop_num];
                                
                                // 클론 생성
                                var ele_clone = ele_drag.cloneNode(true); // 생성
                                ele_drop.parentElement.appendChild(ele_clone); // 붙이기
                                $(ele_clone).addClass("clone"); // 클래스 추가
                                $(ele_clone).addClass("offDrag");
                                ele_clone.style.left = current.left + "px"; // 위치
                                ele_clone.style.top = current.top + "px";
                                ele_clone.modid = current.modid; // modid 지정
                                ele_clone.drop_num = current.drop_num; // drop_num
                                ele_clone.drag_num = current.drag_num; // drag_num
                        }
                }
        }
}

// 모듈 : 선 그리기
var mod_drawline = function () {

    ///// variables

    // reference
    var _this; // 클래스
    var _canvas; // 캔버스 딕셔너리 : 개별 캔버스는 modid 로 접근
    var _context; // 컨텍스트 딕셔너리 : 상동
    var _answer; // 정답 딕셔너리 : [modid][data-num] = 배열
    // [modid].is_show = 현재 정답 가시여부
    var _lineStart; // lineStart 딕셔너리
    var _lineEnd; // 상동 : [modid][data-num] = 엘리먼트

    // storage
    var arValidLine; // 유효 선 배열
    // {}
    // .modid : 모듈 ID
    // .drag_num : lineStart 의 data-num
    // .drop_num : lineEnd 의 data-num
    // .type : "normal" or "answer"
    // .sx .sy .ex . ey : 위치값





    ///// function
    return {

        ///// initialize

        // 초기화
        init: function () {
            var lineSt = $('.lineStart');
            if (lineSt.length == 0) {
                return;
            }
            // 참조 연결
            _this = this;

            // 초기화
            arValidLine = [];
            _canvas = {};
            _context = {};
            _answer = {};
            _lineStart = {};
            _lineEnd = {};

            // ID 설정
            $('.lineStart').each(function () {
                // 기준 엘리먼트 검색(상위의 assessmentItem. 여기의 data-qid 가 이 모듈의 ID 가 됨)
                var ele_base = $(this).closest("assessmentItem")[0];
                this.modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");
                this.num = $(this).data("num");
                this.multi = ($(ele_base).data("multi") == null) ? false : ($(ele_base).data("multi"));

                // 딕셔너리 삽입
                if (_lineStart[this.modid] == null) { _lineStart[this.modid] = {}; }
                _lineStart[this.modid][this.num] = this;
            });
            $('.lineEnd').each(function () { // 상동
                var ele_base = $(this).closest("assessmentItem")[0];
                this.modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");
                this.num = $(this).data("num");
                this.multi = ($(ele_base).data("multi") == null) ? false : ($(ele_base).data("multi"));

                // 딕셔너리 삽입
                if (_lineEnd[this.modid] == null) { _lineEnd[this.modid] = {}; }
                _lineEnd[this.modid][this.num] = this;
            });
            $('.canvasArea').each(function () { // 상동
                var ele_base = $(this).closest("assessmentItem")[0];
                this.modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");
            });
            // 버튼은 data-target 으로 귀속되는 모듈을 찾음
            $('.resetDrawLine').each(function () { this.modid = ($(this).data("target") == null) ? "onlyone" : $(this).data("target"); });
            $('.checkQuizLine').each(function () { this.modid = ($(this).data("target") == null) ? "onlyone" : $(this).data("target"); });

            // 정답 설정
            $('.answerCorrect').each(function () {
                // 기준 엘리먼트 검색(상위의 assessmentItem. 여기의 data-qid 가 이 모듈의 ID 가 됨)
                var ele_base = $(this).closest("assessmentItem")[0];
                var modid = ($(ele_base).data("qid") == null) ? "onlyone" : $(ele_base).data("qid");

                // 정답 가공 및 입력
                var ar_lv0 = this.textContent.split("//");
                _answer[modid] = {};
                _answer[modid].is_show = false;
                for (var ii = 0 ; ii < ar_lv0.length ; ii++) {
                    var ar_lv1 = ar_lv0[ii].split(", "); // 자르고
                    for (var jj = 0 ; jj < ar_lv1.length ; jj++) { ar_lv1[jj] = parseInt(ar_lv1[jj]) - 1; } // 정수화 시킨 뒤 0 부터 시작값으로 변경
                    _answer[modid][ii] = ar_lv1;
                }
            });

            // 캔버스
            $('.canvasArea').each(function () {
                // 캔버스 생성
                _canvas[this.modid] = document.createElement("canvas");

                // 붙이기
                this.appendChild(_canvas[this.modid]);

                // 크기
                _canvas[this.modid].width = this.clientWidth;
                _canvas[this.modid].height = this.clientHeight;

                // 마우스 반응 금지
                $(_canvas[this.modid]).css("pointer-events", "none");

                // 컨텍스트 준비
                _context[this.modid] = _canvas[this.modid].getContext("2d");
            });

            // 라인 시작
            $('.lineStart').draggable({
                // 더미 헬퍼
                helper: function () { return $("<div class='dot' style='opacity:0'></div>"); },

                // 시작
                start: function (event, ui) {
                    // 준비
                    var ele_drag = event.target; // dragEle
                    var drag_num = $(ele_drag).data("num");

                    // _answer 없는 경우 대비
                    if (_answer[ele_drag.modid] == null) {
                        _answer[ele_drag.modid] = {};
                        _answer[ele_drag.modid].is_show = false;
                    }

                    // 조건검사
                    if (_answer[ele_drag.modid].is_show == true) { return; }

                    // 다중 선택 가능 여부
                    if (ele_drag.multi == false) {
                        // 조건검사 : 같은 곳에서 출발하는 기존 선 제거
                        for (var aa = arValidLine.length - 1 ; aa >= 0 ; aa--) {
                            var vv = arValidLine[aa];
                            if (vv.modid == ele_drag.modid && vv.drag_num == drag_num) { arValidLine.splice(aa, 1); }
                        }
                    }
                },

                // 드래그 무브 이벤트
                drag: function (event, ui) {
                    // 준비
                    var ele_drag = event.target;
                    var ele_helper = ui.helper[0];
                    var pos_origin = ui.originalPosition;
                    var hw = ele_drag.clientWidth / 2;
                    var hh = ele_drag.clientHeight / 2;

                    // _answer 없는 경우 대비
                    if (_answer[ele_drag.modid] == null) {
                        _answer[ele_drag.modid] = {};
                        _answer[ele_drag.modid].is_show = false;
                    }

                    // 조건검사
                    if (_answer[ele_drag.modid].is_show == true) { return; }

                    // 헬퍼 위치 보정
                    ele_helper.style.left = ele_helper.offsetLeft + hw + "px";
                    ele_helper.style.top = ele_helper.offsetTop + hh + "px";

                    // 보정된 위치
                    var sx = pos_origin.left + hw;
                    var sy = pos_origin.top + hh;

                    // 다시 그리기
                    _this.clearCanvas(ele_drag.modid);

                    // 그리기
                    _this.drawLine(ele_drag.modid, "normal", sx, sy, ele_helper.offsetLeft, ele_helper.offsetTop);
                },

                // 중단
                stop: function (event, ui) {
                    // _answer 없는 경우 대비
                    if (_answer[event.target.modid] == null) {
                        _answer[event.target.modid] = {};
                        _answer[event.target.modid].is_show = false;
                    }

                    // 조건검사
                    if (_answer[event.target.modid].is_show == true) { return; }

                    // 클리어
                    _this.clearCanvas(event.target.modid);
                }
            });

            // 라인 끝
            $('.lineEnd').droppable({
                // 드랍 이벤트
                drop: function (event, ui) {
                    // 준비
                    var ele_drag = ui.draggable[0]; // dragEle
                    var ele_drop = event.target; // dropEle
                    var drag_num = $(ele_drag).data("num");
                    var drop_num = $(ele_drop).data("num");

                    // _answer 없는 경우 대비
                    if (_answer[ele_drag.modid] == null) {
                        _answer[ele_drad.modid] = {};
                        _answer[ele_drag.modid].is_show = false;
                    }

                    // 조건검사
                    if (_answer[ele_drag.modid].is_show == true) { return; }

                    // 조건검사
                    if (ele_drop.modid != ele_drag.modid) { return; }

                    // 중복검사
                    for (var ii = 0 ; ii < arValidLine.length ; ii++) {
                        var vv = arValidLine[ii];
                        if (vv.modid == ele_drag.modid && vv.drag_num == drag_num && vv.drop_num == drop_num) { return; }
                    }

                    // 다중 선택 가능 여부
                    if (ele_drag.multi == false) {
                        // 조건검사 : 도착지가 선점당해 있으면 중단
                        for (var ww = 0 ; ww < arValidLine.length ; ww++) {
                            var vv = arValidLine[ww];
                            if (vv.modid == ele_drag.modid && vv.drop_num == drop_num) { return; }
                        }
                    }

                    // 위치값 준비
                    var sx = ele_drag.offsetLeft + ele_drag.clientWidth / 2;
                    var sy = ele_drag.offsetTop + ele_drag.clientHeight / 2;
                    var ex = ele_drop.offsetLeft + ele_drop.clientWidth / 2;
                    var ey = ele_drop.offsetTop + ele_drop.clientHeight / 2;

                    // 유효값 저장
                    var vv = { modid: ele_drag.modid, drag_num: drag_num, drop_num: drop_num, type: "normal", sx: sx, sy: sy, ex: ex, ey: ey }
                    arValidLine.push(vv);

                    saveDATALine();
                }
            });

            // 리셋 버튼
            $('.resetDrawLine').click(function () { _this.onReset(this.modid) });

            // 정답 버튼
            $('.checkQuizLine').click(function () { _this.showAnswer(this.modid); });
        },

        // 리셋
        onReset: function (id_mod) {
            // 해당 아이디의 유효값 제거           
            for (var ii = arValidLine.length - 1 ; ii >= 0 ; ii--) {
                if (arValidLine[ii].modid == id_mod) { arValidLine.splice(ii, 1); }
            }

            // _answer 없는 경우 대비
            if (_answer[id_mod] == null) {
                _answer[id_mod] = {};
                _answer[id_mod].is_show = false;
            }

            // 정답 보기 상태
            _answer[id_mod].is_show = false;

            // 지우기
            _this.clearCanvas(id_mod);
        },

        // 캔버스 관련 함수
        clearCanvas: function (id_mod) {
            // 지우고
            _context[id_mod].clearRect(0, 0, _canvas[id_mod].width, _canvas[id_mod].height);

            // 유효선 그리기
            _this.drawValidLines(id_mod);
        },
        drawValidLines: function (id_mod) {
            // 유효값 배열 순회
            for (var ii = 0 ; ii < arValidLine.length ; ii++) {
                var vv = arValidLine[ii];
                if (vv.modid == id_mod) { _this.drawLine(id_mod, vv.type, vv.sx, vv.sy, vv.ex, vv.ey); }
            }
        },
        drawLine: function (id_mod, type, sx, sy, ex, ey) {
            // 선 모양
            switch (type) {
                case "normal":
                    _context[id_mod].strokeStyle = line_normal.strokeStyle;
                    _context[id_mod].lineWidth = line_normal.lineWidth;
                    _context[id_mod].lineCap = line_normal.lineCap;
                    break;
                case "answer":
                    _context[id_mod].strokeStyle = line_answer.strokeStyle;
                    _context[id_mod].lineWidth = line_answer.lineWidth;
                    _context[id_mod].lineCap = line_answer.lineCap;
                    break;
            }

            // 그리기
            _context[id_mod].beginPath();
            _context[id_mod].moveTo(sx, sy);
            _context[id_mod].lineTo(ex, ey);
            _context[id_mod].stroke();
        },
        showAnswer: function (id_mod) {
            // _answer 없는 경우 대비
            if (_answer[id_mod] == null) {
                _answer[id_mod] = {};
                _answer[id_mod].is_show = false;
            }

            // 조건검사
            if (_answer[id_mod].is_show == true) { return; }

            // 정답 보기 상태
            _answer[id_mod].is_show = true;

            // 정답 정리
            $.each(_answer[id_mod], function (index, item) {
                // 시작점
                var ele_start = _lineStart[id_mod][index];

                // 도착점
                for (var ii = 0 ; ii < item.length ; ii++) {
                    // 준비
                    var ele_end = _lineEnd[id_mod][item[ii]];

                    // 위치값 준비
                    var sx = ele_start.offsetLeft + ele_start.clientWidth / 2;
                    var sy = ele_start.offsetTop + ele_start.clientHeight / 2;
                    var ex = ele_end.offsetLeft + ele_end.clientWidth / 2;
                    var ey = ele_end.offsetTop + ele_end.clientHeight / 2;

                    // 선긋기
                    _this.drawLine(id_mod, "answer", sx, sy, ex, ey);
                }
            });
        },

        // 외부 접근 메서드
        getBtn: function (str_type, str_modid) { // 버튼 전달
            // 준비
            var modid = (str_modid == null) ? "onlyone" : str_modid;
            var ref = "";

            // 타입
            switch (str_type) {
                case "reset": ref = ".resetDrawLine"; break;
                case "answer": ref = ".checkQuizLine"; break;
            }

            // 검색과 반환
            var rtn;
            $(ref).each(function () {
                // 조건검사
                if (this.modid != modid) { return; }

                // 반환
                rtn = this;
            });

            // 반환
            return rtn;
        },
        callFunction: function (str_type, str_modid) {
            // 준비
            var modid = (str_modid == null) ? "onlyone" : str_modid;

            // 분기
            switch (str_type) {
                case "reset": _this.onReset(modid); break;
                case "answer": _this.showAnswer(modid); break;
            }
        },
        getStatus: function () { // 상태 저장
            // 준비
            var stored = {};

            // 유효값
            stored.valid = $.extend(true, [], arValidLine);

            // 정답 보던 상태인지 저장
            var answer_show = {};
            $.each(_answer, function (index, item) {
                if (item.is_show == true) {
                    answer_show[index] = {};
                    answer_show[index].is_show = true;
                }
            });
            stored.answer = answer_show;
            return stored;
        },
        setStatus: function (stored) { // 상태 복원
            // 조건검사
            if (stored == null) { return; }

            // 유효선
            arValidLine = $.extend(true, [], stored.valid);
            $.each(_canvas, function (index, item) { _this.clearCanvas(index); });

            // 정답
            $.each(stored.answer, function (index, item) {
                if (item.is_show == true) {
                    if (_answer[index] != null) {
                        _answer[index].is_show = false;
                        _this.showAnswer(index, true);
                    }
                }
            });
        }
    }
}