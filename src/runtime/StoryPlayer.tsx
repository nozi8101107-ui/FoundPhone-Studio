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
 return <main className="start-choice"><section className="start-choice-card"><div className="start-choice-kicker">FOUND PHONE</div><h1>欢迎回来</h1><p>要接着上次的故事，还是重新开始？</p><button className="start-choice-primary" onClick={onContinue}>继续剧情<span>从上次离开的位置继续</span></button><button className="start-choice-secondary" onClick={onRestart}>重新开始<span>清空当前剧情进度，从第一幕开始</span></button><small>你的个人资料和关系设定会保留</small></section></main>;
}
function StoryPlayer(){
 const [work,setWork]=useState<Work|null>(null),[error,setError]=useState(""),[profile,setProfile]=useState<UserProfile|null>(()=>readProfile());
 const [choice,setChoice]=useState<"setup"|"choose"|"play">(()=>readProfile()?"choose":"setup");
 const [session,setSession]=useState(0);
 useEffect(()=>{const abort=new AbortController();fetch(new URLSearchParams(location.search).get("preview")==="test"?"./test-work.json":new URLSearchParams(location.search).get("template")==="blank"?"./blank-work.json":"./work.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw Error("缺少作品文件，请运行 npm run story:build");return r.json()}).then(x=>{const w=validateWork(x);document.title=w.title==="捡手机"?"捡手机":w.title+" · 捡手机";setWork(w)}).catch(e=>{if(e.name!=="AbortError")setError(String(e))});return()=>abort.abort()},[]);
 const complete=(p:UserProfile)=>{try{localStorage.setItem(KEY,JSON.stringify(p));setProfile(p);setChoice("choose")}catch{setError("头像保存失败，请换一张较小的图片后重试。")}};
 const restart=async()=>{if(!work)return;try{await db.saves.delete(work.id);setSession(v=>v+1);setChoice("play")}catch{setError("无法清除旧进度，请检查浏览器存储权限。")}};
 if(!work)return <main className="story-runtime"><p role="status">{error||"正在打开手机…"}</p></main>;
 if(!profile)return <UserOnboarding onComplete={complete}/>;
 if(choice==="choose")return <StartChoice onContinue={()=>setChoice("play")} onRestart={()=>void restart()}/>;
 if(choice==="setup")return <UserOnboarding onComplete={complete}/>;
 const personalized:Work={...work,phone:{...work.phone,owner:profile.nickname,passcode:profile.birthday.slice(-4)}};
 return <main className="story-runtime"><Phone key={session} work={personalized}/></main>;
}
createRoot(document.getElementById("root")!).render(<StoryPlayer/>);
