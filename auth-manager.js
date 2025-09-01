// Gerenciador de Autenticação por Telefone
// Integra com Firebase Auth para login via SMS

class AuthManager {
    constructor() {
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.confirmationResult = null;
        this.recaptchaVerifier = null;
        
        // Aguarda o Firebase estar disponível
        this.waitForFirebase();
    }

    // Aguarda o Firebase estar carregado
    async waitForFirebase() {
        const checkFirebase = () => {
            if (window.firebaseAuth && window.firebaseDB) {
                this.auth = window.firebaseAuth;
                this.db = window.firebaseDB;
                this.init();
                return true;
            }
            return false;
        };

        if (!checkFirebase()) {
            // Tenta novamente a cada 100ms até o Firebase estar disponível
            const interval = setInterval(() => {
                if (checkFirebase()) {
                    clearInterval(interval);
                }
            }, 100);
        }
    }

    // Inicializa o gerenciador
    init() {
        this.setupEventListeners();
        this.setupAuthStateListener();
        this.setupRecaptcha();
    }

    // Configura os event listeners
    setupEventListeners() {
        // Botão de login no header
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Formulário de telefone
        const phoneForm = document.getElementById('phone-form');
        if (phoneForm) {
            phoneForm.addEventListener('submit', (e) => this.handlePhoneSubmit(e));
        }

        // Formulário de código
        const codeForm = document.getElementById('code-form');
        if (codeForm) {
            codeForm.addEventListener('submit', (e) => this.handleCodeSubmit(e));
        }

        // Botões do modal
        const closeLoginBtn = document.getElementById('close-login-btn');
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', () => this.hideLoginModal());
        }

