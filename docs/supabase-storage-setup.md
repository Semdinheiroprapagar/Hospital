# 🖼️ Configurar Supabase Storage para Imagens

## 🎯 Por que isso é necessário?

Na **Vercel**, o sistema de arquivos é **read-only** (somente leitura). Você não pode salvar arquivos na pasta `public/uploads` em produção.

A solução é usar **Supabase Storage** para armazenar todas as imagens.

## 📋 Passo a Passo

### 1️⃣ Criar Bucket no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **"Storage"**
4. Clique em **"Create a new bucket"**
5. Preencha:
   - **Name**: `images`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (importante!)
   - **File size limit**: `5MB` (ou o que preferir)
6. Clique em **"Create bucket"**

### 2️⃣ Configurar Políticas de Acesso

Após criar o bucket, configure as políticas:

1. Clique no bucket **"images"**
2. Vá na aba **"Policies"**
3. Clique em **"New Policy"**

#### Política 1: Leitura Pública (SELECT)

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

Ou use a interface:
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'images'`

#### Política 2: Upload Autenticado (INSERT)

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated, service_role
WITH CHECK (bucket_id = 'images');
```

Ou use a interface:
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`, `service_role`
- **WITH CHECK expression**: `bucket_id = 'images'`

#### Política 3: Deletar Autenticado (DELETE)

```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated, service_role
USING (bucket_id = 'images');
```

Ou use a interface:
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`, `service_role`
- **USING expression**: `bucket_id = 'images'`

### 3️⃣ Testar Upload

Após configurar, teste:

1. **Localmente**: Deve usar Supabase Storage automaticamente
2. **Vercel**: Funcionará perfeitamente

## 🔄 Como Funciona Agora

### Desenvolvimento Local (com Supabase configurado):
```
Upload → Supabase Storage → URL pública
```

### Produção (Vercel):
```
Upload → Supabase Storage → URL pública
```

### Desenvolvimento Local (sem Supabase):
```
Upload → public/uploads/ → URL local
```

## 🗑️ Deletar Imagens

Para deletar imagens antigas do Supabase:

1. Vá em **Storage** > **images**
2. Selecione os arquivos
3. Clique em **"Delete"**

Ou use a API (já implementado no código).

## ✅ Verificar se Está Funcionando

1. **Faça upload de uma imagem** no admin
2. **Verifique no Supabase**:
   - Vá em Storage > images
   - Você deve ver a imagem lá
3. **Verifique na página pública**:
   - A imagem deve aparecer normalmente

## 🔐 URLs das Imagens

### Antes (local):
```
http://localhost:3000/uploads/1234567890-foto.jpg
```

### Depois (Supabase):
```
https://njakdsfmltbahtkjudhs.supabase.co/storage/v1/object/public/images/1234567890-foto.jpg
```

## 📊 Limites do Supabase (Plano Gratuito)

- **Storage**: 1GB
- **Bandwidth**: 2GB/mês
- **Tamanho por arquivo**: Configurável (recomendo 5MB)

Se precisar mais, considere upgrade ou usar CDN.

## 🆘 Problemas Comuns

### "Bucket not found"
- Verifique se criou o bucket com nome exato: `images`
- Verifique se está público

### "Permission denied"
- Configure as políticas de acesso (passo 2)
- Use `service_role` key nas variáveis de ambiente

### "File not uploading"
- Verifique as variáveis de ambiente na Vercel
- Veja os logs em Vercel > Functions

## 🚀 Deploy na Vercel

Após configurar o Supabase Storage:

1. **Commit as mudanças**:
```bash
git add .
git commit -m "feat: implementar Supabase Storage para uploads"
git push
```

2. **Vercel fará deploy automaticamente**

3. **Teste no site em produção**

## 📝 Variáveis de Ambiente Necessárias

Certifique-se de que estas variáveis estão na Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## ✨ Benefícios

- ✅ Funciona na Vercel (sem limitações de filesystem)
- ✅ CDN global do Supabase (imagens rápidas)
- ✅ Backup automático
- ✅ Fácil gerenciamento
- ✅ Escalável

---

**Pronto!** Agora seu sistema de upload funciona tanto localmente quanto na Vercel! 🎉
