/***********************************
 * 小红书视频卡片过滤脚本 + 点赞数筛选
 * 作者: @YourName
 * 功能:
 *   1. 去掉视频卡片（note_type=video_note 或 type=video）
 *   2. 去掉广告（ads_info 存在的）
 *   3. 只保留点赞数 >= 100 的
 * 使用: QuantumultX - script-response-body
 ***********************************/

try {
    let body = $response.body;
    if (body) {
        let obj = JSON.parse(body);

        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                // 去掉视频
                if (item.note_type && item.note_type.toLowerCase().includes('video')) {
                    return false;
                }
                if (item.type && item.type.toLowerCase().includes('video')) {
                    return false;
                }
                // 去掉广告
                if (item.ads_info) {
                    return false;
                }

                // 点赞数筛选（>=100）
                let likeCount = 0;
                if (item.interact_info && item.interact_info.liked_count) {
                    likeCount = item.interact_info.liked_count;
                } else if (item.likes) {
                    likeCount = item.likes;
                }

                return likeCount >= 100;
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
