import { useEffect, useRef } from "react";
import type { SkinProps } from "./AppSkins";
import { safeMedia, type Item } from "./schema";
import { useSkinState } from "./skinState";
export function useTrack(
  p: SkinProps,
  items: Item[],
): [Item | null, (item: Item | null) => void] {
  const [id, setId] = useSkinState<string>(p, "track", "");
  return [
    items.find((i) => i.id === id) ?? null,
    (item) => {
      setId(item?.id ?? "");
      if (item) p.onRead(item.id);
    },
  ];
}
export function AudioPlayer({ p, item }: { p: SkinProps; item: Item }) {
  const last = useRef(-1);
  const element = useRef<HTMLAudioElement>(null);
  const key = `audio-${item.id}`,
    saved = p.ui?.[key];
  const commit = (time: number, force = false) => {
    if (!p.onUi || !Number.isFinite(time)) return;
    if (force || Math.abs(time - last.current) >= 5) {
      last.current = time;
      p.onUi(key, time);
    }
  };
  useEffect(() => {
    const audio = element.current;
    if (
      !audio ||
      typeof saved !== "number" ||
      !Number.isFinite(saved) ||
      saved <= 0
    )
      return;
    const restore = () => {
      if (audio.readyState < 1) return;
      last.current = saved;
      audio.currentTime = Math.min(
        saved,
        Number.isFinite(audio.duration) ? audio.duration : saved,
      );
    };
    restore();
    audio.addEventListener("loadedmetadata", restore, { once: true });
    return () => audio.removeEventListener("loadedmetadata", restore);
  }, [item.id]);
  return (
    <audio
      ref={element}
      controls
      src={safeMedia(item.media)}
      aria-label={`播放${item.title}`}
      onTimeUpdate={(e) => {
        if (e.currentTarget.isConnected) commit(e.currentTarget.currentTime);
      }}
      onPause={(e) => {
        if (e.currentTarget.isConnected)
          commit(e.currentTarget.currentTime, true);
      }}
      onEnded={(e) => commit(e.currentTarget.currentTime, true)}
    />
  );
}


export type AppleMusicTrack = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  file: string;
};
let appleAudio: HTMLAudioElement | null = null;
let applePlaylist: AppleMusicTrack[] = [];
let appleIndex = -1;
const appleListeners = new Set<() => void>();
function notifyAppleMusic() {
  appleListeners.forEach((listener) => listener());
}
function appleElement() {
  if (typeof document === "undefined") return null;
  if (!appleAudio) {
    appleAudio = document.createElement("audio");
    appleAudio.preload = "auto";
    appleAudio.addEventListener("timeupdate", notifyAppleMusic);
    appleAudio.addEventListener("durationchange", notifyAppleMusic);
    appleAudio.addEventListener("play", notifyAppleMusic);
    appleAudio.addEventListener("pause", notifyAppleMusic);
    appleAudio.addEventListener("ended", () => {
      if (!applePlaylist.length) return;
      appleIndex = (appleIndex + 1) % applePlaylist.length;
      loadAppleTrack(true);
    });
    appleAudio.addEventListener("error", notifyAppleMusic);
    appleAudio.style.display = "none";
    document.body.appendChild(appleAudio);
  }
  return appleAudio;
}
function appleTrackUrl(track: AppleMusicTrack) {
  const filename = track.file.normalize("NFD");
  return new URL(import.meta.env.BASE_URL + "am/" + encodeURIComponent(filename), window.location.href).href;
}
function loadAppleTrack(autoplay: boolean) {
  const audio = appleElement();
  const track = applePlaylist[appleIndex];
  if (!audio || !track) return;
  audio.src = appleTrackUrl(track);
  audio.load();
  notifyAppleMusic();
  if (autoplay) void audio.play().catch(() => notifyAppleMusic());
}
export function subscribeAppleMusic(listener: () => void) {
  appleListeners.add(listener);
  return () => appleListeners.delete(listener);
}
export function getAppleMusicState() {
  const audio = appleAudio;
  return {
    track: applePlaylist[appleIndex] ?? null,
    index: appleIndex,
    count: applePlaylist.length,
    playing: !!audio && !audio.paused && !audio.ended,
    currentTime: audio?.currentTime ?? 0,
    duration: Number.isFinite(audio?.duration) ? audio!.duration : 0,
  };
}
export function playAppleMusic(tracks: AppleMusicTrack[], index: number) {
  if (!tracks.length) return;
  applePlaylist = tracks;
  appleIndex = Math.max(0, Math.min(index, tracks.length - 1));
  loadAppleTrack(true);
}
export function toggleAppleMusic() {
  const audio = appleElement();
  if (!audio) return;
  if (audio.paused) {
    if (!audio.src && applePlaylist.length) loadAppleTrack(true);
    else void audio.play().catch(() => notifyAppleMusic());
  } else audio.pause();
  notifyAppleMusic();
}
export function seekAppleMusic(time: number) {
  const audio = appleElement();
  if (audio && Number.isFinite(audio.duration))
    audio.currentTime = Math.max(0, Math.min(time, audio.duration));
  notifyAppleMusic();
}
export function skipAppleMusic(delta: number) {
  if (!applePlaylist.length) return;
  appleIndex = (appleIndex + delta + applePlaylist.length) % applePlaylist.length;
  loadAppleTrack(true);
}
