/**
 * Created by sam on 16-4-7.
 */

var list = [];
function checkfailed() {
    // 判断是否是浮点数
    var reg = /^[\-\+]?\d*\.?\d+$/;
    var input = document.getElementById("input");
    return !reg.test(input.value);

}
// 渲染数据
function render() {
    var room = document.getElementById("room");
    room.innerHTML = '';
    for (var i = 0; i < list.length; i++) {
        room.innerHTML += '<div class="box">' + list[i] + '</div>';
    }
}

// 右侧进入
function rightIn() {
    var hint = document.getElementById("error");
    hint.innerHTML = '';
    if (checkfailed()) {
        hint.innerHTML = '请输入数字';
        return;
    }
    var input = document.getElementById("input");
    list.push(parseFloat(input.value));
    render();
}

// 右侧删除
function rightOut() {
    var hint = document.getElementById("error");
    if (list.length == 0) {
        hint.innerHTML = '';
        return;
    }
    hint.innerHTML = '已移除' + list.pop();
    render();
}

// 左侧进入
function leftIn() {
    var hint = document.getElementById("error");
    hint.innerHTML = '';
    if (checkfailed()) {
        hint.innerHTML = '请输入数字';
        return;
    }
    var input = document.getElementById("input");
    list.unshift(parseFloat(input.value));
    render();
}

// 左侧删除
function leftOut() {
    var hint = document.getElementById("error");
    if (list.length == 0) {
        hint.innerHTML = '';
        return;
    }
    hint.innerHTML = '已移除' + list.shift();
    render();
}

//绑定事件函数
function on(element, eventName, listener) {
    if (element.addEventListener) {
        element.addEventListener(eventName, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + eventName, listener);
    }
    else
        element['on' + eventName] = listener;
}

window.onload = function () {
    var btnLeftIn = document.getElementById("left-in");
    var btnLeftOut = document.getElementById("left-out");
    var btnRightIn = document.getElementById("right-in");
    var btnRightOut = document.getElementById("right-out");

    on(btnLeftIn, 'click', leftIn);
    on(btnLeftOut, 'click', leftOut);
    on(btnRightIn, 'click', rightIn);
    on(btnRightOut, 'click', rightOut);
};