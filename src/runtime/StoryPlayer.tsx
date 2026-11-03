import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { db } from "../persistence";
import { validateWork, type Work } from "../schema";
import { UserOnboarding, type UserProfile } from "./UserOnboarding";
import "../styles.css";
import "./player.css";
const KEY="foundphone.user-profile.v1";
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
 const labels:Record<string,string>={shinyu:"申惟",dohoon:"金道勋",youngjae:"崔英宰",hanjin:"韩振",jihoon:"志薰",kyungmin:"李炅潣"};
 const crushNames:Record<string,string>={shinyu:"晶㬊尼",dohoon:"小屎狗",youngjae:"居家服务型男",hanjin:"珍珍",jihoon:"击击击昏",kyungmin:"炅man"};
 const exNames:Record<string,string>={shinyu:"事多爹系天蝎男",dohoon:"不要理他！",youngjae:"远离双子男",hanjin:"不中",jihoon:"tws韩志薰",kyungmin:"李炅jiong潣min"};
 const handles:Record<string,string>={shinyu:"tlswjdghks",dohoon:"doking",youngjae:"jae_e",hanjin:"henan_prince",jihoon:"ahoooon",kyungmin:"kyungman_lee"};

 const make=(id:string,title:string,body:string,meta:Record<string,string>={},avatar="")=>({id,title,body,richText:"",meta,time:"2026-11-03 09:41",sender:labels[id]||title,avatar,kind:"text" as const,media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:0,comments:[] as string[]});
 const birthdayCompare=(a:string,b:string)=>a.localeCompare(b);
 const olderThan=(id:string)=>birthdayCompare(profile.birthday,({shinyu:"20031107",dohoon:"20050130",youngjae:"20050531",hanjin:"20060105",jihoon:"20060328",kyungmin:"20071002"} as Record<string,string>)[id]||"99999999")<0;
 const address=profile.nickname+(olderThan(profile.crush)?"姐姐":"");
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
 const buildMessages=(id:string,title:string,text:string,avatar:string)=>{let current="2026-10-01 09:00",n=0;return text.split("\n").flatMap((line)=>{if(!line.trim())return [];if(line.startsWith("@")){current=line.slice(1);return [];}const outgoing=line.startsWith("你：");let body=outgoing?line.slice(2):line;if(!outgoing)body=body.replaceAll("user",address);const item=make(id,title,body,{},avatar);item.id="personal-"+id+"-"+(++n);item.time=current;item.sender=outgoing?profile.nickname:labels[id];item.outgoing=outgoing;item.read=false;return [item];});};
 const avatarFor=(id:string)=>`${import.meta.env.BASE_URL}people/${id==="hanjin"?"jihoon":id==="jihoon"?"hanjin":id}.jpg`;
 const crushTitle=crushNames[profile.crush]||labels[profile.crush];
 const contacts=buildMessages(profile.crush,crushTitle,chatText[profile.crush]||"",avatarFor(profile.crush));
 const hanjinWechat=profile.crush==="hanjin"?buildMessages("hanjin","韩振",`@2026-10-01 19:20
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
你：okok`,avatarFor("hanjin")): [];
 const insta=[
  make("tws","TWS (투어스)","welcometoourBside",{handle:"tws_pledis",username:"TWS (투어스)",posts:"2540",followers:"363w",following:"1",account:"official"}),
  make(profile.crush,handles[profile.crush],"",{handle:handles[profile.crush],username:handles[profile.crush],account:"crush"}),
  make(profile.ex,handles[profile.ex],"",{handle:handles[profile.ex],username:handles[profile.ex],account:"ex"})
 ];
 const personalized:Work={...work,phone:{...work.phone,owner:profile.nickname,passcode:profile.birthday.slice(-4),wallpaperImage:profile.homeWallpaper||profile.lockWallpaper},data:{...work.data,kakao:[...(work.data.kakao||[]),...contacts],wechat:[...(work.data.wechat||[]),...hanjinWechat],instagram:[...(work.data.instagram||[]),...insta]}};
 return <main className="story-runtime"><Phone key={session} work={personalized}/></main>;
}
createRoot(document.getElementById("root")!).render(<StoryPlayer/>);
