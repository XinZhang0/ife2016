/**
 * Created by sam on 16-4-6.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {}; // 新建了一个对象

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var error = document.getElementById("input-error");
    error.innerHTML = '';

    // .trim() 去除首尾的空格
    var city = document.getElementById('aqi-city-input').value.trim();
    var aqi = document.getElementById('aqi-value-input').value.trim();
    /**
     * 判断城市名必须为中英文字符，空气质量指数必须为非负整数
     */

    // 匹配中文: [\u4e00-\u9fa5] 英文字母: [a-zA-Z] 数字: [\d]
    var regCity = /^[\u4e00-\u9fa5a-zA-Z]+$/;
    var regAqi = /^\d+$/;

    /**
     * 如果 city 不匹配
     */
    if (!regCity.test(city)) {
        error.innerHTML += '<p>' + '城市名必须为中英文字符' + '</p>';
    }

    /**
     * 如果 aqi 不匹配
     */
    if (!regAqi.test(aqi)) {
        error.innerHTML += '<p>' + '空气质量指数必须为非负整数' + '</p>';
    }

    /**
     * 如果全部匹配，则导入数据
     */

    if (regCity.test(city) && regAqi.test(aqi)) {
        aqi = parseInt(aqi); // string 转化为 int 类型
        aqiData[city] = aqi;   // 对象的属性名等于属性值
    }

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.getElementById('aqi-table');
    var tr = '';
    /**
     * 当 aqiData 有数据时，渲染
     */
    if (!isEmptyObject(aqiData)) {
        tr = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>'; // 添加标题栏
        for (var city in aqiData) {
            /**
             * 添加数据的同时给 删除按钮 绑定了 delBtnHandle 事件
             */
            tr += '<tr>' + '<td>' + city + '</td>' + '<td>' + aqiData[city] + '</td>' + '<td>' + "<button onclick='delBtnHandle(\"" + city + "\")'>" + '删除' + '</button>' + '</td>' + '</tr>';
        }
    }
    table.innerHTML = tr;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
    // do sth.

    // 删除属性
    delete aqiData[city];
    renderAqiList();
}

function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById("add-btn").onclick = addBtnHandle;
}

/**
 * 判断对象是否为空
 */
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

window.onload = function () {
    init();
};
