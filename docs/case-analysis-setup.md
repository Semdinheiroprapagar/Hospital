# Configuração da Seção "Solicitar Análise do Caso"

## Visão Geral
A seção permite que usuários enviem arquivos (exames, imagens médicas) para análise. Os arquivos são armazenados no Supabase Storage e você recebe notificação via WhatsApp.

## Configuração Necessária

### 1. Criar Bucket no Supabase Storage

Acesse seu projeto Supabase e crie um bucket chamado `case-files`:

1. Vá para **Storage** no painel do Supabase
2. Clique em **New bucket**
3. Nome: `case-files`
4. Público: **Sim** (para permitir acesso aos arquivos via URL)
5. Clique em **Create bucket**

### 2. Configurar Políticas de Acesso

No bucket `case-files`, configure as políticas:

**Policy para INSERT (permitir upload):**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'case-files');
```

**Policy para SELECT (permitir leitura):**
```sql
CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'case-files');
```

### 3. Configurar Número do WhatsApp

Adicione seu número de WhatsApp no arquivo `.env.local`:

```env
WHATSAPP_NUMBER=5511999999999
```

**Formato:** Código do país + DDD + número (sem espaços, traços ou parênteses)
- Brasil: `55` + DDD + número
- Exemplo: `5511987654321`

## Como Funciona

1. **Usuário preenche o formulário** com nome, email, telefone, mensagem e anexa um arquivo
2. **Arquivo é enviado** para o Supabase Storage no bucket `case-files`
3. **Sistema gera link do WhatsApp** com todos os dados pré-preenchidos
4. **WhatsApp abre automaticamente** com a mensagem pronta para você

## Tipos de Arquivo Aceitos

- PDF (`.pdf`)
- Imagens: JPEG (`.jpg`, `.jpeg`), PNG (`.png`)
- DICOM (`.dcm`, `.dicom`)
- Tamanho máximo: **10MB**

## Testando

1. Acesse a página inicial do site
2. Role até a seção "Solicitar Análise do Caso"
3. Preencha o formulário e anexe um arquivo
4. Clique em "Enviar Solicitação"
5. O WhatsApp deve abrir com a mensagem contendo:
   - Dados do solicitante
   - Link para o arquivo no Supabase

## Verificando Arquivos Enviados

Você pode ver todos os arquivos enviados em:
**Supabase Dashboard → Storage → case-files**

Os arquivos são organizados por data: `YYYY/MM/DD/arquivo.ext`
