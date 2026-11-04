import type { Item, Work } from "../schema";

const realNames: Record<string, string> = {
  shinyu: "晶㬊申晶㬊",
  dohoon: "道勋金道勋",
  youngjae: "英宰崔英宰",
  hanjin: "韩振朴韩振",
  jihoon: "志薰韩志薰",
  kyungmin: "炅潣李炅潣",
};
const englishNames: Record<string, string> = {
  shinyu: "SHINYU",
  dohoon: "DOHOON",
  youngjae: "YOUNGJAE",
  hanjin: "HANJIN",
  jihoon: "JIHOON",
  kyungmin: "KYUNGMIN",
};

export function makeChapterSocial(work: Work, member: string): { threads: Item[]; weibo: Item[] } {
  const x = englishNames[member] || "SHINYU";
  const real = realNames[member] || realNames.shinyu;
  const seed = Array.from(work.id + member).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);
  const threadComments = [
    "笑死我了", "wtf", "dnys", "佛", "留友看", "起初人们没有在意",
    real + "你被捕了", "黄泉路人能不能滚", "纳尼", "纳尼。", "啊啊啊啊啊啊", "坤续",
  ];
  const threadBodies = [
    "wtf我的河道好精彩",
    "别吵了烦不烦",
    "黄泉路人能不能滚",
    "纳尼",
    "我就说他面相看起来会很爱谈的",
    "我让" + x + "粉丝成天飒飒飒 回旋镖了吧",
    "啊啊啊大晚上睡不着了好坤动",
    x + "你对得起谁",
    "等公司公告的 冷知识 那个谁当年也发公告了",
    "上升期谈恋爱 " + x + "你要死吗",
    "是路人你就给我路过",
    "这么真的料不信的有了",
    "今晚hybe将灯火通明",
    x + "你对得起谁",
    "今年谈恋爱的好多啊",
    "我的舍友是看我是" + x + "粉丝 刚刚听说了这件事 然后刚刚塞给我一堆零食。。我真的要爱上她了",
    "这是ai的吧",
    x + " tms唯一恋爱咖",
  ];
  const mk = (
    id: string, body: string, sender: string, comments: string[],
    likes: number, reposts: number, meta: Record<string, string> = {},
  ): Item => ({
    id, title: "微博正文", body, richText: "",
    meta: { handle: sender.toLowerCase().replace(/[^a-z0-9]/g, ""), reposts: String(reposts), ...meta },
    time: "21:48", sender, avatar: "", kind: "post", media: "",
    hidden: false, unlock: "", password: "", folder: "", favorite: false,
    outgoing: false, read: false, likes, comments,
  });
  const shuffledBodies = [...threadBodies].sort(() => Math.random() - 0.5);
  const threads = shuffledBodies.map((body, i) => {
    const start = Math.floor(Math.random() * threadComments.length);
    const comments = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, n) => threadComments[(start + n) % threadComments.length]);
    const likes = 12000 + i * 137;
    const reposts = 16000 + i * 211;
    return mk("chapter-thread-" + i, body, "路人网友", comments, likes, reposts, { topic: "TWS", reposts: String(reposts) });
  });

  const weibo: Item[] = [];
  const wc1 = ["wtf", "我的法 他生图这么丑啊", "评论区的造谣很有意思？", "啊啊啊啊啊啊", "纳尼。", "闹麻", real + "你被捕了", "黄泉路人能不能滚"];
  const wc2 = ["看看缟纻猪肝", "都澄清了 是ai 造谣的4000+", "缟纻别点了", "gxjh又让你赚爽了吧", "皮下到底审不审稿"];
  const wc3 = ["脱愉", "评论区在说什么 这不是花挺多的", "羡慕缟纻文采", "说的全是实话…", "自证上哪偷的", "就不能多相信他一点吗", "抱着必出神稿的决心就这么做了", "拉队友共沉沦什么意思"];
  [
    "【心灵丑】恋爱咖滚",
    "【心灵丑】为什么这么漂亮的皮囊底下是这么没有内涵的灵魂 你很丑陋",
    "脸丑就算了 还心灵丑 谈谈谈 谈你爸 放生几张生图 姥子再也不替你捂了",
  ].forEach((body, i) => weibo.push(mk("chapter-toilet-" + i, body, "不脱先踩丑老公", wc1, 7000 + i * 500, 12000 + i * 1000, { account: "true" })));
  [
    "事已至此tws top是不是可以换人了",
    "不要让" + x + "粉丝太嚣张",
    "等着看hybe顶级公关",
    "tws恋爱拉表来了 有一个人高居榜首",
  ].forEach((body, i) => weibo.push(mk("chapter-battle-" + i, body, "浴血奋战", wc2, 5000 + i * 400, 9000 + i * 900, { account: "true" })));
  [
    "恋爱咖滚",
    "滚吧负心汉 和嫂子一起下地狱",
    "你太伤粉丝的心了 学生党花得不多 别审判我",
  ].forEach((body, i) => weibo.push(mk("chapter-exfan-" + i, body, "脱粉回踩救钱包", wc3, 6000 + i * 600, 10000 + i * 700, { account: "true" })));
  weibo.push(mk(
    "chapter-giveaway",
    x + "的敬业和职业素养我们有目共睹 恋爱传闻纯属造谣 图片已澄清 详情见：微博正文\n转发+评论抽5个人188元🧧、10个人52元🧧 自动开奖\n要求没有嘴过" + x + " 会查主页",
    "普通用户",
    ["严肃参与", "就是就是 都澄清了", "相信" + real, "参与！！", "大家都转一转呀", "414", "我就知道是假的"],
    18800, 28000, { account: "true", reposts: "28000", pinned: "true" },
  ));
  return { threads, weibo };
}
