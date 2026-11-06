import { useEffect, useRef, useState } from "react";
import type { Item, Work } from "../schema";

const memberNames:Record<string,string>={shinyu:"申正焕",dohoon:"金道勋",youngjae:"崔英宰",hanjin:"韩振",jihoon:"韩志薰",kyungmin:"李炅潣"};
const memberHandles:Record<string,string>={shinyu:"tlswjdghks",dohoon:"doking",youngjae:"jae_e",hanjin:"henan_prince",jihoon:"ahoooon",kyungmin:"kyungman_lee"};
const memberBirthdays:Record<string,string>={shinyu:"2003-11-07",dohoon:"2005-01-30",youngjae:"2005-05-31",hanjin:"2006-01-05",jihoon:"2006-03-28",kyungmin:"2007-10-02"};
const delay=()=>1000+Math.random()*1500;

export function ChapterThree({work,onNativeItem,onNativeNotification,onXPost,onXNotification,onPrompt,onFinish}:{work:Work;onNativeItem:(app:string,item:Item)=>void;onNativeNotification:(app:string,thread:string,item:Item)=>void;onXPost:(item:Item)=>void;onXNotification:(item:Item)=>void;onPrompt:(app:string,thread:string,text:string,token:number)=>void;onFinish:()=>void}){
 const crush=String(work.variables.storyCrush||"shinyu");
 const crushName=memberNames[crush]||crush;
 const crushApp=crush==="hanjin"?"wechat":"kakao";
 const crushSeed=(work.data[crushApp]||[]).find(i=>i.meta?.handle===memberHandles[crush]&&!i.outgoing);
 const crushThread=crushSeed?.title||crushName;
 const crushRemark=String(crushSeed?.meta?.remark||crushSeed?.title||crushName);
 const crushAvatar=crushSeed?.avatar||"";
 const nick=String(work.variables.storyNickname||"你");
 const birthday=String(work.variables.storyBirthday||"2006-08-10").replace(/[^0-9]/g,"").padEnd(8,"0").slice(0,8);
 const crushBirthday=String(work.variables["storyCrushBirthday"]||work.variables["storyCrushBirth"]||memberBirthdays[crush]||"2003-11-07").replace(/[^0-9]/g,"").padEnd(8,"0").slice(0,8);
 const nickEnglish=String(work.variables.storyNicknameEnglish||nick).toLowerCase().replace(/[^a-z0-9]/g,"")||"user";
 const phone="010"+birthday.slice(-4)+crushBirthday.slice(-4);
 const friendThread="闺蜜";
 const groupThread="🍂的预录打歌群2群";
 const sellerThread="票务 🍂打歌🎫代申";
 const chapterTwoEnding=(()=>{try{return Number(JSON.parse(localStorage.getItem("foundphone.chapter2.ending:"+work.id)||"{}").ending||1);}catch{return 1;}})();
 const branchKey="foundphone.chapter3.branch:"+work.id;
 const [step,setStep]=useState(0);
 const [token,setToken]=useState(7300);
 const timers=useRef<number[]>([]);
 const index=useRef(0);
 const done=useRef(false);
 const prompt=(app:string,thread:string,text:string)=>{setToken(v=>v+1);onPrompt(app,thread,text,token+1);};
 const item=(app:string,thread:string,sender:string,body:string,outgoing=false,extra:Partial<Item>={})=>{
  const it:Item={id:"chapter3-"+step+"-"+Date.now()+"-"+Math.random().toString(36).slice(2),title:thread,body,richText:"",meta:{story:"chapter3",handle:app==="kakao"?memberHandles[crush]:"",remark:sender},time:step===5?"10:29":"10:01",sender:outgoing?"我":sender,avatar:outgoing?String(work.variables.storyUserAvatar||""):app===crushApp?crushAvatar:"",kind:"text",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing,read:false,likes:0,comments:[],...extra};
  onNativeItem(app,it); return it;
 };
 const incoming=(app:string,thread:string,sender:string,lines:string[],doneFn:()=>void)=>{
  let n=0; const run=()=>{if(n>=lines.length){doneFn();return;}const t=window.setTimeout(()=>{const it=item(app,thread,sender,lines[n++]);onNativeNotification(app,thread,it);run();},delay());timers.current.push(t);};run();
 };
 const send=(app:string,thread:string,text:string,next:()=>void)=>{item(app,thread,"我",text,true);next();};
 const setPrompt=(app:string,thread:string,text:string)=>prompt(app,thread,text);
 const start=()=>{
  if(done.current||step!==0)return;
  try{localStorage.setItem(branchKey,chapterTwoEnding===2?"3(2)":"3(1)");}catch{}
  setStep(1);
  const post:Item={id:"chapter3-tws-comeback-d2",title:"TWS",body:"[#TWS]  COMING SOON 🔥\nD-2\n再过两天就能见到42了\n准备好了吗？💙\n#TWS #투어스 #COMEBACK",richText:"",meta:{handle:"TWS_PLEDIS",likesDisplay:"9920",reposts:"5000",views:"20万"},time:"10:00",sender:"TWS",avatar:import.meta.env.BASE_URL+"youtube/channels4_profile.jpeg",kind:"post",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:9920,comments:[]};
  const t=window.setTimeout(()=>{onXPost(post);onXNotification(post);},1000);timers.current.push(t);
 };
 useEffect(()=>{start();},[]);
 useEffect(()=>{
  const onCalendar=()=>start();
  const onXOpen=()=>{if(step===1){setStep(2);setPrompt(crushApp,crushThread,"后天要回归了！");}};
  const onSend=(e:Event)=>{
   const d=(e as CustomEvent).detail||{};const text=String(d.text||"");
   if(done.current)return;
   if(step===1&&d.app==="twitter"){setStep(2);setPrompt(crushApp,crushThread,"后天要回归了！");return;}
   if(step===2&&d.app===crushApp&&d.thread===crushThread){send(crushApp,crushThread,text,()=>{if(index.current===0){index.current++;setPrompt(crushApp,crushThread,"好期待呀");}else if(index.current===1){index.current++;setPrompt(crushApp,crushThread,"加油噢");}else if(index.current===2){index.current++;incoming(crushApp,crushThread,crushRemark,["嗯嗯……","会努力的","最近回归期好累","好想见你 但是不能……"],()=>setPrompt(crushApp,crushThread,"我也想……"));}else{setStep(3);const f=window.setTimeout(()=>{incoming("wechat",friendThread,"闺蜜",["闺蜜闺蜜","tms又要回归了","居然就在后天 我还没有实感"],()=>setPrompt("wechat",friendThread,"看到了！"));},delay());timers.current.push(f);}});return;}
   if(step===3&&d.app==="wechat"&&d.thread===friendThread){send("wechat",friendThread,text,()=>{if(index.current===3){index.current++;setPrompt("wechat",friendThread,"话说前两天发的预告我还没看……");}else if(index.current===4){index.current++;incoming("wechat",friendThread,"闺蜜",["笑死 你都收到无数张未公开自拍了吧","这个预告照不看也罢"],()=>setPrompt("wechat",friendThread,"哎呀哎呀"));}else{setStep(4);const t=window.setTimeout(()=>{const g=item("wechat",groupThread,"票务 🍂打歌🎫代申","Tws 人歌sbs\n韩文名400 英文名800中后付\n申请时间：16:40");onNativeNotification("wechat",groupThread,g);},delay());timers.current.push(t);}});return;}
   if(step===5&&d.app==="wechat"&&d.thread===friendThread){send("wechat",friendThread,text,()=>{if(index.current===5){index.current++;setPrompt("wechat",friendThread,"比别的团都贵");}else if(index.current===6){index.current++;setPrompt("wechat",friendThread,"你说我要不要去看");}else if(index.current===7){index.current=8;incoming("wechat",friendThread,"闺蜜",["看吧看吧","不是正好你和"+crushName+"最近不方便见面","想他就去看看"],()=>setPrompt("wechat",friendThread,"有道理 那我去找代申"));}});return;}
   if(step===6&&d.app==="wechat"&&d.thread===sellerThread){send("wechat",sellerThread,text,()=>{if(index.current===9){index.current++;incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["接的接的","TWS 人歌预录代申\n申请时间：16:40\n下单格式：\n邮箱：\n密码：\n姓名：\n出生年月日：\n手机号码：","宝宝按这个格式下单！"],()=>setPrompt("wechat",sellerThread,"TWS 人歌预录代申\n申请时间：16:40\n下单格式：\n邮箱："+nickEnglish+"@mail.com\n密码："+nickEnglish+birthday.slice(-4)+"\n姓名："+nickEnglish+"\n出生年月日："+birthday+"\n手机号码："+phone));}else if(index.current===10){index.current++;incoming("wechat",sellerThread,"票务 🍂打歌🎫代申",["好的收到！","宝宝记得关闭限制海外登录哦"],()=>setPrompt("wechat",sellerThread,"好的👌"));}else{done.current=true;const t=window.setTimeout(()=>{window.dispatchEvent(new CustomEvent("foundphone-chapter3-part2-ready",{detail:{branch:chapterTwoEnding===2?"3(2)":"3(1)"}}));onFinish();},2000);timers.current.push(t);}});return;}
  };
  const onGroupOpen=(e:Event)=>{const d=(e as CustomEvent).detail||{};if(d.app==="wechat"&&d.thread===groupThread&&step===4){setStep(5);setPrompt("wechat",friendThread,"预录代申怎么这么贵");}};
  const onThread=(e:Event)=>{const d=(e as CustomEvent).detail||{};
   if(d.app==="wechat"&&d.thread===groupThread&&step===4){window.sessionStorage.setItem("chapter3.groupViewed:"+work.id,"1");return;}
   if(d.app==="wechat"&&d.thread===friendThread&&step===4&&window.sessionStorage.getItem("chapter3.groupViewed:"+work.id)==="1"){setStep(5);setPrompt("wechat",friendThread,"预录代申怎么这么贵");return;}
   if(d.app==="wechat"&&d.thread===sellerThread&&step===5){index.current=9;setStep(6);setPrompt("wechat",sellerThread,"宝宝 tws代申还接吗");}
  };
  window.addEventListener("foundphone-chapter3-calendar-open",onCalendar);
  window.addEventListener("foundphone-open-dispatch",onXOpen);
  window.addEventListener("foundphone-story-send",onSend);
  window.addEventListener("foundphone-chapter2-thread-open",onThread);
  window.addEventListener("foundphone-chapter3-group-open",onGroupOpen);
  return()=>{window.removeEventListener("foundphone-chapter3-calendar-open",onCalendar);window.removeEventListener("foundphone-open-dispatch",onXOpen);window.removeEventListener("foundphone-story-send",onSend);window.removeEventListener("foundphone-chapter2-thread-open",onThread);window.removeEventListener("foundphone-chapter3-group-open",onGroupOpen);timers.current.forEach(clearTimeout);};
 },[step,index.current]);
 return null;
}
