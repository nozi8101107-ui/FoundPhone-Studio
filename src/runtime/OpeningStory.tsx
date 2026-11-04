import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Work } from "../schema";

type Turn = { from: "them" | "you"; text: string };
type Stage = "crush" | "x" | "friend" | "ex" | "crush_end" | "done";
const names: Record<string,string> = { shinyu:"申惟", dohoon:"金道勋", youngjae:"崔英宰", hanjin:"韩振", jihoon:"韩志薰", kyungmin:"李炅潣" };
const aliases: Record<string,string> = { shinyu:"SHINYU", dohoon:"DOHOON", youngjae:"YOUNGJAE", hanjin:"HANJIN", jihoon:"JIHOON", kyungmin:"KYUNGMIN" };
const black: Record<string,string[]> = { shinyu:["老雕","大哥哥","甲谁"], dohoon:["老牛","黑牛"], youngjae:["丑年","宰割"], hanjin:["蛤蟆","大振哥"], jihoon:["强子","志强"], kyungmin:["娟子","卷子"] };
const abc: Record<string,string> = { shinyu:"晶㬊申晶㬊", dohoon:"道勋金道勋", youngjae:"英宰崔英宰", hanjin:"韩振朴韩振", jihoon:"志薰韩志薰", kyungmin:"炅潣李炅潣" };
const flow = (...turns: Turn[]) => turns;
function crushFlow(id:string):Turn[] {
 const a=names[id]||"他";
 if(id==="shinyu") return flow(
  {from:"them",text:"准备好了吗"},{from:"them",text:"我到了"},{from:"them",text:"下来吧"},
  {from:"you",text:"好啦好啦"},{from:"you",text:"我马上来"});
 if(id==="dohoon") return flow(
  {from:"them",text:"你来了吗"},{from:"you",text:"我马上"},{from:"them",text:"好"},{from:"them",text:"等下拍摄结束 我们去吃点什么吧"},{from:"you",text:"好呀好呀"});
 if(id==="youngjae") return flow(
  {from:"them",text:"你到了吗"},{from:"you",text:"我到了！你在哪呀"},{from:"them",text:"回头"},{from:"you",text:"！"});
 if(id==="hanjin") return flow(
  {from:"them",text:"你到了嘛！"},{from:"you",text:"马上马上！"},{from:"them",text:"好 我等你！"},{from:"them",text:"我跟你讲 我已经规划好了"},{from:"them",text:"我们吃完小蛋糕后"},{from:"them",text:"我先带你去那个很火的diy店"},{from:"them",text:"然后我们再去吃晚饭"},{from:"you",text:"omg！好呀"},{from:"them",text:"嗯嗯 一定给你出片"},{from:"you",text:"嘻嘻期待 我也会给你拍的 给你发wvs呀"});
 if(id==="jihoon") return flow(
  {from:"them",text:"我到了耶"},{from:"you",text:"我也马上到！"},{from:"them",text:"嗯嗯嗯 期待耶"},{from:"you",text:"我也很期待..."});
 return flow(
  {from:"them",text:"我在里面包厢等你"},{from:"you",text:"好 我马上来"},{from:"them",text:"或者我出去接你吗？"},{from:"you",text:"没事不用了不用了 大明星也不怕被拍！"});
}
function exFlow(id:string,xp:string):Turn[] {
 const n=names[id]||"他", target="xxx";
 if(xp==="BG"){
  if(id==="shinyu") return flow(
   {from:"them",text:"？"},{from:"them",text:"你跟"+n+"？"},{from:"them",text:"回话"},{from:"them",text:"快点"},{from:"you",text:"？"},{from:"you",text:"嗯 怎么了"},{from:"them",text:"？"},{from:"them",text:"怎么了？"},{from:"them",text:"你厉害"},{from:"you",text:"没你厉害"},{from:"them",text:"……"},{from:"them",text:"所以你和我分手后选了他？"},{from:"you",text:"不行吗"},{from:"them",text:"行"},{from:"them",text:"你们多久了"},{from:"you",text:"关你什么事"},{from:"you",text:"收收味"},{from:"them",text:"他比我好吗？"});
  if(id==="dohoon") return flow(
   {from:"them",text:"啊？"},{from:"them",text:"不是 你什么意思"},{from:"them",text:"说话。"},{from:"you",text:"就是这个意思"},{from:"you",text:"嗯"},{from:"them",text:"你故意的"},{from:"them",text:"你故意气我是不是？"});
  if(id==="youngjae") return flow(
   {from:"them",text:"？"},{from:"you",text:"？"},{from:"them",text:"你和"+n+"是真的？"},{from:"you",text:"嗯"},{from:"you",text:"怎么了"},{from:"them",text:"[系统提示] 对方已将你拉黑。"},{from:"them",text:"消息已发出，但被对方拒收了"});
  if(id==="hanjin") return flow(
   {from:"them",text:"不是 那张照片上的是你吧"},{from:"you",text:"是"},{from:"them",text:"你无缝衔接？"},{from:"you",text:"没有 我们还没谈"},{from:"them",text:"你厉害"});
  if(id==="jihoon") return flow(
   {from:"them",text:"那张照片是真的吗"},{from:"you",text:"是"},{from:"them",text:"…"},{from:"you",text:"…嗯"},{from:"them",text:"我讨厌你"});
  return flow(
   {from:"them",text:"？"},{from:"you",text:"。"},{from:"them",text:"你真是厉害啊"},{from:"you",text:"我怎么了"},{from:"them",text:"我没看出来啊"},{from:"them",text:"那我们之前是怎样"},{from:"them",text:"你接近我是为了他吗？"});
 }
 if(id==="shinyu") return flow(
  {from:"them",text:"？"},{from:"them",text:"你跟"+n+"？"},{from:"them",text:"回话"},{from:"them",text:"快点"},{from:"you",text:"？"},{from:"you",text:"嗯 怎么了"},{from:"them",text:"。"},{from:"them",text:"他有我漂亮吗"},{from:"them",text:"他胸肌有我的手感好吗"},{from:"you",text:"请自重"},{from:"them",text:"。自重？"},{from:"them",text:"你厉害"});
 if(id==="dohoon") return flow(
  {from:"them",text:"你真厉害"},{from:"them",text:"你跟"+n+"是真的？"},{from:"them",text:"那照片是你吧？"},{from:"them",text:"你化成灰我都认识"},{from:"you",text:"嗯"},{from:"them",text:"“嗯”？"},{from:"them",text:"我等着看"+n+"被你吓跑的那天"},{from:"you",text:"不会有那天的"},{from:"them",text:"合着你们金女玉童呗"},{from:"them",text:"假鸡记得买新的"},{from:"them",text:"哈 你们应该谈不到那一步吧？"});
 if(id==="youngjae") return flow(
  {from:"them",text:"……"},{from:"them",text:"照片是你吗"},{from:"them",text:"d社那张"},{from:"you",text:"嗯 是我"},{from:"them",text:"早知道就该分手前把你掐死"},{from:"them",text:"^ ^"},{from:"you",text:"？"},{from:"them",text:"怎么 他比我听话吧"},{from:"them",text:"他让你糟蹋？"});
 if(id==="hanjin") return flow(
  {from:"them",text:"……"},{from:"them",text:"为什么"},{from:"you",text:"什么为什么"},{from:"them",text:"你不喜欢我吗"},{from:"you",text:"我说过 以前喜欢"},{from:"them",text:"他有我漂亮吗"},{from:"them",text:"他比我放得开吗"},{from:"them",text:"凭什么选他"},{from:"them",text:"我明明一直在等你"},{from:"you",text:"我看你每天拍点小视频还挺逍遥快活"},{from:"them",text:"你真的完了"});
 if(id==="jihoon") return flow(
  {from:"them",text:"那是真的吗"},{from:"them",text:"d社发的"},{from:"you",text:"是"},{from:"them",text:"你们好厉害啊"},{from:"them",text:"一直瞒着我"},{from:"them",text:"早就搞到一起了吧？"},{from:"you",text:"…"},{from:"them",text:"你拿我练手是吗？"},{from:"you",text:"不是"},{from:"them",text:"他对你好吗"},{from:"them",text:"算了"},{from:"them",text:"我不想看见你"});
 return flow(
  {from:"them",text:"我是最后一个知道的吗"},{from:"you",text:"什么"},{from:"them",text:"d社发的"},{from:"you",text:"…"},{from:"them",text:"算了。"},{from:"them",text:"是不是都无所谓了"},{from:"them",text:"原来你还喜欢那样的"},{from:"them",text:"我不够讨你欢心吗"});
}
function endFlow(id:string):Turn[] {
 if(id==="shinyu") return flow({from:"them",text:"没事 别怕"},{from:"them",text:"你到家了就好好休息"},{from:"them",text:"我先去公司开会"},{from:"them",text:"晚安"});
 if(id==="dohoon") return flow({from:"them",text:"你别看"},{from:"them",text:"你别看手机了"},{from:"them",text:"到家就赶紧休息吧"},{from:"them",text:"今天还叫你出来…"},{from:"them",text:"很累了吧"},{from:"them",text:"晚安"});
 if(id==="youngjae") return flow({from:"them",text:"对不起"},{from:"them",text:"是我疏忽"},{from:"them",text:"我应该短时间没法去找你了"},{from:"them",text:"我先去公司了 你早点休息"},{from:"them",text:"今天很高兴"});
 if(id==="hanjin") return flow({from:"them",text:"啊啊啊你先别看手机了"},{from:"them",text:"对不起"},{from:"them",text:"微博、x什么的 都先别看了"},{from:"them",text:"到家了先好好休息吧"},{from:"them",text:"唉 我先去公司啦"},{from:"them",text:"早睡噢 有进展我再跟你说"});
 if(id==="jihoon") return flow({from:"them",text:"你先"},{from:"them",text:"你先别看手机了"},{from:"them",text:"好好休息..."},{from:"them",text:"也真是的 我们又不是情侣 它瞎爆料什么"},{from:"them",text:"…"},{from:"them",text:"对吧？"},{from:"them",text:"…算了 你先休息 晚安"});
 return flow({from:"them",text:"user"},{from:"them",text:"我先去公司了"},{from:"them",text:"你到家之后好好休息"},{from:"them",text:"明早再联系"},{from:"them",text:"晚安"});
}
const friendFlow = flow(
 {from:"them",text:"？？？？"},{from:"them",text:"啊啊啊啊你怎么被拍了"},{from:"you",text:"我好心累"},
 {from:"them",text:"啊啊啊怎么昨天刚说完你就被d社发了"},{from:"them",text:"大头照保卫战…"}
);
const initialTime:Record<string,string>={shinyu:"20:03",dohoon:"15:30",youngjae:"20:30",hanjin:"15:25",jihoon:"18:50",kyungmin:"19:49"};
function Message({mine,text}:{mine:boolean;text:string}) {
 const blocked=text.includes("已将你拉黑")||text.includes("被对方拒收");
 return <div style={{display:"flex",justifyContent:mine?"flex-end":"flex-start",padding:"4px 12px",gap:7,alignItems:"flex-end"}}>
  {!mine&&<span style={{width:29,height:29,borderRadius:"50%",background:"#d8dce3",display:"grid",placeItems:"center",fontSize:13,color:"#555"}}>{blocked?"系":"他"}</span>}
  <div style={{maxWidth:"78%",background:blocked?"transparent":mine?"#a9e78b":"#fff",borderRadius:12,padding:"10px 12px",fontSize:14,lineHeight:1.5,color:"#222",boxShadow:blocked?"none":"0 1px 2px #0001",whiteSpace:"pre-wrap"}}>
   {text}
   {text.includes("被对方拒收")&&<div style={{color:"#999",fontSize:10,marginTop:3}}>🔴 消息已发出，但被对方拒收了</div>}
  </div>
 </div>;
}
export function OpeningStory({work,onFinish}:{work:Work;onFinish:()=>void}) {
 const id=String(work.variables.storyCrush||"shinyu"), ex=String(work.variables.storyEx||"youngjae"), xp=String(work.variables.storyXp||"BG"), nickname=String(work.variables.storyNickname||"你");
 const member=names[id]||"申惟", alias=aliases[id]||"SHINYU";
 const progressKey="foundphone.chapter1.progress:"+work.id+":"+nickname;
 const [saved]=useState(()=>{try{return JSON.parse(localStorage.getItem(progressKey)||"null") as {stage?:Stage;thread?:string;messages?:Turn[];cursor?:number;friendDone?:boolean;exDone?:boolean}|null}catch{return null}});
 const [stage,setStage]=useState<Stage>(saved?.stage||"crush"),[thread,setThread]=useState(saved?.thread||""),[messages,setMessages]=useState<Turn[]>(saved?.messages||[]),[cursor,setCursor]=useState(saved?.cursor||0),[draft,setDraft]=useState(""),[friendDone,setFriendDone]=useState(saved?.friendDone||false),[exDone,setExDone]=useState(saved?.exDone||false),[xOpening,setXOpening]=useState(false);
 useEffect(()=>{try{localStorage.setItem(progressKey,JSON.stringify({stage,thread,messages,cursor,friendDone,exDone}))}catch{}},[progressKey,stage,thread,messages,cursor,friendDone,exDone]);
 const activeFlow=useMemo(()=>stage==="crush"?crushFlow(id):stage==="friend"?friendFlow:stage==="ex"?exFlow(ex,xp):stage==="crush_end"?endFlow(id):[],[stage,id,ex,xp]);
 const current=activeFlow[cursor];
 useEffect(()=>{
  if(!current||current.from!=="them")return;
  const timer=window.setTimeout(()=>{
   setMessages(v=>[...v,current]);
   setCursor(v=>v+1);
  },1100+Math.random()*1400);
  return ()=>window.clearTimeout(timer);
 },[current,stage,cursor]);
 useEffect(()=>{
  if(current)return;
  if(stage==="crush"){
   const t=window.setTimeout(()=>{setStage("x");setMessages([]);setCursor(0);},2000);
   return ()=>window.clearTimeout(t);
  }
  if(stage==="friend"&&!friendDone){setFriendDone(true);return;}
  if(stage==="ex"&&!exDone){setExDone(true);const t=window.setTimeout(()=>{setStage("crush_end");setMessages([]);setCursor(0);},1000);return ()=>window.clearTimeout(t);}
  if(stage==="crush_end"){
   const t=window.setTimeout(()=>setStage("done"),900);
   return ()=>window.clearTimeout(t);
  }
 },[current,stage,friendDone,exDone]);
 const send=()=>{
  if(!current||current.from!=="you")return;
  const text=draft.trim()||current.text;
  setMessages(v=>[...v,{from:"you",text}]);setDraft("");setCursor(v=>v+1);
 };
 const fill=()=>{if(current?.from==="you")setDraft(current.text);};
 const startFriend=()=>{setStage("friend");setMessages([]);setCursor(0);setFriendDone(false);};
 const startEx=()=>{setStage("ex");setMessages([]);setCursor(0);setExDone(false);};
 const frame:CSSProperties={position:"absolute",inset:0,zIndex:60,background:"#f4f5f7",display:"flex",flexDirection:"column",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",color:"#222"};
 const header:CSSProperties={height:52,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"#f8f8f8",borderBottom:"1px solid #e7e7e7"};
 if(stage==="done") return <div style={{...frame,background:"#0006",justifyContent:"center",alignItems:"center",padding:24}}>
  <div style={{background:"#fff",borderRadius:16,padding:"25px 22px",width:"100%",maxWidth:320,textAlign:"center",boxShadow:"0 12px 40px #0003"}}>
   <div style={{fontSize:30,marginBottom:12}}>✓</div><strong style={{fontSize:17}}>剧情1已结束</strong><p style={{fontSize:13,color:"#777",lineHeight:1.6}}>可以自由探索手机啦！</p>
   <button onClick={onFinish} style={{marginTop:12,width:"100%",height:42,border:0,borderRadius:9,background:"#202124",color:"#fff",fontSize:14}}>确定</button>
  </div>
 </div>;
 if(stage==="x") return <div style={{...frame,background:"#f6f7f9"}}>
  <div style={header}><b>𝕏</b><span style={{fontSize:13,color:"#666"}}>为你推荐</span><span>◉</span></div>
  <div style={{padding:14,background:"#fff",borderBottom:"1px solid #eee"}}><div style={{fontWeight:700,fontSize:14}}>Dispatch <small style={{color:"#777",fontWeight:400}}>· @dispatch</small></div><h3 style={{fontSize:17,lineHeight:1.45,margin:"12px 0"}}>【独家】TWS成员{alias}深夜密会素人女性 汉南洞街头举止亲密疑似恋爱中</h3><p style={{fontSize:13,lineHeight:1.65,color:"#333"}}>Dispatch独家报道<br/>D社今日晚间独家捕捉到TWS成员{alias}与一名素人女性在首尔深夜约会，两人举止亲密，疑似恋爱中。<br/>据本社记者追踪，当晚21时40分许，{alias}身着黑色卫衣、佩戴棒球帽和口罩，与一名素人女性一同离开，两人自然并肩而行，{alias}主动接过女方手中的纸袋，途中多次低头靠近女方耳边交谈，笑容明显。{alias}轻拍女方背部，随后两人分别乘车离开。<br/>据本社掌握的信息，该女性为圈外素人，尚未知两人通过何种渠道认识。身边人士向D社透露：“{alias}对这段关系非常谨慎，私下对女方很体贴”<br/>截至发稿时，{alias}所属公司PLEDIS Entertainment尚未就此事发表官方立场。</p><div style={{fontSize:12,color:"#777",marginTop:10}}>转发 5w+　评论 2000+　♥ 3w+</div></div>
  <div style={{padding:14,overflow:"auto",flex:1}}><b style={{fontSize:14}}>热门评论</b>{["让"+(black[id]?.[0]||member)+"粉丝成天飒飒飒 回旋镖了吧","啊啊啊大晚上睡不着了",member+"你对得起谁","d社依旧权威","蹲pledis回应","等公司公告吧","等公司公告的 冷知识 那个谁当年也发公告了","上升期谈恋爱 "+member+"你要死吗",member+"十年老粉脱粉了","一直烦串不串 出道才几年就十年老粉","是路人你就给我路过","这么真的料不信的有了","今晚hybe将灯火通明",member+"你对得起谁 退团！","今年谈恋爱的好多啊","黄泉路人都滚","这是ai的吧",member+" tws唯一恋爱咖"].sort(()=>Math.random()-.5).slice(0,15+Math.floor(Math.random()*11)).map((x,i)=><p key={i} style={{fontSize:13,padding:"7px 0",borderBottom:"1px solid #e8e8e8",margin:0}}><span style={{color:"#75808c"}}>@user_{i+13}</span><br/>{x}</p>)}</div>
  <button disabled={xOpening} onClick={()=>{setXOpening(true);window.setTimeout(()=>{setStage("friend");setMessages([]);setCursor(0);},2000);}} style={{margin:12,height:44,border:0,borderRadius:22,background:"#111",color:"#fff",fontWeight:700,opacity:xOpening?.6:1}}>{xOpening?"正在打开…":"打开 X 推送　→"}</button>
 </div>;
 const contact=stage==="crush"||stage==="crush_end"?member:stage==="friend"?"闺蜜":names[ex]||"前男友";
 const isWechat=(stage==="friend"||id==="hanjin"&&stage!=="crush_end"||ex==="hanjin"&&stage==="ex");
 const subtitle=stage==="crush"?"":stage==="crush_end"?"":stage==="friend"?"微信":isWechat?"微信":"KakaoTalk";
 return <div style={frame}>
  <div style={header}><span style={{fontSize:19}}>‹</span><div style={{textAlign:"center",flex:1}}><b>{contact}</b><div style={{fontSize:10,color:"#999"}}>{subtitle||"KakaoTalk"}</div></div><span>⋯</span></div>
  {stage==="friend"&&<div style={{padding:"7px 12px",background:"#fff5d7",fontSize:11,color:"#8b6a28"}}>微信通知　闺蜜发来新消息</div>}
  {stage==="ex"&&<div style={{padding:"7px 12px",background:"#fff5d7",fontSize:11,color:"#8b6a28"}}>{isWechat?"微信":"KakaoTalk"}通知　前男友发来新消息</div>}
  {stage==="crush"&&<div style={{textAlign:"center",fontSize:11,color:"#999",padding:8}}>{initialTime[id]||"20:03"}</div>}
  <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
   {messages.map((m,i)=><Message key={i} mine={m.from==="you"} text={m.text.replaceAll("user",nickname)}/>)}
   {current?.from==="you"&&<div style={{textAlign:"center",padding:8,fontSize:11,color:"#aaa"}}>点击输入框自动填入回复</div>}
   {stage==="friend"&&friendDone&&<div style={{padding:18,textAlign:"center",color:"#888",fontSize:12}}>闺蜜的消息已读</div>}
   {stage==="ex"&&exDone&&<div style={{padding:18,textAlign:"center",color:"#888",fontSize:12}}>对话结束</div>}
  </div>
  {current?.from==="you"?<div style={{display:"flex",gap:8,padding:10,background:"#f8f8f8",borderTop:"1px solid #ddd"}}>
   <button onClick={fill} style={{flex:1,minHeight:40,border:"1px solid #ddd",borderRadius:8,background:"#fff",textAlign:"left",padding:"8px 10px",color:draft?"#222":"#aaa",fontSize:13}}>{draft||"点击输入回复…"}</button>
   <button onClick={send} style={{border:0,borderRadius:8,background:draft?"#8bd36e":"#bbb",color:"#fff",padding:"0 15px"}}>发送</button>
  </div>:<div style={{padding:13,background:"#f8f8f8",borderTop:"1px solid #ddd",fontSize:12,color:"#aaa"}}>对方正在发送消息…</div>}
  {stage==="friend"&&friendDone&&<button onClick={startEx} style={{margin:10,padding:12,border:0,borderRadius:8,background:"#222",color:"#fff"}}>查看前男友消息 →</button>}
 </div>;
}
