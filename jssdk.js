/** js sdk **/

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