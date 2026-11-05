import Dexie, { type Table } from "dexie";
import type { Work, Runtime } from "./schema";
import type { SaveSlot } from "./runtime/saveSlots";
class Database extends Dexie {
  works!: Table<Work, string>;
  saves!: Table<{ id: string; state: Runtime }, string>;
  slots!: Table<SaveSlot, string>;
  constructor() {
    super("foundphone-studio");
    this.version(1).stores({ works: "id,updatedAt", saves: "id" });
    this.version(2).stores({ works: "id,updatedAt", saves: "id", slots: "id,workId,slot,savedAt" });
  }
}
export const db = new Database();
