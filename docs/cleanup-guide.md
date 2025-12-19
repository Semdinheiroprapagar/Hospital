# Limpeza Automática de Arquivos

## Script: cleanup-old-files.ts

Este script deleta automaticamente arquivos antigos do Supabase Storage.

## Configuração

**Dias para manter arquivos:**
Edite a linha 14 do arquivo `cleanup-old-files.ts`:

```typescript
const DAYS_TO_KEEP = 30; // Altere este valor
```

**Opções sugeridas:**
- `7` = 1 semana
- `15` = 2 semanas
- `30` = 1 mês (padrão)
- `60` = 2 meses
- `90` = 3 meses

## Como Usar

### Executar Manualmente

```bash
npx tsx cleanup-old-files.ts
```

### Agendar Execução Automática

#### Opção 1: Cron Job (Mac/Linux)

1. Abra o crontab:
```bash
crontab -e
```

2. Adicione esta linha (executa todo dia às 3h da manhã):
```bash
0 3 * * * cd /Users/guilhermesousa/Desktop/Hospital/hospital-site && npx tsx cleanup-old-files.ts
```

#### Opção 2: Vercel Cron Jobs

1. Crie arquivo `vercel.json` na raiz do projeto:
```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 3 * * *"
  }]
}
```

2. Crie API route `app/api/cleanup/route.ts` que executa a limpeza

#### Opção 3: GitHub Actions

Executar automaticamente via GitHub Actions (toda semana):

1. Crie `.github/workflows/cleanup.yml`
2. Configure para rodar semanalmente

## O Que o Script Faz

1. ✅ Lista todos os arquivos no bucket `case-files`
2. ✅ Calcula quais têm mais de X dias
3. ✅ Mostra lista de arquivos a deletar
4. ✅ Deleta em lotes de 50 arquivos
5. ✅ Mostra resumo (quantos deletados, espaço liberado)

## Segurança

- ⚠️ **Arquivos deletados não podem ser recuperados**
- ✅ Sempre faça backup antes de rodar pela primeira vez
- ✅ Teste com `DAYS_TO_KEEP = 1` para ver quais arquivos seriam deletados

## Exemplo de Saída

```
🧹 Limpando arquivos com mais de 30 dias...

📅 Data limite: 19/11/2024 09:16:44
📊 Total de arquivos no bucket: 45

🗑️  Marcado para deletar: 2024/11/01/1730462400-Joao-Silva.pdf
   Criado em: 01/11/2024 10:00:00
   Idade: 48 dias

📋 Total de arquivos a deletar: 12
⏳ Deletando arquivos...

✅ Lote 1 deletado (12 arquivos)

📊 Resumo da limpeza:
   ✅ Arquivos deletados: 12
   💾 Espaço liberado: ~6.00 MB (estimativa)

🎉 Limpeza concluída!
```

## Recomendação

**Para seu caso:**
- Configure `DAYS_TO_KEEP = 30` (1 mês)
- Execute manualmente 1x por mês
- Ou configure cron job para rodar automaticamente

Assim você tem 30 dias para baixar os arquivos antes de serem deletados automaticamente.
