import { useEffect, useMemo, useRef, useState } from "react";
import type { Item, Work } from "../schema";

type StoryEvent = { from: "them" | "you"; text: string };
const names: Record<string,string> = { shinyu:"申惟", dohoon:"金道勋", youngjae:"崔英宰", hanjin:"韩振", jihoon:"韩志薰", kyungmin:"李炅潣" };
const english: Record<string,string> = { shinyu:"SHINYU", dohoon:"DOHOON", youngjae:"YOUNGJAE", hanjin:"HANJIN", jihoon:"JIHOON", kyungmin:"KYUNGMIN" };
const handles: Record<string,string> = { shinyu:"tlswjdghks", dohoon:"doking", youngjae:"jae_e", hanjin:"henan_prince", jihoon:"ahoooon", kyungmin:"kyungman_lee" };
const appFor = (id:string) => id === "hanjin" ? "微信" : "KakaoTalk";
const ev = (...rows:[ "them"|"you", string ][]):StoryEvent[] => rows.map(([from,text])=>({from,text}));
function crushChat(id:string):StoryEvent[] {
 const chats:Record<string,StoryEvent[]> = {
 shinyu:ev(["them","准备好了吗"],["them","我到了"],["them","下来吧"],["you","好啦好啦"],["you","我马上来"]),
 dohoon:ev(["them","你来了吗"],["you","我马上"],["them","好"],["them","等下拍摄结束 我们去吃点什么吧"],["you","好呀好呀"]),
 youngjae:ev(["them","你到了吗"],["you","我到了！你在哪呀"],["them","回头"],["you","！"]),
 hanjin:ev(["them","你到了嘛！"],["you","马上马上！"],["them","好 我等你！"],["them","我跟你讲 我已经规划好了"],["them","我们吃完小蛋糕后"],["them","我先带你去那个很火的diy店"],["them","然后我们再去吃晚饭"],["you","omg！好呀"],["them","嗯嗯 一定给你出片"],["you","嘻嘻期待 我也会给你拍的 给你发wvs呀"]),
 jihoon:ev(["them","我到了耶"],["you","我也马上到！"],["them","嗯嗯嗯 期待耶"],["you","我也很期待..."]),
 kyungmin:ev(["them","我在里面包厢等你"],["you","好 我马上来"],["them","或者我出去接你吗？"],["you","没事不用了不用了 大明星也不怕被拍！"])
 };
 return chats[id] || chats.shinyu;
}
function exChat(ex:string, crush:string, xp:string):StoryEvent[] {
 const n=names[crush]||"他";
 const bg:Record<string,StoryEvent[]> = {
 shinyu:ev(["them","？"],["them","你跟"+n+"？"],["them","回话"],["them","快点"],["you","？"],["you","嗯 怎么了"],["them","？"],["them","怎么了？"],["them","你厉害"],["you","没你厉害"],["them","……"],["them","所以你和我分手后选了他？"],["you","不行吗"],["them","行"],["them","你们多久了"],["you","关你什么事"],["you","收收味"],["them","他比我好吗？"]),
 dohoon:ev(["them","啊？"],["them","不是 你什么意思"],["them","说话。"],["you","就是这个意思"],["you","嗯"],["them","你故意的"],["them","你故意气我是不是？"]),
 youngjae:ev(["them","？"],["you","？"],["them","你和"+n+"是真的？"],["you","嗯"],["you","怎么了"]),
 hanjin:ev(["them","不是 那张照片上的是你吧"],["you","是"],["them","你无缝衔接？"],["you","没有 我们还没谈"],["them","你厉害"]),
 jihoon:ev(["them","那张照片是真的吗"],["you","是"],["them","…"],["you","…嗯"],["them","我讨厌你"]),
 kyungmin:ev(["them","？"],["you","。"],["them","你真是厉害啊"],["you","我怎么了"],["them","我没看出来啊"],["them","那我们之前是怎样"],["them","你接近我是为了他吗？"])
 };
 const gb:Record<string,StoryEvent[]> = {
 shinyu:ev(["them","？"],["them","你跟"+n+"？"],["them","回话"],["them","快点"],["you","？"],["you","嗯 怎么了"],["them","。"],["them","他有我漂亮吗"],["them","他胸肌有我的手感好吗"],["you","请自重"],["them","。自重？"],["them","你厉害"]),
 dohoon:ev(["them","你真厉害"],["them","你跟"+n+"是真的？"],["them","那照片是你吧？"],["them","你化成灰我都认识"],["you","嗯"],["them","“嗯”？"],["them","我等着"+n+"被你吓跑的那天"],["you","不会有那天的"],["them","合着你们金女玉童呗"],["them","假鸡记得买新的"],["them","哈 你们应该谈不到那一步吧？"]),
 youngjae:ev(["them","……"],["them","照片是你吗"],["them","d社那张"],["you","嗯 是我"],["them","早知道就该分手前把你掐死"],["them","^ ^"],["you","？"],["them","怎么 他比我听话吧"],["them","他让你糟蹋？"]),
 hanjin:ev(["them","……"],["them","为什么"],["you","什么为什么"],["them","你不喜欢我吗"],["you","我说过 以前喜欢"],["them","他有我漂亮吗"],["them","他比我放得开吗"],["them","凭什么选他"],["them","我明明一直在等你"],["you","我看你每天拍点小视频还挺逍遥快活"],["them","你真的完了"]),
 jihoon:ev(["them","那是真的吗"],["them","d社发的"],["you","是"],["them","你们好厉害啊"],["them","一直瞒着我"],["them","早就搞到一起了吧？"],["you","…"],["them","你拿我练手是吗？"],["you","不是"],["them","他对你好吗"],["them","算了"],["them","我不想看见你"]),
 kyungmin:ev(["them","我是最后一个知道的吗"],["you","什么"],["them","d社发的"],["you","…"],["them","算了。"],["them","是不是都无所谓了"],["them","原来你还喜欢那样的"],["them","我不够讨你欢心吗"])
 };
 return (xp==="GB"?gb:bg)[ex] || (xp==="GB"?gb.shinyu:bg.shinyu);
}
function friendChat():StoryEvent[]{return ev(["them","？？？？"],["them","啊啊啊啊你怎么被拍了"],["you","我好心累"],["them","啊啊啊怎么昨天刚说完你就被d社发了"],["them","大头照保卫战…"]);}
function closeChat(id:string,nick:string):StoryEvent[]{
 const rows:Record<string,StoryEvent[]> = {
 shinyu:ev(["them","没事 别怕"],["them","你到家了就好好休息"],["them","我先去公司开会"],["them","晚安"]),
 dohoon:ev(["them","你别看"],["them","你别看手机了"],["them","到家就赶紧休息吧"],["them","今天还叫你出来…"],["them","很累了吧"],["them","晚安"]),
 youngjae:ev(["them","对不起"],["them","是我疏忽"],["them","我应该短时间没法去找你了"],["them","我先去公司了 你早点休息"],["them","今天很高兴"]),
 hanjin:ev(["them","啊啊啊你先别看手机了"],["them","对不起"],["them","微博、x什么的 都先别看了"],["them","到家了先好好休息吧"],["them","唉 我先去公司啦"],["them","早睡噢 有进展我再跟你说"]),
 jihoon:ev(["them","你先"],["them","你先别看手机了"],["them","好好休息..."],["them","也真是的 我们又不是情侣 它瞎爆料什么"],["them","…"],["them","对吧？"],["them","…算了 你先休息 晚安"]),
 kyungmin:ev(["them",nick],["them","我先去公司了"],["them","你到家之后好好休息"],["them","明早再联系"],["them","晚安"])
 };
 return rows[id]||rows.shinyu;
}
function dispatchBody(id:string):string {
 const n=english[id]||"SHINYU";
 return "【独家】TWS成员"+n+"深夜密会素人女性 汉南洞街头举止亲密疑似恋爱中\n\nDispatch独家报道\nD社今日晚间独家捕捉到TWS成员"+n+"与一名素人女性在首尔深夜约会，两人举止亲密，疑似恋爱中。\n据本社记者追踪，当晚21时40分许，"+n+"身着黑色卫衣、佩戴棒球帽和口罩，与一名素人女性一同离开，两人自然并肩而行，"+n+"主动接过女方手中的纸袋，途中"+n+"多次低头靠近女方耳边交谈，笑容明显。"+n+"轻拍女方背部，随后两人分别乘车离开。\n据本社掌握的信息，该女性为圈外素人，尚未知两人通过何种渠道认识。身边人士向D社透露：“"+n+"对这段关系非常谨慎，私下对女方很体贴”\n截至发稿时，TWS所属公司PLEDIS Entertainment尚未就此事发表官方立场。";
}
export function ChapterOne({work,onFinish,onDispatchOpen,onNativeOpen,onNativeItem,onNativePrompt,onNativeNotification}:{work:Work;onFinish:()=>void;onDispatchOpen:()=>void;onNativeOpen:(app:string,thread:string)=>void;onNativeItem:(app:string,item:Item)=>void;onNativePrompt:(app:string,thread:string,text:string,token:number)=>void;onNativeNotification:(app:string,thread:string,item:Item)=>void}) {
 const crush=String(work.variables.storyCrush||"shinyu"), ex=String(work.variables.storyEx||"dohoon"), xp=String(work.variables.storyXp||"BG"), nick=String(work.variables.storyNickname||"你");
 const key="foundphone.chapter1.v3:"+work.id+":"+nick;
 const [stage,setStage]=useState<"crush"|"dispatch"|"friend"|"ex"|"closing"|"done">(()=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");return v?.done?"done":v?.stage||"crush"}catch{return "crush"}});
 const [rows,setRows]=useState<StoryEvent[]>([]);
 const [cursor,setCursor]=useState(()=>{try{return Number(JSON.parse(localStorage.getItem(key)||"null")?.cursor)||0}catch{return 0}});
 const [draft,setDraft]=useState("");
 const [busy,setBusy]=useState(false);
 const [banner,setBanner]=useState("");
 const [comments,setComments]=useState(()=>{try{return !!JSON.parse(localStorage.getItem(key)||"null")?.comments}catch{return false}});
 const [xOpened,setXOpened]=useState(()=>{try{return !!JSON.parse(localStorage.getItem(key)||"null")?.xOpened}catch{return false}});
 const [blocked,setBlocked]=useState(()=>{try{return !!JSON.parse(localStorage.getItem(key)||"null")?.blocked}catch{return false}});
 const [exFirstDelivered,setExFirstDelivered]=useState(()=>{try{return !!JSON.parse(localStorage.getItem(key)||"null")?.exFirstDelivered}catch{return false}});
 const current=stage==="crush"?crushChat(crush):stage==="friend"?friendChat():stage==="ex"?exChat(ex,crush,xp):stage==="closing"?closeChat(crush,nick):[];
 const stamp=crush==="dohoon"?"15:30":crush==="hanjin"?"15:25":crush==="youngjae"?"20:30":crush==="jihoon"?"18:50":crush==="kyungmin"?"19:49":"20:03";
 const targetId=stage==="ex"?ex:crush;
 const nativeApp=stage==="friend"?"wechat":targetId==="hanjin"?"wechat":"kakao";
 const nativeThread=stage==="friend"?"闺蜜":(work.data[nativeApp]||[]).find(item=>item.meta.handle===handles[targetId])?.title||names[targetId];
 const exApp=ex==="hanjin"?"wechat":"kakao";
 const exThread=(work.data[exApp]||[]).find(item=>item.meta.handle===handles[ex])?.title||names[ex];
 const callbacks=useRef({onNativeOpen,onNativeItem,onNativePrompt,onNativeNotification});
 callbacks.current={onNativeOpen,onNativeItem,onNativePrompt,onNativeNotification};
 useEffect(()=>{if(stage!=="done"&&stage!=="dispatch")callbacks.current.onNativeOpen(nativeApp,nativeThread)},[stage,nativeApp,nativeThread]);


 const goDispatch=()=>{setComments(false);setStage("friend");setRows([]);setCursor(0)};

 useEffect(()=>{
   if(stage!=="friend"||exFirstDelivered)return;
   const first=exChat(ex,crush,xp)[0];
   if(!first)return;
   const t=window.setTimeout(()=>{
     const item:Item={id:"chapter1-ex-0",title:exThread,body:first.text,richText:"",meta:{story:"chapter1"},time:stamp,sender:names[ex],avatar:(work.data[exApp]||[]).find(v=>v.meta.handle===handles[ex])?.avatar||"",kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:0,comments:[]};
     callbacks.current.onNativeItem(exApp,item);
     callbacks.current.onNativeNotification(exApp,exThread,item);
     setExFirstDelivered(true);
   },900);
   return()=>clearTimeout(t);
 },[stage,exFirstDelivered,ex,crush,xp,exApp,exThread,stamp,work]);
 useEffect(()=>{
   if(stage!=="dispatch")return;
   setXOpened(true);
   onDispatchOpen();
   let timer:number|undefined;
   const openDispatch=()=>{timer=window.setTimeout(goDispatch,2000)};
   window.addEventListener("foundphone-open-dispatch",openDispatch);
   return()=>{window.removeEventListener("foundphone-open-dispatch",openDispatch);if(timer)window.clearTimeout(timer)};
 },[stage]);
 const events=rows.length?rows:current;
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify({stage,cursor,done:stage==="done",comments,xOpened,blocked,exFirstDelivered}))}catch{}},[stage,cursor,comments,xOpened,blocked]);
 const history = useMemo(()=>{const app=(id:string)=>id==="hanjin"?"wechat":"kakao"; if(stage==="friend")return (work.data.wechat||[]).filter(item=>item.title==="闺蜜"); if(stage==="ex")return (work.data[app(ex)]||[]).filter(item=>item.meta.handle===handles[ex]); if(stage==="crush"||stage==="closing")return (work.data[app(crush)]||[]).filter(item=>item.meta.handle===handles[crush]); return [];},[work,stage,crush,ex]);
 useEffect(()=>{
   if(stage==="done"||stage==="dispatch")return;
   if(cursor>=events.length){
     if(!events.length)return;
     const t=window.setTimeout(()=>{
       if(stage==="crush"){setStage("dispatch");setRows([]);setCursor(0)}
       else if(stage==="friend"){setStage("ex");setRows([]);setCursor(exFirstDelivered?1:0)}
       else if(stage==="ex"){setStage("closing");setRows([]);setCursor(0)}
       else if(stage==="closing"){setStage("done");try{localStorage.setItem(key,JSON.stringify({done:true}))}catch{}}
     },stage==="crush"?2000:stage==="ex"?1000:500);
     return()=>clearTimeout(t);
   }
   const e=events[cursor];
   if(e.from==="them"){
     setBusy(true);
     const t=window.setTimeout(()=>{
       setBusy(false);
       const item:Item={id:"chapter1-"+stage+"-"+cursor,title:nativeThread,body:e.text,richText:"",meta:{story:"chapter1"},time:stamp,sender:stage==="friend"?"闺蜜":names[targetId],avatar:(work.data[nativeApp]||[]).find(v=>v.meta.handle===handles[targetId])?.avatar||"",kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:0,comments:[]};
       callbacks.current.onNativeItem(nativeApp,item);
       callbacks.current.onNativeNotification(nativeApp,nativeThread,item);
       setCursor(v=>v+1);
     },1200+Math.random()*1300);
     return()=>clearTimeout(t);
   }
   callbacks.current.onNativePrompt(nativeApp,nativeThread,e.text,cursor+1);
   const receive=(event:globalThis.Event)=>{
     const detail=(event as unknown as CustomEvent<{app:string;thread:string;text:string}>).detail;
     if(!detail||detail.app!==nativeApp||detail.thread!==nativeThread||!detail.text?.trim())return;
     window.removeEventListener("foundphone-story-send",receive);
     const blockedMessage=stage==="ex"&&xp==="BG"&&ex==="youngjae"&&cursor===events.length-1;
     const item:Item={id:"chapter1-"+stage+"-"+cursor,title:nativeThread,body:detail.text.trim(),richText:"",meta:{story:"chapter1",...(blockedMessage?{blocked:"true"}:{})},time:stamp,sender:nick||"我",avatar:String(work.variables.storyUserAvatar||""),kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:true,read:true,likes:0,comments:[]};
     callbacks.current.onNativeItem(nativeApp,item);
     setCursor(v=>v+1);
   };
   window.addEventListener("foundphone-story-send",receive);
   return()=>window.removeEventListener("foundphone-story-send",receive);
 },[stage,cursor,events.length,nativeApp,nativeThread,stamp,targetId,ex,xp,work,exFirstDelivered]);

 if(stage!=="done")return null;
 return (
   <div className="chapter-one-modal" style={{position:"absolute",inset:0,zIndex:120,background:"rgba(0,0,0,.42)",display:"grid",placeItems:"center",padding:24}}>
     <section style={{background:"#fff",borderRadius:20,padding:24,textAlign:"center",width:"100%",maxWidth:310,color:"#19191d"}}>
       <h2>剧情1已结束</h2>
       <p>可以自由探索手机啦！</p>
       <button onClick={onFinish} style={{border:0,background:"#171717",color:"#fff",borderRadius:12,padding:"12px 24px",marginTop:16}}>确定</button>
     </section>
   </div>
 );

}
