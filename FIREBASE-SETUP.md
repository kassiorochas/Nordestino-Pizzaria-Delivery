# Guia de Configuração do Firebase - Nordestino Pizzaria

Este guia te ajudará a configurar o Firebase Console para ativar a autenticação por telefone e o banco de dados Firestore no seu projeto.

## Passo 1: Criar Projeto no Firebase Console

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Faça login com sua conta Google

2. **Criar Novo Projeto:**
   - Clique em "Criar um projeto"
   - Nome do projeto: `nordestino-pizzaria` (ou outro nome de sua escolha)
   - Aceite os termos e continue
   - **Google Analytics:** Pode desabilitar por enquanto (opcional)
   - Clique em "Criar projeto"

## Passo 2: Configurar Authentication (Autenticação)

1. **Acessar Authentication:**
   - No painel lateral esquerdo, clique em "Authentication"
   - Clique na aba "Sign-in method"

2. **Ativar Phone Authentication:**
   - Encontre "Telefone" na lista de provedores
   - Clique no ícone de edição (lápis)
   - **Ative** o provedor "Telefone"
   - Clique em "Salvar"

3. **Configurar reCAPTCHA (Importante):**
   - Ainda na configuração do telefone
   - Adicione os domínios autorizados:
     - `localhost` (para desenvolvimento)
     - `nordestinopizzaria.com.br` (seu domínio de produção)
     - Qualquer outro domínio que você usar

## Passo 3: Configurar Firestore Database

1. **Criar Firestore Database:**
   - No painel lateral, clique em "Firestore Database"
   - Clique em "Criar banco de dados"

2. **Configurar Regras de Segurança:**
   - Escolha "Iniciar no modo de teste" (por enquanto)
   - **Localização:** Escolha `southamerica-east1` (São Paulo) para melhor performance no Brasil
   - Clique em "Concluído"

3. **Configurar Regras (Importante para Produção):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Usuários podem ler/escrever apenas seus próprios dados
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Pedidos podem ser criados por usuários autenticados
       match /orders/{orderId} {
         allow read, write: if request.auth != null && 
           (request.auth.uid == resource.data.userId || 
            request.auth.uid == 'ID_DO_ADMIN_AQUI');
       }
     }
   }
   ```

## Passo 4: Obter Configurações do Projeto

1. **Acessar Configurações:**
   - Clique no ícone de engrenagem (⚙️) ao lado de "Visão geral do projeto"
   - Selecione "Configurações do projeto"

2. **Adicionar App Web:**
   - Role para baixo até "Seus apps"
   - Clique no ícone `</>` (Web)
   - Nome do app: `nordestino-pizzaria-web`
   - **NÃO** marque "Configurar Firebase Hosting" (usaremos Netlify)
   - Clique em "Registrar app"

3. **Copiar Configurações:**
   - Copie o objeto `firebaseConfig` que aparece
   - Exemplo:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     authDomain: "nordestino-pizzaria.firebaseapp.com",
     projectId: "nordestino-pizzaria",
     storageBucket: "nordestino-pizzaria.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890abcdef"
   };
   ```

## Passo 5: Atualizar o Código do Site

1. **Substituir Configuração Temporária:**
   - Abra o arquivo `index.html`
   - Encontre a seção com `firebaseConfig` (linha ~56)
   - Substitua pelos dados reais copiados do Firebase Console

2. **Exemplo de substituição:**
   ```javascript
   // ANTES (configuração temporária)
   const firebaseConfig = {
     apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "nordestino-pizzaria.firebaseapp.com",
     // ...
   };

   // DEPOIS (configuração real)
   const firebaseConfig = {
     apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Sua chave real
     authDomain: "nordestino-pizzaria.firebaseapp.com", // Seu domínio real
     projectId: "nordestino-pizzaria", // Seu project ID real
     storageBucket: "nordestino-pizzaria.appspot.com", // Seu storage real
     messagingSenderId: "123456789012", // Seu sender ID real
     appId: "1:123456789012:web:abcdef1234567890abcdef" // Seu app ID real
   };
   ```

## Passo 6: Configurar Domínios Autorizados

1. **Acessar Authentication > Settings:**
   - Vá para Authentication
   - Clique na aba "Settings"
   - Role até "Authorized domains"

2. **Adicionar Domínios:**
   - `localhost` (já deve estar)
   - `nordestinopizzaria.com.br`
   - `www.nordestinopizzaria.com.br`
   - Qualquer subdomínio do Netlify que você usar

## Passo 7: Testar a Configuração

1. **Teste Local:**
   - Abra o site em `http://localhost:8000`
   - Clique no botão "Entrar"
   - Digite um número de telefone válido
   - Verifique se o SMS é enviado

2. **Verificar Console:**
   - Abra as ferramentas de desenvolvedor (F12)
   - Verifique se não há erros no console
   - Confirme se o Firebase está conectado

## Custos e Limites

### Plano Gratuito (Spark):
- **Authentication:** 10.000 verificações por telefone/mês
- **Firestore:** 50.000 leituras, 20.000 escritas, 20.000 exclusões por dia
- **Storage:** 1 GB

### Quando Atualizar:
- Se passar de 10.000 logins por mês
- Se o banco de dados crescer muito
- Para funcionalidades avançadas

## Próximos Passos

Após configurar o Firebase:

1. ✅ **Testar autenticação por telefone**
2. ✅ **Implementar salvamento de dados do usuário**
3. ✅ **Criar histórico de pedidos**
4. ✅ **Desenvolver dashboard administrativo**

## Suporte

Se encontrar problemas:

1. **Verifique o Console do Navegador** para erros
2. **Confirme as configurações** do Firebase
3. **Teste com números diferentes** (alguns operadores podem bloquear SMS)
4. **Verifique os domínios autorizados**

---

**Importante:** Mantenha suas chaves do Firebase seguras e nunca as compartilhe publicamente!

