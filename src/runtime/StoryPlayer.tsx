import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { db } from "../persistence";
import { validateWork, type Work } from "../schema";
import { UserOnboarding, type UserProfile } from "./UserOnboarding";
import "../styles.css";
import "./player.css";
const KEY="foundphone.user-profile.v1";
const randId=()=>Array.from({length:9},()=>{const chars="abcdefghijklmnopqrstuvwxyz0123456789";return chars[Math.floor(Math.random()*chars.length)];}).join("");
function readProfile():UserProfile|null{try{const x=JSON.parse(localStorage.getItem(KEY)||"null") as UserProfile|null;return x&&x.nickname&&/^\d{8}$/.test(x.birthday)&&x.avatar&&x.crush&&x.ex&&["BG","GB"].includes(x.xp)?x:null}catch{return null}}
function StartChoice({onContinue,onRestart}:{onContinue:()=>void;onRestart:()=>void}){
 return <main className="start-choice"><section className="start-choice-card"><div className="start-choice-kicker">FOUND PHONE</div><h1>欢迎回来</h1><p>要接着上次的故事，还是重新开始？</p><button className="start-choice-primary" onClick={onContinue}>继续剧情<span>从上次离开的位置继续</span></button><button className="start-choice-secondary" onClick={onRestart}>重新开始<span>重新设置个人资料，从第一幕开始</span></button><small>选择继续会保留当前进度；重新开始会清空进度并重新设置资料</small></section></main>;
}
function StoryPlayer(){
 const [work,setWork]=useState<Work|null>(null),[error,setError]=useState(""),[profile,setProfile]=useState<UserProfile|null>(()=>readProfile());
 const [choice,setChoice]=useState<"setup"|"choose"|"play">(()=>readProfile()?"choose":"setup");
 const [session,setSession]=useState(0);
 useEffect(()=>{const abort=new AbortController();fetch(new URLSearchParams(location.search).get("preview")==="test"?"./test-work.json":new URLSearchParams(location.search).get("template")==="blank"?"./blank-work.json":"./work.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw Error("缺少作品文件，请运行 npm run story:build");return r.json()}).then(x=>{const w=validateWork(x);document.title=w.title==="捡手机"?"捡手机":w.title+" · 捡手机";setWork(w)}).catch(e=>{if(e.name!=="AbortError")setError(String(e))});return()=>abort.abort()},[]);
 const complete=(p:UserProfile)=>{try{localStorage.setItem(KEY,JSON.stringify(p));setProfile(p);setChoice("play");setSession(v=>v+1)}catch{setError("头像保存失败，请换一张较小的图片后重试。")}};
 const restart=async()=>{if(!work)return;try{await db.saves.delete(work.id);localStorage.removeItem(KEY);setProfile(null);setChoice("setup");setSession(v=>v+1)}catch{setError("无法清除旧进度，请检查浏览器存储权限。")}};
 if(!work)return <main className="story-runtime"><p role="status">{error||"正在打开手机…"}</p></main>;
 if(!profile)return <UserOnboarding key={session} onComplete={complete}/>;
 if(choice==="choose")return <StartChoice onContinue={()=>setChoice("play")} onRestart={()=>void restart()}/>;
 const labels:Record<string,string>={shinyu:"tlswjdghks",dohoon:"doking",youngjae:"jae_e",hanjin:"henan_prince",jihoon:"ahoooon",kyungmin:"kyungman_lee"};
 const crushNames:Record<string,string>={shinyu:"晶㬊尼",dohoon:"小屎狗",youngjae:"居家服务型男",hanjin:"珍珍",jihoon:"击击击昏",kyungmin:"炅man"};
 const exNames:Record<string,string>={shinyu:"事多爹系天蝎男",dohoon:"不要理他！",youngjae:"远离双子男",hanjin:"不中",jihoon:"tws韩志薰",kyungmin:"李炅jiong潣min"};
 const handles:Record<string,string>={shinyu:"tlswjdghks",dohoon:"doking",youngjae:"jae_e",hanjin:"henan_prince",jihoon:"ahoooon",kyungmin:"kyungman_lee"};

 const make=(id:string,title:string,body:string,meta:Record<string,string>={},avatar="")=>({id,title,body,richText:"",meta,time:"2026-11-03 09:41",sender:labels[id]||title,avatar,kind:"text" as const,media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:0,comments:[] as string[]});
 const birthdayCompare=(a:string,b:string)=>a.localeCompare(b);
 const olderThan=(id:string)=>birthdayCompare(profile.birthday,({shinyu:"20031107",dohoon:"20050130",youngjae:"20050531",hanjin:"20060105",jihoon:"20060328",kyungmin:"20071002"} as Record<string,string>)[id]||"99999999")<0;
 
 const chatText:Record<string,string>={
 shinyu:`@2026-10-01 01:47
user
睡了吗。
今天阵容又没成型ㅠㅠ有点烦。
你：还没 你怎么这么晚还在玩云顶之弈
睡不着
而且……
算了
你明天几点起
你：八点吧 怎么了
啊 那你快睡
我七点四十叫你
别定闹钟了 我打给你
@2026-10-01 07:41
语音通话02:10
@2026-10-02 13:01
user
刚结束训练
有空吗
一起去吃饭
你：啊 我刚跟浩俊xi去吃了那家新开的店 还不错
哦
好吃就行
你：不好意思呀
你：之后再约
没事
你：刚刚遇到小猫咪了！好萌么！
@2026-10-02 15:34
你：你怎么了 生气了？
没有。
我在打荒野
就是
下次先叫我
我也可以去
好不好
你：…好
@2026-10-03 22:34
今天吃了两人份的便当
还吃了一桶爆米花…
你：诶诶…ㅋㅋ
…有点多。
别笑
你：怎么了 心情不好？
没有
就是
练习的时候有个动作一直不对
烦…吃的时候没感觉
光想事情去了
吃完才觉得撑
你：哦哦哦 唉 孩子爱吃就多吃吧
…？
你：别有压力嘛
你：唉 不舒服的话 给我打电话嘛
…嗯
没事 就是你别跟别人说
就你知道
哦对 明天想不想出来
你：怎么了
我想见你
你：好呀
那我订了 江南的餐厅
到时候去接你`,
 dohoon:`@2026-10-01 22:31
诶 user
刚跟朋友打完pubg 累死了
你在干嘛
怎么不回
你：…你发这么快 我还没看清！
你：刚洗澡 怎么了
没事 就是想找你说话
不行吗
你：…行
@2026-10-03 16:43
user
刚练完舞 身上全是汗
但是好想见你…
你：不要 你以为我从家里过去hybe找你很近？
嘿嘿…那我去找你
你：你先回宿舍洗澡去！
@2026-10-05 20:22
喂 user
你：干嘛 刚分开就发消息
我刚看见你跟浩俊聊天了
聊挺久啊
你：…
我有点不爽
你看着办
你：你以什么立场问我？
我追你啊？
我以为你知道
你：………喂！！！
kiyo
@2026-10-06 01:50
睡了吗
好累
你：快睡觉
我是说真的…
你：……
…能不能……
算了
你别觉得我随便跟谁都这样。
我边界感很强的
time time。
说多了 你睡吧。
@2026-10-06 12:08
在干嘛
我一会儿有个拍摄 好烦
你想不想来…
算了你别来 我工作的时候不想分心
你：？？
但是拍完你得在 算了你还是来吧`,
 youngjae:`@2026-10-01 18:21
user
我今天在宿舍里做了点曲奇
做多了
你吃不吃
不难吃 我试过了
你：你还会做这个啊
你：我看twsclub 你们宿舍都不怎么开火的
你：居然还能做曲奇？？
会一点
以后你想吃什么 跟我说
我准备
你：哦哦哦 帅气的男人
@2026-10-04 19:22
user
刚刚你闺蜜跟我说你哭了？
你在哪
我过去
@2026-10-04 22:01
到家跟我说一声
你：诶诶 但是 我刚刚没看消息
你：你是怎么知道我在这的
^^
@2026-10-06 10:44
前两天发给你的那家咖啡厅
想不想去
我今天有空
你：诶 我正好今天约了浩俊去那里 我们要做小组项目…
嗯。
那挺好的
@2026-10-07 23:52
user
我跟你说个事
我想了一阵了
不是冲动
我对你 不只是朋友那种
你不用现在回
我只是觉得 这种事我该说清楚
你慢慢想 我等着
你：诶…诶
你：这么说的话
你：我好像要想一想诶…
你：考察期 这种东西
^^
会尽快通过考核的 公主nim
@2026-10-08 07:13
降温
今天多穿些
你：好
…其实想问你
今天可以来找我吗
你：去hybe找你吗？？
嗯…但是后门粉丝太多了
我出去之后去找你吧
我们去狎鸥亭怎么样
你：好
嗯`,
 hanjin:`@2026-10-01 19:08
哈咯 user 备注韩振`,
 jihoon:`@2026-10-01 14:02
啊今天练习好累
但是刚刚吃了好吃的
给你看
好想带你来 user
这样说话会不会太直接
算了 我就是想带你来
你：哈哈哈哈哈kiyo
ㅠㅠ
@2026-10-02 22:32
你看我今天
这张笑得太开了
这张还行
这张我喜欢
你：哎呀 好可爱
诶…
等一下 你觉得呢
你选一张 我发wvs
算了你别选了 我全发
但是我最喜欢这张
［图片］
这张只给你看 不一样的
你：OMG
你：怎么单独给我发呀…
你：这张真的 笑起来好暖
你：喜欢
嘿嘿…
你这么说我脸红了
真的 我脸热
你别不信
［图片］
这张是看到你那句话之后笑的
给你看证据
你：哎呀 知道了知道了
@2026-10-04 19:20
user
user呀
你在干嘛
理我一下
就一下
我今天很乖 练习很认真 饭也好好吃了
你是不是该夸我
不夸也行 你回我一条就行
一条就好
我真的很好养活的
@2026-10-04 20:11
你：啊啊啊志薰 我刚刚没看手机
你：米安内…
嘿嘿嘿没事呀我们user
你：志薰 好棒
你：最棒的宝宝
哎呀！！！
@2026-10-06 00:47
睡了吗
我知道很晚了
但是我想跟你说个事
你看到就行 不用马上回
@2026-10-06 01:02
其实我这个人 表面上话很多 好像什么都不在乎 但是不是的。我在乎的东西很多 只是我不太会说。但是对你我好像话就特别多 多到我自己都觉得自己烦。我怕说错话 我怕你觉得我太吵 但是我又忍不住想说。我今天看到你跟别人出去 我其实有点不开心 但是我知道我没有立场不开心 我们又不是那种关系 对吧 哈哈
@2026-10-06 01:05
算了 太长了
啊啊怎么撤回不了
就是 我今天有点想你
你别回太快啊啊我害羞
你：志薰啊 我也想你
……
你这个人
我输了
睡吧睡吧 明天见
明天我要第一个见到你`,
 kyungmin:`@2026-10-01 11:23
user 我刚看到一个东西 特别像你
［图片］
你：诶呀你想死吗！
我开玩笑的
其实像你的不是这个
［图片］
是这个
好看但不好惹 跟你一模一样
你：你才不好惹
我不好惹吗
那我惹你一下试试
你：…懒得理你
你今天干嘛
算了你别告诉我 我猜
你在躺平
你：？？
猜对了吧
我太了解你了
@2026-10-03 23:45
你：你还好吗 看你ig story
嗯
没事
就是有点烦
我一般不这样的
你：…
其实也不是完全没事
但是我说不清楚
等我理清楚再跟你说
@2026-10-04 23:20
今天练习被说了
没事
我接受
我确实还能更好
我不是那种被说一句就垮的人
但是我也不会一直这样
你等着看
我会有让你吓一跳的那天
你：期待着
你：不过
你：感觉不会太久呢
…
你：你可是tws的未来呀
你：哇？我现在是在安慰tws的未来吗？
你：ㅋㅋ不过 就算是tws的未来
你：也不要有压力
你：比起什么tws的未来 你要是能成为你所梦寐以求的就更好了
说什么…这么多…
你：我在安慰你欸
谢谢你
你：别掉小珍珠了
…………
@2026-10-05 20:30
在干嘛
我跟你说 我今天做了件很蠢的事
你：什么什么
打歌的时候
我不小心拿了申惟哥的手机
因为我们的手机都亮着屏放在桌子上
我直接就拿起来发了一段文字wvs…
发完才意识到用错手机了
你：？？哈哈哈哈哈哈
你：你别这样
是不是很蠢
你别笑
你：哈哈哈哈哈哈哈哈哈哈
你：感觉cpf会说磕到了哈哈哈哈
你：原来我的竞争对手是你队长？
…………
不说了
明天本来要和道勋哥去网吧拍摄的
他突然有个个人通告
所以我明天休假一天
你：真的吗真的吗
嗯 明天要不要去吃烤肉？在狎鸥亭
你：ok`
 };
 const buildMessages=(id:string,title:string,text:string,avatar:string)=>{let current="2026-10-01 09:00",n=0;return text.split("\n").flatMap((line)=>{if(!line.trim())return [];if(line.startsWith("@")){current=line.slice(1);return [];}const outgoing=line.startsWith("你：");let body=outgoing?line.slice(2):line;if(!outgoing)body=body.replaceAll("user",profile.nickname+(olderThan(id)?"":(id==="hanjin"?"姐姐":"怒那")));const item=make(id,title,body,{handle:handles[id]||"",remark:profile.crush===id?(crushNames[id]||""):(exNames[id]||"")},avatar);item.id="personal-"+id+"-"+(++n);item.time=current;item.sender=outgoing?profile.nickname:(handles[id]||labels[id]);item.outgoing=outgoing;item.read=false;return [item];});};
 const avatarFor=(id:string)=>`${import.meta.env.BASE_URL}people/${id==="hanjin"?"jihoon":id==="jihoon"?"hanjin":id}.jpg`;
 const crushTitle=handles[profile.crush]||labels[profile.crush];
 const contacts=buildMessages(profile.crush,crushNames[profile.crush]||crushTitle,chatText[profile.crush]||"",avatarFor(profile.crush));
 const breakupText:Record<string,string>={
 shinyu:`我想了一阵了 不是冲动
我们这样下去 你会累 我也会
我不想让你觉得是我不要你
是我发现 我给的方式可能不是你想要的
你：…
我这个人 什么都想安排好
连你几点起我都想管
我以为那是照顾
你：你也知道
对不起…
算了。说多了没意思
你以后，按时吃饭
别吃速食凑合
你：谢谢 我吃得很好。
…
天气冷了 穿厚点
最后一句
我认定了就不会改 这句话现在也还算数
我只是换一种方式
你：？
保重`,
 dohoon:`time。
先别说话 让我说
我现在直说
我早就感觉到不对了
我这个人 看起来跟谁都能聊 其实边界感很强 你是少数进来的
所以现在才这么难受
你：？你是想挽留吗
……
我说这话自己都想笑
我就是有点不甘心
我以为我想要的东西我都能留住
原来不是
行。我说完了 你以后找个像我这样的
……算了，不像也行。`,
 youngjae:`我想清楚了才来找你
不是一时冲动 我这个人 冲动的话不会说出口
我们之间的问题 我列过
不是你的错 也不是我的错
我一直以为 只要我稳定 只要我把问题都拆开解决就没事
但是我发现 有些事不是拆开就能解决的
我逃避过
你：…
你可能没发现 我自己消化 消化完再回来
回来的时候 你已经走远了一点
我这个人 很多人说我温柔 但是让人猜不透 这个我知道
猜久了会累 你累了 我看得出来
你：多说无益
…以后你哭的时候 还是会有人抱住你
但是那个人不是我了
你要好好的 真的
有事……还是可以找我`,
 hanjin:`我想了很久要不要说
可能我就是这样 什么都想很久
我们之间 我其实早就看到了结局 我只是没说
我以为不说 就能多留一会儿
我拍过你很多张照片 每一张我都留着
你：…对不起
我才对不起你
不 谁都没对不起谁
但是……
有些话用中文说比用韩语疼
我现在知道了
你：真的对不起…
你以后 会遇到给你拍得更好的人
那个人应该不会让你说对不起吧
就这样吧`,
 jihoon:`睡了吗 我知道很晚了
我打了一大段 撤回了 太长了 太天真了
我重新说
我这个人 话多 你一直知道的。
我早就感觉到了 我容易吃醋 你知道的 但是后来我连吃醋都不敢了
因为没立场了
我一般不把负面情绪给别人
但是对你 我好像藏不住
你：别说这些…
现在也一样 我很难受 我不藏了
你不用回 真的
你：你让我好难受 为什么我会流这么多泪呢
对不起 怪我
我就是想让你知道。
我是真的喜欢过你 不是开玩笑的
你：…`,
 kyungmin:`你：你发的igstory 什么意思
嗯。没事
不是你的问题。
…
其实也不是完全没事
我说不清楚。但是
你知道的
我们这段关系 我后知后觉
等我发现我在意的时候 已经晚了
你：可是我那时候喜欢你 我不怕累
不 你以后还是找个让你不用猜的人吧
我这种太累了
保重`
 };
 const crushMessages=buildMessages(profile.crush,crushNames[profile.crush]||handles[profile.crush]||labels[profile.crush],chatText[profile.crush]||"",avatarFor(profile.crush));
 const exMessages=buildMessages(profile.ex,exNames[profile.ex]||handles[profile.ex]||labels[profile.ex],breakupText[profile.ex]||"",avatarFor(profile.ex));
 const crushIsHanjin=profile.crush==="hanjin", exIsHanjin=profile.ex==="hanjin";
 const hanjinWechat=crushIsHanjin?buildMessages("hanjin",handles.hanjin,`@2026-10-01 19:20
睡了吗 user
今天有点想家
不是那种想
就是突然闻到一种味道 很像小时候在老家闻到的
老家的泥土味
你：懂你意思…
你：我也想
你：嗯嗯…想吃你煮的麻辣香锅！
哈哈哈哈哈哈怎么突然
唉 我在这边挺好的 真的
但是有些话
用韩语说和用中文说感觉不一样
跟你说中文的时候
我觉得我比较像我
你别觉得我矫情 我就跟你说说
说完就好了
你：不矫情。
你：我在
你：这有什么矫情的
嗯
@2026-10-04 20:32
今天光线太好了
你看这张
你：我去 男神驾到
嘿嘿
这张我也喜欢
但是这张构图是不是有点歪
你：确实
你：我不行了
你：但是这张完全 骨相绝了
你说哪张好看 我想发wvs
你：都发吧！
你：要我挑我也挑不出来 这张脸绝了
真的吗
你眼光好 你说行就行
@2026-10-04 21:02
你：诶 第一张怎么没发
@2026-10-04 21:14
其实第一张我是想发给你看的
你懂我意思吧
你：你！
你：网恋大省发力了。
哈哈哈哈哈哈笑死我了
@2026-10-07 14:02
user 我刚刚路过一家店 看到这个
你：OMG好可爱啊这个项链
我就觉得你会喜欢
我买了 下次给你
你：OMG！！
你：谢谢…
没事没事
@2026-10-09 20:30
你今天出去了吗
看到你朋友圈了
你：对…今天浩俊帮我拍了照
哦哦
浩俊？我记得他是你组员
你们出去做什么了
你：嗯 没什么 组里有点东西要线下讨论一下
哦哦哦
@2026-10-09 21:12
他用的什么镜头
构图一般 一点都没拍出我们user的闭月羞花沉鱼落雁
你：哎哟 你干嘛
下次我给你拍 我知道你哪个角度最好看
不 你哪个角度都很好看
但是别人拍不出我拍的效果
你：…行
明天见 可以吗
你：好
那 下午？
你：okok`,avatarFor("hanjin")):exIsHanjin?buildMessages("hanjin","韩振",`我想了很久要不要说
可能我就是这样 什么都想很久
我们之间 我其实早就看到了结局 我只是没说
我以为不说 就能多留一会儿
我拍过你很多张照片 每一张我都留着
你：…对不起
我才对不起你
不 谁都没对不起谁
但是……
有些话用中文说比用韩语疼
我现在知道了
你：真的对不起…
你以后 会遇到给你拍得更好的人
那个人应该不会让你说对不起吧
就这样吧`,avatarFor("hanjin")):[];
 const hanjinKakao=exIsHanjin&&!crushIsHanjin?exMessages:crushIsHanjin?crushMessages:[];
 
 const selectedMembers=[...new Set([profile.crush,profile.ex])];
 const friendNames=["민서","서연","지우","유진","수빈","예린","채원","하린","도연","나연","소희","은서","지민","다은","현아","예지","승아","가은","혜원","시은"];
 const friends=friendNames.map((name,index)=>{const handle=randId();return make("ig-friend-"+index,handle,"",{handle,username:name,account:"friend",relationship:"互相关注",mutual:"true"});});
 const selectedAccounts=selectedMembers.map(id=>make("ig-member-"+id,handles[id],"",{handle:handles[id],username:handles[id],account:id===profile.crush?"crush":"ex",member:id,relationship:"互相关注",remark:id===profile.crush?crushNames[id]:exNames[id]}));
 const mutualCount=friends.length+selectedAccounts.length;
 const insta=[
  make("tws","TWS (투어스)","",{handle:"tws_pledis",username:"TWS (투어스)",posts:"2540",followers:"363w",following:"1",account:"official",relationship:"关注"}),
  ...selectedAccounts,
  ...friends,
  make("ig-user-profile",profile.nickname,"",{handle:profile.nickname,username:profile.nickname,account:"user",followers:String(mutualCount),following:String(mutualCount+1),mutuals:String(mutualCount),followingOnly:"tws_pledis"})
 ];
 const exContact=profile.ex!==profile.crush?exMessages:[];
 const hanjinSelected=profile.crush==="hanjin"||profile.ex==="hanjin";
 const hanjinWechatMessages=hanjinSelected?(profile.crush==="hanjin"?hanjinWechat:buildMessages("hanjin",handles.hanjin,breakupText.hanjin,avatarFor("hanjin"))):[];
 const isPlaceholder=(item:Work["data"][string][number])=>/测试(用户|联系人|会话|消息|内容|回复|动态)/.test([item.title,item.body,item.sender].join(" "))||item.body==="这是一条测试内容。"||item.body==="这是一条测试消息。";
 const cleanedData=Object.fromEntries(Object.entries(work.data).map(([app,items])=>[app,items.filter(item=>!isPlaceholder(item))])) as Work["data"];
 cleanedData.instagram=(cleanedData.instagram||[]).filter(item=>item.meta.account==="official");
 const taobaoProducts=[
  ["bag-dior-ladydior","Dior Lady Dior 中号手袋",51000,"DIOR 迪奥官方旗舰店","藤格纹羊皮革，经典五格戴妃包。","奢侈品女包"],
  ["bag-dior-toujours","Dior Toujours 小号手袋",29000,"DIOR 迪奥官方旗舰店","小号牛皮革手袋，日常通勤款。","奢侈品女包"],
  ["bag-chanel-cf","CHANEL Classic Flap 中号口盖包",84000,"CHANEL 香奈儿精品店","经典菱格纹链条包。","奢侈品女包"],
  ["bag-chanel-mini","CHANEL Mini 迷你口盖包",58000,"CHANEL 香奈儿精品店","迷你尺寸经典链条包。","奢侈品女包"],
  ["bag-celine-triomphe","CELINE Teen Triomphe 凯旋门包",27000,"CELINE 思琳官方旗舰店","经典凯旋门金属扣饰肩背包。","奢侈品女包"],
  ["bag-celine-ava","CELINE Ava 腋下包",18500,"CELINE 思琳官方旗舰店","简洁弧形包身，牛皮革款。","奢侈品女包"],
  ["bag-lv-neverfull","Louis Vuitton Neverfull MM",15200,"Louis Vuitton 路易威登官方旗舰店","Monogram 帆布经典托特包。","奢侈品女包"],
  ["bag-lv-speedy","Louis Vuitton Speedy Bandoulière 25",23600,"Louis Vuitton 路易威登官方旗舰店","经典 Speedy 迷你波士顿包。","奢侈品女包"],
  ["bag-gucci-marmont","Gucci GG Marmont 小号肩背包",19500,"GUCCI 古驰官方旗舰店","双 G 标识绗缝皮革肩背包。","奢侈品女包"],
  ["bag-prada-reedition","Prada Re-Edition 2005 Re-Nylon",16000,"PRADA 普拉达官方旗舰店","再生尼龙迷你肩背包。","奢侈品女包"],
  ["bag-ysl-loulou","Saint Laurent LouLou 小号包",23500,"Saint Laurent 圣罗兰官方旗舰店","绗缝皮革包身与 YSL 标识。","奢侈品女包"],
  ["bag-loewe-puzzle","LOEWE Puzzle Edge 小号包",29500,"LOEWE 罗意威官方旗舰店","几何拼接结构小号手袋。","奢侈品女包"],
  ["bag-bottega-cassette","Bottega Veneta Cassette 编织包",22500,"Bottega Veneta 官方旗舰店","经典 Intrecciato 编织皮革包。","奢侈品女包"],
  ["bag-fendi-baguette","Fendi Baguette 中号法棍包",29800,"FENDI 芬迪官方旗舰店","标志性法棍廓形肩背包。","奢侈品女包"],
  ["bag-miumiu-wander","Miu Miu Wander 漫游包",18500,"Miu Miu 缪缪官方旗舰店","Matelassé 纳帕皮革腋下包。","奢侈品女包"],
  ["bag-balenciaga-lecity","Balenciaga Le City 小号机车包",18500,"BALENCIAGA 巴黎世家官方旗舰店","复古机车风皮革手袋。","奢侈品女包"],
  ["bag-hermes-picotin","Hermès Picotin 18 菜篮子",24000,"Hermès 爱马仕精品店","经典水桶包基础皮款参考价。","奢侈品女包"],
  ["bag-burberry-check","Burberry Check 肩背包",13800,"BURBERRY 博柏利官方旗舰店","品牌格纹拼接皮革肩背包。","奢侈品女包"],
  ["condom-durex-air","杜蕾斯 AIR 空气套 12只装",59,"杜蕾斯官方旗舰店","超薄天然乳胶避孕套，12只装。","避孕用品"],
  ["condom-jissbon-ultra","杰士邦超薄系列 12只装",49,"杰士邦官方旗舰店","超薄天然乳胶避孕套，12只装。","避孕用品"],
  ["condom-okamoto003","冈本 003 12只装",109,"冈本官方旗舰店","003 超薄系列，12只装。","避孕用品"],
  ["condom-sagami002","相模原装 0.02 6只装",129,"相模官方旗舰店","聚氨酯材质，6只装。","避孕用品"],
  ["condom-durex-mix","杜蕾斯多款组合装 24只",99,"杜蕾斯官方旗舰店","多款组合装。","避孕用品"],
  ["toy-remote-egg","APP远程遥控用品",369,"成人用品品牌旗舰店","手机 APP 远程控制，多档模式。","成人用品"]
 ];
 if(profile.xp==="GB")taobaoProducts.push(["toy-wearable","穿戴式假生殖器套装",499,"成人用品品牌旗舰店","可调节穿戴式设计，含固定带。","成人用品"]);
 const taobaoItems=taobaoProducts.map(([id,title,price,shop,body,category])=>{const item=make(String(id),String(title),String(body),{price:String(price),category:String(category),currency:"CNY",condition:"全新",sales:"店铺商品"}, "");item.sender=String(shop);return item;});
 const phoneDate=work.phone.date||new Date().toLocaleDateString("en-CA");
 const historyDate=(monthsAgo:number,day:number)=>{const base=new Date(phoneDate+"T12:00:00");const target=new Date(base.getFullYear(),base.getMonth()-monthsAgo,1,12);const last=new Date(target.getFullYear(),target.getMonth()+1,0).getDate();target.setDate(Math.min(day,last));const pad=(n:number)=>String(n).padStart(2,"0");return `${target.getFullYear()}-${pad(target.getMonth()+1)}-${pad(target.getDate())} ${day===6?"20:16":"22:08"}`;};
 const historicalOrders:ReturnType<typeof make>[]=[];
 if(profile.xp==="BG"){for(let m=12;m>=1;m--){for(const day of [6,21]){const product=taobaoItems.find(i=>i.id==="condom-durex-mix")!;const order=make("history-condom-"+m+"-"+day,product.title,product.body,{...product.meta,price:product.meta.price,quantity:"1",status:"已完成",number:"TB"+String(m).padStart(2,"0")+String(day)+"2026",paidBy:"支付宝余额"});order.sender=product.sender;order.folder="订单";order.time=historyDate(m,day);historicalOrders.push(order);}}}
 if(profile.xp==="GB"){const product=taobaoItems.find(i=>i.id==="toy-wearable")!;const order=make("history-wearable",product.title,product.body,{...product.meta,price:product.meta.price,quantity:"1",status:"已完成",number:"TB20260618",paidBy:"支付宝余额"});order.sender=product.sender;order.folder="订单";order.time=historyDate(5,18);historicalOrders.push(order);}
 const highFrequencyComments=["笑死我了","wtf","dnys","佛","留友看","起初人们没有在意","经赤郑经赤你被捕了","💐","纳尼","纳尼。","我看哭了","坤续","评论区有的人在显化什么"];
const lowFrequencyComments=["抱着必出金句的决心…","十二星座选择专属庇护所","快点补水吧！","你以为我不玩脆？"];
const randomThreadComment=()=>Math.random()<0.8?highFrequencyComments[Math.floor(Math.random()*highFrequencyComments.length)]:lowFrequencyComments[Math.floor(Math.random()*lowFrequencyComments.length)];

 const threadTexts=[
"tms我好像没允许你们开始","你性侵别人这辈子就完了 你一辈子都是强奸犯","高认知群体在听tms新歌","一天天在tms什么 tws很难打吗","tms到底飞升没有","原来你们都和卢关sl了才敢互动的啊 我以为大家都是陌生人","老雕居然没在养梦女 好恐怖","tms要养死侍吗","tms宁再当宁的免费男孩就全都给我滚","tws有没有hybe鼻","看看猫图","李涛ive谁胸最大","咖妹是真韩红啊","男女爱豆就应该住在两个星球","我要告诉崔英宰","我卸载threads了","脆用户平均年龄究竟几岁","这里不是川普超话吗","李涛脆女一是谁","韩娱有全员原生脸的吗","吐司亩别吵了好难看","tms新photoism怎么拍。","所以吴是温和朴元彬谁更有女人味","不是 為什麼大家都能看懂繁體字啊","谁想看tws鉴鸟我出一个","气候卡能不能回来","有没有二十块钱的黑五打折爱豆同款衣服","想问一下大家在韩国留学的租房都多少钱","掉漆们你们买kgma票了吗…","谁说fm在室内的","wvs影通已中 金道勋6xxx 韩振6xxx","有没有这次回归part大拉表","李在民你的子民欺负我","希望志强幸福…","𬶍家这姐弟神了","金道勋就是小黑猫呀小黑猫塑是正确的","宰比这次唱得太好听了吧我流猪泪了","灵润的头发是谁给他做的…","韩振又在勾引我","cody什么时候能滚"
 ];
 const shuffledThreadTexts=[...threadTexts].sort(()=>Math.random()-.5); const threadItems=shuffledThreadTexts.map((body,index)=>{const author=randId();const item=make("thread-"+index,body,body,{handle:author,reposts:String(Math.floor(Math.random()*900)),shares:String(Math.floor(Math.random()*500))});item.sender=author;item.folder="正在关注";item.likes=Math.floor(Math.random()*12000);item.comments=Array.from({length:Math.floor(Math.random()*180)},()=>randId()+": "+randomThreadComment());return item;});
 const extraThreadTexts=["美咖也太火了吧我觉得会登顶换代","猪肝红99新诚心出","zgk姐姐别来飒飒飒了","苹果这事应该给所有苹果用户赔一部ip18pm","一个暴论：t开头的男团都很贱","我发现喜欢了很久的女生是拉拉怎么办","感觉我舍敌有病","今天买了一件好大的衣服感觉我爸爸（不是申惟）都能穿上","打包出tws站台 直接dm","感觉宰比是呆比","好想哭好想我家明星","有没有给我讲讲那个qsz的瓜","我有一个小众怒点","冷静下来想想道牛会怎么做","唯粉活不起了是吧","这次回归新歌好好听啊啊啊","我怎么感觉收录曲比主打好听","现在的脆好难看","我的爸呀大哥去做做医美吧","不是战场在哪我怎么没刷到","自从知道泡菜妹在韩语里是拜金女的意思之后我再也没用过这个词，，","人真的得追一个长得好看的爱豆 追线下拍视频发pyq都有面儿","我自己麻辣一下我心肝就算了你们dyf在飒什么","我爱上top时：啊啊啊怎么又爱上top了 我不要拼车带人啊\\n我爱上mid时：他/她凭啥不是top啊 她比top好多了吧\\n我爱上back时 没有爱上过back。","女孩们一定不要粉一个性格和长相都完美契合你理想型的爱豆 万一他哪天犯了什么错让你很难过甚至于泪洒当场你也是脱不了粉的。我现在每天都被我前心肝儿折磨得一会神一会鬼 这么久了我还在想要不要原谅他因为他真的只是犯了所有人都会犯的错呀。但又没法回去粉他因为我一想到他做的事我就膈应 我觉得要精神分裂了","哎其实在粉圈待久了就会对一些事有敏锐的直觉了。比如我经常在看物料的时候能分别代入唯粉公公嬷嬷cp粉对家粉视角来分析一下这件事之后会往哪个方向吵😳","我每天都要熬到在床上翻个身都能觉得到头晕的程度才肯放下手坤睡觉","人们到底对微胖有什么误解啊 叶舒华以前那也能叫微胖吗 以前那只是正常身材 现在反而瘦得可怜人儿了😳","韩国到底研究出什么新科技了 之前出现一堆暴瘦的爱豆的时候你们说韩国有新减肥技术我没信 现在看到方时赫也瘦了之后我信了","到底什么是开荤感啊 又研究面相又研究什么身形体态穿搭气质语气眼神的 样本在哪对照在哪 没有数据支撑的话难道不只是在自己的认知半径里的主观推断吗😳我比起两年前也成熟不少 穿衣风格一夜之间变化巨大 体态变好了 面相也变了 待人处事方式更是大相径庭 我也没开荤啊。。","不看预录的你申它干嘛","完了预录开始卡中文名了","人脸上自然的纹路 黑眼圈 痘坑 毛孔 绒毛 皱纹 痣 疤痕 这些瑕疵是最性感最生动的东西","无条件相信所有男爱豆非母胎solo 现下非单身状态 坤坤使用次数大于等于一 但是你要真发个文字瓜出来咯噔的话那不就是造黄谣吗😳","女孩们我怎么感觉我对我心肝完全是生理性喜欢。","其实我最佩服柳智敏的不是她生日会唱了中文歌 而是她中英日韩的歌都唱了","你再讨厌张妮妮 她也只是一只萌兔子而已 你放下偏见看看她的脸 都是很可爱的宝宝","别再问我属性了连我自己到现在也不知道我到底是我担的公公嬷嬷梦女妈粉还是cpf"];
const extraThreads=extraThreadTexts.map((body,index)=>{const author=randId();const item=make("thread-extra-"+index,body,body,{handle:author,reposts:String(Math.floor(Math.random()*900)),shares:String(Math.floor(Math.random()*500))});item.sender=author;item.folder="正在关注";item.likes=Math.floor(Math.random()*12000);item.comments=Array.from({length:Math.floor(Math.random()*80)},()=>randId()+": "+randomThreadComment());return item;});

 const weiboRandomNames=["小狗不困","椰椰乌龙","momo","BlueHour","小林同学","cloudnine","今天也要早睡","Luna_07","海盐芝士","Nana酱","一颗糖","yuki_22","晚风不晚","Ming","橘子汽水","noah_kk","小熊软糖","April","睡不醒的鱼","阿布"];
 const weiboName=()=>weiboRandomNames[Math.floor(Math.random()*weiboRandomNames.length)];
 const chooseWeibo=(xs:string[])=>xs[Math.floor(Math.random()*xs.length)];
 const toiletComments=["看看缟纻猪肝","这不是挺好看的吗","评论区zgk来了","评论区别挽尊了","丑的好像另有其人","安利帖吧","长得好猥琐","这谁啊怎么长这样","面相好可怕…","这谁啊怎么出道的"];
 const sixGen=["ILLIT","BABYMONSTER","Hearts2Hearts","RESCENE","A2O LITE"];
 const bigbarComments=["能不能做点正事","评论区在说什么我们大吧已经够好了吧","怎么还有大吧zgk","好帅啊啊啊","萌……","好期待啊啊啊啊啊","这是在哪发的物料呀","笑死我了","好羡慕能去线下的","能不能换个美工"];
 const commonBathComments=["看看缟纻猪肝","美帝实火#"+chooseWeibo(["寻珍","雕勋","锐因","雕年","枪年","队忙"])+"tws唯一美帝#","缟纻别点了","gxjh又让你赚爽了吧","皮下到底审不审稿","完全"+chooseWeibo(["申惟","金道勋","崔英宰","韩振","韩志薰","李炅潣","月表","老蛙","丑人"])+"粉丝","完全。","底下控评的滚回去","只知道#"+chooseWeibo(["申惟","金道勋","崔英宰","韩振","韩志薰","李炅潣"])+"tws唯一top#"];
 const exFanComments=["脱愉","评论区在说什么 这不是花挺多的","羡慕缟纻文采","说的全是实话…","自证上哪偷的","就不能多相信他一点吗","抱着必出神稿的决心就这么做了","拉队友共沉沦什么意思","这不是公司要求的吗怪他干嘛","脱愉宝宝 公司太阴了","宝子你猪肝很明显"];
 const makeWeibo=(id:string,author:string,handle:string,body:string,comments:string[],folder:string)=>{
  const item=make(id,body,body,{handle,reposts:String(Math.floor(Math.random()*1800)),accountType:folder,source:folder});
  item.sender=author;item.folder=folder;item.likes=Math.floor(Math.random()*28000);
  item.comments=comments.map(text=>weiboName()+": "+text);
  return item;
 };
 const toiletPosts=[
  ["老公你现在好像流浪汉","不脱先踩丑老公","toilet_01"],
  ["这谁啊","不脱先踩丑老公","toilet_02"],
  ["月表怎么会来","不脱先踩丑老公","toilet_03"],
  ["能不能少吃点啊你这大脸盘子站队友旁边不觉得自卑吗","不脱先踩丑老公","toilet_04"],
  ["肥成啥了还想着吃","不脱先踩丑老公","toilet_05"],
  ["谁给他整的发型","不脱先踩丑老公","toilet_06"]
 ].map(([body,author,id])=>makeWeibo(id,author,"不脱先踩丑老公",body,toiletComments,"厕所"));
 const bathPosts=[
  ["大家觉得六代最有可能登顶的是哪个女团？\nILLIT、BABYMONSTER、Hearts2Hearts、RESCENE、A2O LITE","浴血奋战","bath_01"],
  ["李涛一下tms路人缘最好的是谁","浴血奋战","bath_02"],
  ["五颜一候选人杂志销量🈶 谁赢了？","浴血奋战","bath_03"],
  ["hybe真是顶级公关","浴血奋战","bath_04"],
  ["aespa生日会数据拉表来了","浴血奋战","bath_05"],
  ["李涛tms出道曲到底注没注","浴血奋战","bath_06"],
  ["tms十月wvs拉表","浴血奋战","bath_07"],
  ["KPOP六代男团十月破塔产出数排名","浴血奋战","bath_08"]
 ].map(([body,author,id],index)=>{
  const comments=index===0?[
   "注水的粉丝能不能别来沾边了","六团一是那个吧","缟纻别点了","看看缟纻猪肝","笑死我了","都不是","#"+chooseWeibo(sixGen)+"六团一#"
  ]:commonBathComments;
  return makeWeibo(id,author,"浴血奋战",body,comments,"厕所");
 });
 const exFanPosts=[
  ["我真的看不下去了 你很好 但是追你太累了","exfan_01"],
  ["滚吧负心汉 去下地狱","exfan_02"],
  ["我曾经那么爱你…你太伤粉丝心了 学生党花得不多 别审判我","exfan_03"]
 ].map(([body,id])=>makeWeibo(id,"脱粉回踩救钱包","脱粉回踩救钱包",body,exFanComments,"厕所"));
 const bigbarAccounts=[
  ["申惟shinyu_申吧","shinyu_bar"],["金道勋_sweet海","dohoon_bar"],["崔英宰_time","youngjae_bar"],
  ["韩振_heart海","hanjin_bar"],["韩志薰_farm","jihoon_bar"],["李炅潣_happy","kyungmin_bar"]
 ];
 const bigbarPosts=bigbarAccounts.flatMap(([author,handle],index)=>{
  const key=["shinyu","dohoon","youngjae","hanjin","jihoon","kyungmin"][index];
  const base="bar_"+key+"_";
  return [
   makeWeibo(base+"1",author,handle,"【饭拍】今日饭拍更新 #tws唯一门面#\n好帅呀…\ncr：logo\n近期大事汇总：微博正文",bigbarComments,"大吧"),
   makeWeibo(base+"2",author,handle,"【wvs】wvs回复更新\nwvs回复相关\n近期大事汇总：微博正文\n安利：微博正文",bigbarComments,"大吧"),
   makeWeibo(base+"3",author,handle,"【应援】\n仁川机场大屏\n应援已经上线～欢迎大家积极打卡\n近期大事汇总：微博正文\n安利：微博正文",bigbarComments,"大吧")
  ];
 });
 const weiboPosts=[...toiletPosts,...bathPosts,...exFanPosts,...bigbarPosts].sort(()=>Math.random()-.5);

 const historicalBills=historicalOrders.map(order=>{const bill=make("bill-"+order.id,order.title,"淘宝订单付款",{merchant:"淘宝 · "+order.sender,amount:"-¥"+order.meta.price,status:"支付成功",orderNumber:order.meta.number});bill.sender="淘宝";bill.folder="交易";bill.time=order.time;return bill;});
 const hiddenAppIds=new Set(["appstore","contacts","reminders","spotify","find"]);
 const cleanedApps=work.apps.map(app=>hiddenAppIds.has(app.id)?{...app,installed:false,visible:false,dock:false,folder:""}:app.id==="taobao"?{...app,installed:true,visible:true}:app);
 if(!cleanedApps.some(app=>app.id==="taobao"))cleanedApps.push({id:"taobao",name:"淘宝",installed:true,visible:true,dock:false,folder:"",icon:""});
 const personalized:Work={...work,apps:cleanedApps,phone:{...work.phone,owner:profile.nickname,passcode:profile.birthday.slice(-4),wallpaperImage:profile.homeWallpaper||profile.lockWallpaper},data:{...cleanedData,kakao:[...(cleanedData.kakao||[]),...crushMessages,...exContact],wechat:[...(cleanedData.wechat||[]),...hanjinWechatMessages],instagram:[...(cleanedData.instagram||[]).filter(item=>item.meta.account==="official"),...insta],threads:[...(cleanedData.threads||[]),...threadItems,...extraThreads],weibo:[...(cleanedData.weibo||[]).filter(item=>item.id!=="test-item-weibo"),...weiboPosts],taobao:[...(cleanedData.taobao||[]),...taobaoItems,...historicalOrders],alipay:[...(cleanedData.alipay||[]),...historicalBills]}};
 return <main className="story-runtime"><Phone key={session} work={personalized}/></main>;
}
createRoot(document.getElementById("root")!).render(<StoryPlayer/>);
