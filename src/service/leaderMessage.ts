import { db } from './db';
import logger from '../log';

const leaderMessageKey = 'site:leader-message';

export interface LeaderMessageRecord {
  message: string;
  presidentName: string;
  presidentDesignation: string;
  imageUrl?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getLeaderMessage(): Promise<LeaderMessageRecord | undefined> {
  try {
    const value = await db.get(leaderMessageKey);
    return value as LeaderMessageRecord;
  } catch (err: any) {
    if (err?.notFound) return undefined;
    logger.error({ error: err?.message }, 'get leader message failed');
    return undefined;
  }
}

export async function upsertLeaderMessage(
  input: Partial<Pick<LeaderMessageRecord, 'message' | 'presidentName' | 'presidentDesignation' | 'imageUrl' | 'imagePath'>>,
): Promise<LeaderMessageRecord> {
  const now = new Date().toISOString();
  const prev = await getLeaderMessage();

  const next: LeaderMessageRecord = {
    message: input.message ?? prev?.message ?? '',
    presidentName: input.presidentName ?? prev?.presidentName ?? 'President',
    presidentDesignation: input.presidentDesignation ?? prev?.presidentDesignation ?? 'Future Leaders Assembly Bangladesh (FLABD)',
    imageUrl: input.imageUrl ?? prev?.imageUrl,
    imagePath: input.imagePath ?? prev?.imagePath,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };

  await db.put(leaderMessageKey, next as any);
  logger.info({ hasImageUrl: !!next.imageUrl, hasImagePath: !!next.imagePath }, 'leader message upserted');
  return next;
}
