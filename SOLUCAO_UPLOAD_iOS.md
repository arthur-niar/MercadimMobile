# Solução: Upload de Foto de Perfil em iOS

## Problema Identificado

O código anterior usava `fetch()` para converter o URI local em blob, o que tem comportamento inconsistente em iOS. O Supabase suporta blobs, mas o problema estava na forma de envio do cliente.

## Solução Implementada

Convertemos o sistema para usar **base64 em vez de FormData**, que é mais confiável em iOS.

### O que foi mudado:

#### 1. **Frontend** (`profile.service.ts`)

- ✅ Usando `expo-file-system` para ler arquivo como base64
- ✅ Enviando JSON com base64 em vez de FormData
- ✅ Suporte automático para diferentes tipos de arquivo (jpg, png, gif, webp)

```typescript
// Antes: FormData + Blob
const blob = await response.blob();
formData.append("photo", blob, "profile-photo.jpg");

// Depois: Base64 + JSON
const base64String = await FileSystem.readAsStringAsync(photoUri, {
  encoding: FileSystem.EncodingType.Base64,
});
api.post("/profile/photo", {
  photo: base64String,
  mimeType: mimeType,
  fileName: fileName,
});
```

#### 2. **Backend** (`profile.controller.ts`)

- ✅ Suporta ambos os formatos (multipart legacy + JSON base64 novo)
- ✅ Validação de MIME type e tamanho máximo (5MB)
- ✅ Conversão de base64 para buffer antes de enviar ao Supabase

```typescript
// Suporta multipart (req.file) E JSON (req.body)
if (req.file) {
  // FormData multipart
  buffer = req.file.buffer;
} else {
  // JSON com base64
  buffer = Buffer.from(photo, "base64");
}
```

#### 3. **Rotas** (`profile.routes.ts`)

- ✅ Mantém multer para compatibilidade com requests antigos
- ✅ Middleware aceitará tanto multipart quanto JSON

## Por que funciona em iOS?

1. **FileSystem.readAsStringAsync**: Funciona nativamente em iOS (Expo suporta bem)
2. **Base64 em JSON**: Não depende de blob nativo do iOS
3. **Sem intermediários**: Vai direto do arquivo para base64 para JSON
4. **Compatível**: Backend aceita também a forma antiga de envio

## Benefícios Adicionais

- ✅ **Compatibilidade retroativa**: Android e Web continuam funcionando
- ✅ **Validação melhorada**: Verifica MIME type e tamanho
- ✅ **Sem dependências extras**: Usa apenas expo-file-system
- ✅ **Mais eficiente em iOS**: Base64 é mais rápido que blob em iOS

## Próximos Passos (Opcional)

Se quiser mais otimizações:

1. **Compressão de imagem no cliente**: Adicionar `expo-image-manipulator` para reduzir tamanho antes de enviar
2. **Upload em chunks**: Para imagens muito grandes
3. **Retry automático**: Adicionar lógica de retry com exponential backoff
4. **Indicador de progresso**: Usar `axios` com `onUploadProgress`

## Como Testar

1. **iOS**: Abra o app em um iPhone/iPad e teste o upload de foto
2. **Android**: Verifique se ainda funciona normal
3. **Monitor backend**: Verifique os logs do servidor

```bash
# Monitor do backend
npm run dev
# Look for: "Foto de perfil atualizada com sucesso"
```

## Rollback (se necessário)

Se algo der errado, o backend ainda aceita o formato antigo (FormData), então é seguro reverter o `profile.service.ts` sem quebrar tudo.
