/***********************************
 * 小红书视频&直播卡片过滤脚本
 * 作者: @YourName
 * 参考: ddgksf2013/redbook_json.js
 * 功能: 过滤信息流、首页feed中的视频和直播卡片
 * 使用: QuantumultX - script-response-body
 ***********************************/

try {
    let body = $response.body;
    if (body) {
        let obj = JSON.parse(body);

        // 过滤首页信息流
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                // 1. 过滤 note_type 或 type 包含 'video' 或 'live'
                const noteType = (item.note_type || '').toLowerCase();
                const type = (item.type || '').toLowerCase();

                if (noteType.includes('video') || noteType.includes('live')) {
                    return false;
                }
                if (type.includes('video') || type.includes('live')) {
                    return false;
                }

                // 2. 过滤包含直播信息的字段
                if (item.is_live || item.live_info || item.live_status || item.live_card) {
                    return false;
                }

                // 3. 也可过滤广告（ads）
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
    console.log(`❌ 小红书去视频&直播卡片脚本出错: ${e}`);
    $done({});
}
