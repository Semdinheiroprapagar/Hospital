-- Supabase Storage Policies Setup
-- Execute este script no SQL Editor do Supabase

-- Política 1: Leitura pública (qualquer um pode ver as imagens)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Política 2: Upload autenticado (service_role pode fazer upload)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (bucket_id = 'images');

-- Política 3: Delete autenticado (service_role pode deletar)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated, service_role
USING (bucket_id = 'images');

-- Verificar políticas criadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
