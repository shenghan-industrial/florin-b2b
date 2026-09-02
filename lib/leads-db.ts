// 线索数据层：KV key "leads"（询盘/拿样/视频选品/目录/订阅 统一存储）
import { kvGetJSON, kvPutJSON } from "./kv-storage";
import type { Lead, LeadType } from "./types";

const KEY = "leads";

export async function getAllLeads(): Promise<Lead[]> {
  return (await kvGetJSON<Lead[]>(KEY, [])) || [];
}

export async function addLead(
  input: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt"> & { type: LeadType }
): Promise<Lead> {
  const now = new Date().toISOString();
  const lead: Lead = {
    ...input,
    id: `ld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  const list = await getAllLeads();
  list.unshift(lead);
  await kvPutJSON(KEY, list);
  return lead;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const list = await getAllLeads();
  const idx = list.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  await kvPutJSON(KEY, list);
  return list[idx];
}

export const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "closed"] as const;
