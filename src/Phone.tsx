import { StatusGlyph } from "./ios/StatusGlyph";
import { SocialDetail, socialDetailApps } from "./skins/SocialDetails";
import { NativeCalculator } from "./ios/Calculator";
import { HomeLauncher } from "./launcher/HomeLauncher";
import { useDeviceLayout } from "./launcher/layout";
import "./launcher/launcher.css";
import { NativeDetail, nativeDetailApps } from "./ios/Details";
import "./ios/details.css";
import {
  SystemNotifications,
  notificationContent,
} from "./SystemNotifications";
import {
  readLauncherOrigin,
  AppWindow,
  screenOrigin,
} from "./vendor/ios-web/Launcher";
import {
  DeviceLock,
  ControlCenter,
  DeviceKeyboard,
  KeyboardContext,
  NativeSettings,
} from "./DeviceSystem";
import { AppArtwork, hasNativeArtwork } from "./AppArtwork";
import { getFields } from "./fields";
import { catalogSkins } from "./skins/catalog";
import "./skins/skins.css";
import "./ios18.css";
import "./device-system.css";
import "./ios/tokens.css";
import "./ios/reference.css";
import "./ios/status-bar.css";
import { WeChatSkin, WhatsAppSkin } from "./AppSkins";
import { RichText } from "./RichText";
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  Suspense,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  Plus,
  Search,
  LockKeyhole,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ArrowUp,
  Folder,
  Phone as PhoneIcon,
} from "lucide-react";
import { getApp, type AppPlugin } from "./registry";
import {
  initialRuntime,
  safeMedia,
  type Work,
  type Item,
  type Runtime,
  type UiValue,
} from "./schema";
import { dispatch, choose, visible, advance } from "./engine";
import { db } from "./persistence";
import { ChapterOne } from "./runtime/ChapterOne";
import { makeChapterSocial } from "./runtime/ChapterOneSocial";
function makeChapterDispatch(work: Work, member: string): Item {
  const labels: Record<string,string> = {shinyu:"SHINYU",dohoon:"DOHOON",youngjae:"YOUNGJAE",hanjin:"HANJIN",jihoon:"JIHOON",kyungmin:"KYUNGMIN"};
  const nick: Record<string,string> = {shinyu:"老雕",dohoon:"老牛",youngjae:"丑年",hanjin:"蛤蟆",jihoon:"强子",kyungmin:"娟子"};
  const n=labels[member]||"SHINYU", k=nick[member]||"老雕";
  const all=["让"+k+"粉丝成天飒飒飒 回旋镖了吧","啊啊啊大晚上睡不着了好坤动",k+"你对得起谁","等公司公告的 冷知识 那个谁当年也发公告了","上升期谈恋爱 "+k+"你要死吗","是路人你就给我路过","这么真的料不信的有了","今晚hybe将灯火通明",k+"你对得起谁","今年谈恋爱的好多啊","我的舍友是看我是TWS粉丝 刚刚听说了这件事 然后刚刚塞给我一堆零食。。我真的要爱上她了","这是ai的吧","TWS唯一恋爱咖","蹲公司回应","粉丝滤镜碎一地","别吵了等声明","这时间点也太巧了","到底是不是本人啊"];
  const seed=Array.from(work.id+member).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
  const comments=[...all].sort((a,b)=>{const h=(v:string)=>Array.from(v).reduce((x,c)=>(x*33+c.charCodeAt(0))>>>0,seed);return h(a)-h(b)}).slice(0,15+seed%11);
  return {id:"chapter-dispatch",title:"【独家】TWS成员"+n+"深夜密会素人女性 汉南洞街头举止亲密疑似恋爱中",body:"Dispatch独家报道\nD社今日晚间独家捕捉到TWS成员"+n+"与一名素人女性在首尔深夜约会，两人举止亲密，疑似恋爱中。\n据本社记者追踪，当晚21时40分许，"+n+"身着黑色卫衣、佩戴棒球帽和口罩，与一名素人女性一同离开，两人自然并肩而行，"+n+"主动接过女方手中的纸袋，途中"+n+"多次低头靠近女方耳边交谈，笑容明显。"+n+"轻拍女方背部，随后两人分别乘车离开。\n据本社掌握的信息，该女性为圈外素人，尚未知两人通过何种渠道认识。身边人士向D社透露：“"+n+"对这段关系非常谨慎，私下对女方很体贴”\n截至发稿时，TWS所属公司PLEDIS Entertainment尚未就此事发表官方立场。",richText:"",meta:{source:"Dispatch",exclusive:"true",handle:"dispatch",reposts:"54000",commentCount:"2000+",views:"3.2M"},time:"21:40",sender:"Dispatch",avatar:"",kind:"post",media:"",hidden:false,unlock:"",password:"",folder:"",favorite:false,outgoing:false,read:false,likes:32000,comments};
}
export function AppIcon({
  id,
  name,
  small = false,
  custom = "",
  date,
  time,
  unread = false,
}: {
  id: string;
  name?: string;
  small?: boolean;
  custom?: string;
  date?: string;
  time?: string;
  unread?: boolean;
}) {
  const a = getApp(id);
  const Icon = a.icon;
  return (
    <span className={`app-icon-wrap ${small ? "small" : ""}`} style={{position:"relative"}}>
      <span className="app-icon" style={{ background: a.color }}>
        {custom ? (
          safeMedia(custom) ? (
            <img src={safeMedia(custom)} alt="自定义图标" />
          ) : (
            <span>{custom.slice(0, 2)}</span>
          )
        ) : hasNativeArtwork(id) ? (
          <AppArtwork id={id} date={date} time={time} />
        ) : (
          <Icon size={small ? 21 : 28} strokeWidth={1.65} />
        )}
      </span>
      {unread && <i aria-label="未读消息" style={{position:"absolute",right:small?0:2,top:small?0:2,width:small?7:10,height:small?7:10,borderRadius:"50%",background:"#ff3b30",border:"1.5px solid white",boxSizing:"border-box"}} />}
      {name && <span className="app-name">{name}</span>}
    </span>
  );
}
type PhoneProps = Omit<Parameters<typeof PhoneRuntime>[0], "deviceLayout">;
export function Phone(props: PhoneProps) {
  const deviceLayout = useDeviceLayout(props.work, props.creator);
  return (
    <PhoneRuntime
      {...props}
      work={deviceLayout.work}
      deviceLayout={deviceLayout}
    />
  );
}
function PhoneRuntime({
  deviceLayout,
  work,
  creator = false,
  onEdit,
  onAdd,
  onSettings,
  onOpen,
  runtime: external,
  onRuntime,
}: {
  deviceLayout: ReturnType<typeof useDeviceLayout>;
  work: Work;
  creator?: boolean;
  onEdit?: (app: string, item: Item) => void;
  onAdd?: (app: string) => void;
  onSettings?: () => void;
  onOpen?: (app: string) => void;
  runtime?: Runtime;
  onRuntime?: (s: Runtime) => void;
}) {
  const [app, setApp] = useState("");
  const [homeRequest, setHomeRequest] = useState(0);
  const [locked, setLocked] = useState(!creator);
  const storyKey = "foundphone.chapter1.v2.done:" + work.id + ":" + String(work.variables.storyNickname || "");
  const storyFlowKey = "foundphone.chapter1.v3:" + work.id + ":" + String(work.variables.storyNickname || "");
  const chapterItemsKey = "foundphone.chapter1.messages:" + work.id;
  const [storyActive, setStoryActive] = useState(false);
  const [storyFinished, setStoryFinished] = useState(() => { try { return !!JSON.parse(localStorage.getItem(storyFlowKey) || "null")?.done; } catch { return false; } });
  const [storyThread, setStoryThread] = useState("");
  const [storyApp, setStoryApp] = useState("");
  const [storyUnreadThreads, setStoryUnreadThreads] = useState<Record<string, boolean>>({});
  const [deliveredStoryIds, setDeliveredStoryIds] = useState<string[]>([]);
  const [storyNotification, setStoryNotification] = useState<{app:string;thread:string;item:Item}|null>(null);
  const [chapterItems, setChapterItems] = useState<Record<string,Item[]>>(() => { try { return JSON.parse(localStorage.getItem(chapterItemsKey) || "{}"); } catch { return {}; } });
  const [storyReply, setStoryReply] = useState<{app:string;thread:string;text:string;token:number}|null>(null);
  const [pendingThread, setPendingThread] = useState("");
  const storyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [quickCamera, setQuickCamera] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const appSnapshots = useRef(new Map<string, HTMLElement>());
  const [banner, setBanner] = useState("");
  const [checkout, setCheckout] = useState<{item:Item;quantity:number;success:boolean}|null>(null);
  const noticesSeen = useRef(0);
  const [contextApp, setContextApp] = useState("");
  const [deviceScale, setDeviceScale] = useState(0.84);
  const shell = useRef<HTMLDivElement>(null);
  const gesture = useRef({ x: 0, y: 0, time: 0, zone: "" });
  const [launchOrigin, setLaunchOrigin] = useState(screenOrigin);

  const beginUnlock = () => {
    setPinError("");
    setQuickCamera(false);
    if (work.phone.passcode) setPinOpen(true);
    else unlock();
  };
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const gestureConsumed = useRef(false);
  const [pinError, setPinError] = useState("");
  const [folder, setFolder] = useState("");
  const [panel, setPanel] = useState("");
  const [own, setOwn] = useState(() => initialRuntime(work));
  const [ready, setReady] = useState(creator || !!external);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const fit = () => {
      setDeviceScale(
        Math.max(
          0.4,
          Math.min(
            1.2,
            (el.parentElement!.clientWidth - 8) / 406,
            (window.innerHeight - 8) / 860,
          ),
        ),
      );
    };
    const observer = new ResizeObserver(fit);
    observer.observe(el.parentElement!);
    window.addEventListener("resize", fit);
    fit();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [creator, ready]);
  const s = external ?? own;
  const runtimeRef = useRef(s);
  runtimeRef.current = s;
  const update = (next: Runtime) => {
    runtimeRef.current = next;
    setOwn(next);
    onRuntime?.(next);
  };
  useEffect(() => {
    const handleCheckout = (event: Event) => {
      const detail = (event as CustomEvent<{item:Item;quantity:number}>).detail;
      if (!detail?.item || !detail.quantity) return;
      setCheckout({...detail,success:false});
      setApp("alipay");
    };
    window.addEventListener("foundphone:checkout",handleCheckout);
    return ()=>window.removeEventListener("foundphone:checkout",handleCheckout);
  }, []);
  const completePayment = () => {
    if (!checkout) return;
    const {item,quantity}=checkout;
    const total=Number(item.meta.price||0)*quantity;
    const time=new Date().toLocaleString("sv-SE",{hour12:false}).replace("T"," ");
    const number="TB"+Date.now().toString().slice(-12);
    const order:Item={id:"purchase-"+(globalThis.crypto?.randomUUID?.()||Date.now()),title:item.title,body:item.body,richText:"",meta:{...item.meta,price:total.toFixed(2),quantity:String(quantity),status:"已完成",number,paidBy:"支付宝余额"},time,sender:item.sender,avatar:"",kind:"order",media:"",hidden:false,unlock:"",password:"",folder:"订单",favorite:false,outgoing:false,read:false,likes:0,comments:[]};
    const bill:Item={id:"alipay-"+(globalThis.crypto?.randomUUID?.()||Date.now()),title:item.title,body:"淘宝订单付款",richText:"",meta:{merchant:"淘宝 · "+item.sender,amount:"-¥"+total.toFixed(2),status:"支付成功",orderNumber:number,quantity:String(quantity)},time,sender:"淘宝",avatar:"",kind:"order",media:"",hidden:false,unlock:"",password:"",folder:"交易",favorite:false,outgoing:false,read:false,likes:0,comments:[]};
    const current=runtimeRef.current;
    update({...current,messages:{...current.messages,taobao:[...(current.messages.taobao||[]),order],alipay:[...(current.messages.alipay||[]),bill]}});
    setCheckout({...checkout,success:true});
  };
  useEffect(() => {
    let active = true;
    if (creator || external) return;
    void db.saves
      .get(work.id)
      .then((saved) => {
        if (!active) return;
        if (saved && saved.state.revision === work.updatedAt)
          setOwn(saved.state);
        else {
          setOwn(dispatch(work, initialRuntime(work), "start"));
          if (saved) setLoadError("作品已更新，已开始新的进度。");
        }
        setReady(true);
      })
      .catch(() => {
        setOwn(dispatch(work, initialRuntime(work), "start"));
        setLoadError("无法读取本地存档。本次仍可游玩。");
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, [work.id, work.updatedAt, creator, external]);
  useEffect(() => {
    if (!creator && !external && ready)
      void db.saves
        .put({ id: work.id, state: own })
        .catch(() => setLoadError("存档失败，请检查浏览器存储权限。"));
  }, [own, creator, work.id, external, ready]);
  useEffect(() => {
    if (creator || !ready) return;
    const interval = setInterval(() => {
      const previous = runtimeRef.current;
      const next = advance(work, previous, 1000);
      runtimeRef.current = next;
      const changed =
        next.time !== previous.time ||
        next.trace.join() !== previous.trace.join() ||
        (next.scheduled?.length ?? 0) !== (previous.scheduled?.length ?? 0) ||
        (next.scheduled?.length ?? 0) > 0 ||
        Math.floor((next.elapsedMs ?? 0) / 5000) !==
          Math.floor((previous.elapsedMs ?? 0) / 5000);
      if (changed) update(next);
    }, 1000);
    return () => clearInterval(interval);
  }, [creator, ready, work.id, work.updatedAt]);
  const event = (event: string, target: string) => {
    if (!creator) update(dispatch(work, runtimeRef.current, event, target));
  };
  const captureApp = () => {
    if (!app) return;
    const current = shell.current?.querySelector<HTMLElement>(".app-screen");
    if (!current) return;
    const snapshot = current.cloneNode(true) as HTMLElement;
    snapshot.style.transform = "none";
    snapshot.style.opacity = "1";
    snapshot.style.filter = "none";
    snapshot.style.borderRadius = "0";
    snapshot.querySelectorAll("audio").forEach((el) => el.remove());
    snapshot.querySelectorAll("video").forEach((el) => {
      el.removeAttribute("autoplay");
      el.removeAttribute("src");
    });
    snapshot.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    appSnapshots.current.set(app, snapshot);
    for (const id of appSnapshots.current.keys())
      if (!recent.includes(id) && id !== app) appSnapshots.current.delete(id);
  };
  const open = (id: string) => {
    if (!work.apps.some((a) => a.id === id && a.installed)) return;
    setApp(id);
    setKeyboard(false);
    setRecent((v) => [id, ...v.filter((a) => a !== id)].slice(0, 8));
    setFolder("");
    setPanel("");
    onOpen?.(id);
    event("openApp", id);
  };
  const installedApps = work.apps.filter((a) => a.installed);
  const apps = installedApps.filter((a) => a.visible);
  const unlock = (pin = "") => {
    if (!work.phone.passcode || pin === work.phone.passcode) {
      setLocked(false);
      setPinOpen(false);
      const crush = String(work.variables.storyCrush || "");
      const targetApp = crush === "hanjin" ? "wechat" : "kakao";
      if (!creator && crush && !storyFinished) {
        setStoryApp(targetApp);
        setStoryUnreadThread(String(work.variables.storyNickname || "user"));
        setApp(targetApp);
        setStoryActive(true);
      }
      event("password", pin);
    } else {
      setPinError("密码不正确");
      setPinOpen(true);
    }
  };
  useEffect(() => {
    if (app && !work.apps.some((a) => a.id === app && a.installed)) setApp("");
  }, [app, work.apps]);
  const [deviceNow, setDeviceNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setDeviceNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const displayTime = deviceNow.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  const chapterDispatch = useMemo(() => makeChapterDispatch(work, String(work.variables.storyCrush || "shinyu")), [work.id, work.variables.storyCrush]);
  const chapterSocial = useMemo(() => makeChapterSocial(work, String(work.variables.storyCrush || "shinyu")), [work.id, work.variables.storyCrush]);
  useEffect(() => { try { localStorage.setItem(chapterItemsKey, JSON.stringify(chapterItems)); } catch {} }, [chapterItemsKey, chapterItems]);
  const storyUnreadKey = (appId:string, threadId:string) => appId + "::" + threadId;
  const unreadThreadForApp = Object.keys(storyUnreadThreads).find((key) => key.startsWith(app + "::"))?.slice(app.length + 2) || "";
  const appHasStoryUnread = (appId:string) => Object.keys(storyUnreadThreads).some((key) => key.startsWith(appId + "::"));
  const plugin = getApp(app);
  useEffect(() => {
    const count = s.notifications.length;
    if (!locked && work.phone.notifications && count > noticesSeen.current) {
      setBanner(s.notifications.at(-1) || "");
      const timer = setTimeout(() => setBanner(""), 2000);
      noticesSeen.current = count;
      return () => clearTimeout(timer);
    }
    noticesSeen.current = count;
  }, [s.notifications.length, locked, work.phone.notifications]);
  const dismissNotice = (index: number) =>
    update({
      ...runtimeRef.current,
      notifications: runtimeRef.current.notifications.filter(
        (_, i) => i !== index,
      ),
    });
  useEffect(() => {
    if (!banner) return;
    const timer = window.setTimeout(() => setBanner(""), 2000);
    return () => window.clearTimeout(timer);
  }, [banner]);
  if (!ready) return <div className="phone-loading">正在恢复进度…</div>;
  return (
    <div
      ref={shell}
      style={{ "--phone-scale": deviceScale } as CSSProperties}
      className={`phone-shell ios18 ${work.phone.theme === "dark" ? "dark-phone" : ""}`}
    >
      <KeyboardContext.Provider value={setKeyboard}>
        <div
          className={`phone-screen wallpaper-${work.phone.wallpaper} ${locked ? "is-locked" : ""} ${app ? "in-app" : ""} ${keyboard ? "keyboard-open" : ""}`}
          data-app={app}
          style={work.phone.wallpaperImage ? { backgroundImage: "linear-gradient(#00000008,#00000008), url(\"" + work.phone.wallpaperImage + "\")", backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            gestureConsumed.current = false;
            const button = (e.target as HTMLElement).closest<HTMLElement>(
              "[data-app-id]",
            );
            if (button) {
              pressTimer.current = setTimeout(() => {
                gestureConsumed.current = true;
                setContextApp(button.dataset.appId || "");
              }, 550);
            }
            const box = e.currentTarget.getBoundingClientRect(),
              x = (e.clientX - box.left) / deviceScale,
              y = (e.clientY - box.top) / deviceScale;
            gesture.current = {
              x,
              y,
              time: Date.now(),
              zone: y < 58 ? "top" : y > 818 ? "bottom" : locked ? "lock" : "",
            };
          }}
          onPointerMove={(e) => {
            if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5)
              clearTimeout(pressTimer.current);
          }}
          onPointerCancel={() => clearTimeout(pressTimer.current)}
          onPointerUp={(e) => {
            clearTimeout(pressTimer.current);
            const box = e.currentTarget.getBoundingClientRect(),
              y = (e.clientY - box.top) / deviceScale,
              g = gesture.current;
            const dy = y - g.y;
            if (g.zone === "top" && dy > 65)
              setPanel(g.x > 230 ? "control" : "notification");
            else if ((g.zone === "bottom" || g.zone === "lock") && dy < -55) {
              gestureConsumed.current = true;
              if (!locked) captureApp();
              setKeyboard(false);
              if (panel) {
                setPanel("");
              } else if (locked) {
                beginUnlock();
              } else if (g.zone === "bottom" && Date.now() - g.time > 450) {
                captureApp();
                setPanel("switcher");
              } else {
                setApp("");
                setPanel("");
                setFolder("");
              }
            }
          }}
          onClickCapture={(e) => {
            const target = (e.target as HTMLElement).closest(
              ".home-app-grid button,.dock button",
            );
            if (target) {
              setLaunchOrigin(
                readLauncherOrigin(target as HTMLElement, e.currentTarget),
              );
            }
          }}
        >
          <div className="wallpaper-orb orb-one" />
          <div className="wallpaper-orb orb-two" />
          <div className="status-bar">
            <button
              onClick={() =>
                setPanel(panel === "notification" ? "" : "notification")
              }
              className="status-time"
              aria-label="通知中心"
            >
              {displayTime}
              <StatusGlyph kind="silent" />
            </button>
            <div className="dynamic-island" />
            <button
              className="signals"
              onClick={() => setPanel(panel === "control" ? "" : "control")}
              aria-label="控制中心"
            >
              <StatusGlyph kind="cellular" />
              <StatusGlyph kind="wifi" />
              <span
                className={`ios-battery${work.phone.battery <= 20 ? " low-battery" : ""}`}
              >
                <span style={{ width: `${work.phone.battery}%` }} />
                <b>{work.phone.battery}</b>
              </span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            {locked && !(quickCamera && app === "camera") ? (
              <DeviceLock
                work={
                  s.date
                    ? { ...work, phone: { ...work.phone, date: s.date } }
                    : work
                }
                time={displayTime}
                notices={s.notifications}
                onDismiss={dismissNotice}
                pinOpen={pinOpen}
                setPinOpen={setPinOpen}
                error={pinError}
                onUnlock={unlock}
                onLight={() => setPanel("light")}
                onCamera={() => {
                  setQuickCamera(true);
                  open("camera");
                }}
              />
            ) : app && app !== "appstore" ? (
              <AppWindow
                key={app}
                className={`app-screen engine-${plugin.engine} skin-${app}`}
                creator={creator}
                origin={launchOrigin}
              >
                <AppContent
                  app={plugin}
                  name={
                    work.apps.find((a) => a.id === app)?.name ?? plugin.name
                  }
                  items={[
                    ...(work.data[app] ?? []).filter((item) => item.id !== "chapter-dispatch" && !item.id.startsWith("chapter-thread-") && !item.id.startsWith("chapter-toilet-") && !item.id.startsWith("chapter-battle-") && !item.id.startsWith("chapter-exfan-") && item.id !== "chapter-giveaway"),
                    ...(app === "twitter" && storyActive ? [chapterDispatch] : []),
                    ...(app === "threads" && storyFinished ? chapterSocial.threads : []),
                    ...(app === "weibo" && storyFinished ? chapterSocial.weibo : []),
                    ...(s.messages[app] ?? []),
                    ...(chapterItems[app] ?? []),
                  ].filter((item) => {
                    if (creator) return true;
                    const chapterPost = item.id.startsWith("chapter-thread-") || item.id.startsWith("chapter-toilet-") || item.id.startsWith("chapter-battle-") || item.id.startsWith("chapter-exfan-") || item.id === "chapter-giveaway" || item.id === "chapter-dispatch";
                    return !chapterPost || storyFinished || (storyActive && item.id === "chapter-dispatch");
                  }).sort((a,b) => {
                    const priority = (id:string) => id === "chapter-dispatch" ? 0 : app === "weibo" && id === "chapter-giveaway" ? 1 : 2;
                    return priority(a.id)-priority(b.id);
                  })}
                  initialThread={app === storyApp ? pendingThread : ""}
                  unreadThread={unreadThreadForApp}
                  unreadThreads={Object.keys(storyUnreadThreads).filter((key) => key.startsWith(app + "::")).map((key) => key.slice(app.length + 2))}
                  storyReply={storyReply}
                  onStorySend={(text, thread) => {
                    window.dispatchEvent(new CustomEvent("foundphone-story-send", {detail:{app,thread,text}}));
                    setStoryReply(null);
                  }}
                  creator={creator}
                  state={s}
                  onRead={(id) => { event("read", id); setStoryUnreadThreads((v) => { const next={...v}; delete next[storyUnreadKey(app,id)]; return next; }); }}
                  onEdit={(item) => onEdit?.(app, item)}
                  onAdd={() => onAdd?.(app)}
                  onBack={() => setApp("")}
                  onSettings={onSettings}
                  onUi={(key, value) => {
                    const current = runtimeRef.current;
                    update(
                      dispatch(
                        work,
                        {
                          ...current,
                          ui: {
                            ...current.ui,
                            [app]: { ...current.ui?.[app], [key]: value },
                          },
                        },
                        "variable",
                        `ui:${app}:${key}`,
                      ),
                    );
                  }}
                  work={work}
                />
              </AppWindow>
            ) : (
              <HomeLauncher
                key={
                  "home-" + homeRequest + (app === "appstore" ? "store" : "")
                }
                storeOpen={app === "appstore"}
                closeStore={() => setApp("")}
                work={work}
                layout={deviceLayout.layout}
                change={deviceLayout.change}
                importLayout={deviceLayout.importLayout}
                error={deviceLayout.error}
                open={open}
                onFolder={setFolder}
                search={() => setPanel("search")}
                time={displayTime}
                icon={(a, small) => (
                  <AppIcon
                    key={a.id}
                    id={a.id}
                    unread={appHasStoryUnread(a.id)}
                    name={small ? undefined : a.name}
                    small={small}
                    custom={a.icon}
                    date={s.date || work.phone.date}
                    time={s.time}
                  />
                )}
                clearApp={(id) =>
                  update({
                    ...runtimeRef.current,
                    messages: Object.fromEntries(
                      Object.entries(runtimeRef.current.messages).filter(
                        ([app]) => app !== id,
                      ),
                    ),
                  })
                }
              />
            )}
          </AnimatePresence>
          {storyActive && !locked && (
            <ChapterOne
              key={storyFlowKey}
              work={work}
              onNativeOpen={(nativeApp, thread) => {
                setStoryApp(nativeApp);
                setPendingThread(thread);
                setStoryThread(thread);
                setStoryUnreadThreads((v) => { const next={...v}; delete next[storyUnreadKey(nativeApp,thread)]; return next; });
                setStoryNotification(null);
                setApp(nativeApp);
                setRecent((v) => [nativeApp, ...v.filter((a) => a !== nativeApp)].slice(0, 8));
              }}
              onNativeItem={(nativeApp, item) => {
                setChapterItems((v) => ({...v,[nativeApp]:[...(v[nativeApp]||[]),item]}));
              }}
              onNativePrompt={(nativeApp, thread, text, token) => setStoryReply({app:nativeApp,thread,text,token})}
              onNativeNotification={(nativeApp, thread, item) => {
                if (app === nativeApp && storyThread === thread) {
                  setBanner("新消息 · "+item.sender+"："+item.body);
                  window.setTimeout(() => setBanner(""), 2600);
                } else {
                  setStoryUnreadThreads((v) => ({...v,[storyUnreadKey(nativeApp,thread)]:true}));
                  setStoryNotification({app:nativeApp,thread,item});
                }
              }}
              onDispatchOpen={() => {
                setApp("twitter");
                setRecent((v) => ["twitter", ...v.filter((a) => a !== "twitter")].slice(0, 8));
              }}
              onFinish={() => {
                setStoryActive(false);
                setStoryFinished(true);
                setStoryUnreadThreads({});
                setStoryNotification(null);
                setApp("");
              }}
            />
          )}
          {storyNotification && !locked && (
            <button
              type="button"
              aria-label="打开新消息"
              onClick={() => {
                const notice = storyNotification;
                setPendingThread(notice.thread);
                setStoryThread(notice.thread);
                setStoryUnreadThreads((v) => { const next={...v}; delete next[storyUnreadKey(notice.app,notice.thread)]; return next; });
                setStoryNotification(null);
                open(notice.app);
              }}
              style={{position:"absolute",zIndex:90,top:12,left:12,right:12,width:"calc(100% - 24px)",maxWidth:390,margin:"0 auto",border:0,borderRadius:18,padding:"12px 14px",background:"rgba(250,250,252,.96)",backdropFilter:"blur(24px)",boxShadow:"0 8px 28px #0003",color:"#202124",textAlign:"left",display:"flex",gap:11,alignItems:"center"}}
            >
              <AppIcon id={storyNotification.app} small />
              <span style={{minWidth:0,flex:1}}>
                <span style={{display:"flex",justifyContent:"space-between",gap:8,fontSize:12,color:"#555"}}>
                  <strong>{storyNotification.app === "kakao" ? "KakaoTalk" : "微信"}</strong><span>刚刚</span>
                </span>
                <strong style={{display:"block",fontSize:14,marginTop:2}}>{storyNotification.item.meta.remark || storyNotification.item.sender}</strong>
                <span style={{display:"block",fontSize:13,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{storyNotification.item.body}</span>
              </span>
            </button>
          )}
          {folder && (
            <div className="folder-overlay" onClick={() => setFolder("")}>
              <h2>{folder}</h2>
              <div className="folder-apps" onClick={(e) => e.stopPropagation()}>
                {apps
                  .filter((a) => a.folder === folder)
                  .map((a) => (
                    <button key={a.id} onClick={() => open(a.id)}>
                      <AppIcon id={a.id} name={a.name} custom={a.icon} unread={appHasStoryUnread(a.id)} />
                    </button>
                  ))}
              </div>
              <button className="glass-btn" onClick={() => setFolder("")}>
                关闭文件夹
              </button>
            </div>
          )}
          {panel === "control" && (
            <ControlCenter
              battery={work.phone.battery}
              network={work.phone.network}
              close={() => setPanel("")}
            />
          )}
          {panel && panel !== "control" && panel !== "switcher" && (
            <div
              className={`system-panel ${panel === "light" ? "flash-on" : ""}`}
            >
              <button className="panel-close" onClick={() => setPanel("")}>
                关闭 <ChevronLeft size={14} />
              </button>
              {panel === "notification" ? (
                <>
                  <h2>通知中心</h2>
                  {work.phone.notifications && s.notifications.length ? (
                    <SystemNotifications
                      notices={s.notifications}
                      apps={work.apps}
                      onOpen={() => {
                        setPanel("");
                        if (locked) beginUnlock();
                        else if (installedApps.some((a) => a.id === "messages"))
                          open("messages");
                      }}
                      onDismiss={dismissNotice}
                    />
                  ) : (
                    <p>没有新通知</p>
                  )}
                </>
              ) : panel === "search" ? (
                <>
                  <h2>搜索 App</h2>
                  <AppSearch apps={installedApps} open={open} />
                </>
              ) : (
                <h2>手电筒已打开</h2>
              )}
            </div>
          )}
          {!creator && s.choices.length > 0 && !locked && (
            <div className="story-overlay">
              <span className="eyebrow">故事来到一个岔路口</span>
              <h3>你会如何选择？</h3>
              {s.choices.map((c) => (
                <button
                  key={c.target}
                  onClick={() => update(choose(work, s, c.target))}
                >
                  {c.label}
                  <ArrowUp size={15} />
                </button>
              ))}
            </div>
          )}
          {!creator && s.endings.length > 0 && !locked && (
            <div className="story-overlay ending">
              <span className="eyebrow">ENDING · {s.endings.length}</span>
              <h2>故事在这里停泊。</h2>
              <p>{s.endings[s.endings.length - 1]}</p>
              <button
                onClick={() => {
                  update(dispatch(work, initialRuntime(work), "start"));
                  setApp("");
                  setLocked(true);
                }}
              >
                重新开始
              </button>
            </div>
          )}
          {!creator && s.incomingCall && (
            <div className="incoming-call-screen">
              <small>
                {s.incomingCall.status === "ringing" ? "来电" : "通话中"} ·
                作品内模拟
              </small>
              <div className="incoming-avatar">
                {s.incomingCall.caller.slice(0, 1)}
              </div>
              <h2>{s.incomingCall.caller}</h2>
              {s.incomingCall.status === "answered" &&
                (() => {
                  const record = work.data.phone?.find(
                    (i) => i.id === s.incomingCall?.target,
                  );
                  return record?.kind === "audio" && safeMedia(record.media) ? (
                    <audio controls src={safeMedia(record.media)} />
                  ) : (
                    <p>这是一通虚构来电。</p>
                  );
                })()}
              <div className="incoming-actions">
                <button
                  className="decline-call"
                  onClick={() => {
                    const call = runtimeRef.current.incomingCall;
                    if (call)
                      update(
                        dispatch(
                          work,
                          { ...runtimeRef.current, incomingCall: null },
                          call.status === "ringing"
                            ? "callDeclined"
                            : "callEnded",
                          call.target || call.caller,
                        ),
                      );
                  }}
                >
                  <PhoneIcon size={25} />
                  <span>
                    {s.incomingCall.status === "ringing" ? "拒接" : "挂断"}
                  </span>
                </button>
                {s.incomingCall.status === "ringing" && (
                  <button
                    className="accept-call"
                    onClick={() => {
                      const call = runtimeRef.current.incomingCall;
                      if (call)
                        update(
                          dispatch(
                            work,
                            {
                              ...runtimeRef.current,
                              incomingCall: { ...call, status: "answered" },
                            },
                            "callAnswered",
                            call.target || call.caller,
                          ),
                        );
                    }}
                  >
                    <PhoneIcon size={25} />
                    <span>接听</span>
                  </button>
                )}
              </div>
            </div>
          )}
          {checkout && !locked && (
            <div className="alipay-flow-backdrop">
              <section className="alipay-flow-card" role="dialog" aria-modal="true">
                <div className="alipay-flow-brand">支付宝</div>
                {checkout.success ? <>
                  <div className="alipay-success-mark">✓</div>
                  <h2>付款成功</h2>
                  <p>{(Number(checkout.item.meta.price||0)*checkout.quantity).toFixed(2)}元</p>
                  <button onClick={()=>{const title=checkout.item.title;setCheckout(null);setApp("taobao");setBanner("淘宝：您已成功购买「"+title+"」");}}>完成</button>
                </> : <>
                  <small>确认付款</small>
                  <strong className="alipay-flow-amount">{(Number(checkout.item.meta.price||0)*checkout.quantity).toFixed(2)}元</strong>
                  <div className="alipay-flow-detail"><span>{checkout.item.title} × {checkout.quantity}</span><b>付款方式：余额</b></div>
                  <button onClick={completePayment}>支付</button>
                  <small className="alipay-flow-note">模拟支付 · 不会产生真实扣款</small>
                </>}
              </section>
            </div>
          )}
          <AnimatePresence>
            {banner && !locked && (
              <motion.button
                className="device-banner"
                initial={{ opacity: 0, y: -28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -72, transition: { duration: 0.16, ease: "easeIn" } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={() => {
                  setBanner("");
                  setPanel("notification");
                }}
              >
                <AppIcon
                  id={notificationContent(banner, work.apps).appId}
                  small
                />
                <span>
                  <strong>{notificationContent(banner, work.apps).title}</strong>
                  <span>{notificationContent(banner, work.apps).body}</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
          {panel === "switcher" && (
            <div className="device-switcher">
              <div className="switcher-cards">
                {recent
                  .filter(
                    (id) =>
                      installedApps.some((a) => a.id === id) &&
                      appSnapshots.current.has(id),
                  )
                  .map((id) => (
                    <button
                      className="recent-app-card"
                      key={id}
                      onClick={() => open(id)}
                    >
                      <span className="recent-app-label">
                        <AppIcon id={id} small />
                        <strong>
                          {work.apps.find((a) => a.id === id)?.name}
                        </strong>
                      </span>
                      <span className="recent-app-window">
                        <span
                          className="recent-app-snapshot"
                          aria-hidden="true"
                          inert
                          ref={(el) => {
                            const snapshot = appSnapshots.current.get(id);
                            if (el && snapshot)
                              el.replaceChildren(snapshot.cloneNode(true));
                          }}
                        />
                      </span>
                    </button>
                  ))}
              </div>
              <button className="switcher-done" onClick={() => setPanel("")}>
                完成
              </button>
            </div>
          )}
          {contextApp && (
            <div
              className="home-context-shade"
              onClick={() => setContextApp("")}
            >
              <div className="home-context-menu">
                <AppIcon id={contextApp} />
                <strong>
                  {work.apps.find((a) => a.id === contextApp)?.name}
                </strong>
                <button
                  onClick={() => {
                    open(contextApp);
                    setContextApp("");
                  }}
                >
                  打开 App
                </button>
                <button
                  onClick={() => {
                    setContextApp("");
                    setPanel("search");
                  }}
                >
                  在 App 库中查看
                </button>
                <button onClick={() => setContextApp("")}>取消</button>
              </div>
            </div>
          )}
          {keyboard && <DeviceKeyboard close={() => setKeyboard(false)} />}
          {loadError && (
            <button className="runtime-error" onClick={() => setLoadError("")}>
              {loadError}
            </button>
          )}
          <button
            className="home-indicator"
            aria-label="返回桌面"
            onClick={() => {
              if (gestureConsumed.current) return;
              if (locked) {
                beginUnlock();
                return;
              }
              captureApp();
              setHomeRequest((n) => n + 1);
              setKeyboard(false);
              setApp("");
              setFolder("");
              setPanel("");
            }}
          />
          <div className="screen-dimmer" />
          <div className="hardware-reflection" />
        </div>
      </KeyboardContext.Provider>
    </div>
  );
}
function AppSearch({
  apps,
  open,
}: {
  apps: Work["apps"];
  open: (id: string) => void;
}) {
  const [q, set] = useState("");
  return (
    <>
      <input
        autoFocus
        value={q}
        placeholder="App 名称"
        onChange={(e) => set(e.target.value)}
      />
      {apps
        .filter((a) => a.name.toLowerCase().includes(q.toLowerCase()))
        .map((a) => (
          <button
            className="search-result"
            key={a.id}
            onClick={() => open(a.id)}
          >
            <AppIcon id={a.id} small />
            {a.name}
          </button>
        ))}
    </>
  );
}
function Media({ item }: { item: Item }) {
  const src = safeMedia(item.media);
  return src ? (
    item.kind === "audio" ? (
      <audio controls src={src} />
    ) : item.kind === "video" ? (
      <video controls playsInline src={src} />
    ) : (
      <img loading="lazy" src={src} alt={item.title} />
    )
  ) : (
    <div
      className={`original-art art-${item.id.includes("ticket") ? "ticket" : "rain"}`}
    >
      <span>
        {item.id.includes("ticket") ? "城南 / SOUTHBOUND" : "after the rain"}
      </span>
      <strong>{item.id.includes("ticket") ? "09 · 01" : "雨 后"}</strong>
      <small>
        {item.id.includes("ticket")
          ? "16:30 · 一张未完成的约定"
          : "a little moment of quiet"}
      </small>
    </div>
  );
}
function AppContent({
  app,
  name,
  items,
  creator,
  state,
  onRead,
  onEdit,
  onAdd,
  onBack,
  onSettings,
  onUi,
  work,
  initialThread = "",
  unreadThread = "",
  unreadThreads = [],
  storyReply = null,
  onStorySend,
}: {
  app: AppPlugin;
  name: string;
  items: Item[];
  creator: boolean;
  state: Runtime;
  onRead: (id: string) => void;
  onEdit: (item: Item) => void;
  onAdd: () => void;
  onBack: () => void;
  onSettings?: () => void;
  onUi?: (key: string, value: UiValue) => void;
  work: Work;
  initialThread?: string;
  unreadThread?: string;
  unreadThreads?: string[];
  storyReply?: { app: string; thread: string; text: string; token: number } | null;
  onStorySend?: (text: string, thread: string) => void;
}) {
  const [detail, setDetail] = useState<Item | null>(null);
  const [thread, setThread] = useState(initialThread);
  useEffect(() => { if (initialThread) setThread(initialThread); }, [initialThread]);
  const [tab, setTab] = useState(app.tabs[0]);
  const [q, setQ] = useState("");
  const [pw, setPw] = useState("");
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const [pwError, setPwError] = useState("");
  const [likes, setLikes] = useState<string[]>([]);
  const shown = items
    .filter((i) => creator || visible(i, state))
    .filter((i) =>
      (i.title + i.body + i.sender).toLowerCase().includes(q.toLowerCase()),
    );
  const filtered =
    tab === "收藏"
      ? shown.filter((i) => i.favorite)
      : tab === app.tabs[0]
        ? shown
        : shown.filter((i) => i.folder === tab);
  const read = (i: Item) => {
    if (creator) {
      onEdit(i);
      return;
    }
    setDetail(i);
    if (!i.password || unlocks.includes(i.id)) onRead(i.id);
  };
  const chats = [...new Set(shown.map((i) => i.title))];
  const back = () => {
    if (detail) setDetail(null);
    else if (thread) setThread("");
    else onBack();
  };
  const Skin =
    app.id === "wechat"
      ? WeChatSkin
      : app.id === "whatsapp"
        ? WhatsAppSkin
        : (catalogSkins[app.id as keyof typeof catalogSkins] ?? null);
  const detailView = detail ? (
    <div className="phone-content detail-content">
      {detail.password && !creator && !unlocks.includes(detail.id) ? (
        <div className="locked-note">
          <LockKeyhole size={36} />
          <h3>这条内容已锁定</h3>
          <input
            type="password"
            placeholder="内容密码"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            onClick={() => {
              if (pw === detail.password) {
                setUnlocks([...unlocks, detail.id]);
                onRead(detail.id);
                setPwError("");
              } else setPwError("密码不正确");
            }}
          >
            解锁内容
          </button>
          <small>{pwError}</small>
        </div>
      ) : (
        <>
          <small className="detail-meta">
            {detail.time} · {detail.sender}
          </small>
          <h2>{detail.title}</h2>
          {(detail.media || ["media", "social"].includes(app.engine)) && (
            <Media item={detail} />
          )}
          <RichText value={detail.richText} fallback={detail.body} />
          <dl className="item-metadata">
            {getFields(app.id)
              .filter((f) => detail.meta?.[f.key])
              .map((f) => (
                <div key={f.key}>
                  <dt>{f.label}</dt>
                  <dd>{detail.meta[f.key]}</dd>
                </div>
              ))}
          </dl>
          {detail.folder && (
            <span className="folder-label">
              <Folder size={12} />
              {detail.folder}
            </span>
          )}
          {detail.comments.map((c, i) => (
            <p key={i} className="comment">
              {c}
            </p>
          ))}
        </>
      )}
    </div>
  ) : null;
  if (Skin)
    return (
      <>
        <div className="catalog-slot" hidden={!!detail}>
          <Suspense fallback={<div className="catalog-loading">正在打开…</div>}>
            <Skin
              appId={app.id}
              owner={work.phone.owner}
              virtualTime={state.time}
              ui={state.ui?.[app.id]}
              onUi={creator ? undefined : onUi}
              name={name}
              items={shown}
              creator={creator}
              onRead={onRead}
              onItem={read}
              onAdd={onAdd}
              onBack={onBack}
              thread={thread}
              onThread={(value) => { setThread(value); if (value === unreadThread || unreadThreads.includes(value)) onRead(value); }}
              unreadThread={unreadThread}
              unreadThreads={unreadThreads}
              storyReply={storyReply?.app === app.id && storyReply.thread === thread ? {text:storyReply.text,token:storyReply.token} : null}
              onStorySend={(text) => onStorySend?.(text, thread)}
            />
          </Suspense>
        </div>
        {detail &&
          (socialDetailApps.has(app.id) &&
          (!detail.password || unlocks.includes(detail.id)) ? (
            <SocialDetail
              app={app.id}
              item={detail}
              back={back}
              owner={work.phone.owner}
              ui={state.ui?.[app.id]}
              onUi={onUi}
            />
          ) : nativeDetailApps.has(app.id) &&
            (!detail.password || unlocks.includes(detail.id)) ? (
            <NativeDetail app={app.id} item={detail} back={back} />
          ) : (
            <>
              <div className="app-nav">
                <button aria-label="返回" onClick={back}>
                  <ChevronLeft size={23} />
                </button>
                <strong>{detail.title}</strong>
                <span />
              </div>
              {detailView}
            </>
          ))}
      </>
    );
  return (
    <>
      <div className="app-nav">
        <button onClick={back} aria-label="返回">
          <ChevronLeft size={23} />
          {detail || thread ? "返回" : ""}
        </button>
        <strong>{thread || name}</strong>
        <button
          onClick={
            creator
              ? onAdd
              : () =>
                  document
                    .querySelector<HTMLInputElement>(
                      ".app-screen .phone-search input",
                    )
                    ?.focus()
          }
          aria-label={creator ? "新增内容" : "搜索内容"}
        >
          {creator ? <Plus size={22} /> : <Search size={20} />}
        </button>
      </div>
      {app.id === "settings" && !detail ? (
        <NativeSettings
          work={work}
          items={items}
          creator={creator}
          onItem={read}
          onSettings={onSettings}
        />
      ) : app.id === "calculator" && !detail ? (
        <NativeCalculator
          items={shown}
          onRead={read}
          ui={state.ui?.[app.id]}
          onUi={onUi}
        />
      ) : detail ? (
        detailView
      ) : app.engine === "messaging" && thread ? (
        <div className="chat-content">
          <div className="chat-time">2026 年 9 月 1 日</div>
          {shown
            .filter((i) => i.title === thread)
            .map((i) => (
              <button
                key={i.id}
                className={`message-row ${i.outgoing ? "outgoing" : ""}`}
                onClick={() => (creator ? onEdit(i) : onRead(i.id))}
              >
                <span className="avatar">{i.sender.slice(0, 1)}</span>
                <span className="bubble">
                  {i.kind === "image" ||
                  i.kind === "audio" ||
                  i.kind === "video" ? (
                    <Media item={i} />
                  ) : i.kind === "transfer" ? (
                    <span className="transfer">
                      ¥ {i.body}
                      <small>虚构转账记录</small>
                    </span>
                  ) : (
                    i.body
                  )}
                  <small>
                    {i.time.slice(-5)} {i.read ? "✓✓" : ""}
                  </small>
                  {creator && (i.hidden || i.unlock) && (
                    <LockKeyhole size={12} />
                  )}
                </span>
              </button>
            ))}
          {creator ? (
            <button className="chat-compose" onClick={onAdd}>
              ＋ 添加一条消息
            </button>
          ) : (
            <div className="chat-compose muted">
              根据剧情推进，互动回复将在这里出现。
            </div>
          )}
        </div>
      ) : (
        <div
          className={`phone-content ${app.engine === "social" ? "feed-content" : ""}`}
        >
          {app.engine !== "media" && (
            <div className="phone-search">
              <Search size={15} />
              <input
                placeholder={`搜索${name}`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          )}
          {app.engine === "messaging" ? (
            chats.map((t) => {
              const list = shown.filter((i) => i.title === t),
                last = list[list.length - 1];
              return (
                <button
                  className="contact-row"
                  key={t}
                  onClick={() => {
                    setThread(t);
                    onRead(t);
                  }}
                >
                  <span className="avatar" style={{ background: app.color }}>
                    {t.slice(0, 1)}
                  </span>
                  <span>
                    <strong>{t}</strong>
                    <p>{last.body}</p>
                  </span>
                  <small>{last.time.slice(-5)}</small>
                </button>
              );
            })
          ) : app.engine === "media" ? (
            <>
              <div className="media-heading">
                <h1>{tab}</h1>
                <p>{filtered.length} 个故事片段</p>
              </div>
              <div className="media-grid">
                {filtered.map((i) => (
                  <button key={i.id} onClick={() => read(i)}>
                    <Media item={i} />
                    <span>
                      {i.title} {creator && i.hidden ? "· 隐藏" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : app.engine === "social" ? (
            filtered.map((i) => (
              <article className="social-post" key={i.id}>
                <div className="post-author">
                  <span className="avatar" style={{ background: app.color }}>
                    {i.sender.slice(0, 1)}
                  </span>
                  <div>
                    <strong>{i.sender}</strong>
                    <small>{i.time}</small>
                  </div>
                  <button aria-label="查看帖子详情" onClick={() => read(i)}>
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <button className="post-image" onClick={() => read(i)}>
                  <Media item={i} />
                </button>
                <div className="post-actions">
                  <button
                    aria-label="虚构点赞"
                    onClick={() =>
                      setLikes(
                        likes.includes(i.id)
                          ? likes.filter((id) => id !== i.id)
                          : [...likes, i.id],
                      )
                    }
                  >
                    <Heart
                      size={22}
                      fill={likes.includes(i.id) ? "#d67670" : "none"}
                    />
                  </button>
                  <button aria-label="查看评论" onClick={() => read(i)}>
                    <MessageCircle size={22} />
                  </button>
                  <small>
                    {i.likes + (likes.includes(i.id) ? 1 : 0)} 次虚构喜欢
                  </small>
                </div>
                <button className="post-text" onClick={() => read(i)}>
                  <strong>{i.title}</strong>
                  <p>{i.body}</p>
                </button>
              </article>
            ))
          ) : (
            filtered.map((i) => (
              <button
                key={i.id}
                className={`record-row ${app.engine === "document" ? "document-row" : ""}`}
                onClick={() => read(i)}
              >
                <div className="record-symbol">
                  {app.engine === "records" ? (
                    <app.icon size={20} />
                  ) : (
                    <span>{i.title.slice(0, 1)}</span>
                  )}
                </div>
                <div>
                  <strong>{i.title}</strong>
                  <p>{i.body.split("\n")[0]}</p>
                  <small>
                    {i.time} {i.folder && `· ${i.folder}`}
                  </small>
                </div>
                {i.password || i.hidden ? (
                  <LockKeyhole size={14} />
                ) : (
                  <ChevronLeft className="chevron-right" size={16} />
                )}
              </button>
            ))
          )}
          {!filtered.length && app.engine !== "messaging" && (
            <div className="empty-app">
              <app.icon size={36} />
              <h3>这一页还很安静</h3>
              <p>
                {creator
                  ? "添加属于这个 App 的故事内容。"
                  : "暂时没有可浏览的内容。"}
              </p>
            </div>
          )}
          {creator && (
            <button className="phone-add" onClick={onAdd}>
              <Plus size={15} />
              添加
              {app.engine === "messaging"
                ? "聊天"
                : app.engine === "social"
                  ? "帖子"
                  : app.engine === "media"
                    ? "素材"
                    : "内容"}
            </button>
          )}
        </div>
      )}
      {!detail &&
        !thread &&
        app.id !== "calculator" &&
        app.id !== "settings" && (
          <div className="app-tabs">
            {app.tabs.map((t, i) => (
              <button
                key={t}
                className={tab === t ? "selected" : ""}
                onClick={() => setTab(t)}
              >
                {i === 0 ? (
                  <MessageCircle size={17} />
                ) : i === 1 ? (
                  <Search size={17} />
                ) : (
                  <UsersIcon />
                )}
                <span>{t}</span>
              </button>
            ))}
          </div>
        )}
    </>
  );
}
function UsersIcon() {
  return <PhoneIcon size={17} />;
}
