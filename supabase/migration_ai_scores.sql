-- Wallflow AI scores migration
-- Run this in Supabase SQL Editor after schema.sql

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS ai_score int CHECK (ai_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS ai_flags jsonb DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_testimonials_ai_score
  ON testimonials(workspace_id, ai_score);
