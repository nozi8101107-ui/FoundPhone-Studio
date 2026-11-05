import { useEffect, useRef, useState } from "react";
import type { Item, Work } from "../schema";

const names: Record<string,string> = { shinyu:"申惟", dohoon:"金道勋", youngjae:"崔英宰", hanjin:"韩振", jihoon:"韩志薰", kyungmin:"李炅潣" };
const realNames: Record<string,string> = { shinyu:"申正焕", dohoon:"金道勋", youngjae:"崔英宰", hanjin:"韩振", jihoon:"韩志薰", kyungmin:"李炅潣" };
const english: Record<string,string> = { shinyu:"SHINYU", dohoon:"DOHOON", youngjae:"YOUNGJAE", hanjin:"HANJIN", jihoon:"JIHOON", kyungmin:"KYUNGMIN" };
const handles: Record<string,string> = { shinyu:"tlswjdghks", dohoon:"doking", youngjae:"jae_e", hanjin:"henan_prince", jihoon:"ahoooon", kyungmin:"kyungman_lee" };
const blackNames: Record<string,string[]> = { shinyu:["老雕","大哥哥","甲谁"], dohoon:["老牛","黑牛"], youngjae:["丑年","宰割"], hanjin:["蛤蟆","大振哥"], jihoon:["强子","志强"], kyungmin:["娟子","卷子"] };
const pick = <T,>(a:T[]) => a[Math.floor(Math.random()*a.length)];

function makeComments(crush:string):string[] {
  const others=Object.keys(names).filter(id=>id!==crush);
  const otherName=()=>names[pick(others)];
  const otherBlack=()=>pick(blackNames[pick(others)]);
  const target=english[crush]||crush.toUpperCase();
  const targetName=names[crush]||target;
  const targetBlack=pick(blackNames[crush]||[targetName]);
  const pool=[
    `相信${target}`,
    "啊啊啊大晚上睡不着了",
    "我就知道",
    "啊啊啊终于等到",
    `plds狗公司为什么这种待遇${otherName()}从来没有过`,
    "再造谣的你等着吃子弹吧",
    "冷知识 那个谁当年也发公告了",
    "评论区有的人把你猪肝藏好",
    `${pick([otherName,otherBlack])()}粉丝道歉`,
    "hybe公关部绞尽脑汁才想出这么个东西吧",
    "是路人你就给我路过",
    "这么真的料不信的有了",
    "笑死你们看没看到那张图 今晚hybe一直亮着灯",
    `${pick([targetName,targetBlack])}你对得起谁 退团！`,
    "今年谈恋爱的好多啊",
    "黄泉路人都滚",
    "这公告好像ai写的",
    `${pick([targetName,targetBlack])} tws唯一恋爱咖`
  ];
  const shuffled=[...pool].sort(()=>Math.random()-.5);
  const users=["bluehour_03","only4tws","summer_0525","luvmybias","hanriver00","starrynight_7","twsarchive","moodmaker__","pocket_angel","daily_idol","cloudnine_kr","dear_my_youth","winterpeach","afterglow_17","staywithus","orbitingyou","plum_soda","midnighttalk","zero_o_clock","twinkle_404","mellowday","tws_lover","peachy_0525","myblue_7","wintertws"];
  const shuffledUsers=[...users].sort(()=>Math.random()-.5);
  const count=15+Math.floor(Math.random()*11);
  return Array.from({length:count},(_,i)=>`@${shuffledUsers[i%shuffledUsers.length]}：${shuffled[i%shuffled.length]}`);
}

