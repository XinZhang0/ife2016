/**
 * Created by sam on 16-4-6.
 */

/**
 * 初始化函数
 */
function init() {
    var btnLeftIn = document.getElementById("left-in");
    var btnLeftOut = document.getElementById("left-out");
    var btnRightIn = document.getElementById("right-in");
    var btnRightOut = document.getElementById("right-out");
    var btnSelectSort = document.getElementById("select-sort");
    var btnRandomChart = document.getElementById("random-chart");
    var btnPopSort = document.getElementById("pop-sort");
    var btnStop = document.getElementById("stop");
    var btnInterval = document.getElementById("interval");
    on(btnInterval, 'click', Interval);
    on(btnStop, 'click', Stop);
    on(btnLeftIn, 'click', leftIn);
    on(btnLeftOut, 'click', leftOut);
    on(btnRightIn, 'click', rightIn);
    on(btnRightOut, 'click', rightOut);
    on(btnSelectSort, 'click', selectSort);
    on(btnPopSort, 'click', popSort);
    on(btnRandomChart, 'click', clickRandom);
    randomChart();
}
function Interval() {
    var hint = document.getElementById("error");
    var input = document.getElementById("input-interval");
    if (checkFailed("input-interval") || parseInt(input.value) < 1) {
        hint.innerHTML = '请输入大于0的整数';
        return;
    }
    interval = parseInt(input.value);
}
function Stop() {
    var count = 1;
    var st = setInterval(function () {
        count++;
        end = 1;
        if (count > 20) {
            end = 0;
            clearInterval(st);
        }
    }, 10);
}
window.onload = function () {
    init();
};
function clickRandom() {
    var hint = document.getElementById("error");
    var number = document.getElementById("num");
    if (checkFailed("num")) {
        hint.innerHTML = '请输入大于1的整数';
        return;
    }
    if (parseInt(number.value) <= 1) {
        hint.innerHTML = '请输入大于1的整数';
        return;
    }
    num = parseInt(number.value);
    chartData = randomBuildData(num, 100);
    renderChart();
    restart = 1;
}

// 随机模拟生成测试数据
function randomBuildData(num, seed) {
    var returnData = [];
    for (var i = 0; i < num; i++) {
        returnData.push(parseInt(Math.ceil(Math.random() * seed)));
    }
    return returnData;
}
var interval = 10;
var end = 0;
var restart = 0;
// 用于渲染图表的数据
var chartData = randomBuildData(100, 100);
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

// 随机生成图表
function randomChart() {
    chartData = randomBuildData(100, 100);
    renderChart();
}

/**
 * 渲染图表
 */
function renderChart() {
    var table = document.getElementById('sort-chart');
    table.innerHTML = '';
    for (var i = 0; i < chartData.length; i++) {
        table.innerHTML += '<div class ="bar"  style="height:' + chartData[i] * 5 + 'px;"></div>';
    }
}

// 判断是否是整数
function checkFailed(id) {
    var reg = /^\d+$/;
    var input = document.getElementById('' + id);
    return !reg.test(input.value);
}

// 右侧进入
function rightIn() {
    var hint = document.getElementById("error");
    var input = document.getElementById("input");
    hint.innerHTML = '';
    if (checkFailed("input")) {
        hint.innerHTML = '请输入 0 ~ 100 之间的整数';
        return;
    }
    if (parseInt(input.value) > 100) {
        hint.innerHTML = '请输入 0 ~ 100 之间的整数';
        return;
    }
    chartData.push(parseInt(input.value));
    renderChart();
}

// 右侧删除
function rightOut() {
    var hint = document.getElementById("error");
    if (chartData.length == 0) {
        hint.innerHTML = '';
        return;
    }
    hint.innerHTML = '已移除' + chartData.pop();
    renderChart();
}

