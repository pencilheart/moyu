/***********************************
 * 小红书视频卡片过滤脚本 + 点赞数筛选 + 关键词过滤
 * 作者: @YourName
 * 功能:
 *   1. 去掉视频卡片
 *   2. 去掉广告
 *   3. 只保留点赞数 >= 20 的
 *   4. 去掉标题/描述含“美女”等关键词的笔记
 * 使用: QuantumultX - script-response-body
 ***********************************/

try {
    let body = $response.body;
    if (body) {
        let obj = JSON.parse(body);

        // 黑名单关键词，可以自行扩展
        const keywordBlacklist = ["美女", "小姐姐", "颜值", "美照", "自拍", "身材", "骑行", "明星"];

        if (obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                // 去掉视频
                if (item.note_type && item.note_type.toLowerCase().includes('video')) return false;
                if (item.type && item.type.toLowerCase().includes('video')) return false;

                // 去掉广告
                if (item.ads_info) return false;

                // 点赞数筛选
                let likeCount = 0;
                if (item.interact_info && item.interact_info.liked_count) {
                    likeCount = item.interact_info.liked_count;
                } else if (item.likes) {
                    likeCount = item.likes;
                }
                if (likeCount < 20) return false;

                // 文本内容筛选
                let text = "";
                if (item.title) text += item.title;
                if (item.desc) text += item.desc;
                if (item.note_card && item.note_card.display_title) text += item.note_card.display_title;

                if (keywordBlacklist.some(k => text.includes(k))) {
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
    console.log(`❌ 小红书过滤脚本出错: ${e}`);
    $done({});
}
