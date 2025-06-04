/***********************************
 * 小红书视频卡片过滤脚本
 * 作者: @YourName
 * 参考: ddgksf2013/redbook_json.js
 * 功能: 过滤信息流或首页 feed 中的“视频卡片”
 * 使用: QuantumultX - script-response-body
 ***********************************/

try {
    let body = $response.body;
    if (body) {
        let obj = JSON.parse(body);

        // 过滤首页信息流
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                // 1. 过滤 note_type 为 video_note 或者 type 为 video（可以根据接口返回的字段做微调）
                if (item.note_type && item.note_type.toLowerCase().includes('video')) {
                    return false;
                }
                if (item.type && item.type.toLowerCase().includes('video')) {
                    return false;
                }
                // 2. 也可以增加对广告（ads）等字段的过滤
                if (item.ads_info) {
                    return false;
                }
                return true;
            });
        }

        $done({ body: JSON.stringify(obj) });
    } else {
        $done({});
    }
} catch (e) {
    console.log(`❌ 小红书去视频卡片脚本出错: ${e}`);
    $done({});
}
