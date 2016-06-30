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