function makeStatement(crush:string):Item {
  const stage=english[crush]||crush.toUpperCase();
  const body=
    "这里是PLEDIS Entertainment。\n\n"+
    "就今日部分媒体发布的关于本公司艺人TWS成员"+stage+"的相关报道，现向大家传达本公司的立场。\n\n"+
    "经向艺人本人确认，报道中提及的场合为艺人与友人之间的多人聚会，两人系朋友关系，并非报道所推测的恋爱关系。当日同行系多人相约见面后的自然同行，报道中所谓\"举止亲密\"等描述，系拍摄角度与光线造成的视觉误读，与事实不符。\n\n"+
    "本公司尊重艺人正常的私人社交生活，亦理解公众对艺人动向的关注。但恳请媒体与各位粉丝，切勿对非公众人士的私人生活进行过度解读与传播，以免给无关的素人造成困扰与伤害。\n\n"+
    "对于散布不实信息、侵犯艺人及素人隐私的行为，本公司将保留采取法律措施的权利。\n\n"+
    "今后本公司将继续支持艺人的演艺活动，也请大家继续给予TWS与成员"+stage+"不变的关心与喜爱。\n\n"+
    "谢谢大家。\n\nPLEDIS Entertainment";
  return {
    id:"chapter2-pledis-statement", title:"PLEDIS Entertainment", body, richText:"",
    meta:{handle:"PLEDIS_Entertainment",likesDisplay:"10w+",commentCount:"4000+",reposts:"3w+",story:"chapter2"},
    time:"00:30",sender:"PLEDIS_Entertainment",avatar:"",kind:"post",media:"",
    hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,
    likes:100000,comments:makeComments(crush)
  };
}

