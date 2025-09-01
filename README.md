# Nordestino Pizzaria - Plataforma Dinâmica

Transformação do site estático da Nordestino Pizzaria em uma plataforma dinâmica completa com gerenciamento de cardápio, autenticação por celular, perfis de usuário e dashboard administrativo.

## 🚀 Funcionalidades Implementadas

### ✅ Fase 1: Gerenciamento de Cardápio (Decap CMS)
- **Interface administrativa** para o dono gerenciar o cardápio
- **Categorias organizadas:** Pizzas Tradicionais, Especiais, Doces, Bordas, Bebidas, Promoções
- **Campos personalizados:** Nome, descrição, preços, imagens, disponibilidade
- **Integração automática** com o site principal

### ✅ Fase 2: Autenticação por Telefone (Firebase)
- **Login via SMS** - Mais prático que e-mail
- **Interface responsiva** para mobile e desktop
- **Verificação de segurança** com reCAPTCHA
- **Gerenciamento de sessão** automático

### 🔄 Em Desenvolvimento
- **Perfil do cliente** com dados salvos
- **Histórico de pedidos** completo
- **Dashboard administrativo** com métricas
- **Sistema de endereços** múltiplos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **CMS:** Decap CMS (Netlify CMS)
- **Backend:** Firebase (Authentication + Firestore)
- **Deploy:** Netlify + GitHub
- **Design:** Responsivo, PWA-ready

## 📁 Estrutura do Projeto

```
nordestino-pizzaria-dinamica/
├── admin/                      # Decap CMS
│   ├── index.html             # Interface administrativa
│   └── config.yml             # Configuração do CMS
├── data/                      # Dados do cardápio
│   └── cardapio/
│       ├── tradicionais/      # Pizzas tradicionais
│       ├── especiais/         # Pizzas especiais
│       ├── doces/            # Pizzas doces
│       ├── bordas/           # Bordas recheadas
│       ├── bebidas/          # Bebidas
│       └── promocoes/        # Promoções
├── images/                    # Imagens do site
│   └── cardapio/             # Imagens do cardápio (CMS)
├── icon/                     # Ícones e logos
├── index.html                # Página principal
├── style.css                 # Estilos principais
├── script.js                 # JavaScript principal (original)
├── cardapio-loader.js        # Carregador dinâmico do cardápio
├── auth-manager.js           # Gerenciador de autenticação
├── firebase-config.js        # Configurações do Firebase
├── manifest.json             # PWA manifest
├── service-worker.js         # Service Worker
├── _redirects               # Configurações Netlify
├── FIREBASE-SETUP.md        # Guia de configuração
└── README.md                # Este arquivo
```

## 🚀 Como Usar

### Para o Dono da Pizzaria (Administrador)

1. **Gerenciar Cardápio:**
   - Acesse: `seusite.com/admin/`
   - Faça login com GitHub
   - Adicione/edite pizzas, bebidas e promoções
   - As mudanças aparecem automaticamente no site

2. **Acessar Dashboard:**
   - Faça login no site com seu número de celular
   - Acesse métricas de vendas e pedidos
   - Visualize relatórios em tempo real

### Para os Clientes

1. **Fazer Pedidos:**
   - Navegue pelo cardápio
   - Adicione itens ao carrinho
   - Finalize via WhatsApp (como antes)

2. **Criar Conta (Opcional):**
   - Clique em "Entrar" no header
   - Digite seu número de celular
   - Receba e digite o código SMS
   - Salve seus dados para próximos pedidos

## ⚙️ Configuração

### 1. Decap CMS (Já Configurado)
- Interface administrativa pronta
- Integração com GitHub/Netlify automática

### 2. Firebase (Requer Configuração)
- Siga o guia: [`FIREBASE-SETUP.md`](./FIREBASE-SETUP.md)
- Configure Authentication e Firestore
- Atualize as chaves no código

### 3. Deploy
- **GitHub:** Faça push do código
- **Netlify:** Deploy automático
- **Domínio:** Configure DNS para seu domínio

## 💰 Custos

### Gratuito:
- **Netlify:** Hosting ilimitado
- **GitHub:** Repositório público
- **Decap CMS:** Totalmente gratuito
- **Firebase (Spark):** 10.000 logins/mês + 50k leituras/dia

### Pago (apenas se crescer muito):
- **Firebase (Blaze):** Pay-as-you-go após limites
- **Domínio personalizado:** ~R$ 40/ano

## 🔧 Desenvolvimento Local

1. **Clone o repositório:**
   ```bash
   git clone [seu-repositorio]
   cd nordestino-pizzaria-dinamica
   ```

2. **Inicie servidor local:**
   ```bash
   python3 -m http.server 8000
   # ou
   npx serve .
   ```

3. **Acesse:**
   - Site: `http://localhost:8000`
   - Admin: `http://localhost:8000/admin/`

## 📱 Funcionalidades Futuras

- [ ] **App móvel nativo** (React Native)
- [ ] **Notificações push** para pedidos
- [ ] **Sistema de fidelidade** com pontos
- [ ] **Integração com delivery** (iFood, Uber Eats)
- [ ] **Pagamento online** (PIX, cartão)
- [ ] **Chat ao vivo** com clientes

## 🤝 Suporte

Para dúvidas ou problemas:

1. **Documentação:** Consulte os arquivos `.md` do projeto
2. **Issues:** Abra uma issue no GitHub
3. **Contato:** Entre em contato com o desenvolvedor

## 📄 Licença

Este projeto foi desenvolvido especificamente para a Nordestino Pizzaria.

---

**Desenvolvido com ❤️ para a melhor pizzaria nordestina!** 🍕