        const resendCodeBtn = document.getElementById('resend-code-btn');
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', () => this.resendCode());
        }

        const changePhoneBtn = document.getElementById('change-phone-btn');
        if (changePhoneBtn) {
            changePhoneBtn.addEventListener('click', () => this.changePhone());
        }

        // Botão voltar ao menu da conta
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.showMainMenu());
        }
    }

    // Configura listener para mudanças no estado de autenticação
    setupAuthStateListener() {
        if (!this.auth) return;

        // Importa onAuthStateChanged dinamicamente
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
            .then(({ onAuthStateChanged }) => {
                onAuthStateChanged(this.auth, (user) => {
                    this.currentUser = user;
                    this.updateUI(user);
                });
            });
    }

    // Configura reCAPTCHA
    setupRecaptcha() {
        if (!this.auth) return;

        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
            .then(({ RecaptchaVerifier }) => {
                this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log('reCAPTCHA resolvido');
                    },
                    'expired-callback': () => {
                        console.log('reCAPTCHA expirado');
                    }
                });
            });
    }

    // Mostra o modal de login
    showLoginModal() {
        this.hideAllSections();
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            this.resetLoginForm();
        }
    }

    // Esconde o modal de login
    hideLoginModal() {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.add('hidden');
        }
        this.showMainMenu();
    }

    // Reseta o formulário de login
    resetLoginForm() {
        const phoneStep = document.getElementById('phone-step');
        const codeStep = document.getElementById('code-step');
        const errorDiv = document.getElementById('login-error');
        
        if (phoneStep) phoneStep.classList.remove('hidden');
        if (codeStep) codeStep.classList.add('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');
        
        // Limpa os campos
        const phoneInput = document.getElementById('phone-input');
        const codeInput = document.getElementById('code-input');
        if (phoneInput) phoneInput.value = '';
        if (codeInput) codeInput.value = '';
    }

    // Manipula o envio do formulário de telefone
    async handlePhoneSubmit(e) {
        e.preventDefault();
        
        const phoneInput = document.getElementById('phone-input');
        const sendBtn = document.getElementById('send-code-btn');
        
        if (!phoneInput || !sendBtn) return;
        
        const phone = phoneInput.value.trim();
        if (!phone) {
            this.showError('Por favor, digite seu número de telefone');
            return;
        }

        // Mostra loading
        this.setButtonLoading(sendBtn, true);
        this.hideError();

        try {
            const result = await this.sendSMSCode(phone);
            if (result.success) {
                this.showCodeStep(phone);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('Erro ao enviar código. Tente novamente.');
        } finally {
            this.setButtonLoading(sendBtn, false);
        }
    }

    // Manipula o envio do formulário de código
    async handleCodeSubmit(e) {
        e.preventDefault();
        
        const codeInput = document.getElementById('code-input');
        const verifyBtn = document.getElementById('verify-code-btn');
        
        if (!codeInput || !verifyBtn) return;
        
        const code = codeInput.value.trim();
        if (!code || code.length !== 6) {
            this.showError('Por favor, digite o código de 6 dígitos');
            return;
        }

        // Mostra loading
        this.setButtonLoading(verifyBtn, true);
        this.hideError();

        try {
            const result = await this.verifyCode(code);
            if (result.success) {
                this.hideLoginModal();
                this.showMyAccount();
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            this.showError('Código inválido. Tente novamente.');
        } finally {
            this.setButtonLoading(verifyBtn, false);
        }
    }

    // Envia código SMS
    async sendSMSCode(phone) {
        if (!this.auth || !this.recaptchaVerifier) {
            return { success: false, message: 'Erro de configuração. Recarregue a página.' };
        }

        try {
            const { signInWithPhoneNumber } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            
            // Formata o número
            const formattedPhone = this.formatPhoneNumber(phone);
            
            // Envia SMS
            this.confirmationResult = await signInWithPhoneNumber(this.auth, formattedPhone, this.recaptchaVerifier);
            
            return { success: true, message: 'Código enviado com sucesso!' };
        } catch (error) {
            console.error('Erro ao enviar SMS:', error);
            return { success: false, message: this.getErrorMessage(error.code) };
        }
    }

    // Verifica o código SMS
    async verifyCode(code) {
        if (!this.confirmationResult) {
            return { success: false, message: 'Erro: código de confirmação não encontrado' };
        }

        try {
            const result = await this.confirmationResult.confirm(code);
            const user = result.user;
            
            // Salva dados básicos do usuário
            await this.saveUserData(user);
            
            return { success: true, user: user, message: 'Login realizado com sucesso!' };
        } catch (error) {
            console.error('Erro ao verificar código:', error);
            return { success: false, message: this.getErrorMessage(error.code) };
        }
    }

    // Salva dados do usuário no Firestore
    async saveUserData(user) {
        if (!this.db) return;

        try {
            const { doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const userRef = doc(this.db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            const userData = {
                telefone: user.phoneNumber,
                ultimoLogin: new Date()
            };

            if (!userDoc.exists()) {
                userData.criadoEm = new Date();
            }

            await setDoc(userRef, userData, { merge: true });
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
        }
    }

    // Formata número de telefone
    formatPhoneNumber(phone) {
        // Remove todos os caracteres não numéricos
        let cleanPhone = phone.replace(/\D/g, '');
        
        // Se não começar com 55, adiciona
        if (!cleanPhone.startsWith('55')) {
            cleanPhone = '55' + cleanPhone;
        }
        
        return '+' + cleanPhone;
    }

    // Mostra o passo do código
    showCodeStep(phone) {
        const phoneStep = document.getElementById('phone-step');
        const codeStep = document.getElementById('code-step');
        const phoneDisplay = document.getElementById('phone-display');
        
        if (phoneStep) phoneStep.classList.add('hidden');
        if (codeStep) codeStep.classList.remove('hidden');
        if (phoneDisplay) phoneDisplay.textContent = this.formatPhoneForDisplay(phone);
    }

    // Formata telefone para exibição
    formatPhoneForDisplay(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length === 11) {
            return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
        }
        return phone;
    }

    // Reenviar código
    async resendCode() {
        const phoneInput = document.getElementById('phone-input');
        if (phoneInput && phoneInput.value) {
            await this.sendSMSCode(phoneInput.value);
        }
    }

    // Alterar telefone
    changePhone() {
        this.resetLoginForm();
    }

    // Fazer logout
    async logout() {
        if (!this.auth) return;

        try {
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
            await signOut(this.auth);
            this.showMainMenu();
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }

    // Atualiza a interface do usuário
    updateUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const userPhone = document.getElementById('user-phone');
        
        if (user) {
            // Usuário logado
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userInfo) {
                userInfo.classList.remove('hidden');
                if (userPhone) {
                    userPhone.textContent = this.formatPhoneForDisplay(user.phoneNumber || '');
                }
            }
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userInfo) userInfo.classList.add('hidden');
        }
    }

    // Mostra/esconde erro
    showError(message) {
        const errorDiv = document.getElementById('login-error');
        const errorText = document.getElementById('error-text');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    hideError() {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    // Controla loading dos botões
    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (loading) {
            button.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnLoading) btnLoading.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoading) btnLoading.classList.add('hidden');
        }
    }

    // Esconde todas as seções
    hideAllSections() {
        const sections = ['hero', 'menu-navigation', 'promocoes', 'cardapio', 'cart', 'checkout', 'order-confirmation', 'login-modal', 'my-account'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
    }

    // Mostra menu principal
    showMainMenu() {
        this.hideAllSections();
        const hero = document.getElementById('hero');
        const menuNav = document.getElementById('menu-navigation');
        const promocoes = document.getElementById('promocoes');
        const cardapio = document.getElementById('cardapio');
        
        if (hero) hero.classList.remove('hidden');
        if (menuNav) menuNav.classList.remove('hidden');
        if (promocoes) promocoes.classList.remove('hidden');
        if (cardapio) cardapio.classList.remove('hidden');
    }

    // Mostra área "Minha Conta"
    showMyAccount() {
        this.hideAllSections();
        const myAccount = document.getElementById('my-account');
        if (myAccount) {
            myAccount.classList.remove('hidden');
            this.loadAccountData();
        }
    }

    // Carrega dados da conta
    async loadAccountData() {
        if (!this.currentUser) return;

        const accountName = document.getElementById('account-name');
        const accountPhone = document.getElementById('account-phone');
        
        if (accountName) accountName.textContent = 'Usuário';
        if (accountPhone) accountPhone.textContent = this.formatPhoneForDisplay(this.currentUser.phoneNumber || '');
    }

    // Mensagens de erro
    getErrorMessage(errorCode) {
        const messages = {
            'auth/invalid-phone-number': 'Número de telefone inválido',
            'auth/missing-phone-number': 'Número de telefone é obrigatório',
            'auth/quota-exceeded': 'Cota de SMS excedida. Tente novamente mais tarde',
            'auth/user-disabled': 'Usuário desabilitado',
            'auth/invalid-verification-code': 'Código de verificação inválido',
            'auth/invalid-verification-id': 'ID de verificação inválido',
            'auth/code-expired': 'Código expirado. Solicite um novo código',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
        };
        
        return messages[errorCode] || 'Erro desconhecido. Tente novamente';
    }

    // Verifica se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obtém usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

