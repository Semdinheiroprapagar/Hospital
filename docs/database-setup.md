# Database Setup Guide

Este projeto suporta dois tipos de banco de dados: **SQLite** (padrão) e **Supabase** (PostgreSQL).

## Configuração Rápida

### Modo SQLite (Padrão)

SQLite é o modo padrão e não requer configuração adicional.

1. Certifique-se de que `DATABASE_TYPE=sqlite` no seu `.env.local` (ou deixe vazio)
2. Execute o projeto: `npm run dev`
3. O banco de dados `hospital.db` será criado automaticamente

### Modo Supabase

Para usar Supabase como banco de dados:

1. **Crie um projeto no Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma nova conta ou faça login
   - Crie um novo projeto

2. **Configure o banco de dados**
   - No dashboard do Supabase, vá para SQL Editor
   - Execute o script `scripts/setup-supabase.sql`
   - Aguarde a conclusão (todas as tabelas e políticas serão criadas)

3. **Obtenha as credenciais**
   - Vá para Project Settings > API
   - Copie:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

4. **Configure as variáveis de ambiente**
   
   Crie ou edite `.env.local`:
   ```env
   DATABASE_TYPE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

5. **Reinicie o servidor**
   ```bash
   npm run dev
   ```

## Estrutura do Banco de Dados

O projeto usa as seguintes tabelas:

- **banners** - Carrossel de imagens da página inicial
- **posts** - Publicações/notícias
- **testimonials** - Depoimentos de pacientes
- **history_items** - Itens da seção de história
- **contact_cards** - Cards de contato no rodapé
- **admin_users** - Usuários administrativos

## Migrando entre Bancos de Dados

### SQLite → Supabase

1. **Exporte os dados do SQLite**
   ```bash
   sqlite3 hospital.db .dump > backup.sql
   ```

2. **Configure o Supabase** (siga os passos acima)

3. **Importe os dados manualmente**
   - Use o SQL Editor do Supabase
   - Adapte os comandos INSERT do backup.sql para PostgreSQL
   - Ou use a interface admin para recriar o conteúdo

### Supabase → SQLite

1. **Exporte do Supabase**
   - Use o SQL Editor para fazer SELECT de todas as tabelas
   - Salve os resultados

2. **Configure SQLite**
   ```env
   DATABASE_TYPE=sqlite
   ```

3. **Importe via interface admin**
   - Acesse o painel admin
   - Recrie o conteúdo manualmente

## Troubleshooting

### Erro: "Supabase credentials not found"

Verifique se todas as variáveis de ambiente estão configuradas corretamente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`

### Erro: "relation does not exist"

Execute o script `scripts/setup-supabase.sql` no SQL Editor do Supabase.

### Erro: "permission denied"

Verifique se as políticas RLS estão configuradas corretamente. Execute novamente o script de setup.

### Performance lenta no Supabase

1. Verifique se os índices foram criados (incluídos no script de setup)
2. Considere usar `SUPABASE_SERVICE_ROLE_KEY` em vez de `ANON_KEY` para operações admin

## Desenvolvimento Local

Para desenvolvimento, recomendamos usar SQLite por ser mais simples e rápido.

Para produção, Supabase oferece:
- ✅ Escalabilidade automática
- ✅ Backups automáticos
- ✅ CDN global
- ✅ Row Level Security
- ✅ Realtime subscriptions (se necessário no futuro)

## Variáveis de Ambiente

Consulte `env.example` para ver todas as variáveis disponíveis.

**Importante:** Nunca commite o arquivo `.env.local` no Git!
