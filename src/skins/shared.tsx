import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LockKeyhole,
  Plus,
  Search,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { SkinProps } from "../AppSkins";
import { safeMedia, type Item } from "../schema";
export type Props = SkinProps;
export const meta = (
  i: Pick<Item, "meta"> | undefined,
  key: string,
  fallback = "",
) => String(i?.meta?.[key] ?? fallback);
export function Header({ p, children }: { p: Props; children?: ReactNode }) {
  return (
    <header
      className="app-nav catalog-nav"
      data-authoring={p.creator}
      data-root={!p.thread}
    >
      <button aria-label="返回" onClick={p.onBack}>
        <ChevronLeft size={22} />
      </button>
      <strong>{p.name}</strong>
      <div>
        {children}
        {p.creator && (
          <button aria-label="新增内容" onClick={p.onAdd}>
            <Plus size={21} />
          </button>
        )}
      </div>
    </header>
  );
}
export function Tabs({
  tabs,
  value,
  set,
  icons,
}: {
  tabs: string[];
  value: string;
  set: (s: string) => void;
  icons?: ReactNode[];
}) {
  return (
    <nav className="catalog-tabs">
      {tabs.map((t, i) => (
        <button
          key={t}
          className={value === t ? "selected" : ""}
          onClick={() => set(t)}
        >
          {icons?.[i]}
          <span>{t}</span>
        </button>
      ))}
    </nav>
  );
}
export function SearchBox({
  value,
  set,
  placeholder = "搜索",
}: {
  value: string;
  set: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="catalog-search">
      <Search size={15} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
const MEMBER_AVATARS: Record<string, string> = {
  shinyu: "IMG_9696",
  "申惟": "IMG_9696",
  "晶㬊尼": "IMG_9696",
  "事多爹系天蝎男": "IMG_9696",
  tlswjdghks: "IMG_9696",
  dohoon: "IMG_9697",
  "道勋": "IMG_9697",
  "小屎狗": "IMG_9697",
  "不要理他！": "IMG_9697",
  doking: "IMG_9697",
  youngjae: "IMG_9701",
  "英宰": "IMG_9701",
  "居家服务型男": "IMG_9701",
  "远离双子男": "IMG_9701",
  jae_e: "IMG_9701",
  hanjin: "IMG_9702",
  "韩振": "IMG_9702",
  "珍珍": "IMG_9702",
  "不中": "IMG_9702",
  henan_prince: "IMG_9702",
  jihoon: "IMG_9703",
  "志薰": "IMG_9703",
  "击击击昏": "IMG_9703",
  "tws韩志薰": "IMG_9703",
  ahoooon: "IMG_9703",
  kyungmin: "IMG_9704",
  "炅潣": "IMG_9704",
  "炅man": "IMG_9704",
  "李炅jiong潣min": "IMG_9704",
  kyungman_lee: "IMG_9704",
};

export function Avatar({
  name,
  round = true,
  src = "",
}: {
  name: string;
  round?: boolean;
  src?: string;
}) {
  const mappedImage = MEMBER_AVATARS[name.trim()];
  const resolvedSrc = src || (mappedImage
    ? `${import.meta.env.BASE_URL}people/${mappedImage}.jpeg`
    : "");
  const imageSrc = resolvedSrc.startsWith("data:image/")
    ? safeMedia(resolvedSrc)
    : /^(\/|\.\/|people\/)/.test(resolvedSrc)
      ? resolvedSrc
      : "";

  return (
    <span className={`catalog-avatar ${round ? "round" : ""}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="" loading="lazy" />
      ) : (
        name.slice(0, 1) || "人"
      )}
    </span>
  );
}
export function Media({
  item,
  className = "",
}: {
  item: Item;
  className?: string;
}) {
  const raw = item.media;
  const local = /^(\/|\.\/|people\/|wx\/|kkt\/)/.test(raw) && !raw.includes('..');
  const src = safeMedia(raw) || (local ? (raw.startsWith('/') ? raw : `${import.meta.env.BASE_URL}${raw}`) : '');
  return src ? (
    item.kind === "audio" ? (
      <audio className={className} controls src={src} />
    ) : item.kind === "video" ? (
      <video
        className={className}
        controls
        playsInline
        src={src}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <img className={className} loading="lazy" alt={item.title} src={src} />
    )
  ) : (
    <div className={`catalog-art ${className}`}>
      <span>{item.title}</span>
    </div>
  );
}
export function Row({
  item,
  onItem,
  leading,
  children,
}: {
  item: Item;
  onItem: (i: Item) => void;
  leading?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <button className="catalog-row" onClick={() => onItem(item)}>
      {leading ?? <FileText size={22} />}
      <span>
        <strong>{item.title}</strong>
        <p>{item.body.split("\n")[0]}</p>
        <small>{item.time}</small>
      </span>
      {children ??
        (item.password ? (
          <LockKeyhole size={13} />
        ) : (
          <ChevronRight size={15} />
        ))}
    </button>
  );
}
export function Empty({
  items,
  label = "暂无内容",
}: {
  items: Item[];
  label?: string;
}) {
  return !items.length ? <p className="catalog-empty">{label}</p> : null;
}
export function Add({ p, label = "添加内容" }: { p: Props; label?: string }) {
  return p.creator ? (
    <button className="catalog-add" onClick={p.onAdd}>
      <Plus size={15} />
      {label}
    </button>
  ) : null;
}
export function useContent(p: Props, first: string) {
  const [tab, setTab] = useState(first),
    [q, setQ] = useState("");
  const items = p.items.filter((i) =>
    (
      i.title +
      i.body +
      i.sender +
      i.folder +
      Object.values(i.meta ?? {}).join(" ")
    )
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return { tab, setTab, q, setQ, items };
}
export function groupItems(items: Item[], fallback = "未分类") {
  return [...new Set(items.map((i) => i.folder || fallback))];
}
