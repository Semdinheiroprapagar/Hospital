# Guia de Testes - Sistema de Banco de Dados

## 🎯 Onde Fazer os Testes

### 1. **Teste via Interface Admin** (Recomendado)

A forma mais fácil de testar é usando a interface administrativa:

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse o painel admin:**
   - Abra: `http://localhost:3000/admin`
   - Faça login com suas credenciais (configuradas no `.env.local`)

3. **Teste cada seção:**
   - **Posts** (`/admin/posts`) - Criar, editar, deletar posts
   - **Banners** (`/admin/banners`) - Gerenciar carrossel
   - **Depoimentos** (`/admin/testimonials`) - Gerenciar depoimentos
   - **História** (`/admin/history`) - Gerenciar seção de história
   - **Contato** (`/admin/contact`) - Gerenciar cards de contato

### 2. **Teste via Script** (Verificação Rápida)

Execute o script de teste que criamos:

```bash
npx tsx test-db.ts
```

Isso verifica se todas as operações de leitura estão funcionando.

### 3. **Teste via API Diretamente** (Avançado)

Use ferramentas como **Postman**, **Insomnia**, ou **curl**:

#### Exemplo: Listar Posts
```bash
curl http://localhost:3000/api/posts
```

#### Exemplo: Criar Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "content": "Conteúdo de teste",
    "published": true
  }'
```

## 🔄 Testando Ambos os Bancos de Dados

### Modo SQLite (Padrão)

1. **Configure `.env.local`:**
   ```env
   DATABASE_TYPE=sqlite
   ```

2. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

3. **Teste normalmente** - os dados ficam em `hospital.db`

### Modo Supabase

1. **Configure o Supabase:**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Execute o script `scripts/setup-supabase.sql` no SQL Editor
   - Copie as credenciais

2. **Configure `.env.local`:**
   ```env
   DATABASE_TYPE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

4. **Teste normalmente** - os dados ficam no Supabase

## ✅ Checklist de Testes

### Posts
- [ ] Criar novo post
- [ ] Editar post existente
- [ ] Deletar post
- [ ] Upload de imagem
- [ ] Publicar/despublicar

### Banners
- [ ] Adicionar banner
- [ ] Reordenar banners
- [ ] Deletar banner
- [ ] Upload de imagem

### Depoimentos
- [ ] Criar depoimento
- [ ] Editar depoimento
- [ ] Deletar depoimento
- [ ] Publicar/despublicar

### História
- [ ] Adicionar item de história
- [ ] Editar item
- [ ] Reordenar itens
- [ ] Deletar item
- [ ] Upload de imagem

### Contato
- [ ] Criar card de texto
- [ ] Criar card de imagem
- [ ] Editar cards
- [ ] Deletar cards
- [ ] Reordenar cards

## 🐛 Verificando Erros

### No Console do Navegador

Abra o DevTools (F12) e veja a aba Console para erros JavaScript.

### No Terminal do Servidor

Observe o terminal onde `npm run dev` está rodando. Você verá:
- `💾 Using SQLite database` ou `🚀 Using Supabase database`
- Logs de erro se algo falhar

### Logs Detalhados

Todos os erros de API agora incluem `console.error()` com detalhes.

## 🔍 Verificando os Dados

### SQLite

Use um visualizador de SQLite:

```bash
# Via linha de comando
sqlite3 hospital.db "SELECT * FROM posts;"

# Ou instale uma extensão VSCode: "SQLite Viewer"
```

### Supabase

1. Acesse o dashboard do Supabase
2. Vá para "Table Editor"
3. Visualize e edite os dados diretamente

## 📊 Teste de Performance

Compare a performance entre SQLite e Supabase:

1. **Crie 10+ posts em cada modo**
2. **Meça o tempo de carregamento da página inicial**
3. **Observe a velocidade das operações CRUD**

**Esperado:**
- SQLite: Mais rápido localmente
- Supabase: Pequena latência de rede, mas escalável

## 🚨 Problemas Comuns

### "Database not found"
- **SQLite:** Certifique-se de que `hospital.db` existe
- **Supabase:** Verifique as credenciais no `.env.local`

### "Permission denied"
- **Supabase:** Execute o script `setup-supabase.sql` para criar as políticas RLS

### "Cannot read properties of undefined"
- Verifique se todas as variáveis de ambiente estão configuradas
- Reinicie o servidor após alterar `.env.local`

## 🎬 Próximos Passos

Após testar com sucesso:

1. ✅ Escolha qual banco usar em produção
2. ✅ Configure as variáveis de ambiente de produção
3. ✅ Faça backup dos dados importantes
4. ✅ Deploy!

## 📝 Notas

- **Desenvolvimento:** Use SQLite (mais simples)
- **Produção:** Use Supabase (escalável, backups automáticos)
- **Migração:** Siga o guia em `docs/database-setup.md`