// 左侧进入
function leftIn() {
    var hint = document.getElementById("error");
    var input = document.getElementById("input");
    hint.innerHTML = '';
    if (checkFailed("input")) {
        hint.innerHTML = '请输入 0 ~ 100 之间的整数';
        return;
    }
    if (parseInt(input.value) > 100) {
        hint.innerHTML = '请输入 0 ~ 100 之间的整数';
        return;
    }
    chartData.unshift(parseInt(input.value));
    renderChart();
}

// 左侧删除
function leftOut() {
    var hint = document.getElementById("error");
    if (chartData.length == 0) {
        hint.innerHTML = '';
        return;
    }
    hint.innerHTML = '已移除' + chartData.shift();
    renderChart();
}

function popSort() {
    renderChart();
    var i = 0, len = chartData.length, j = 1, temp, flag = 1;

    function reset() {
        i = 0, len = chartData.length, j = 1, temp, flag = 1;
    }

    var timer = setInterval(run, interval);
    var bar = document.getElementsByClassName("bar");

    function stop(string) {
        var color;
        if (string == 'success') {
            color = "#6393ff";
        }
        if (string == 'end') {
            color = "#72b16a";
        }
        i = 0;
        var success = setInterval(function () {
            if (i < len) {
                bar[i].style.background = color;
                i++;
            } else {
                clearInterval(success);
            }
        }, interval);
    }

    function run() {
        if (i < len) {
            try {
                bar[i].style.background = "#6393ff";
            } catch (err) {

            }
            if (j < len) {
                if (end) {
                    stop('end');
                    clearInterval(timer);
                    end = 0;
                }
                if (len != chartData.length || restart) {
                    reset();
                    restart = 0;
                }
                if (chartData[j - 1] > chartData[j]) {
                    flag = 0;
                }
                try {
                    bar[j].style.background = "#ff0000";
                } catch (err) {

                }

                if (chartData[i] > chartData[j]) {
                    temp = chartData[i];
                    chartData[i] = chartData[j];
                    chartData[j] = temp;
                    renderChart();
                }
                j++;
            } else if (flag) {
                i = 0;
                stop('success');
                clearInterval(timer);
            } else {
                renderChart();
                bar[i].style.background = "#72b16a";
                i++;
                j = i + 1;
                flag = 1;

            }
        } else {
            i = 0;
            stop('success');
            clearInterval(timer);
        }
    }


}

function selectSort() {
    renderChart();
    var i = 0, len = chartData.length, j = 1, temp, flag = 1, p = i;

    function reset() {
        i = 0, len = chartData.length, j = 1, temp, flag = 1, p = i;
    }

    var timer = setInterval(run, interval);
    var bar = document.getElementsByClassName("bar");

    function stop(string) {
        var color;
        if (string == 'success') {
            color = "#6393ff";
        }
        if (string == 'end') {
            color = "#72b16a";
        }
        i = 0;
        var success = setInterval(function () {
            if (i < len) {
                bar[i].style.background = color;
                i++;
            } else {
                clearInterval(success);
            }
        }, interval);
    }

    function run() {
        if (i < len) {
            try {
                bar[i].style.background = "#6393ff";
            } catch (err) {

            }
            if (j < len) {
                if (end) {
                    stop('end');
                    clearInterval(timer);
                }
                if (len != chartData.length || restart) {
                    reset();
                    restart = 0;
                }
                try {
                    bar[j].style.background = "#ff0000";
                } catch (err) {

                }
                if (chartData[j - 1] > chartData[j]) {
                    flag = 0;
                }
                if (chartData[p] > chartData[j]) {
                    try {
                        bar[p].style.background = "#ff0000";
                    } catch (err) {

                    }
                    p = j;
                    try {
                        bar[j].style.background = "#6393ff";
                    } catch (err) {

                    }
                }
                j++;
            } else if (flag) {
                stop('success');
                clearInterval(timer);
            } else {
                temp = chartData[i];
                chartData[i] = chartData[p];
                chartData[p] = temp;
                bar[i].style.background = "#72b16a";
                renderChart();
                i++;
                j = i + 1;
                p = i;
                flag = 1;
            }
        } else {
            stop('success');
            renderChart();
            clearInterval(timer);
        }
    }

}

