import { useState, type ComponentType, type CSSProperties } from "react";
import {
  Plane,
  Wifi,
  Bluetooth,
  Signal,
  Battery,
  Settings,
  Accessibility,
  Image,
  Bell,
  Volume2,
  Moon,
  Shield,
  ChevronRight,
  Search,
  Check,
  Link,
  Globe,
  Mic,
} from "lucide-react";
import type { Work, Item } from "../schema";
import type { SaveSlot } from "../runtime/saveSlots";
import { IOSToggle } from "../vendor/konsta/Toggle";
import { NavigationPage, useNavigation } from "./Navigation";
type Row = [ComponentType<{ size?: number }>, string, string];
const slotButtonStyle: CSSProperties = {flex:1,minWidth:0,height:34,border:0,borderRadius:9,background:"#f2f2f7",color:"#222",fontSize:12,fontWeight:600};
const groups: Row[][] = [
  [
    [Plane, "飞行模式", "#ff9500"],
    [Wifi, "无线局域网", "#007aff"],
    [Bluetooth, "蓝牙", "#007aff"],
    [Signal, "蜂窝网络", "#34c759"],
    [Link, "个人热点", "#65ce88"],
    [Battery, "电池", "#34c759"],
    [Globe, "VPN", "#007aff"],
  ],
  [
    [Settings, "通用", "#8e8e93"],
    [Accessibility, "辅助功能", "#007aff"],
    [Image, "墙纸", "#32ade6"],
  ],
  [
    [Bell, "通知", "#ff3b30"],
    [Volume2, "声音与触感", "#ff2d55"],
    [Moon, "专注模式", "#5856d6"],
    [Shield, "面容 ID 与密码", "#34c759"],
  ],
];
export function NativeSettings({
  work,
  items,
  creator,
  onItem,
  onSettings,
  saveSlots = [],
  onSaveSlot,
  onRenameSlot,
  onLoadSlot,
}: {
  work: Work;
  items: Item[];
  creator: boolean;
  onItem: (i: Item) => void;
  onSettings?: () => void;
  saveSlots?: SaveSlot[];
  onSaveSlot?: (slot: number) => Promise<void>;
  onRenameSlot?: (slot: number, name: string) => Promise<void>;
  onLoadSlot?: (slot: SaveSlot) => void;
}) {
  const nav = useNavigation(),
    [query, setQuery] = useState(""),
    [airplane, setAirplane] = useState(false),
    [wifi, setWifi] = useState(true),
    [bluetooth, setBluetooth] = useState(true),
    [lowPower, setLowPower] = useState(false),
    [nameSlot, setNameSlot] = useState<number | null>(null),
    [nameDraft, setNameDraft] = useState(""),
    [overwriteSlot, setOverwriteSlot] = useState<number | null>(null);
  const row = (label: string, value?: string, click?: () => void) => (
    <button key={label} className="settings-native-row" onClick={click}>
      <span>{label}</span>
      <span className="settings-detail-value">{value}</span>
      {click && <ChevronRight size={16} />}
    </button>
  );

  const slotAt = (slot: number) => saveSlots.find((item) => item.slot === slot);
  const requestSave = (slot: number) => {
    if (slotAt(slot)) setOverwriteSlot(slot);
    else void onSaveSlot?.(slot);
  };
  const confirmSave = async () => {
    if (overwriteSlot === null) return;
    await onSaveSlot?.(overwriteSlot);
    setOverwriteSlot(null);
  };
  const toggle = (label: string, value: boolean, set: (v: boolean) => void) => (
    <div className="settings-native-row">
      <span>{label}</span>
      <IOSToggle label={label} checked={value} onChange={set} />
    </div>
  );
  const sub = () => {
    switch (nav.page) {
      case "通用":
        return (
          <div className="settings-group">
            {row("关于本机", "", () => nav.push("关于本机"))}
            {row("软件更新", "iOS 18.0", () => nav.push("软件更新"))}
            {row("iPhone 储存空间", "", () => nav.push("iPhone 储存空间"))}
            {row("日期与时间", "", () => nav.push("日期与时间"))}
            {row("语言与地区", "简体中文", () => nav.push("语言与地区"))}
          </div>
        );
      case "关于本机":
        return (
          <div className="settings-group">
            {row("名称", work.phone.owner + "的 iPhone")}
            {row("iOS 版本", "18.0")}
            {row("机型名称", "iPhone 15 Pro")}
            {row("照片", String(work.data.photos?.length || 0))}
            {row(
              "应用程序",
              String(work.apps.filter((a) => a.installed).length),
            )}
          </div>
        );
      case "Wi-Fi":
      case "无线局域网":
        return (
          <>
            <div className="settings-group">
              {toggle("Wi-Fi", wifi, setWifi)}
            </div>
            {wifi && (
              <>
                <p className="settings-section-label">我的网络</p>
                <div className="settings-group">
                  <div className="settings-native-row">
                    <Check size={18} color="#007aff" />
                    <span>{work.phone.network}</span>
                    <Wifi size={18} />
                  </div>
                </div>
                <p className="settings-page-caption">
                  连接状态仅用于作品中的虚拟手机。
                </p>
              </>
            )}
          </>
        );
      case "蓝牙":
        return (
          <>
            <div className="settings-group">
              {toggle("蓝牙", bluetooth, setBluetooth)}
            </div>
            <p className="settings-page-caption">
              {bluetooth ? "我的设备" : "蓝牙已关闭"}
            </p>
          </>
        );
      case "电池":
        return (
          <>
            <div className="settings-group">
              {row("电池电量", work.phone.battery + "%")}
              {toggle("低电量模式", lowPower, setLowPower)}
            </div>
            <p className="settings-page-caption">
              低电量模式仅改变虚拟设备状态。
            </p>
          </>
        );
      case "日期与时间":
        return (
          <div className="settings-group">
            {row("日期", work.phone.date || "2026-09-01")}
            {row("时间", work.phone.time)}
            {row("时区", "中国标准时间")}
          </div>
        );
      case "iPhone 储存空间":
        return (
          <div className="settings-group">
            {work.apps
              .filter((a) => a.installed)
              .map((a) => row(a.name, `${work.data[a.id]?.length || 0} 项`))}
          </div>
        );
      case "软件更新":
        return (
          <p className="settings-page-caption">
            iOS 18.0 · 此为作品中的虚拟系统，不下载系统更新。
          </p>
        );
      default:
        return (
          <>
            <div className="settings-group">
              {row(
                nav.page,
                nav.page === "面容 ID 与密码"
                  ? work.phone.passcode
                    ? "已设置密码"
                    : "未设置密码"
                  : "",
              )}
            </div>
            {!items.some((i) => i.folder === nav.page) && (
              <p className="settings-page-caption">此作品没有配置更多选项。</p>
            )}
          </>
        );
    }
  };
  return (
    <div className="native-settings" data-root={!nav.page}>
      <NavigationPage
        page={nav.page}
        back={nav.pop}
        title={nav.depth > 1 ? "通用" : "设置"}
      >
        {nav.page ? (
          sub()
        ) : (
          <>
            <h1>设置</h1>
            <section style={{margin:"14px 0 18px",padding:"16px",borderRadius:18,background:"#fff",boxShadow:"0 1px 5px #0000000d"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                <strong style={{fontSize:16}}>剧情存档</strong><small style={{color:"#8e8e93"}}>本机最多保存 3 个</small>
              </div>
              <p style={{fontSize:12,color:"#8e8e93",margin:"0 0 12px"}}>存档只记录当前进度与个人设定，后续更新的新剧情仍可继续体验。</p>
              {[1,2,3].map((slot) => {
                const saved = slotAt(slot);
                return <div key={slot} style={{padding:"12px 0",borderTop:"1px solid #f0f0f2"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                    <strong style={{fontSize:14}}>{saved?.name || "空存档位 " + slot}</strong>
                    <small style={{fontSize:11,color:"#8e8e93"}}>{saved ? new Date(saved.savedAt).toLocaleString() : "尚未存档"}</small>
                  </div>
                  <div style={{display:"flex",gap:7,marginTop:10}}>
                    <button disabled={!saved} onClick={()=>{setNameSlot(slot);setNameDraft(saved?.name || "存档"+slot)}} style={{...slotButtonStyle,opacity:saved?1:.4}}>命名</button>
                    <button onClick={()=>requestSave(slot)} style={slotButtonStyle}>存档</button>
                    <button disabled={!saved} onClick={()=>saved&&onLoadSlot?.(saved)} style={{...slotButtonStyle,opacity:saved?1:.4}}>读档</button>
                  </div>
                </div>;
              })}
            </section>

            {!query && (
              <button
                className="settings-account"
                onClick={() => nav.push(work.phone.owner)}
              >
                <span>{work.phone.owner.slice(0, 1)}</span>
                <div>
                  <strong>{work.phone.owner}</strong>
                  <small>Apple 账户、iCloud 与更多</small>
                </div>
                <ChevronRight size={17} />
              </button>
            )}
            {groups.map((group, n) => (
              <div className="settings-group" key={n}>
                {group
                  .filter(([, name]) => name.includes(query))
                  .map(([Icon, name, color]) => (
                    <div
                      key={name}
                      className="settings-native-row"
                      role={name === "飞行模式" ? undefined : "button"}
                      tabIndex={name === "飞行模式" ? undefined : 0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") nav.push(name);
                      }}
                      onClick={() => {
                        if (name !== "飞行模式") nav.push(name);
                      }}
                    >
                      <span
                        className="settings-glyph"
                        style={{ background: color }}
                      >
                        <Icon size={21} />
                      </span>
                      <span>{name}</span>
                      {name === "飞行模式" ? (
                        <IOSToggle
                          label="飞行模式"
                          checked={airplane}
                          onChange={setAirplane}
                        />
                      ) : (
                        <>
                          <small>
                            {name === "无线局域网"
                              ? wifi
                                ? "未连接"
                                : "关闭"
                              : name === "蓝牙"
                                ? bluetooth
                                  ? "打开"
                                  : "关闭"
                                : name === "VPN"
                                  ? "未连接"
                                  : name === "蜂窝网络" || name === "个人热点"
                                    ? "关闭"
                                    : ""}
                          </small>
                          <ChevronRight size={16} />
                        </>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
        {items
          .filter(
            (i) =>
              !nav.page || i.folder === nav.page || i.title.includes(nav.page),
          )
          .map((i) => (
            <button className="record-row" key={i.id} onClick={() => onItem(i)}>
              {i.title}
              <ChevronRight size={16} />
            </button>
          ))}
        {creator && (
          <button className="phone-add" onClick={onSettings}>
            编辑系统配置
          </button>
        )}
      </NavigationPage>

      {(nameSlot !== null || overwriteSlot !== null) && (
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#0006",display:"grid",placeItems:"center",padding:24}}>
          <div style={{width:"min(100%,320px)",background:"#fff",borderRadius:18,padding:20,boxShadow:"0 12px 40px #0003"}}>
            {nameSlot !== null ? <>
              <strong style={{fontSize:17}}>修改存档名称</strong>
              <input autoFocus value={nameDraft} maxLength={8} onChange={(e)=>setNameDraft(e.target.value.slice(0,8))} placeholder="最多8个字" style={{width:"100%",boxSizing:"border-box",height:42,marginTop:14,padding:"0 12px",border:"1px solid #ddd",borderRadius:10,fontSize:15}}/>
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <button onClick={()=>setNameSlot(null)} style={slotButtonStyle}>取消</button>
                <button onClick={async()=>{if(nameDraft.trim()){await onRenameSlot?.(nameSlot,nameDraft.trim());}setNameSlot(null)}} style={{...slotButtonStyle,background:"#242424",color:"#fff"}}>保存名称</button>
              </div>
            </> : <>
              <strong style={{fontSize:17}}>覆盖已有存档？</strong>
              <p style={{fontSize:13,color:"#777",lineHeight:1.6}}>这个存档位已有进度，确定要用当前进度覆盖吗？</p>
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <button onClick={()=>setOverwriteSlot(null)} style={slotButtonStyle}>否</button>
                <button onClick={()=>void confirmSave()} style={{...slotButtonStyle,background:"#242424",color:"#fff"}}>是，覆盖</button>
              </div>
            </>}
          </div>
        </div>
      )}
      {!nav.page && (
        <label className="settings-search">
          <Search size={23} />
          <input
            aria-label="搜索设置"
            placeholder="搜索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Mic size={22} aria-hidden="true" />
        </label>
      )}
    </div>
  );
}