export function ChapterTwo({work,onNativeItem,onNativeNotification,onXPost,onXNotification,onPrompt,onChoices}:{
  work:Work;
  onNativeItem:(app:string,item:Item)=>void;
  onNativeNotification:(app:string,thread:string,item:Item)=>void;
  onXPost:(item:Item)=>void;
  onXNotification:(item:Item)=>void;
  onPrompt:(app:string,thread:string,text:string,token:number)=>void;
  onChoices:(choices:string[])=>void;
}) {
  const crush=String(work.variables.storyCrush||"shinyu");
  const app=crush==="hanjin"?"wechat":"kakao";
  const thread=(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]&&!i.outgoing)?.title||names[crush]||"聊天";
  const contact=(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]&&!i.outgoing&&i.avatar)||(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]);
  const remark=String(contact?.meta.remark||contact?.title||names[crush]||"对方");
  const avatar=crush==="hanjin"?import.meta.env.BASE_URL+"people/IMG_9702.jpeg":contact?.avatar||"";
  const xp=String(work.variables.storyXp||"BG").toUpperCase();
  const ex=String(work.variables.storyEx||"dohoon");
  const exApp=ex==="hanjin"?"wechat":"kakao";
  const exContact=(work.data[exApp]||[]).find(i=>i.meta.handle===handles[ex]&&!i.outgoing&&i.avatar)||(work.data[exApp]||[]).find(i=>i.meta.handle===handles[ex]);
  const exThread=exContact?.title||names[ex]||"聊天";
  const exRemark=String(exContact?.meta.remark||exContact?.title||names[ex]||"对方");
  const exAvatar=ex==="hanjin"?import.meta.env.BASE_URL+"people/IMG_9702.jpeg":exContact?.avatar||"";
  const part4ActiveRef=useRef(false);
  const nick=String(work.variables.storyNickname||"你");
  const userBirthday=String(work.variables.storyBirthday||"2006-08-10");
  const userOlderThanKyungmin=userBirthday<="2007-10-02";
  const userYoungerThanHanjin=userBirthday>"2006-02-05";
  const hanjinNick=nick+(userYoungerThanHanjin?"欧巴":"");
  const [part3Started,setPart3Started]=useState(false);
  const [part3Index,setPart3Index]=useState(0);
  const [part3Branch,setPart3Branch]=useState("");
  const [part4Started,setPart4Started]=useState(false);
  const [part4Index,setPart4Index]=useState(0);
  const [part4Branch,setPart4Branch]=useState("");
  const [part4Ended,setPart4Ended]=useState(false);
  const [replyToken,setReplyToken]=useState(3100);
  const flow=useRef<any[]>([]);
  const sendPrompt=(text:string)=>{setReplyToken(v=>v+1);callbacks.current.onPrompt(part4ActiveRef.current?exApp:app,part4ActiveRef.current?exThread:thread,text,replyToken+1);};
  const addChat=(body:string,outgoing:boolean,extra:Partial<Item>={})=>{
    const inPart4=part4ActiveRef.current;
    const targetApp=inPart4?exApp:app;
    const targetThread=inPart4?exThread:thread;
    const targetRemark=inPart4?exRemark:remark;
    const targetAvatar=inPart4?exAvatar:avatar;
    const targetHandle=inPart4?handles[ex]:handles[crush];
    const item:Item={id:"chapter2-"+(inPart4?"p4":"p3")+"-"+Date.now()+"-"+Math.random().toString(36).slice(2),title:targetThread,body,richText:"",meta:{story:"chapter2",handle:targetHandle,remark:targetRemark},time:inPart4?"00:53":"00:31",sender:outgoing?"我":targetRemark,avatar:outgoing?"":targetAvatar,kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing,read:false,likes:0,comments:[],...extra};
    callbacks.current.onNativeItem(targetApp,item);
    return item;
  };
  const p3First:Record<string,string[]>={
    shinyu:["我没事","怎么还没睡","说了让你先好好休息的"],
    dohoon:["你有什么好对不起的","啧","早知道就不叫你出来了"],
    youngjae:["是我对不起才对","抱歉 最近应该不能见面了"],
    hanjin:["没有没有我没事","不用对不起呀","怎么还没睡呀"],
    jihoon:["没没！","我没事耶","怎么还没睡！"],
    kyungmin:["没有没什么事","你不用道歉","我们很顺利就开完会了","你也快睡吧"]
  };
  const p3Choices:Record<string,string[]>={
    shinyu:["睡不着…","想等你"],dohoon:["ㅋㅋㅋ…","可是你不说我也会去找你"],
    youngjae:["noooo","啊…可是我不见你会难受的"],hanjin:["因为想等你么！","不放心你…"],
    jihoon:["等你来找我呀><","被消息吵醒了ㅋㅋ"],kyungmin:["嗯嗯 那我等下就睡了",userOlderThanKyungmin?"好可靠呢炅潣":"好可靠呢炅潣欧巴"]
  };
  const p3Branches:Record<string,string[][]>={
    shinyu:[["抱歉","让你不安了","以后我会更谨慎的"],["你不要这样","…","谢谢你","谢谢你等我","要是我开始变得依赖你了该怎么办"]],
    dohoon:[["哎…别笑","嗯 现在解决了","我突然想见你怎么办？","但是近期估计不方便了"],["…","你真是","！！！！！！！！"]],
    youngjae:[["ㅋㅋ","可爱呢","这段日子 我会常给你发kkt的^ ^"],["ㅋㅋ","我也是","那这段时间","常联系吧"]],
    hanjin:[["嘿嘿","你真好","谢谢你 看到你还在等我我很高兴","但是我也希望你可以早休息呀"],["hhhhhh","没事","就是那个什么d社太爱管闲事了！","我没事呀 你不用等我"]],
    jihoon:[["嘿嘿","我来找你了","我没什么事了耶"],["啊啊啊啊啊","我给你吵醒了吗！","米阿内……"]],
    kyungmin:[["嗯嗯！",nick+(userOlderThanKyungmin?"姐姐":"")+"快点睡噢","晚安"],["啊啊","怎么突然","不说了快睡吧快睡吧"]]
  };
  const p3Tail:Record<string,string[]>={
    shinyu:["明明你才让我更安心"],dohoon:["唉 最近不方便见面的话","多打打视频通话吧^-^"],
    youngjae:["嗯嗯！我也会经常给你发kkt的"],hanjin:["hh其实还是希望会能收到我消息的吧？","无论怎么样我都会等你的"],
    jihoon:["ㅋㅋ没什么事就好 你快回宿舍休息吧！"],kyungmin:["嗯嗯晚安 你也早睡"]
  };
  const beginPart3=()=>{
    if(part3Started)return;
    setPart3Started(true);setPart3Index(0);sendPrompt("我看到了");
  };
  const handlePart3Send=(text:string)=>{
    if(!part3Started||part4Started)return;
    addChat(text,true);
    if(part3Index<2){const next=["你没事吧","对不起"][part3Index];setPart3Index(v=>v+1);sendPrompt(next);return;}
    if(part3Index===2){
      (p3First[crush]||p3First.shinyu).forEach(m=>addChat(m,false));
      callbacks.current.onChoices(p3Choices[crush]||p3Choices.shinyu);
      setPart3Index(3);return;
    }
    if(part3Index===3){
      const choice=(p3Choices[crush]||p3Choices.shinyu).indexOf(text);
      setPart3Branch(String(Math.max(0,choice)));
      (p3Branches[crush]||p3Branches.shinyu)[Math.max(0,choice)].forEach(m=>addChat(m,false));
      callbacks.current.onChoices([]);
      const tail=p3Tail[crush]||p3Tail.shinyu;
      setPart3Index(4);
      sendPrompt(tail[0]);
      return;
    }
    const tail=p3Tail[crush]||p3Tail.shinyu;
    if(part3Index===4&&tail.length>1){setPart3Index(5);sendPrompt(tail[1]);return;}
    setPart3Index(6);
    window.setTimeout(()=>{setPart4Started(true);window.dispatchEvent(new CustomEvent("foundphone-chapter2-part4-ready"));},2000);
  };
  const p4End=(n:number)=>{setPart4Ended(true);try{localStorage.setItem("foundphone.chapter2.ending:"+work.id,JSON.stringify({ending:n,xp,ex,crush}));}catch{}window.setTimeout(()=>{window.dispatchEvent(new CustomEvent("foundphone-chapter2-ending",{detail:{ending:n}}));},1000);};
  const sendPart4Prompt=(text:string)=>sendPrompt(text);
  type P4Action = {type:"in";lines:string[]} | {type:"image";path:string} | {type:"prompt";text:string} | {type:"wait";ms:number} | {type:"choice";options:string[];branches:P4Action[][]} | {type:"end";ending:number};
  const I=(...lines:string[]):P4Action=>({type:"in",lines});
  const P=(text:string):P4Action=>({type:"prompt",text});
  const C=(options:string[],branches:P4Action[][]):P4Action=>({type:"choice",options,branches});
  const E=(ending:number):P4Action=>({type:"end",ending});
  const p4Flows:Record<string,Record<string,P4Action[]>>={
    BG:{
      shinyu:[I(String(realNames[crush]||crush)+"刚刚回来了","你们最近","见不了面了吧？"),P("关你什么事"),I("明天","我去你家楼下接你"),P("？？？你干嘛"),P("我跟你已经没有关系了"),P("你也想被拍？"),I("……","我会准备好的","鲜花","红酒","套我也买了"),C(["我不喝酒","……"],[[I("行"),E(1)],[P("房间号"),I("1107"),E(2)]])],
      dohoon:[I(String(realNames[crush]||crush)+"还真想得出来","“普通朋友”？？","喂","你喜欢那样的胆小鬼吗"),P("关你什么事"),I("关我什么事？","房间号3001","明天晚上"),C(["你放过我吧 我这两天很累了","……"],[[I("那我呢","……算了"),E(1)],[I("你来不来"),P("滚"),I("哈","不愿意来","那我明天去你家找你"),E(2)]])],
      youngjae:[I("明天有空吗"),P("？"),{type:"wait",ms:1000},I("明天我去你接你"),P("不是你有病啊我发不出去消息"),I("…"),C(["我不会去的","你这是通知吗"],[[I("……行"),E(1)],[I("我只是问你"),P("。"),I("^ ^","我明晚八点到"),E(2)]])],
      hanjin:[{type:"image",path:"wx/IMG_9985.jpeg"},P("？"),I("想见你","明天"),P("这位男士请你爱疯手机"),I("……","不好吗","我去接你"),C(["不好","什么时候"],[[I("。"),E(1)],[I("明晚八点","我会到你家楼下"),E(2)]])],
      jihoon:[I("你明天有事吗"),P("有事"),I("…","呀","骗人"),P("你有什么事"),I("我明天去找你好不好"),C(["你老实跳你的舞吧","你来干嘛"],[[E(1)],[I("还能干嘛","我想你了"),P("你想我了就直接来我家？"),I("嗯"),P("真好奇你的粉丝如果知道你这样之后会怎么想"),I("我买好套了","明晚八点到你家"),E(2)]])],
      kyungmin:[I("你在家吗"),P("？"),I("你现在在家吗 我去找你"),P("我现在不在家还能在哪"),P("你来我家干嘛"),P("这么晚了 你有病啊"),I("那我明天去找你","去你家","我的东西你还没扔吧"),C(["早扔了^ ^","你有病"],[[I("哈"),E(1)],[I("对","等着我吧"),E(2)]])]
    },
    GB:{
      shinyu:[I(String(names[crush]||crush)+"刚刚回来了","你们最近","见不了面了吧？"),P("关你什么事"),I("没什么事","想见你"),P("我跟你已经没有关系了"),{type:"image",path:"kkt/IMG_9986.jpeg"},I("我会准备好的"),C(["我不在意","色诱？"],[[I("行"),E(1)],[P("房间号"),I("1107","会让你满意的"),E(2)]])],
      dohoon:[I(String(names[crush]||crush)+"还真想得出来","“普通朋友”？？","喂","你喜欢那样的胆小鬼吗"),P("关你什么事"),I("关我什么事？","房间号3001","明天晚上","我从现在开始断食"),C(["现在才断食 明天会喷我一身吧","你自己灌？"],[[I("你他爸"),E(1)],[I("？","那你给我灌"),P("滚"),I("说好了","明晚八点"),E(2)]])],
      youngjae:[I("明晚八点在家等我"),P("？"),I("明天我去找你","^ ^"),C(["你觉得你对我还有吸引力？","你这是通知吗"],[[I("是我自负了"),E(1)],[I("我只是问你"),P("。"),I("^ ^","我明晚八点到","喜欢男仆装还是裸体围裙","露背毛衣？怎么样"),P("都不喜欢"),I("那我都带过去"),E(2)]])],
      hanjin:[I(hanjinNick),P("？"),I("想见你","明天"),P("别发骚"),I("……","不好吗","我去找你"),C(["不好","什么时候"],[[I("。"),E(1)],[I("明晚八点","我会到你家楼下",hanjinNick),E(2)]])],
      jihoon:[I("你明天在家吗",nick),P("有事"),I("…","呀","骗人的吧"),P("你有什么事"),I("我明天去找你"),{type:"image",path:"kkt/IMG_9993.jpeg"},C(["这招对我没用","脸都红透了^ ^"],[[I("。","好不容易才发出来"),E(1)],[I("。"),P("可爱"),I("嗯"),P("这么想我？"),I("我明晚八点到你家"),E(2)]])],
      kyungmin:[I("你在家吗"),P("？"),I("你现在在家吗","我想去找你"),P("我现在不在家还能在哪"),P("这么晚了来我家？"),P("你有病？"),I("那我明天再去找你","去你家","我的东西你还没扔吧"),C(["早扔了^ ^","这么急不可耐？"],[[I("哈"),E(1)],[I("对","等着我吧","明晚八点","我会准时到的"),E(2)]])]
    }
  };
  const p4Actions=useRef<P4Action[]>([]);
  const p4Cursor=useRef(0);
  const p4Waiting=useRef<"prompt"|"choice"|null>(null);
  const callbacks=useRef({onNativeItem,onNativeNotification,onXPost,onXNotification,onPrompt,onChoices});
  callbacks.current={onNativeItem,onNativeNotification,onXPost,onXNotification,onPrompt,onChoices};
  const runP4=()=>{
    while(p4Cursor.current<p4Actions.current.length){
      const action=p4Actions.current[p4Cursor.current++];
      if(action.type==="in"){action.lines.forEach(line=>addChat(line,false));continue;}
      if(action.type==="image"){addChat("",false,{kind:"image",media:import.meta.env.BASE_URL+action.path});continue;}
      if(action.type==="prompt"){p4Waiting.current="prompt";sendPrompt(action.text);return;}
      if(action.type==="wait"){window.setTimeout(runP4,action.ms);return;}
      if(action.type==="choice"){p4Waiting.current="choice";callbacks.current.onChoices(action.options);return;}
      if(action.type==="end"){p4Waiting.current=null;callbacks.current.onChoices([]);p4End(action.ending);return;}
    }
  };
  const startP4=()=>{
    if(part4Ended||part4ActiveRef.current)return;
    const branch=(xp==="GB"?"GB":"BG");
    part4ActiveRef.current=true;
    p4Actions.current=p4Flows[branch][ex]||p4Flows[branch].shinyu;
    p4Cursor.current=0;p4Waiting.current=null;setPart4Started(true);setPart4Index(0);runP4();
  };
  const delivered=useRef(false);


  useEffect(()=>{
    if(delivered.current)return;
    delivered.current=true;
    const messages=["开完会了","公司打算发声明","说只是朋友 普通聚餐"];
    const timers:number[]=[];
    messages.forEach((body,index)=>{
      timers.push(window.setTimeout(()=>{
        const item:Item={
          id:"chapter2-chat-"+index,title:thread,body,richText:"",
          meta:{story:"chapter2",handle:handles[crush],remark},time:"00:29",
          sender:remark,avatar,kind:"text",media:"",hidden:false,unlock:"",
          password:"",folder:"",favorite:false,outgoing:false,read:false,likes:0,comments:[]
        };
        callbacks.current.onNativeItem(app,item);
        callbacks.current.onNativeNotification(app,thread,item);
        if(index===messages.length-1){
          window.setTimeout(()=>{
            const post=makeStatement(crush);
            callbacks.current.onXPost(post);
            callbacks.current.onXNotification(post);
          },1000);
        }
      },900+index*1050));
    });
    return ()=>timers.forEach(window.clearTimeout);
  },[app,thread,remark,avatar,crush,work]);

  useEffect(()=>{
    const onThread=(e:Event)=>{const d=(e as CustomEvent).detail||{};if(d.app===app&&d.thread===thread&&localStorage.getItem("foundphone.chapter2.xOpened:"+work.id)==="1")beginPart3();};
    const onSend=(e:Event)=>{const d=(e as CustomEvent).detail||{};const expectedApp=part4ActiveRef.current?exApp:app;const expectedThread=part4ActiveRef.current?exThread:thread;if(d.app!==expectedApp||d.thread!==expectedThread)return;if(part4ActiveRef.current){handlePart4Send(String(d.text||""));return;}if(part3Started)handlePart3Send(String(d.text||""));};
    const onPart4=()=>startP4();
    window.addEventListener("foundphone-chapter2-thread-open",onThread);
    window.addEventListener("foundphone-story-send",onSend);
    window.addEventListener("foundphone-chapter2-part4-ready",onPart4);
    return()=>{window.removeEventListener("foundphone-chapter2-thread-open",onThread);window.removeEventListener("foundphone-story-send",onSend);window.removeEventListener("foundphone-chapter2-part4-ready",onPart4);};
  });
  const handlePart4Send=(text:string)=>{
    if(!p4Waiting.current)return;
    const blockedFirst = xp==="BG" && ex==="youngjae" && p4Cursor.current===2 && text==="？";
    addChat(text,true,blockedFirst?{meta:{story:"chapter2",handle:handles[crush],remark,blocked:"true"}}:{});
    if(p4Waiting.current==="choice"){
      const action=p4Actions.current[p4Cursor.current-1];
      if(action?.type!=="choice")return;
      const selected=action.options.indexOf(text);
      const branch=action.branches[Math.max(0,selected)]||[];
      p4Actions.current.splice(p4Cursor.current,0,...branch);
      callbacks.current.onChoices([]);
    }
    p4Waiting.current=null;
    setPart4Index(v=>v+1);
    runP4();
  };
  return null;
}
