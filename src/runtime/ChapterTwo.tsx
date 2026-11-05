import { useEffect, useRef } from "react";
import type { Item, Work } from "../schema";

const names: Record<string,string> = { shinyu:"申惟", dohoon:"金道勋", youngjae:"崔英宰", hanjin:"韩振", jihoon:"韩志薰", kyungmin:"李炅潣" };
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

export function ChapterTwo({work,onNativeItem,onNativeNotification,onXPost,onXNotification}:{
  work:Work;
  onNativeItem:(app:string,item:Item)=>void;
  onNativeNotification:(app:string,thread:string,item:Item)=>void;
  onXPost:(item:Item)=>void;
  onXNotification:(item:Item)=>void;
}) {
  const crush=String(work.variables.storyCrush||"shinyu");
  const app=crush==="hanjin"?"wechat":"kakao";
  const thread=(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]&&!i.outgoing)?.title||names[crush]||"聊天";
  const contact=(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]&&!i.outgoing&&i.avatar)||(work.data[app]||[]).find(i=>i.meta.handle===handles[crush]);
  const remark=String(contact?.meta.remark||contact?.title||names[crush]||"对方");
  const avatar=crush==="hanjin"?import.meta.env.BASE_URL+"people/IMG_9702.jpeg":contact?.avatar||"";
  const delivered=useRef(false);
  const callbacks=useRef({onNativeItem,onNativeNotification,onXPost,onXNotification});
  callbacks.current={onNativeItem,onNativeNotification,onXPost,onXNotification};
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
  return null;
}
