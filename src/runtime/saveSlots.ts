import type { Runtime } from "../schema";
import type { UserProfile } from "./UserOnboarding";

export type SaveSlot = {
  id: string;
  workId: string;
  slot: number;
  name: string;
  savedAt: number;
  profile: UserProfile;
  runtime: Runtime;
  localStorage: Record<string, string>;
};

export const collectProgressStorage = () => {
  const values: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("foundphone.") || key.startsWith("foundphone.save-slots.")) continue;
    if (key === "foundphone.user-profile.v1") continue;
    const value = localStorage.getItem(key);
    if (value !== null) values[key] = value;
  }
  return values;
};

export const restoreProgressStorage = (values: Record<string, string>) => {
  const remove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("foundphone.") && !key.startsWith("foundphone.save-slots.") && key !== "foundphone.user-profile.v1") remove.push(key);
  }
  remove.forEach((key) => localStorage.removeItem(key));
  Object.entries(values).forEach(([key, value]) => {
    if (key.startsWith("foundphone.") && !key.startsWith("foundphone.save-slots.") && key !== "foundphone.user-profile.v1") {
      localStorage.setItem(key, value);
    }
  });
};
