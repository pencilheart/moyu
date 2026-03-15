/***********************************
 * 小红书信息流终极过滤脚本
 * 适用于 QuantumultX
 *
 * 模式1：智能过滤
 *   - 去视频
 *   - 去广告
 *   - 点赞数过滤
 *   - 关键词过滤
 *   - 作者昵称过滤
 *   - 标签过滤
 *
 * 模式2：彻底清空
 ***********************************/

// ===== 模式切换 =====
// 1 = 正常过滤
// 2 = 彻底清空
const mode = 1;

// 点赞最低限制
const MIN_LIKES = 100;

// 关键词黑名单
const keywordBlacklist = [
"美女","小姐姐","颜值","美照","自拍",
"身材","穿搭","辣妹","纯欲","氛围感",
"写真","女友","约会","ootd","OOTD",
"cos","jk","丝袜","腿","明星",
"社交","王者荣耀","游戏","焦虑"
];

// 作者昵称黑名单
const authorBlacklist = [
"美女","辣妹","穿搭","日常",
"OOTD","写真","颜值","探店","小姐姐"
];

// 标签黑名单
const tagBlacklist = [
"自拍","穿搭","OOTD","ootd",
"辣妹","纯欲","写真","颜值",
"约会","cos","jk"
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

// 旧字段
if (item.title) text += item.title;
if (item.desc) text += item.desc;

// note_card 字段
if (item.note_card) {

if (item.note_card.title)
text += item.note_card.title;

if (item.note_card.display_title)
text += item.note_card.display_title;

if (item.note_card.desc)
text += item.note_card.desc;

if (item.note_card.note_title)
text += item.note_card.note_title;

}

// ---------- 关键词过滤 ----------
if (keywordBlacklist.some(k => text.includes(k))) {
return false;
}

// ---------- 作者昵称 ----------
let nickname = "";

if (item.user && item.user.nickname) {
nickname = item.user.nickname;
}

if (item.note_card && item.note_card.user && item.note_card.user.nickname) {
nickname = item.note_card.user.nickname;
}

if (authorBlacklist.some(k => nickname.includes(k))) {
return false;
}

// ---------- 标签 ----------
if (item.note_card && item.note_card.tag_list) {

let tags = item.note_card.tag_list
.map(t => t.name)
.join(",");

if (tagBlacklist.some(k => tags.includes(k))) {
return false;
}

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