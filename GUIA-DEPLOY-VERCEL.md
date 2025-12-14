# 🚀 Guia de Deploy na Vercel

## 📋 Pré-requisitos

- ✅ Código no GitHub
- ✅ Supabase configurado
- ✅ Credenciais em mãos

## 🎯 Passo a Passo

### 1️⃣ Criar Conta na Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize a Vercel a acessar seus repositórios

### 2️⃣ Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** > **"Project"**
2. Encontre o repositório: **`Semdinheiroprapagar/Hospital`**
3. Clique em **"Import"**

### 3️⃣ Configurar Projeto

Na tela de configuração:

**Framework Preset:** Next.js (detectado automaticamente)
**Root Directory:** `hospital-site` ⚠️ **IMPORTANTE!**
**Build Command:** `npm run build` (padrão)
**Output Directory:** `.next` (padrão)

### 4️⃣ Adicionar Variáveis de Ambiente

⚠️ **PASSO MAIS IMPORTANTE!**

Clique em **"Environment Variables"** e adicione:

```
DATABASE_TYPE
```
Valor: `supabase`

```
NEXT_PUBLIC_SUPABASE_URL
```
Valor: `https://njakdsfmltbahtkjudhs.supabase.co`

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzQ0MjEsImV4cCI6MjA4MTMxMDQyMX0.HCFtcxOJKzJrPby1XDDdBkMwBx1CPZOLOPkbIyXx_yk`

```
SUPABASE_SERVICE_ROLE_KEY
```
Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYWtkc2ZtbHRiYWh0a2p1ZGhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTczNDQyMSwiZXhwIjoyMDgxMzEwNDIxfQ.JljL1vqn7oulwWWDKFjc4WH7pL_JsdwE_B4y39geyUA`

```
JWT_SECRET
```
Valor: `sua-chave-secreta-jwt`

**Para cada variável:**
- Cole o **Name** (nome da variável)
- Cole o **Value** (valor)
- Deixe em **All** (Production, Preview, Development)
- Clique em **"Add"**

### 5️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. ✅ **Pronto!** Seu site está no ar!

## 🌐 Acessar o Site

Após o deploy:
- **URL de produção:** `https://hospital-xxx.vercel.app`
- **Admin:** `https://hospital-xxx.vercel.app/admin`

## 🔄 Atualizações Automáticas

Agora, sempre que você fizer `git push`:
1. GitHub recebe o código
2. Vercel detecta automaticamente
3. Faz novo deploy automaticamente
4. Site atualizado em ~2 minutos

## ⚙️ Configurações Importantes

### Root Directory

⚠️ **MUITO IMPORTANTE:** Configure o Root Directory!

1. Vá em: **Project Settings** > **General**
2. Em **Root Directory**, clique em **"Edit"**
3. Digite: `hospital-site`
4. Clique em **"Save"**

Isso é necessário porque seu projeto está dentro da pasta `hospital-site`.

### Domínio Personalizado (Opcional)

Se você tiver um domínio:

1. Vá em: **Project Settings** > **Domains**
2. Clique em **"Add"**
3. Digite seu domínio: `seusite.com.br`
4. Siga as instruções para configurar DNS

## 🔐 Segurança

✅ **O que está seguro:**
- Variáveis de ambiente **NÃO** vão para o GitHub
- `.env.local` está no `.gitignore`
- Credenciais ficam apenas na Vercel

❌ **NUNCA faça:**
- Commitar `.env.local`
- Compartilhar `SUPABASE_SERVICE_ROLE_KEY`
- Expor credenciais em código

## 📊 Monitoramento

Na Vercel você pode ver:
- **Deployments:** Histórico de deploys
- **Analytics:** Visitantes, performance
- **Logs:** Erros e logs do servidor
- **Speed Insights:** Performance do site

## 🆘 Problemas Comuns

### Build Failed

**Erro:** "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para testar

**Erro:** "Root Directory not found"
- Configure Root Directory para `hospital-site`

### Site não carrega

**Erro 500:**
- Verifique as variáveis de ambiente
- Veja os logs em: **Deployments** > **Functions**

**Dados não aparecem:**
- Verifique se o Supabase está configurado
- Teste as credenciais localmente

### Variáveis de ambiente não funcionam

1. Vá em: **Project Settings** > **Environment Variables**
2. Verifique se todas estão lá
3. **Redeploy** o projeto (Deployments > ... > Redeploy)

## ✅ Checklist Final

Antes de fazer deploy:

- [ ] Código commitado e no GitHub
- [ ] Supabase configurado e funcionando
- [ ] Todas as credenciais em mãos
- [ ] `.env.local` NÃO está no Git
- [ ] Testado localmente com `npm run build`

## 🎯 Comandos Úteis

```bash
# Testar build localmente (antes de deploy)
npm run build
npm start

# Ver se há erros de build
npm run build 2>&1 | tee build.log

# Verificar o que vai para o Git
git status
```

## 📝 Notas

- **Primeiro deploy:** ~3-5 minutos
- **Deploys seguintes:** ~1-2 minutos
- **Limite gratuito:** 100GB bandwidth/mês
- **Domínio Vercel:** Grátis (`.vercel.app`)
- **Domínio próprio:** Grátis para configurar

---

**Pronto para deploy!** 🚀

Qualquer dúvida, a Vercel tem suporte muito bom e documentação excelente.
