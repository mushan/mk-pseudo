/** Platform **/

/**
 * 登录
 * @param email
 * @param pwd
 * @returns {*}
 */
function login(email, pwd) {
    var user = db.getUser(email, pwd);
    if (user) {
        return {
            success: true,
            result: user
        }
    } else {
        return {
            success: false,
            result: ''
        }
    }
}

/**
 * 注册
 * @param email
 * @param pwd
 * @param orgName
 * @returns {*}
 */
function register(email, pwd, orgName) {
    check(email);
    encrypt(pwd);
    var user = db.getUser(email);
    if (user) {
        db.create(email, pwd, orgName);
        return {
            success: true,
            result: ''
        }
    } else {
        return {
            success: false,
            result: '已存在'
        }
    }
}


/**
 * 获取app列表
 * @param uid
 * @returns {*}
 */
function apps(uid) {
    var array = db.getByUid(uid);
    return array;
}

/**
 * 添加app
 * @param appName
 * @param uid
 * @returns {boolean}
 */
function add(appName, uid) {
    try {
        db.create(uid, appName);
        return true;
    } catch (e) {
        return false;
    }

}

/**
 * 删除app
 * @param uid
 * @param appId
 * @returns {boolean}
 */
function remove(uid, appId) {
    try {
        // 设置app不显示
        db.update(uid, appId);
        return true;
    } catch (e) {
        return false;
    }
}


/**
 *  获取app详情
 * @param appId
 * @returns {{app: *, apis: Array}}
 */
function appDetail(appId) {
    // 1. 从获取app信息
    var app = db.getById(appId);

    // 2. 获取app已启用的api
    var apis = db.getApiByAppId(appId);

    // 3. 每个api获取详细信息
    var api_combine = [];
    apis.forEach(function (item) {
        var tmp = API.getApiByApiName(item.apiName);
        api_combine.push(tmp);
    });

    return {
        'app': app,
        'apis': api_combine
    };
}


/**
 * 获取api列表
 * @returns {*}
 */
function apiList() {
    var apis = API.getApiList();
    return apis;
}


/**
 * 启动api | 关闭api
 * @param apiName
 * @param appId
 * @param isShow
 * @returns {boolean}
 */
function toogle(apiName, appId, isShow) {
    try {
        db.upsert({
            'apiName': apiName,
            'appId': appId,
            'isShow': isShow
        });
        return true;
    } catch (e) {
        return false;
    }
}


/**
 * 获取api详情
 * @param appId
 * @param apiName
 * @returns {{doc: *, conf: *}}
 */
function apiConfig(appId, apiName) {
    /**
     * 1. 从数据库获取api的具体配置
     * 待定:
     *    api配置的数据格式
     */
    var conf = db.getByApiName(appId, apiName);

    /**
     *  2. 获取api的文档
     *
     *  待定:
     *      a. 获取结果为markdown,之后渲染为html
     *      b. 获取结果直接为html
     */
    var doc = API.getBayApiName(apiName);
    return {
        doc: doc,
        conf: conf
    }
}


/**
 * api 配置更新
 * @param form
 */
function updateConfig(appId, apiName, form) {

    //1. 检验参数
    check(form);

    /**
     * 2. 格式化数据
     *    待定: 数据格式是什么
     */
    var data = format(form);

    // 3. 保存数据
    db.upsert({
        'appId': appId,
        'apiName': apiName
    }, {
        $set: data
    })

    /**
     * 4. 通知api提供方配置发生更行
     *      4.1 根据约定的 数据格式 和 加密方式 传参
     *      4.2 http post 配置信息到指定url ?? 这个url如何获取  待定
     */
    var url = '';
    notify(data, url);
}


/**
 * api对应的数据报表
 * @param appId
 * @param apiName
 * @param pageIndex
 * @param pageSize
 * @returns {*}
 */
function dataList(appId, apiName, pageIndex, pageSize) {
    var array = db.get(appId, apiName, pageIndex, pageSize);
    /** 处理数据,提取column 和 对应的data
     *  result 格式
     * {
     *   columns : ['姓名','年龄','性别'],
     *   data :[
     *      {
     *          'name':'XX',
     *          'age':12,
     *          'gender':'male'
     *       },
     *      {
     *          'name':'YY',
     *          'age':10,
     *          'gender':'female'
     *      }
     *   ]
     * }
     */
    var result = handle(array);
    return result;
}


/**
 * 导出数据
 * @param appId
 * @param apiId
 */
function exportData(appId, apiId) {
    // 1. 从数据库获取所有数据
    var all = db.all(appId, apiId);

    /**
     *  2. 导出所有数据
     *      待定: 十万百万级数据导出可能有performance问题
     */
    exportToCsv(all);
}

