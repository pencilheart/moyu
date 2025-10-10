/***********************************
 * 小红书信息流过滤脚本（支持模式切换）
 * 作者: @YourName
 * 功能:
 *   模式1：正常过滤（去视频、去广告、点赞数 >=100、去美女）
 *   模式2：彻底清空（返回空 data 数组）
 * 使用: QuantumultX - script-response-body
 ***********************************/

// ========== 这里切换模式 ==========
// mode = 1 → 正常过滤
// mode = 2 → 彻底清空
const mode = 1;
// =================================

try {
    let body = $response.body;
    if (!body) {
        $done({});
    }

    let obj = JSON.parse(body);

    if (obj.data && Array.isArray(obj.data)) {
        if (mode === 2) {
            // -------- 模式2：强制空白 --------
            obj.data = [];
        } else {
            // -------- 模式1：正常过滤 --------
            const keywordBlacklist = ["美女", "小姐姐", "颜值", "美照", "自拍", "身材", "明星", "骑行"];

            obj.data = obj.data.filter(item => {
                // 去视频
                if (item.note_type && item.note_type.toLowerCase().includes('video')) return false;
                if (item.type && item.type.toLowerCase().includes('video')) return false;

                // 去广告
                if (item.ads_info) return false;

                // 点赞数筛选
                let likeCount = 0;
                if (item.interact_info && item.interact_info.liked_count) {
                    likeCount = item.interact_info.liked_count;
                } else if (item.likes) {
                    likeCount = item.likes;
                }
                if (likeCount < 100) return false;

                // 关键词黑名单过滤
                let text = "";
                if (item.title) text += item.title;
                if (item.desc) text += item.desc;
                if (item.note_card && item.note_card.display_title) text += item.note_card.display_title;

                if (keywordBlacklist.some(k => text.includes(k))) return false;

                return true;
            });
        }
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.log(`❌ 小红书脚本出错: ${e}`);
    $done({});
}
