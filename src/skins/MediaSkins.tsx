import { AudioPlayer, useTrack } from "../audio";
import { useSkinState } from "../skinState";
import {
  Bookmark,
  Check,
  Compass,
  Heart,
  Home,
  MessageCircle,
  Music,
  Play,
  Plus,
  Search,
  Share2,
  SkipForward,
  User,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { safeMedia, type Item } from "../schema";
import {
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
function TrackPlayer({
  item,
  p,
  onNext,
}: {
  item: Item;
  p: Props;
  onNext: () => void;
}) {
  return (
    <div className="track-player">
      <button onClick={() => p.onItem(item)}>
        <Music size={20} />
        <span>
          {item.title}
          <small>{item.sender}</small>
        </span>
      </button>
      {item.kind === "audio" && safeMedia(item.media) ? (
        <AudioPlayer p={p} item={item} />
      ) : (
        <button onClick={() => p.onItem(item)}>查看</button>
      )}
      <button aria-label="下一首" onClick={onNext}>
        <SkipForward size={19} />
      </button>
    </div>
  );
}
export function SpotifySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [playlist, setPlaylist] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = playlist
    ? items.filter((i) => (i.folder || "我的音乐") === playlist)
    : items;
  return (
    <div className="catalog-skin spotify-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <div className="spotify-heading">
          <Avatar name={p.owner ?? "我"} />
          <button
            className={tab === "首页" ? "selected" : ""}
            onClick={() => setTab("首页")}
          >
            音乐
          </button>
          <button
            className={tab === "音乐库" ? "selected" : ""}
            onClick={() => setTab("音乐库")}
          >
            音乐库
          </button>
        </div>
        {tab === "搜索" && <SearchBox value={q} set={setQ} />}
        <h1>{playlist || (tab === "音乐库" ? "音乐库" : "为你收藏")}</h1>
        {!playlist && (
          <div className="spotify-playlists">
            {groupItems(items, "我的音乐").map((g) => (
              <button key={g} onClick={() => setPlaylist(g)}>
                <Music size={29} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        )}
        {playlist && (
          <button className="playlist-back" onClick={() => setPlaylist("")}>
            返回全部音乐
          </button>
        )}
        <div className="spotify-tracks">
          {list.map((i, n) => (
            <button
              key={i.id}
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
              <small>{meta(i, "duration")}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      {track && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["首页", "搜索", "音乐库"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setPlaylist("");
        }}
        icons={[<Home />, <Search />, <Music />]}
      />
    </div>
  );
}
export function NeteaseSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "发现");
  const [folder, setFolder] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = folder
    ? items.filter((i) => (i.folder || "我的歌单") === folder)
    : items;
  return (
    <div className="catalog-skin netease-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "发现" ? (
          <>
            <div className="netease-feature">
              <Music size={44} />
              <h2>推荐歌单</h2>
            </div>
            <div className="netease-shelves">
              {groupItems(items, "我的歌单").map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setFolder(g);
                    setTab("我的");
                  }}
                >
                  <Music size={33} />
                  <strong>{g}</strong>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="netease-profile">
              <Avatar name={p.owner ?? "我"} />
              <h2>{p.owner ?? "我的音乐"}</h2>
            </div>
            <h3>{folder || "我的歌单"}</h3>
          </>
        )}
        {list.map((i, n) => (
          <div className="netease-track" key={i.id}>
            <button
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
            </button>
            <button
              aria-label={`歌曲详情${i.title}`}
              onClick={() => p.onItem(i)}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        ))}
        <Empty items={list} />
      </div>
      {track && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["发现", "我的"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Compass />, <Music />]}
      />
    </div>
  );
}
export function YouTubeSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [playing, setPlaying] = useState<Item | null>(null);
  const videoSrc = playing ? safeMedia(playing.media) : "";
  const list = tab === "首页"
    ? items
    : tab === "订阅"
      ? items
      : tab === "播放列表"
        ? items.filter((i) => i.favorite || i.folder === "播放列表")
        : items.filter((i) => i.folder === tab);
  return (
    <div className="catalog-skin youtube-ui">
      <Header p={p}>
        <span className="youtube-brand-mark" aria-label="YouTube">▶</span>
      </Header>
      <SearchBox value={q} set={setQ} placeholder="搜索 YouTube" />
      <div className="youtube-chips">
        <button className="selected">全部</button>
      </div>
      {playing && videoSrc && (
        <section style={{ padding: "0 12px 12px", background: "#0f0f0f", color: "#fff" }}>
          <video
            key={playing.id}
            controls
            autoPlay
            playsInline
            preload="auto"
            poster={import.meta.env.BASE_URL + "youtube/" + meta(playing, "thumbnail")}
            src={import.meta.env.BASE_URL.replace(/\/$/, "") + videoSrc}
            style={{ display: "block", width: "100%", maxHeight: "52vh", background: "#000" }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 8 }}>
            <strong style={{ fontSize: 14 }}>{playing.title}</strong>
            <button onClick={() => setPlaying(null)} style={{ color: "#fff", padding: 8 }}>关闭</button>
          </div>
        </section>
      )}
      <div className="catalog-scroll">
        <div className="youtube-videos">
          {list.map((i) => (
            <article key={i.id}>
              <button className="youtube-thumb" onClick={() => setPlaying(i)}>
                <img
                  src={import.meta.env.BASE_URL + "youtube/" + meta(i, "thumbnail")}
                  alt={i.title}
                  loading="lazy"
                />
                <span className="youtube-play-overlay"><Play size={30} fill="white" /></span>
              </button>
              <div className="youtube-byline">
                <Avatar name={i.sender} src="/youtube/channels4_profile.jpeg" />
                <button onClick={() => setPlaying(i)}>
                  <strong>{i.title}</strong>
                  <small>
                    TWS · {meta(i, "views")} · {meta(i, "likesCount")} 赞
                  </small>
                </button>
                <button className="youtube-more" aria-label="更多选项" onClick={() => setPlaying(i)}>⋮</button>
              </div>
            </article>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "Shorts", "订阅", "播放列表"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Video />, <Users />, <User />]}
      />
    </div>
  );
}
export function BilibiliSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [category, setCategory] = useState("推荐");
  const list =
    tab === "历史"
      ? items.filter((i) => i.folder === "历史")
      : tab === "动态"
        ? items.filter((i) => i.folder === "动态")
        : category === "推荐"
          ? items
          : items.filter((i) => i.folder === category);
  return (
    <div className="catalog-skin bilibili-ui">
      <Header p={p} />
      <div className="bili-search">
        <Avatar name={p.owner ?? "我"} />
        <SearchBox value={q} set={setQ} />
      </div>
      <div className="bili-categories">
        {["推荐", "动画", "音乐", "生活"].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        <div className="bili-grid">
          {list.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <div>
                <Media item={i} />
                <small>
                  <Play size={10} />
                  {meta(i, "views", "—")}
                  <time>{meta(i, "duration")}</time>
                </small>
              </div>
              <strong>{i.title}</strong>
              <span>UP · {i.sender}</span>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "动态", "历史"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <MessageCircle />, <User />]}
      />
    </div>
  );
}
function VerticalVideo({ p, item }: { p: Props; item: Item }) {
  const [liked, setLiked] = useSkinState<boolean>(p, `liked-${item.id}`, false),
    [saved, setSaved] = useSkinState<boolean>(p, `saved-${item.id}`, false);
  return (
    <article className="vertical-video">
      <Media item={item} />
      <div className="vertical-actions">
        <button
          aria-label={`作者${item.sender}`}
          onClick={() => p.onItem(item)}
        >
          <Avatar name={item.sender} />
        </button>
        <button
          aria-label={`喜欢${item.title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={29} fill={liked ? "#f44368" : "white"} />
          <small>{item.likes + (liked ? 1 : 0)}</small>
        </button>
        <button aria-label={`评论${item.title}`} onClick={() => p.onItem(item)}>
          <MessageCircle size={29} />
          <small>{item.comments.length}</small>
        </button>
        <button
          aria-label={`收藏${item.title}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={27} fill={saved ? "#f8cc55" : "none"} />
        </button>
      </div>
      <button className="vertical-caption" onClick={() => p.onItem(item)}>
        <strong>@{item.sender}</strong>
        <p>{item.body}</p>
        <small>
          <Music size={11} />
          {item.title}
        </small>
      </button>
    </article>
  );
}
type DouyinPostData = {
  title: string;
  video: string;
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  date: string;
};

const douyinPosts: DouyinPostData[] = [
  {
    title: "Replay,replay,replay⏪️#姐姐真漂亮 #SHINYU #申惟 #TWS",
    video: "ScreenRecording_11-05-2026 11-42-20_1.mov",
    likes: "90.4万", comments: "7.0万", saves: "9.1万", shares: "18.2万",
    date: "2024年2月28日",
  },
  {
    title: "道勋丝带儿🤓🖤 #道勋 #DOHOON #TWS",
    video: "ScreenRecording_11-05-2026 11-54-52_1.mov",
    likes: "54.0万", comments: "2.4万", saves: "5.1万", shares: "12.0万",
    date: "2024年9月15日",
  },
  {
    title: "no doubt #TWS #英宰 #YOUNGJAE",
    video: "ScreenRecording_11-05-2026 11-58-40_1.mov",
    likes: "40.4万", comments: "1.1万", saves: "2.9万", shares: "4.9万",
    date: "2025年12月14日",
  },
  {
    title: "🪩🪩 #TWS #韩振 #HANJIN",
    video: "ScreenRecording_11-05-2026 12-02-07_1.mov",
    likes: "212.5万", comments: "21.9万", saves: "10.0万", shares: "20.7万",
    date: "2026年2月10日",
  },
  {
    title: "🪼🔄 #TWS #志薰 #JIHOON",
    video: "ScreenRecording_11-05-2026 12-06-19_1.mp4",
    likes: "25.0万", comments: "4779", saves: "1.0万", shares: "2.7万",
    date: "2025年8月17日",
  },
  {
    title: "NEON2 #TWS #炅潣 #KYUNGMIN #247WithUs",
    video: "ScreenRecording_11-05-2026 12-09-12_1.mov",
    likes: "41.3万", comments: "2862", saves: "1.4万", shares: "3.4万",
    date: "2026年10月21日",
  },
  {
    title: "NEON #TWS #志薰 #JIHOON #炅潣 #KYUNGMIN",
    video: "ScreenRecording_11-05-2026 12-14-54_1.mov",
    likes: "75.9万", comments: "9675", saves: "3.1万", shares: "11.9万",
    date: "2026年10月15日",
  },
  {
    title: "LOVE SCENARIO🩵 #TWS #韩振 #HANJIN #英宰 #YOUNGJAE",
    video: "ScreenRecording_11-05-2026 12-18-34_1.mov",
    likes: "25.4万", comments: "3606", saves: "8970", shares: "1.9万",
    date: "2026年8月19日",
  },
  {
    title: "哈吉嘛🙅‍♂️🙅‍♂️ #TWS #道勋 #DOHOON #申惟 #SHINYU",
    video: "copy_0ECC91CC-68D5-49AC-825E-0FFBAEF0B09D.mov",
    likes: "32.0万", comments: "5264", saves: "2.3万", shares: "3.4万",
    date: "2025年8月20日",
  },
];

function DouyinPost({ post }: { post: DouyinPostData }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = import.meta.env.BASE_URL + "youtube/channels4_profile.jpeg";
  const src = encodeURI(import.meta.env.BASE_URL + "dy/" + post.video);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          // Try autoplay with sound; mobile browsers may require a prior user gesture.
          void video.play().catch(() => {
            // Playback can still be blocked by browser or device settings.
          });
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.65, 1] },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <article className="vertical-video douyin-video-post">
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        loop
        preload="metadata"
        aria-label={post.title}
      />
      <div className="vertical-actions">
        <span className="douyin-account-avatar">
          <Avatar name="TWS_PLEDIS" src={avatar} />
        </span>
        <button aria-label="点赞" aria-pressed={liked} onClick={() => setLiked((v) => !v)}>
          <Heart size={29} fill={liked ? "#f44368" : "white"} />
          <small>{post.likes}</small>
        </button>
        <button aria-label="评论">
          <MessageCircle size={27} />
          <small>{post.comments}</small>
        </button>
        <button aria-label="收藏" aria-pressed={saved} onClick={() => setSaved((v) => !v)}>
          <Bookmark size={27} fill={saved ? "#f8cc55" : "none"} />
          <small>{post.saves}</small>
        </button>
        <button aria-label="转发">
          <Share2 size={26} />
          <small>{post.shares}</small>
        </button>
      </div>
      <div className="vertical-caption douyin-caption">
        <strong>@TWS_PLEDIS</strong>
        <p>{post.title}</p>
        <small>{post.date}</small>
      </div>
    </article>
  );
}

