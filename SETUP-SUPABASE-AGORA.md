# 🚀 GUIA RÁPIDO: Configurar Tabelas no Supabase

## ✅ STATUS ATUAL:
- ✅ Credenciais do Supabase configuradas
- ✅ Conexão com Supabase funcionando
- ❌ Tabelas NÃO criadas ainda

## 📋 AÇÃO NECESSÁRIA (5 minutos):

### Passo 1: Acesse o Supabase
1. Abra: https://supabase.com/dashboard
2. Faça login
3. Clique no seu projeto: **njakdsfmltbahtkjudhs**

### Passo 2: Abra o SQL Editor
1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique no botão **"New Query"** (ou "+ New query")

### Passo 3: Execute o Script
1. Abra o arquivo: `scripts/setup-supabase.sql` (no seu projeto)
2. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)
3. **Cole** no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
5. Aguarde a mensagem de sucesso

### Passo 4: Verifique
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver 6 tabelas criadas:
   - ✅ banners
   - ✅ posts
   - ✅ testimonials
   - ✅ history_items
   - ✅ contact_cards
   - ✅ admin_users

### Passo 5: Teste
1. Volte para o terminal
2. Execute: `npx tsx test-supabase.ts`
3. Deve mostrar: "✨ Supabase está configurado e funcionando!"

## 🎯 DEPOIS DE CONFIGURAR:

Reinicie o servidor:
```bash
# Pare o servidor atual (Ctrl+C)
npm run dev
```

Você deve ver:
```
🚀 Using Supabase database
```

Pronto! Agora você pode usar o sistema normalmente com Supabase! 🎉

---

## 📝 CONTEÚDO DO SCRIPT SQL:

O script está em: `scripts/setup-supabase.sql`

Ele cria:
- 6 tabelas (banners, posts, testimonials, history_items, contact_cards, admin_users)
- Índices para melhor performance
- Row Level Security (RLS) para segurança
- Políticas de acesso público e admin

## 🆘 PROBLEMAS?

Se der erro ao executar o SQL:
1. Verifique se você está no projeto correto
2. Tente executar o script em partes menores
3. Verifique se as tabelas já existem (Table Editor)

## 💡 DICA:

Você pode executar o script quantas vezes quiser.
O `IF NOT EXISTS` garante que não haverá erro se as tabelas já existirem.
