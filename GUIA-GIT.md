# 🔗 Guia: Conectar Projeto ao GitHub

## 📋 Passo a Passo

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `hospital-site` (ou o nome que preferir)
   - **Description**: "Site do Hospital com integração Supabase"
   - **Visibility**: Private (recomendado) ou Public
   - ⚠️ **NÃO** marque "Add a README file"
   - ⚠️ **NÃO** marque "Add .gitignore"
   - ⚠️ **NÃO** marque "Choose a license"
3. Clique em **"Create repository"**

### 2️⃣ Conectar Repositório Local ao GitHub

Após criar o repositório, o GitHub mostrará instruções. Use estas:

```bash
# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/hospital-site.git

# Verificar se foi adicionado
git remote -v

# Fazer o primeiro push
git push -u origin main
```

**Substitua** `SEU-USUARIO` pelo seu username do GitHub!

### 3️⃣ Adicionar e Commitar Mudanças Recentes

Antes de fazer push, vamos adicionar as mudanças recentes:

```bash
# Ver o que mudou
git status

# Adicionar todos os arquivos novos/modificados
git add .

# Criar commit com as mudanças
git commit -m "feat: Implementar database abstraction layer com Supabase"

# Enviar para o GitHub
git push
```

## 🔐 Autenticação

Quando você fizer `git push`, o GitHub pode pedir autenticação:

### **Opção A: Personal Access Token (Recomendado)**

1. Vá em: https://github.com/settings/tokens
2. Clique em **"Generate new token"** > **"Generate new token (classic)"**
3. Dê um nome: "Hospital Site"
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você não verá novamente!)
7. Use o token como senha quando o Git pedir

### **Opção B: SSH (Mais seguro)**

Se preferir usar SSH:

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar em: https://github.com/settings/keys
```

Depois use URL SSH:
```bash
git remote set-url origin git@github.com:SEU-USUARIO/hospital-site.git
```

## 📝 Comandos Git Úteis

```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem do commit"

# Push (enviar para GitHub)
git push

# Pull (baixar do GitHub)
git pull

# Ver histórico
git log --oneline

# Ver repositórios remotos
git remote -v
```

## ⚠️ Arquivos Ignorados

O `.gitignore` já está configurado para ignorar:
- ✅ `.env.local` (credenciais secretas)
- ✅ `node_modules/` (dependências)
- ✅ `.next/` (build)
- ✅ `hospital.db` (banco SQLite local)

**NUNCA** commite o `.env.local`! Ele contém credenciais secretas.

## 🚀 Workflow Recomendado

```bash
# 1. Fazer mudanças no código
# 2. Ver o que mudou
git status

# 3. Adicionar mudanças
git add .

# 4. Commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade"

# 5. Enviar para GitHub
git push
```

## 📦 Tipos de Commit (Conventional Commits)

Use prefixos para organizar commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, espaços
- `refactor:` - Refatoração de código
- `test:` - Adicionar testes
- `chore:` - Manutenção, configs

Exemplo:
```bash
git commit -m "feat: adicionar integração com Supabase"
git commit -m "fix: corrigir erro de autenticação"
git commit -m "docs: atualizar README com instruções"
```

## 🆘 Problemas Comuns

### "Permission denied"
- Use Personal Access Token como senha
- Ou configure SSH

### "Repository not found"
- Verifique se o nome do repositório está correto
- Verifique se você tem acesso ao repositório

### "Failed to push"
- Faça `git pull` primeiro para baixar mudanças
- Depois `git push`

## ✅ Verificar Conexão

```bash
# Ver se está conectado
git remote -v

# Deve mostrar algo como:
# origin  https://github.com/SEU-USUARIO/hospital-site.git (fetch)
# origin  https://github.com/SEU-USUARIO/hospital-site.git (push)
```

---

**Pronto!** Agora seu código está seguro no GitHub! 🎉