export function DouyinSkin(p: Props) {
  const { tab, setTab } = useContent(p, "推荐");
  return (
    <div className="catalog-skin douyin-ui">
      <Header p={p} />
      <div className="douyin-top">
        {["同城", "关注", "推荐"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="vertical-feed douyin-feed">
        {tab === "推荐" || tab === "关注"
          ? douyinPosts.map((post) => <DouyinPost key={post.video} post={post} />)
          : <div className="douyin-empty">暂时没有同城视频</div>}
      </div>
      <Tabs
        tabs={["推荐", "关注", "我"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function TikTokSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "For You");
  const list =
    tab === "For You"
      ? items
      : tab === "Following"
        ? items.filter((i) => i.folder === "关注" || i.folder === "Following")
        : items.filter((i) => i.folder === "个人主页");
  return (
    <div className="catalog-skin tiktok-ui">
      <Header p={p} />
      <div className="tiktok-top">
        <button
          className={tab === "Following" ? "selected" : ""}
          onClick={() => setTab("Following")}
        >
          Following
        </button>
        <button
          className={tab === "For You" ? "selected" : ""}
          onClick={() => setTab("For You")}
        >
          For You
        </button>
      </div>
      <div className="vertical-feed">
        {list.map((i) => (
          <VerticalVideo key={i.id} p={p} item={i} />
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["For You", "Following", "Profile"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function NetflixSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [saved, setSaved] = useSkinState<string[]>(p, "saved", []);
  const list =
    tab === "我的片单"
      ? items.filter((i) => i.favorite || saved.includes(i.id))
      : items;
  const featured = list[0];
  return (
    <div className="catalog-skin netflix-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {featured && tab === "首页" && (
          <div className="netflix-feature">
            <Media item={featured} />
            <div>
              <strong>{featured.title}</strong>
              <small>
                {meta(featured, "year")} · {meta(featured, "genre")} ·{" "}
                {meta(featured, "duration")}
              </small>
              <button onClick={() => p.onItem(featured)}>
                <Play size={16} />
                播放 / 详情
              </button>
              <button
                onClick={() =>
                  setSaved(
                    saved.includes(featured.id)
                      ? saved.filter((id) => id !== featured.id)
                      : [...saved, featured.id],
                  )
                }
              >
                {saved.includes(featured.id) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}
                我的片单
              </button>
            </div>
          </div>
        )}
        {groupItems(list, "影片").map((g) => (
          <section className="netflix-shelf" key={g}>
            <h3>{g}</h3>
            <div>
              {list
                .filter((i) => (i.folder || "影片") === g)
                .map((i) => (
                  <button key={i.id} onClick={() => p.onItem(i)}>
                    <Media item={i} />
                    <strong>{i.title}</strong>
                  </button>
                ))}
            </div>
          </section>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "我的片单"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Bookmark />]}
      />
    </div>
  );
}

