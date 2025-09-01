// Configuração do Firebase para Nordestino Pizzaria
// Este arquivo contém as configurações e inicializações do Firebase

// Configuração do Firebase (será preenchida com os dados do console)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "nordestino-pizzaria.firebaseapp.com",
  projectId: "nordestino-pizzaria",
  storageBucket: "nordestino-pizzaria.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicialização do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
const auth = getAuth(app);
const db = getFirestore(app);

// Classe para gerenciar autenticação
class FirebaseAuth {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
        this.recaptchaVerifier = null;
        
        // Escutar mudanças no estado de autenticação
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.updateUI(user);
        });
    }

    // Configurar reCAPTCHA
    setupRecaptcha() {
        if (!this.recaptchaVerifier) {
            this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA resolvido');
                }
            });
        }
        return this.recaptchaVerifier;
    }

    // Enviar código SMS
    async enviarCodigoSMS(numeroTelefone) {
        try {
            // Formatar número para padrão internacional
            const numeroFormatado = this.formatarNumero(numeroTelefone);
            
            const recaptcha = this.setupRecaptcha();
            const confirmationResult = await signInWithPhoneNumber(this.auth, numeroFormatado, recaptcha);
            
            return {
                success: true,
                confirmationResult: confirmationResult,
                message: 'Código SMS enviado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao enviar SMS:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    // Verificar código SMS
    async verificarCodigo(confirmationResult, codigo) {
        try {
            const result = await confirmationResult.confirm(codigo);
            const user = result.user;
            
            // Salvar dados básicos do usuário no Firestore
            await this.salvarUsuarioBasico(user);
            
            return {
                success: true,
                user: user,
                message: 'Login realizado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao verificar código:', error);
            return {
                success: false,
                error: error.code,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    // Fazer logout
    async logout() {
        try {
            await signOut(this.auth);
            return { success: true, message: 'Logout realizado com sucesso!' };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, message: 'Erro ao fazer logout' };
        }
    }

    // Salvar dados básicos do usuário
    async salvarUsuarioBasico(user) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    telefone: user.phoneNumber,
                    criadoEm: new Date(),
                    ultimoLogin: new Date()
                });
            } else {
                await setDoc(userRef, {
                    ultimoLogin: new Date()
                }, { merge: true });
            }
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
        }
    }

    // Formatar número de telefone
    formatarNumero(numero) {
        // Remove todos os caracteres não numéricos
        let numeroLimpo = numero.replace(/\D/g, '');
        
        // Se não começar com +55, adiciona
        if (!numeroLimpo.startsWith('55')) {
            numeroLimpo = '55' + numeroLimpo;
        }
        
        return '+' + numeroLimpo;
    }

    // Mensagens de erro em português
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

    // Atualizar interface do usuário
    updateUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (user) {
            // Usuário logado
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.textContent = `Logado: ${user.phoneNumber}`;
            }
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Verificar se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Classe para gerenciar dados no Firestore
class FirebaseData {
    constructor() {
        this.db = db;
    }

    // Salvar dados do perfil do usuário
    async salvarPerfilUsuario(userId, dados) {
        try {
            const userRef = doc(this.db, 'users', userId);
            await setDoc(userRef, dados, { merge: true });
            return { success: true, message: 'Perfil salvo com sucesso!' };
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            return { success: false, message: 'Erro ao salvar perfil' };
        }
    }

    // Obter dados do perfil do usuário
    async obterPerfilUsuario(userId) {
        try {
            const userRef = doc(this.db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return { success: true, data: userDoc.data() };
            } else {
                return { success: false, message: 'Usuário não encontrado' };
            }
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            return { success: false, message: 'Erro ao carregar perfil' };
        }
    }

    // Salvar pedido
    async salvarPedido(pedido) {
        try {
            const pedidosRef = collection(this.db, 'orders');
            const docRef = await addDoc(pedidosRef, {
                ...pedido,
                criadoEm: new Date(),
                status: 'pendente'
            });
            
            return { success: true, id: docRef.id, message: 'Pedido salvo com sucesso!' };
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            return { success: false, message: 'Erro ao salvar pedido' };
        }
    }

    // Obter histórico de pedidos do usuário
    async obterHistoricoPedidos(userId) {
        try {
            const pedidosRef = collection(this.db, 'orders');
            const q = query(
                pedidosRef, 
                where('userId', '==', userId),
                orderBy('criadoEm', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const pedidos = [];
            
            querySnapshot.forEach((doc) => {
                pedidos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, data: pedidos };
        } catch (error) {
            console.error('Erro ao obter histórico:', error);
            return { success: false, message: 'Erro ao carregar histórico' };
        }
    }

    // Obter todos os pedidos (para admin)
    async obterTodosPedidos() {
        try {
            const pedidosRef = collection(this.db, 'orders');
            const q = query(pedidosRef, orderBy('criadoEm', 'desc'));
            
            const querySnapshot = await getDocs(q);
            const pedidos = [];
            
            querySnapshot.forEach((doc) => {
                pedidos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, data: pedidos };
        } catch (error) {
            console.error('Erro ao obter pedidos:', error);
            return { success: false, message: 'Erro ao carregar pedidos' };
        }
    }
}

// Instâncias globais
window.firebaseAuth = new FirebaseAuth();
window.firebaseData = new FirebaseData();

// Exportar para uso em outros arquivos
export { FirebaseAuth, FirebaseData, auth, db };

