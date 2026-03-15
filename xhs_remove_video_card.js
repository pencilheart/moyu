/***********************************
 * 小红书信息流终极过滤脚本（v3）
 * 适用于 QuantumultX
 *
 * 模式1：智能过滤
 *   - 去视频
 *   - 去广告
 *   - 点赞数过滤
 *   - 统一黑名单（关键词、作者、标签）
 *
 * 模式2：彻底清空
 ***********************************/

// ===== 模式切换 =====
// 1 = 正常过滤
// 2 = 彻底清空
const mode = 1;

// 点赞最低限制
const MIN_LIKES = 100;

// 统一黑名单（关键词、作者昵称、标签）
const unifiedBlacklist = [
    "美女","小姐姐","颜值","美照","自拍",
    "身材","穿搭","辣妹","纯欲","氛围感","项链","风格","pink","姐姐",
    "写真","女友","约会","ootd","OOTD",
    "cos","jk","丝袜","腿","明星",
    "社交","王者荣耀","游戏","焦虑","日常","探店"
];

try {

let body = $response.body;
if (!body) {
    $done({});
}

let obj = JSON.parse(body);

if (obj.data && Array.isArray(obj.data)) {

    if (mode === 2) {

        // ===== 模式2：清空 =====
        obj.data = [];

    } else {

        // ===== 模式1：过滤 =====
        obj.data = obj.data.filter(item => {

            // ---------- 去视频 ----------
            if (item.note_type && item.note_type.toLowerCase().includes("video")) return false;
            if (item.type && item.type.toLowerCase().includes("video")) return false;

            // ---------- 去广告 ----------
            if (item.ads_info) return false;

            // ---------- 点赞数 ----------
            let likeCount = 0;
            if (item.interact_info && item.interact_info.liked_count) {
                likeCount = item.interact_info.liked_count;
            }
            if (item.likes) {
                likeCount = item.likes;
            }
            if (likeCount < MIN_LIKES) return false;

            // ---------- 提取所有文本 ----------
            let text = "";
            if (item.title) text += item.title;
            if (item.desc) text += item.desc;

            if (item.note_card) {
                if (item.note_card.title) text += item.note_card.title;
                if (item.note_card.display_title) text += item.note_card.display_title;
                if (item.note_card.desc) text += item.note_card.desc;
                if (item.note_card.note_title) text += item.note_card.note_title;
            }

            // ---------- 作者昵称 ----------
            let nickname = "";
            if (item.user && item.user.nickname) nickname = item.user.nickname;
            if (item.note_card && item.note_card.user && item.note_card.user.nickname) {
                nickname = item.note_card.user.nickname;
            }

            // ---------- 标签 ----------
            let tags = "";
            if (item.note_card && item.note_card.tag_list) {
                tags = item.note_card.tag_list.map(t => t.name).join(",");
            }

            // ---------- 统一黑名单过滤 ----------
            const combinedText = text + nickname + tags;
            if (unifiedBlacklist.some(k => combinedText.includes(k))) {
                return false;
            }

            return true;

        });

    }

}

$done({ body: JSON.stringify(obj) });

} catch (e) {

console.log("小红书过滤脚本错误: " + e);
$done({});

}