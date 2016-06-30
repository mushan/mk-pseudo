/** 第三方提供api 自动接入平台 **/


/**
 * 保存api的相关信息 包括: request params , response params , redirect|direct , doc , data 格式
 */
function createApi(api) {
    /**
     * api 相关信息直接以文件形式保存
     */
    api_factory.add(api);
}


/**
 * 获取所有api相关信息 包括配置信息 , doc , data 格式
 */
function getApis() {
    var apis = api_factory.getApis();
    return apis;
}

/**
 * 获取api详细信息
 * @param apiName
 */
function apiDetail(apiName) {
    var apis = api_factory.getApis();
    var result;
    apis.forEach(function (item) {
        if (item.title === apiName) {
            result = item;
            return;
        }
    });
    return result;
}


/**
 * 接收第三方api通知数据
 * @param data
 */
function onReceived(data) {

    // 1. 保存数据
    db.save(data);

    // 2. 调用成功计数
    var appId = url.get('appId');
    var apiName = url.get('apiName');
    db.increase(appId, apiName, 1);
}


/**
 * api 通用调用方式
 */
function call(req, res, callback) {

    var mdata = parse(req);
    /**
     * 1. 找到对应的api信息
     */
    var api = api_factory[mdata['apiName']];

    //2. 调用api
    var url = api['url'];
    var type = api['type'];

    //2.1 组装请求的数据
    var data;
    for (var field in api['fields']) {
        data[field] = req['fields'][field];
    }

    for (var fileKey in api['files']) {
        data[fileKey] = req['files'][fileKey];
    }
    switch (type) {
        case 'direct':
            var response = http.request({
                url: url,
                type: api['HTTP_TYPE'],//POST|GET,
                data: data,
                dataType: api['DATA_TYPE'] //application/json 之类
            });
            break;

        case 'redirect':
            //组装新的url
            url = url + jsonToQueryString(data);
            res.redirect(url);
            break
    }
}
