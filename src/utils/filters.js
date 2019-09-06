

function add0(m) {
    return m < 10 ? '0' + m : m
}

//格式时间戳
function formatTimeStamp(timestamp) {
    if( !timestamp || timestamp==''){
        return "";
    }
    var time = new Date(parseInt(timestamp));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

//格式时间戳
function formatTimeStampMinute(timestamp) {
    if( !timestamp || timestamp==''){
        return "";
    }
    var time = new Date(parseInt(timestamp));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm)
}

//格式时间戳
function formatDate(date) {
    if( !date || date==''){
        return "";
    }
    let time = new Date(date);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + add0(m) + '-' + add0(d) ;
}

//格式化日志等级
function formatLogLevel(logLevel) {
    switch (logLevel) {
        case 0:
            return "Debug";
            break;
        case 1:
            return "Info";
            break;
        case 2:
            return "Warn";
            break;
        case 3:
            return "Error";
            break;
        case 4:
            return "Fatal";
            break;

        default:
            return "";
            break;
    }

}

//格式化请求类型
//0 GET,1 POST,2 PUT,3 DELETE
function formatRequestType(requestType) {
    switch (requestType) {
        case 0:
            return "GET";
            break;
        case 1:
            return "POST";
            break;
        case 2:
            return "PUT";
            break;
        case 3:
            return "DELETE";
            break;

        default:
            return "";
            break;
    }

}

//格式化浏览器类型
//客户端类型 10 Android,20 IOS, 30 IE ,31 FireFox,32 Opera ,33 Safari ,34 Chrome ,40 Service(系统服务)
function formatClientType(clientType) {
    switch (clientType) {
        case 30:
            return "IE";
            break;
        case 31:
            return "FireFox";
            break;
        case 32:
            return "Opera";
            break;
        case 33:
            return "Safari";
            break;
        case 34:
            return "Chrome";
            break;

        default:
            return "";
            break;
    }

}

//格式化参数类型 0 int  1 String  2  boolean 3  double
function formatParamType(paramType) {
    switch (paramType) {
        case 0:
            return "int";
            break;
        case 1:
            return "String";
            break;
        case 2:
            return "boolean";
            break;
        case 3:
            return "double";
            break;
        case 4:
            return "long";
            break;
        default:
            return "";
            break;
    }
}
// 过滤掉 图片
function formatImg(text) {
    let reg = /<img[^>]*src[=\"\'\s]+[^\.]*\/([^\.]+)\.[^\"\']+[\"\']?[^>]*>/gi;
   return text.replace(reg, "");
}

// 过滤掉 样式
function formatStyle(text) {
    let reg = /style\s*=\s*('[^']*'|\"[^\"]*\")/g;
    return text.replace(reg, "");
}


//格式化菜单是否显示  0 不显示     1 显示
function formatIsShow(isShow) {

    switch (isShow) {
        case 0:
            return "否";
            break;
        case 1:
            return "是";
            break;
    }

};

// 三位加个小数点
function formatNumberThousands(num) {
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}

function formatTimeUnit(timeUnit) {
    switch (timeUnit) {
        case 0:
            return "分钟";
        case 1:
            return "小时";
        default :
            return "";
    }
}

// storageUnitFormat 显示k m
function formatStorageUnit(num) {
    if(num<1000){
        return num;
    }
    if (num < 1000 * 1000) {
        return (num / 1000).toFixed(0)+" K";
    }
    if (num < 1000 * 1000 * 1000) {
        return (num / ( 1000*1000 ) ). toFixed(0)+" M";
    }
    if (num < 1000 * 1000 * 1000 * 1000) {
        return (num / ( 1000 * 1000 * 1000 ) ). toFixed(0)+" G";
    }
    if (num < 1000 * 1000 * 1000 * 1000 * 1000 ) {
        return (num / ( 1000 * 1000 * 1000 * 1000 ) ). toFixed(0)+" P";
    }
    return num;
}

//
function formatSex(sex) {
    switch (sex) {
        case 1:
            return "男";
        case 2:
            return "女";
        default :
            return "保密";
    }
}


export default {
    install: function(vm){
        vm.filter('formatDate',formatDate );
        vm.filter('formatTimeStamp',formatTimeStamp );
        vm.filter('formatTimeStampMinute',formatTimeStampMinute );
        vm.filter('formatLogLevel',formatLogLevel );
        vm.filter('formatRequestType',formatRequestType );
        vm.filter('formatClientType',formatClientType );
        vm.filter('formatParamType',formatParamType );
        vm.filter('formatIsShow',formatIsShow);
        vm.filter('formatNumberThousands',formatNumberThousands);
        vm.filter('formatTimeUnit',formatTimeUnit);
        vm.filter('formatImg',formatImg);
        vm.filter('formatStyle',formatStyle);
        vm.filter('formatStorageUnit',formatStorageUnit);
        vm.filter('formatSex',formatSex);
    }
}
