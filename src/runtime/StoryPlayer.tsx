import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "../Phone";
import { validateWork, type Work } from "../schema";
import { UserOnboarding, type UserProfile } from "./UserOnboarding";
import "../styles.css";
import "./player.css";
const KEY="foundphone.user-profile.v1";
function readProfile():UserProfile|null{try{const x=JSON.parse(localStorage.getItem(KEY)||"null") as UserProfile|null;return x&&x.nickname&&/^\d{8}$/.test(x.birthday)&&x.avatar&&x.crush&&x.ex&&["BG","GB"].includes(x.xp)?x:null}catch{return null}}
function StoryPlayer(){
 const [work,setWork]=useState<Work|null>(null),[error,setError]=useState(""),[profile,setProfile]=useState<UserProfile|null>(()=>readProfile());
 useEffect(()=>{const abort=new AbortController();fetch(new URLSearchParams(location.search).get("preview")==="test"?"./test-work.json":new URLSearchParams(location.search).get("template")==="blank"?"./blank-work.json":"./work.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw Error("缺少作品文件，请运行 npm run story:build");return r.json()}).then(x=>{const w=validateWork(x);document.title=w.title==="捡手机"?"捡手机":w.title+" · 捡手机";setWork(w)}).catch(e=>{if(e.name!=="AbortError")setError(String(e))});return()=>abort.abort()},[]);
 const complete=(p:UserProfile)=>{try{localStorage.setItem(KEY,JSON.stringify(p));setProfile(p)}catch{setError("头像保存失败，请换一张较小的图片后重试。")}};
 if(!work)return <main className="story-runtime"><p role="status">{error||"正在打开手机…"}</p></main>;
 if(!profile)return <UserOnboarding onComplete={complete}/>;
 const personalized:Work={...work,phone:{...work.phone,owner:profile.nickname,passcode:profile.birthday.slice(-4)}};
 return <main className="story-runtime"><Phone work={personalized}/></main>;
}
createRoot(document.getElementById("root")!).render(<StoryPlayer/>);