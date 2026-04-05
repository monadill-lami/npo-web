import { Router } from 'express';
import adminOnly from '../middleware/adminOnly';
import { upload, uploadDir } from '../utils/upload';
import { getLeaderMessage, upsertLeaderMessage } from '../service/leaderMessage';
import path from 'path';

const router = Router();

// GET /api/get_leader_message (public)
router.get('/get_leader_message', async (_req, res) => {
  const leaderMessage = await getLeaderMessage();
  return res.json({ ok: true, leaderMessage: leaderMessage ?? null });
});

// PATCH /api/update_leader_message (admin)
router.patch('/update_leader_message', adminOnly, upload.single('image'), async (req, res) => {
  const message = (req.body?.message as string | undefined)?.trim();
  const presidentName = (req.body?.presidentName as string | undefined)?.trim();
  const presidentDesignation = (req.body?.presidentDesignation as string | undefined)?.trim();
  const imageUrl = (req.body?.imageUrl as string | undefined)?.trim();

  let imagePath: string | undefined;
  if (req.file) {
    const abs = req.file.path;
    const rel = path.relative(uploadDir, abs);
    imagePath = rel.replace(/\\/g, '/');
  }

  if (!message && !presidentName && !presidentDesignation && !imageUrl && !imagePath) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }

  const next = await upsertLeaderMessage({
    message: message || undefined,
    presidentName: presidentName || undefined,
    presidentDesignation: presidentDesignation || undefined,
    imageUrl: imageUrl || undefined,
    imagePath,
  });

  return res.json({ ok: true, leaderMessage: next });
});

export default router;
