/**
 * Created by sam on 16-4-6.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
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

// onmouseover 显示详细信息
function mouseover(e) {
    e.childNodes[0].style.visibility = 'visible';
}
// 隐藏详细信息
function mouseout(e) {
    e.childNodes[0].style.visibility = 'hidden';
}
/**
 * 渲染图表
 */
function renderChart() {
    var table = document.getElementById('aqi-chart-wrap');
    var color = '';
    table.innerHTML = '';
    for (var time in chartData) {
        color = 'rgb(' + parseInt(256 * Math.random()) + ',' +
            parseInt(256 * Math.random()) + ',' + parseInt(256 * Math.random()) + ')';
        table.innerHTML += '<div class ="bar" onmouseover="mouseover(this)" onmouseout="mouseout(this)" style = "background:' + color + '; height:' + chartData[time] + 'px;">' + '<span class="detail">date: ' + time + '<br />AQI: ' + chartData[time] + '</span>' + '</div>';
    }
    console.log('render complete');
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var currentTime = document.getElementsByName('gra-time');
    for (var i = 0; i < currentTime.length; i++) {
        if (currentTime[i].checked) {
            var time = currentTime[i].value;
        }
    }
    if (time == pageState.nowGraTime) {
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = time;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var selection = document.getElementById('city-select');
    if (pageState.nowSelectCity == selection.options[selection.selectedIndex].text) {
        return;
    }
    // 设置对应数据
    pageState.nowSelectCity = selection.options[selection.selectedIndex].text;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var formGraTime = document.getElementById('form-gra-time');
    on(formGraTime, 'click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var selection = document.getElementById('city-select');
    // 清空所有城市
    selection.options.length = 0;
    for (city in aqiSourceData) {
        selection.innerHTML += '<option>' + city + '</option>';
    }
    citySelectChange();
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    on(selection, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var chart = aqiSourceData[pageState.nowSelectCity];
    chartData = {};
    switch (pageState.nowGraTime) {
        case 'day':
            chartData = chart;
            break;
        case 'week':
            var sum = day = week = 0;
            for (var item in chart) {
                sum += chart[item];
                day++;
                if (new Date(item).getDay() == 6) {    // new 一个对象，判断是否是周日
                    week++;
                    chartData['2016年第' + week + '周'] = parseInt(sum / day);
                    day = 0;
                    sum = 0;
                }
            }
            if (day != 0) {
                week++;
                chartData['2016年第' + week + '周'] = parseInt(sum / day);
            }
            break;
        case 'month':
            var sum = 0, month = 1, day = 0;
            for (item in chart) {
                var date = new Date(item);
                if (date.getMonth() + 1 != month) {
                    console.log(date);
                    chartData[date.getFullYear() + '-' + (month < 10 ? '0' + month : month)] = parseInt(sum / day);
                    month = date.getMonth() + 1;
                    sum = chart[item];
                    day = 1;
                }
                else {
                    day++;
                    sum += chart[item];
                }
            }
            if (sum != 0) {
                chartData[date.getFullYear() + '-' + (month < 10 ? '0' + month : month)] = parseInt(sum / day);
            }
            break;
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

window.onload = function () {
    init();
};
