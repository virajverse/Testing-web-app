-- Supabase Storage Setup for Order Files
-- Run this in Supabase SQL Editor after creating the storage bucket

-- Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-files', 'order-files', true);

-- Set up storage policies for order files bucket
CREATE POLICY "Public can view order files" ON storage.objects
FOR SELECT USING (bucket_id = 'order-files');

CREATE POLICY "Authenticated users can upload order files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'order-files');

CREATE POLICY "Users can update their own order files" ON storage.objects
FOR UPDATE USING (bucket_id = 'order-files');

CREATE POLICY "Admin can delete order files" ON storage.objects
FOR DELETE USING (bucket_id = 'order-files');

-- Note: You may need to adjust these policies based on your authentication setup
-- For now, they allow public access which is suitable for order attachments