import { useEffect, useRef, useState } from "react";
import type { Item, Work } from "../schema";

const memberNames:Record<string,string>={shinyu:"申正焕",dohoon:"金道勋",youngjae:"崔英宰",hanjin:"韩振",jihoon:"韩志薰",kyungmin:"李炅潣"};
const memberHandles:Record<string,string>={shinyu:"tlswjdghks",dohoon:"doking",youngjae:"jae_e",hanjin:"henan_prince",jihoon:"ahoooon",kyungmin:"kyungman_lee"};
const memberBirthdays:Record<string,string>={shinyu:"2003-11-07",dohoon:"2005-01-30",youngjae:"2005-05-31",hanjin:"2006-01-05",jihoon:"2006-03-28",kyungmin:"2007-10-02"};
const delay=()=>1000+Math.random()*1500;
type ExAction={type:"in";lines:string[]}|{type:"image";path:string}|{type:"prompt";text:string}|{type:"end"};
const I=(...lines:string[]):ExAction=>({type:"in",lines});
const P=(text:string):ExAction=>({type:"prompt",text});
const IMG=(path:string):ExAction=>({type:"image",path});
const END:ExAction={type:"end"};

export function ChapterThree({work,onNativeItem,onNativeNotification,onXPost,onXNotification,onPrompt,onFinish}:{work:Work;onNativeItem:(app:string,item:Item)=>void;onNativeNotification:(app:string,thread:string,item:Item)=>void;onXPost:(item:Item)=>void;onXNotification:(item:Item)=>void;onPrompt:(app:string,thread:string,text:string,token:number)=>void;onFinish:()=>void}){
 const crush=String(work.variables.storyCrush||"shinyu");
 const crushName=memberNames[crush]||crush;
 const crushApp=crush==="hanjin"?"wechat":"kakao";
 const crushSeed=(work.data[crushApp]||[]).find(i=>i.meta?.handle===memberHandles[crush]&&!i.outgoing);
 const crushThread=crushSeed?.title||crushName;
 const crushRemark=String(crushSeed?.meta?.remark||crushSeed?.title||crushName);
 const crushAvatar=crushSeed?.avatar||"";
 const ex=String(work.variables.storyEx||"dohoon");
 const exName=memberNames[ex]||ex;
 const xp=String(work.variables.storyXp||"BG").toUpperCase()==="GB"?"GB":"BG";
 const exApp=ex==="hanjin"?"wechat":"kakao";
 const exSeed=(work.data[exApp]||[]).find(i=>i.meta?.handle===memberHandles[ex]&&!i.outgoing);
 const exThread=exSeed?.title||memberNames[ex]||ex;
 const exRemark=String(exSeed?.meta?.remark||exSeed?.title||memberNames[ex]||ex);
 const exAvatar=exSeed?.avatar||"";
 const nick=String(work.variables.storyNickname||"你");
 const birthday=String(work.variables.storyBirthday||"2006-08-10").replace(/[^0-9]/g,"").padEnd(8,"0").slice(0,8);
 const crushBirthday=String(work.variables["storyCrushBirthday"]||work.variables["storyCrushBirth"]||memberBirthdays[crush]||"2003-11-07").replace(/[^0-9]/g,"").padEnd(8,"0").slice(0,8);
 const nickEnglish=String(work.variables.storyNicknameEnglish||nick).toLowerCase().replace(/[^a-z0-9]/g,"")||"user";
 const phone="010"+birthday.slice(-4)+crushBirthday.slice(-4);
 const friendThread="闺蜜", buddyThread="搭子", groupThread="🍂的预录打歌群2群", sellerThread="票务 🍂打歌🎫代申";
 const chapterTwoEnding=(()=>{try{return Number(JSON.parse(localStorage.getItem("foundphone.chapter2.ending:"+work.id)||"{}").ending||1);}catch{return 1;}})();
 const branch=chapterTwoEnding===2?"3(2)":"3(1)";
 const [,setStep]=useState(0);
 const stepRef=useRef(0);
 const tokenRef=useRef(7300);
 const timers=useRef<number[]>([]);
 const index=useRef(0);
 const done=useRef(false);
 const groupViewed=useRef(false);
 const transferTotal=useRef(0);
 const transferAttempts=useRef(0);
 const blacklisted=useRef(false);
 const refundItemId=useRef("");
 const exFlow=useRef<ExAction[]>([]);
 const exCursor=useRef(0);
 let runEx:()=>void;
 const exRunning=useRef(false);
 const go=(n:number)=>{stepRef.current=n;setStep(n);};
 const prompt=(app:string,thread:string,text:string)=>{tokenRef.current+=1;onPrompt(app,thread,text,tokenRef.current);};
 const item=(app:string,thread:string,sender:string,body:string,outgoing=false,extra:Partial<Item>={})=>{
  const it:Item={id:"chapter3-"+stepRef.current+"-"+Date.now()+"-"+Math.random().toString(36).slice(2),title:thread,body,richText:"",meta:{story:"chapter3",handle:app==="kakao"?memberHandles[crush]:"",remark:sender},time:stepRef.current>=12?"19:29":stepRef.current===5?"10:29":"10:01",sender:outgoing?"我":sender,avatar:outgoing?String(work.variables.storyUserAvatar||""):app===crushApp?crushAvatar:app===exApp?exAvatar:"",kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing,read:false,likes:0,comments:[],...extra};
  onNativeItem(app,it);return it;
 };
 const incoming=(app:string,thread:string,sender:string,lines:string[],doneFn:()=>void,extra:Partial<Item>={})=>{
  let n=0;const run=()=>{if(n>=lines.length){doneFn();return;}const t=window.setTimeout(()=>{const it=item(app,thread,sender,lines[n++],false,extra);onNativeNotification(app,thread,it);run();},delay());timers.current.push(t);};run();
 };
 const send=(app:string,thread:string,text:string,next:()=>void,extra:Partial<Item>={})=>{item(app,thread,"我",text,true,extra);next();};
 const crushImage=crush==="hanjin"?"wx/IMG_0152.jpeg":({
  shinyu:"kkt/IMG_0140.jpeg",
  dohoon:"kkt/weverse_20261106200813_1675918858.jpeg",
  youngjae:"kkt/IMG_0144.jpeg",
  jihoon:"kkt/weverse_20261106202005_3242968375.jpeg",
  kyungmin:"kkt/weverse_20261106202448_2704130200.jpeg"
 } as Record<string,string>)[crush]||"kkt/IMG_0140.jpeg";
 const sendPart3Image=(app:string,thread:string,sender:string,path:string,time="06:14")=>{
  const it=item(app,thread,sender,"",false,{time,kind:"image",media:"/"+path,meta:{story:"chapter3",handle:app==="wechat"?"":memberHandles[crush]||"",remark:sender}});
  onNativeNotification(app,thread,it);
 };
 const finishPart3=(which:string)=>{
  startPart4(which);
 };
 const part4Actions=useRef<Array<{type:"in"|"prompt";thread:string;text?:string;lines?:string[];time:string}>>([]);
 const part4Cursor=useRef(0);
 const part4Waiting=useRef(false);
 const part4Active=useRef(false);
 const runPart4=()=>{
  if(!part4Active.current||part4Waiting.current)return;
  const action=part4Actions.current[part4Cursor.current];
  if(!action){
   done.current=true;
   window.dispatchEvent(new CustomEvent("foundphone-chapter3-part5-ready",{detail:{branch}}));
   onFinish();
   return;
  }
  if(action.type==="in"){
   part4Cursor.current++;
   incoming("wechat",action.thread,action.thread==="搭子"?"搭子":"闺蜜",action.lines||[],()=>runPart4(),{time:action.time});
  }else{
   part4Waiting.current=true;
   // The prompt is surfaced only after the player opens the corresponding conversation.
  }
 };
 const startPart4=(which:string)=>{
  done.current=false;part4Active.current=true;part4Waiting.current=false;part4Cursor.current=0;
  const common=[
   {type:"in" as const,thread:"搭子",lines:["宝宝你到了吗","马上要check了","这边在排队了！"],time:"06:22"},
   {type:"prompt" as const,thread:"搭子",text:"到了到了！我看到你了",time:"06:22"},
   {type:"in" as const,thread:"搭子",lines:["好！"],time:"06:22"},
  ];
  const branchOne=[
   {type:"in" as const,thread:"搭子",lines:["你回家路上注意安全！"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"好！你也是！",time:"09:47"},
   {type:"in" as const,thread:"搭子",lines:["哎呀 今天好激动呀",crushName+"今天也一直在给你饭撒耶","逆应援也好好吃！！"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"对呀对呀 好幸运呀",time:"09:47"},
   {type:"in" as const,thread:"搭子",lines:["感觉你和你爱豆是正缘吧ㅠㅠ","感觉他今天一直在看你……你要粉这个人一辈子了"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"是的呀……",time:"09:47"},
   {type:"in" as const,thread:"闺蜜",lines:["怎么样 你们录完了吧"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"刚录完",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我不行了 我跟你说",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我今天不是和我搭子一起看的预录嘛",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["昂 对"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"今天"+crushName+"一直在看我",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我搭子也发现了",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我搭子就说我真的好幸运 追到正缘了",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["……好地狱","她居然一直被蒙在鼓里"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"。",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我都有点对不起她",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["哈哈哈哈哈哈哈没事","其实告诉她了她受到的伤害会更大吧！",nick+"大胆飞 诡秘永相随。"],time:"09:50"}
  ];
  const branchTwo=[
   {type:"in" as const,thread:"搭子",lines:["你回家路上注意安全！"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"好！你也是！",time:"09:47"},
   {type:"in" as const,thread:"搭子",lines:["哎呀 今天好激动呀",exName+"今天往这边看了好几眼！","他是不是看到我手上写的字啦","我真的要粉他一辈子了……","他真的好宠粉呜呜我保证他是天使","还有"+crushName+"今天也一直在给你饭撒耶"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"对呀对呀 好幸运呀",time:"09:47"},
   {type:"in" as const,thread:"搭子",lines:["咱俩追的这两个人都是正缘吧ㅠㅠ","感觉咱俩要粉这两个人一辈子了"],time:"09:47"},
   {type:"prompt" as const,thread:"搭子",text:"是的呀……",time:"09:47"},
   {type:"in" as const,thread:"闺蜜",lines:["怎么样 你们录完了吧"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"刚录完",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我不行了 我跟你说",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"我今天不是和我搭子一起看的预录嘛",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["昂 对","我记得她是不是喜欢"+exName+"来着？"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"对……",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"今天"+exName+"一直在看我这边",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"结果我搭子以为他是在给她饭撒……",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["……好地狱","等一下 "+exName+"看你干嘛？","他还对你余情未了啊？"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"。",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"其实昨晚我又和他法了。",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["。？？"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"都怪他勾引我",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"呃。",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["啊？那"+crushName+"呢？"],time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"不知道。",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"诡秘你会因此讨厌我吗",time:"09:50"},
   {type:"prompt" as const,thread:"闺蜜",text:"可我只是一个被两个漂亮男人迷惑的可怜女人",time:"09:50"},
   {type:"in" as const,thread:"闺蜜",lines:["……没事诡秘你大胆去做吧",nick+"大胆飞 诡秘永相随。"],time:"09:50"}
  ];
  part4Actions.current=[...common,...(which==="3(1)"?branchOne:branchTwo)];
  go(16);index.current=0;
  incoming("wechat",buddyThread,"搭子",["宝宝你到了吗","马上要check了","这边在排队了！"],()=>{
   part4Waiting.current=true;
  },{time:"06:22"});
 };
 const startPart3=()=>{
  done.current=false;go(13);index.current=0;
  incoming("wechat",buddyThread,"搭子",["宝宝你快到了吗","还有15分钟就要check了"],()=>prompt("wechat",buddyThread,"快啦快啦 我在车上 还有八分钟左右吧"),{time:"06:14"});
 };
 const start=()=>{
  if(done.current||stepRef.current!==0)return;
  try{localStorage.setItem("foundphone.chapter3.branch:"+work.id,branch);}catch{}
  go(1);
  const post:Item={id:"chapter3-tws-comeback-d2",title:"TWS",body:"[#TWS]  COMING SOON 🔥\nD-2\n再过两天就能见到42了\n准备好了吗？💙\n#TWS #투어스 #COMEBACK",richText:"",meta:{handle:"TWS_PLEDIS",likesDisplay:"9920",reposts:"5000",views:"20万"},time:"10:00",sender:"TWS",avatar:import.meta.env.BASE_URL+"youtube/channels4_profile.jpeg",kind:"post",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:9920,comments:[]};
  const t=window.setTimeout(()=>{onXPost(post);onXNotification(post);},1000);timers.current.push(t);
 };
 const startEx=()=>{
  const userOlderThanHanjin=birthday<"2006-01-05";
  const hanjinNick=nick+(userOlderThanHanjin?"姐姐":"");
  const bg:Record<string,ExAction[]> = {
   shinyu:[I("你出发了吗","我到了 在等你"),P("我马上出发"),I("嗯","路上小心"),END],
   dohoon:[I("我快到你家楼下了"),P("这么快"),P("你买好套了吗"),I("当然","等着我"),END],
   youngjae:[I("我马上到"),P("怎么这么快"),I("嗯","到了","我现在上楼"),END],
   hanjin:[I("我快到了","你准备下楼吧"),P("好快"),I("因为想快点见到你"),END],
   jihoon:[I("我马上到！"),P("好的"),I("三分钟","等我"),END],
   kyungmin:[I("我马上就到","密码还是我生日吧？"),P("……是"),I("嗯","我就知道"),END]
  };
  const gb:Record<string,ExAction[]> = {
   shinyu:[I("你出发了吗","我已经准备好了"),P("我马上出发"),I("可不要迟到","我会等得很难受的"),P("会难受到哭吗 想看"),I("……"),END],
   dohoon:[I("我都做好事前准备了","你出发了吗"),P("我现在出发 二十分钟到"),I("ok"),IMG("kkt/IMG_0101.jpeg"),P("穿这么多给谁看"),I("穿得少的版本等你来了亲眼看"),END],
   youngjae:[IMG("kkt/IMG_0104.jpeg"),I("马上出发 十五分钟到"),P("？"),P("说好的男仆装 裸体围裙 露背毛衣呢"),I("？","我还要出门坐车过去"),P("你现在就穿 另外两件也带过来"),P("害臊就在外面套个风衣^ ^"),I("……行"),END],
   hanjin:[I(hanjinNick,"我马上到"),P("看看脸"),I("……","马上到了 到时候再看嘛","不光能看脸","你想看的话 哪里都可以哦"),P("……"),I("迫不及待了吧^ ^","等我"),END],
   jihoon:[I("我马上到了！"),P("好"),I("怎么这么冷淡","不期待吗"),P("你猜我在用哪打字？"),I("……？","你长出来了？"),P("哈哈 当然是用手打字啊"),I("……","今天不搞到你腱鞘炎我就随妻姓"),END],
   kyungmin:[I("我大概还有五分钟到"),P("嗯好"),I("密码还是我生日吧？"),P("对"),P("你直接进来"),I("好"),IMG("kkt/weverse_20261106164830_753070257.jpeg"),P("穿的什么 看不清"),I("外面穿了一件外套"),P("里面呢"),I("你等会自己看看"),END]
  };
  exFlow.current=(xp==="GB"?gb:bg)[ex]||((xp==="GB"?gb:bg).shinyu);
  exCursor.current=0;exRunning.current=false;go(12);runEx();
 };
 runEx=()=>{
  if(exRunning.current||done.current)return;
  const action=exFlow.current[exCursor.current++];
  if(!action)return;
  if(action.type==="prompt"){prompt(exApp,exThread,action.text);return;}
  if(action.type==="end"){startPart3();return;}
  exRunning.current=true;
  const t=window.setTimeout(()=>{
   if(action.type==="in"){
    const lines=action.lines;let n=0;
    const deliver=()=>{if(n>=lines.length){exRunning.current=false;runEx();return;}const it=item(exApp,exThread,exRemark,lines[n++],false,{time:"19:29",meta:{story:"chapter3",handle:memberHandles[ex]||"",remark:exRemark}});onNativeNotification(exApp,exThread,it);const next=window.setTimeout(deliver,delay());timers.current.push(next);};
    deliver();
   }else{
    const it=item(exApp,exThread,exRemark,"",false,{time:"19:29",kind:"image",media:"/"+action.path,meta:{story:"chapter3",handle:memberHandles[ex]||"",remark:exRemark}});
    onNativeNotification(exApp,exThread,it);exRunning.current=false;runEx();
   }
  },delay());timers.current.push(t);
 };
 useEffect(()=>{
  start();
  const onCalendar=()=>start();
  const onXOpen=()=>{if(stepRef.current===1)go(2);};
  const onThread=(e:Event)=>{
   const d=(e as CustomEvent).detail||{};
   if(stepRef.current===2&&d.app===crushApp&&d.thread===crushThread){prompt(crushApp,crushThread,"后天要回归了！");return;}
   if(d.app==="wechat"&&d.thread===groupThread&&stepRef.current===4){groupViewed.current=true;return;}
   if(d.app==="wechat"&&d.thread===friendThread&&stepRef.current===4&&groupViewed.current){go(5);prompt("wechat",friendThread,"预录代申怎么这么贵");return;}
   if(d.app==="wechat"&&d.thread===sellerThread&&stepRef.current===6){index.current=9;prompt("wechat",sellerThread,"宝宝 tws代申还接吗");return;}
   if(d.app==="wechat"&&d.thread===buddyThread&&stepRef.current===7){prompt("wechat",buddyThread,"去的去的");return;}
   if(d.app==="wechat"&&d.thread===sellerThread&&stepRef.current===8){prompt("wechat",sellerThread,"omg！");return;}
   if(d.app==="wechat"&&d.thread===buddyThread&&stepRef.current===10){prompt("wechat",buddyThread,"我中了！！！");return;}
   if(part4Active.current&&part4Waiting.current){
    const a=part4Actions.current[part4Cursor.current];
    if(a?.type==="prompt"&&a.thread===d.thread){prompt("wechat",d.thread,a.text||"");}
   }
   
  };
  const onSend=(e:Event)=>{
   const d=(e as CustomEvent).detail||{};const text=String(d.text||"");
   const s=stepRef.current;
   if(done.current)return;
   if(s===2&&d.app===crushApp&&d.thread===crushThread){
    send(crushApp,crushThread,text,()=>{if(index.current===0){index.current++;prompt(crushApp,crushThread,"好期待呀");}else if(index.current===1){index.current++;prompt(crushApp,crushThread,"加油噢");}else if(index.current===2){index.current++;incoming(crushApp,crushThread,crushRemark,["嗯嗯……","会努力的","最近回归期好累","好想见你 但是不能……"],()=>prompt(crushApp,crushThread,"我也想……"));}else{go(3);incoming("wechat",friendThread,"闺蜜",["闺蜜闺蜜","tms又要回归了","居然就在后天 我还没有实感"],()=>prompt("wechat",friendThread,"看到了！"));}});
    return;
   }
   if(s===3&&d.app==="wechat"&&d.thread===friendThread){
    send("wechat",friendThread,text,()=>{if(index.current===3){index.current++;prompt("wechat",friendThread,"话说前两天发的预告我还没看……");}else if(index.current===4){index.current++;incoming("wechat",friendThread,"闺蜜",["笑死 你都收到无数张未公开自拍了吧","这个预告照不看也罢"],()=>prompt("wechat",friendThread,"哎呀哎呀"));}else{go(4);const t=window.setTimeout(()=>{const g=item("wechat",groupThread,"票务 🍂打歌🎫代申","Tws 人歌sbs\n韩文名400 英文名800中后付\n申请时间：16:40");onNativeNotification("wechat",groupThread,g);},delay());timers.current.push(t);}});
    return;
   }
   if(s===5&&d.app==="wechat"&&d.thread===friendThread){
    send("wechat",friendThread,text,()=>{if(index.current===5){index.current++;prompt("wechat",friendThread,"比别的团都贵");}else if(index.current===6){index.current++;prompt("wechat",friendThread,"你说我要不要去看");}else if(index.current===7){index.current=8;incoming("wechat",friendThread, "闺蜜",["看吧看吧","不是正好你和"+crushName+"最近不方便见面","想他就去看看"],()=>prompt("wechat",friendThread,"有道理 那我去找代申"));}else if(index.current===8){go(6);}});
    return;
   }
   if(s===6&&d.app==="wechat"&&d.thread===sellerThread){
    send("wechat",sellerThread,text,()=>{if(index.current===9){index.current++;incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["接的接的","TWS 人歌预录代申\n申请时间：16:40\n下单格式：\n邮箱：\n密码：\n姓名：\n出生年月日：\n手机号码：","宝宝按这个格式下单！"],()=>prompt("wechat",sellerThread,"TWS 人歌预录代申\n申请时间：16:40\n下单格式：\n邮箱："+nickEnglish+"@mail.com\n密码："+nickEnglish+birthday.slice(-4)+"\n姓名："+nickEnglish+"\n出生年月日："+birthday+"\n手机号码："+phone));}else if(index.current===10){index.current++;incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["好的收到！","宝宝记得关闭限制海外登录哦"],()=>prompt("wechat",sellerThread,"好的👌"));}else{index.current=0;go(7);const t=window.setTimeout(()=>incoming("wechat",buddyThread,"搭子",["宝宝 你去看这次首次打歌吗"],()=>{}),2000);timers.current.push(t);}});
    return;
   }
   if(s===7&&d.app==="wechat"&&d.thread===buddyThread){
    send("wechat",buddyThread,text,()=>{if(index.current===0){index.current++;prompt("wechat",buddyThread,"刚找了代申 不知道");}else{index.current=0;incoming("wechat",buddyThread, "搭子",["我也刚找了代申！","希望能中"],()=>{const t=window.setTimeout(()=>{const msg=item("wechat",sellerThread,"票务 🍂打歌🎫代申","宝宝 中了！39号！");onNativeNotification("wechat",sellerThread,msg);go(8);},1000);timers.current.push(t);});}});
    return;
   }
   if(s===8&&d.app==="wechat"&&d.thread===sellerThread){
    send("wechat",sellerThread,text,()=>{if(index.current===0){index.current++;prompt("wechat",sellerThread,"好的好的！800是吗");}else if(index.current===1){index.current++;window.dispatchEvent(new CustomEvent("foundphone-story-transfer-enable",{detail:{thread:sellerThread,recipient:sellerThread}}));go(9);}});
    return;
   }
   if(s===9&&d.app==="wechat"&&d.thread===sellerThread){
    if(blacklisted.current){item("wechat",sellerThread,"我",text,true,{meta:{story:"chapter3",blocked:"true",remark:"我"}});return;}
   }
   if(s===10&&d.app==="wechat"&&d.thread===buddyThread){
    send("wechat",buddyThread,text,()=>{if(index.current===0){index.current++;incoming("wechat",buddyThread,"搭子",["我也中了！！！啊啊啊啊","你是多少号","我这次号很小"],()=>prompt("wechat",buddyThread,"我也挺小的！我39号"));}else if(index.current===1){index.current++;incoming("wechat",buddyThread,"搭子",["？？？？？wtf","我40号啊"],()=>prompt("wechat",buddyThread,"这也太巧了吧"));}else if(index.current===2){index.current++;prompt("wechat",buddyThread,"那我们到时候见");}else{index.current=0;incoming("wechat",buddyThread,"搭子",["嗯嗯！"],()=>{if(branch==="3(1)"){startPart3();}else{go(11);const t=window.setTimeout(()=>startEx(),delay());timers.current.push(t);}});}});
    return;
   }


   if(part4Active.current&&s>=16&&s!==161&&d.app==="wechat"&&(d.thread===buddyThread||d.thread===friendThread)){
    const a=part4Actions.current[part4Cursor.current];
    if(a?.type==="prompt"&&a.thread===d.thread){
     item("wechat",d.thread,"我",text,true,{time:a.time,meta:{story:"chapter3",remark:"我"}});
     part4Cursor.current++;part4Waiting.current=false;
     const next=part4Actions.current[part4Cursor.current];
     if(next?.type==="in"){
      part4Cursor.current++;
      incoming("wechat",next.thread,next.thread==="搭子"?"搭子":"闺蜜",next.lines||[],()=>{part4Waiting.current=true;const upcoming=part4Actions.current[part4Cursor.current];if(upcoming?.type==="prompt"&&upcoming.thread===next.thread)prompt("wechat",next.thread,upcoming.text||"");},{time:next.time});
     }else if(next?.type==="prompt"){
      if(next.thread===d.thread){part4Waiting.current=true;prompt("wechat",next.thread,next.text||"");}
      else {part4Waiting.current=true;}
     }else runPart4();
    }
    return;
   }
   if(s===13&&d.app==="wechat"&&d.thread===buddyThread){
    send("wechat",buddyThread,text,()=>{go(131);incoming("wechat",buddyThread,"搭子",["嗯嗯好"],()=>{const t=window.setTimeout(()=>{go(14);sendPart3Image(crushApp,crushThread,crushRemark,crushImage);incoming(crushApp,crushThread,crushRemark,["醒了吗","刚做完妆造 在路上","今天第一天打歌"],()=>prompt(crushApp,crushThread,"醒啦！"),{time:"06:14"});},1000);timers.current.push(t);},{time:"06:14"});});
    return;
   }
   if(s===14&&d.app===crushApp&&d.thread===crushThread){
    send(crushApp,crushThread,text,()=>{
     if(index.current===0){index.current++;incoming(crushApp,crushThread,crushRemark,["醒得好早"],()=>prompt(crushApp,crushThread,"对呀"),{time:"06:14"});}
     else if(index.current===1){index.current++;prompt(crushApp,crushThread,"你猜猜是为什么");}
     else if(index.current===2){index.current++;incoming(crushApp,crushThread,crushRemark,["答对有奖励吗"],()=>prompt(crushApp,crushThread,"你先猜猜^ ^"),{time:"06:14"});}
     else if(index.current===3){index.current++;incoming(crushApp,crushThread,crushRemark,["难道你今天要来看打歌？"],()=>prompt(crushApp,crushThread,"bingo！猜对了"),{time:"06:14"});}
     else if(index.current===4){index.current++;prompt(crushApp,crushThread,"奖励是今天可以见面");}
     else if(index.current===5){index.current++;prompt(crushApp,crushThread,"我是39号 应该站在第二排 记得找我噢");}
     else{
      index.current=0;
      incoming(crushApp,crushThread,crushRemark,["ㅋㅋㅋ好"],()=>{
       if(branch==="3(1)")finishPart3("3(1)");
       else{const t=window.setTimeout(()=>{go(15);incoming(exApp,exThread,exRemark,["刚刚"+crushName+"给你发消息了是不是？"],()=>prompt(exApp,exThread,"？你怎么知道"),{time:"06:14"});},1000);timers.current.push(t);}
      },{time:"06:14"});
     }
    },{time:"06:14"});
    return;
   }
   if(s===15&&d.app===exApp&&d.thread===exThread){
    send(exApp,exThread,text,()=>{
     if(index.current===0){index.current++;incoming(exApp,exThread,exRemark,["我和他坐在一辆车上啊^ ^"],()=>prompt(exApp,exThread,"……"),{time:"06:14"});}
     else if(index.current===1){index.current++;incoming(exApp,exThread,exRemark,["昨天晚上我们折腾到那么晚","你今天还能起这么早来看打歌？"],()=>prompt(exApp,exThread,"你也很厉害 还能上去唱跳rap呢^ ^"),{time:"06:14"});}
     else if(index.current===2){
      index.current++;
      sendPart3Image(exApp,exThread,exRemark,crushImage);
      incoming(exApp,exThread,exRemark,["他给你发自拍了吧",(["shinyu","youngjae","jihoon"].includes(ex)?"我怎么样":"我们谁更帅一点？")],()=>prompt(exApp,exThread,"……无聊"),{time:"06:14"});
     }
     else if(index.current===3){index.current++;incoming(exApp,exThread,exRemark,["你今天多少号 靠前吗？"],()=>prompt(exApp,exThread,"我是39号 大概在第二排吧"),{time:"06:14"});}
     else{index.current=0;incoming(exApp,exThread,exRemark,["ok"],()=>finishPart3("3(2)"),{time:"06:14"});}
    },{time:"06:14"});
    return;
   }

   if(s===16&&d.app==="wechat"&&d.thread===buddyThread){
    if(part4Cursor.current===1){
     send("wechat",buddyThread,text,()=>{part4Cursor.current++;incoming("wechat",buddyThread,["好！"][0],["好！"],()=>{window.dispatchEvent(new CustomEvent("foundphone-chapter3-blackout"));go(161);},{time:"06:22"});},{time:"06:22"});
    }
    return;
   }
   if((s===17||s===18)&&d.app==="wechat"&&d.thread===buddyThread&&part4Waiting.current){
    const a=part4Actions.current[part4Cursor.current];
    if(a?.type==="prompt"&&a.thread===buddyThread){part4Waiting.current=false;prompt("wechat",buddyThread,a.text||"");}
   }
   if(s===19&&d.app==="wechat"&&d.thread===friendThread&&part4Waiting.current){
    const a=part4Actions.current[part4Cursor.current];
    if(a?.type==="prompt"&&a.thread===friendThread){part4Waiting.current=false;prompt("wechat",friendThread,a.text||"");}
   }
   if(s===12&&d.app===exApp&&d.thread===exThread){item(exApp,exThread,"我",text,true,{time:"19:29",meta:{story:"chapter3",handle:memberHandles[ex]||"",remark:exRemark}});runEx();return;}
  };

  const onPhoneUnlocked=()=>{
   if(stepRef.current===161&&part4Active.current){
    const t=window.setTimeout(()=>{go(17);part4Cursor.current=3;part4Waiting.current=true;incoming("wechat",buddyThread,"搭子",["你回家路上注意安全！"],()=>{part4Waiting.current=true;const a=part4Actions.current[part4Cursor.current];if(a?.type==="prompt"&&a.thread===buddyThread)prompt("wechat",buddyThread,a.text||"");},{time:"09:47"});},1000);
    timers.current.push(t);
   }
  };
  window.addEventListener("foundphone-phone-unlocked",onPhoneUnlocked);
  const onTransfer=(e:Event)=>{
   const d=(e as CustomEvent).detail||{};if(d.thread!==sellerThread||stepRef.current!==9||blacklisted.current)return;
   const amount=Math.max(0,Math.round((Number(d.amount)||0)*100)/100);if(!amount)return;
   transferAttempts.current++;transferTotal.current=Math.round((transferTotal.current+amount)*100)/100;
   const outgoing=item("wechat",sellerThread,"我",String(amount),true,{kind:"transfer",meta:{story:"chapter3",transferAmount:String(amount),transferStatus:"sent",remark:"我"}});
   void outgoing;
   if(transferTotal.current===800){
    incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["好的好的收到啦 祝追星愉快！"],()=>{go(10);index.current=0;});
   }else if(transferTotal.current<800){
    const n=transferAttempts.current;
    if(n===1)incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["宝宝你是不是发错了呀"],()=>{});
    else if(n===2)incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["？"],()=>{});
    else if(n===3)incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["你也不希望你的真名还有电话号满天飞吧"],()=>{});
    else{blacklisted.current=true;}
   }else{
    const refund=transferTotal.current-800;
    const received=item("wechat",sellerThread,"票务 🍂打歌🎫代申",String(refund.toFixed(2)),false,{kind:"transfer",meta:{story:"chapter3",refund:"true",transferAmount:String(refund),transferStatus:"pending",remark:"票务 🍂打歌🎫代申"}});
    refundItemId.current=received.id;onNativeNotification("wechat",sellerThread,received);
    incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["宝宝你发多啦！我给你退回来"],()=>go(91));
   }
  };
  const onTransferClaim=(e:Event)=>{
   const d=(e as CustomEvent).detail||{};if(stepRef.current!==91||d.id!==refundItemId.current)return;
   const claimed=item("wechat",sellerThread,"票务 🍂打歌🎫代申",String((transferTotal.current-800).toFixed(2)),false,{kind:"transferReceived",meta:{story:"chapter3",transferAmount:String(transferTotal.current-800),transferStatus:"claimed",remark:"票务 🍂打歌🎫代申"}});
   onNativeNotification("wechat",sellerThread,claimed);
   incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["好的 祝宝宝追星愉快！"],()=>{go(10);index.current=0;});
  };
  window.addEventListener("foundphone-phone-unlocked",onPhoneUnlocked);
  window.addEventListener("foundphone-chapter3-calendar-open",onCalendar);
  window.addEventListener("foundphone-open-dispatch",onXOpen);
  window.addEventListener("foundphone-story-send",onSend);
  window.addEventListener("foundphone-chapter2-thread-open",onThread);
  window.addEventListener("foundphone-chapter3-group-open",onGroupOpen);
  window.addEventListener("foundphone-story-transfer",onTransfer);
  window.addEventListener("foundphone-story-transfer-claim",onTransferClaim);
  function onGroupOpen(e:Event){const d=(e as CustomEvent).detail||{};if(d.app==="wechat"&&d.thread===groupThread&&stepRef.current===4)groupViewed.current=true;}
  return()=>{window.removeEventListener("foundphone-phone-unlocked",onPhoneUnlocked);window.removeEventListener("foundphone-chapter3-calendar-open",onCalendar);window.removeEventListener("foundphone-open-dispatch",onXOpen);window.removeEventListener("foundphone-story-send",onSend);window.removeEventListener("foundphone-chapter2-thread-open",onThread);window.removeEventListener("foundphone-chapter3-group-open",onGroupOpen);window.removeEventListener("foundphone-story-transfer",onTransfer);window.removeEventListener("foundphone-story-transfer-claim",onTransferClaim);timers.current.forEach(clearTimeout);};
 },[]);
 return null;
}
