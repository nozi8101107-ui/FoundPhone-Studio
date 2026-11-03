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
 const contacts=[
  make(profile.crush,"", "最近联系的人",{}, ""),
  make(profile.ex,"", "聊天记录",{}, "")
 ];
 contacts[0].title=crushNames[profile.crush]||labels[profile.crush];
 contacts[0].sender=labels[profile.crush];
 contacts[1].title=exNames[profile.ex]||labels[profile.ex];
 contacts[1].sender=labels[profile.ex];
 const insta=[
  make("tws","TWS (투어스)","welcometoourBside",{handle:"tws_pledis",username:"TWS (투어스)",posts:"2540",followers:"363w",following:"1",account:"official"}),
  make(profile.crush,handles[profile.crush],"",{handle:handles[profile.crush],username:handles[profile.crush],account:"crush"}),
  make(profile.ex,handles[profile.ex],"",{handle:handles[profile.ex],username:handles[profile.ex],account:"ex"})
 ];
 const personalized:Work={...work,phone:{...work.phone,owner:profile.nickname,passcode:profile.birthday.slice(-4),wallpaperImage:profile.homeWallpaper||profile.lockWallpaper},data:{...work.data,kakao:[...(work.data.kakao||[]),...contacts],instagram:[...(work.data.instagram||[]),...insta]}};
 return <main className="story-runtime"><Phone key={session} work={personalized}/></main>;
}
createRoot(document.getElementById("root")!).render(<StoryPlayer/>);
