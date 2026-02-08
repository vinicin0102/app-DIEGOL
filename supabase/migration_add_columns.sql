-- Migration: Add missing columns for image and avatar support
-- Run this if your tables already exist

-- Add image_url to posts table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='image_url') THEN
        ALTER TABLE public.posts ADD COLUMN image_url text;
    END IF;
END $$;

-- Add user_avatar_id to posts table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='user_avatar_id') THEN
        ALTER TABLE public.posts ADD COLUMN user_avatar_id text;
    END IF;
END $$;

-- Add user_avatar_id to chat_messages table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='user_avatar_id') THEN
        ALTER TABLE public.chat_messages ADD COLUMN user_avatar_id text;
    END IF;
END $$;

-- Add user_avatar_id to comments table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='user_avatar_id') THEN
        ALTER TABLE public.comments ADD COLUMN user_avatar_id text;
    END IF;
END $$;

-- Make sure Storage bucket exists for community images
-- Note: This needs to be done via Supabase Dashboard or API, not SQL directly
-- Go to Storage in Supabase Dashboard and create a bucket called "community" with public access
