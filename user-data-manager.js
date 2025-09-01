// Gerenciador de Dados do Usuário
// Gerencia perfil, endereços e histórico de pedidos

class UserDataManager {
    constructor() {
        this.db = null;
        this.currentUser = null;
        this.userProfile = null;
        this.userAddresses = [];
        this.userOrders = [];
        
        // Aguarda o Firebase estar disponível
        this.waitForFirebase();
    }

    // Aguarda o Firebase estar carregado
    async waitForFirebase() {
        const checkFirebase = () => {
            if (window.firebaseDB && window.authManager) {
                this.db = window.firebaseDB;
                this.init();
                return true;
            }
            return false;
        };

        if (!checkFirebase()) {
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
        this.setupAuthListener();
    }

    // Configura os event listeners
    setupEventListeners() {
        // Navegação entre seções da conta
        const accountSectionBtns = document.querySelectorAll('.account-section-btn');
        accountSectionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showAccountSection(section);
            });
        });

        // Botões de voltar
        const backBtns = [
            'back-to-account-btn',
            'back-to-account-orders-btn', 
            'back-to-account-addresses-btn'
        ];
        backBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.showMyAccount());
            }
        });

        // Formulário de perfil
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        }

        // Gerenciamento de endereços
        const addAddressBtn = document.getElementById('add-address-btn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', () => this.showAddressModal());
        }

        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => this.handleAddressSubmit(e));
        }

        const cancelAddressBtn = document.getElementById('cancel-address-btn');
        if (cancelAddressBtn) {
            cancelAddressBtn.addEventListener('click', () => this.hideAddressModal());
        }
    }

    // Escuta mudanças na autenticação
    setupAuthListener() {
        // Monitora mudanças no usuário atual
        const checkUser = () => {
            if (window.authManager && window.authManager.getCurrentUser()) {
                const user = window.authManager.getCurrentUser();
                if (user !== this.currentUser) {
                    this.currentUser = user;
                    this.loadUserData();
                }
            } else if (this.currentUser) {
                this.currentUser = null;
                this.clearUserData();
            }
        };

        // Verifica a cada segundo
        setInterval(checkUser, 1000);
    }

    // Carrega todos os dados do usuário
    async loadUserData() {
        if (!this.currentUser) return;

        try {
            await Promise.all([
                this.loadUserProfile(),
                this.loadUserAddresses(),
                this.loadUserOrders()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    // Limpa dados do usuário
    clearUserData() {
        this.userProfile = null;
        this.userAddresses = [];
        this.userOrders = [];
    }

    // === GERENCIAMENTO DE PERFIL ===

    // Carrega perfil do usuário
    async loadUserProfile() {
        if (!this.currentUser || !this.db) return;

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const userRef = doc(this.db, 'users', this.currentUser.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                this.userProfile = userDoc.data();
                this.populateProfileForm();
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    // Popula formulário de perfil
    populateProfileForm() {
        if (!this.userProfile) return;

        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const birthInput = document.getElementById('profile-birth');

        if (nameInput && this.userProfile.nome) {
            nameInput.value = this.userProfile.nome;
        }
        if (emailInput && this.userProfile.email) {
            emailInput.value = this.userProfile.email;
        }
        if (birthInput && this.userProfile.nascimento) {
            birthInput.value = this.userProfile.nascimento;
        }
    }

    // Manipula envio do formulário de perfil
    async handleProfileSubmit(e) {
        e.preventDefault();
        
        if (!this.currentUser) return;

        const saveBtn = document.getElementById('save-profile-btn');
        const successDiv = document.getElementById('profile-success');
        
        // Mostra loading
        this.setButtonLoading(saveBtn, true);
        this.hideMessage(successDiv);

        try {
            const formData = new FormData(e.target);
            const profileData = {
                nome: formData.get('profile-name') || document.getElementById('profile-name').value,
                email: formData.get('profile-email') || document.getElementById('profile-email').value,
                nascimento: formData.get('profile-birth') || document.getElementById('profile-birth').value,
                atualizadoEm: new Date()
            };

            // Remove campos vazios
            Object.keys(profileData).forEach(key => {
                if (!profileData[key]) delete profileData[key];
            });

            const result = await this.saveUserProfile(profileData);
            
            if (result.success) {
                this.showMessage(successDiv);
                this.userProfile = { ...this.userProfile, ...profileData };
                
                // Atualiza nome na conta
                const accountName = document.getElementById('account-name');
                if (accountName && profileData.nome) {
                    accountName.textContent = profileData.nome;
                }
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        } finally {
            this.setButtonLoading(saveBtn, false);
        }
    }

    // Salva perfil do usuário
    async saveUserProfile(profileData) {
        if (!this.currentUser || !this.db) return { success: false };

        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const userRef = doc(this.db, 'users', this.currentUser.uid);
            await setDoc(userRef, profileData, { merge: true });
            
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            return { success: false };
        }
    }

    // === GERENCIAMENTO DE ENDEREÇOS ===

    // Carrega endereços do usuário
    async loadUserAddresses() {
        if (!this.currentUser || !this.db) return;

        try {
            const { collection, query, where, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const addressesRef = collection(this.db, 'addresses');
            const q = query(
                addressesRef,
                where('userId', '==', this.currentUser.uid),
                orderBy('criadoEm', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            this.userAddresses = [];
            
            querySnapshot.forEach((doc) => {
                this.userAddresses.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            this.renderAddresses();
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
        }
    }

    // Renderiza lista de endereços
    renderAddresses() {
        const loadingDiv = document.getElementById('addresses-loading');
        const emptyDiv = document.getElementById('addresses-empty');
        const listDiv = document.getElementById('addresses-list');
        
        if (loadingDiv) loadingDiv.classList.add('hidden');
        
        if (this.userAddresses.length === 0) {
            if (emptyDiv) emptyDiv.classList.remove('hidden');
            if (listDiv) listDiv.classList.add('hidden');
            return;
        }
        
        if (emptyDiv) emptyDiv.classList.add('hidden');
        if (listDiv) {
            listDiv.classList.remove('hidden');
            listDiv.innerHTML = this.userAddresses.map(address => this.createAddressCard(address)).join('');
            
            // Adiciona event listeners aos botões
            this.setupAddressCardListeners();
        }
    }

    // Cria card de endereço
    createAddressCard(address) {
        const isDefault = address.padrao ? '<span class="address-default">Padrão</span>' : '';
        
        return `
            <div class="address-card" data-address-id="${address.id}">
                <div class="address-header">
                    <h4>${address.rotulo}</h4>
                    ${isDefault}
                </div>
                <div class="address-details">
                    <p><strong>${address.rua}</strong></p>
                    <p>${address.bairro}</p>
                    ${address.complemento ? `<p>${address.complemento}</p>` : ''}
                    ${address.referencia ? `<p class="address-reference">Ref: ${address.referencia}</p>` : ''}
                </div>
                <div class="address-actions">
                    <button class="btn-icon edit-address" data-address-id="${address.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-address" data-address-id="${address.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${!address.padrao ? `<button class="btn-text set-default" data-address-id="${address.id}">Definir como padrão</button>` : ''}
                </div>
            </div>
        `;
    }

    // Configura listeners dos cards de endereço
    setupAddressCardListeners() {
        // Botões de editar
        document.querySelectorAll('.edit-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = e.currentTarget.dataset.addressId;
                this.editAddress(addressId);
            });
        });

        // Botões de excluir
        document.querySelectorAll('.delete-address').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = e.currentTarget.dataset.addressId;
                this.deleteAddress(addressId);
            });
        });

        // Botões de definir como padrão
        document.querySelectorAll('.set-default').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const addressId = e.currentTarget.dataset.addressId;
                this.setDefaultAddress(addressId);
            });
        });
    }

    // Mostra modal de endereço
    showAddressModal(address = null) {
        this.hideAllSections();
        
        const modal = document.getElementById('address-modal');
        const title = document.getElementById('address-modal-title');
        
        if (modal) modal.classList.remove('hidden');
        
        if (address) {
            // Editando endereço existente
            if (title) title.textContent = 'Editar Endereço';
            this.populateAddressForm(address);
        } else {
            // Novo endereço
            if (title) title.textContent = 'Adicionar Endereço';
            this.clearAddressForm();
        }
    }

    // Esconde modal de endereço
    hideAddressModal() {
        const modal = document.getElementById('address-modal');
        if (modal) modal.classList.add('hidden');
        this.showAccountSection('addresses');
    }

    // Popula formulário de endereço
    populateAddressForm(address) {
        document.getElementById('address-id').value = address.id || '';
        document.getElementById('address-label').value = address.rotulo || '';
        document.getElementById('address-street').value = address.rua || '';
        document.getElementById('address-neighborhood').value = address.bairro || '';
        document.getElementById('address-complement').value = address.complemento || '';
        document.getElementById('address-reference').value = address.referencia || '';
        document.getElementById('address-default').checked = address.padrao || false;
    }

    // Limpa formulário de endereço
    clearAddressForm() {
        document.getElementById('address-form').reset();
        document.getElementById('address-id').value = '';
    }

    // Manipula envio do formulário de endereço
    async handleAddressSubmit(e) {
        e.preventDefault();
        
        if (!this.currentUser) return;

        const saveBtn = document.getElementById('save-address-btn');
        this.setButtonLoading(saveBtn, true);

        try {
            const formData = new FormData(e.target);
            const addressData = {
                userId: this.currentUser.uid,
                rotulo: formData.get('address-label') || document.getElementById('address-label').value,
                rua: formData.get('address-street') || document.getElementById('address-street').value,
                bairro: formData.get('address-neighborhood') || document.getElementById('address-neighborhood').value,
                complemento: formData.get('address-complement') || document.getElementById('address-complement').value,
                referencia: formData.get('address-reference') || document.getElementById('address-reference').value,
                padrao: document.getElementById('address-default').checked,
                atualizadoEm: new Date()
            };

            const addressId = document.getElementById('address-id').value;
            
            if (addressId) {
                // Editando endereço existente
                await this.updateAddress(addressId, addressData);
            } else {
                // Novo endereço
                addressData.criadoEm = new Date();
                await this.createAddress(addressData);
            }
            
            // Recarrega endereços e volta para a lista
            await this.loadUserAddresses();
            this.hideAddressModal();
            
        } catch (error) {
            console.error('Erro ao salvar endereço:', error);
        } finally {
            this.setButtonLoading(saveBtn, false);
        }
    }

    // Cria novo endereço
    async createAddress(addressData) {
        if (!this.db) return;

        try {
            const { collection, addDoc, doc, updateDoc, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            // Se for padrão, remove padrão dos outros
            if (addressData.padrao) {
                await this.clearDefaultAddresses();
            }
            
            const addressesRef = collection(this.db, 'addresses');
            await addDoc(addressesRef, addressData);
            
        } catch (error) {
            console.error('Erro ao criar endereço:', error);
        }
    }

    // Atualiza endereço existente
    async updateAddress(addressId, addressData) {
        if (!this.db) return;

        try {
            const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            // Se for padrão, remove padrão dos outros
            if (addressData.padrao) {
                await this.clearDefaultAddresses();
            }
            
            const addressRef = doc(this.db, 'addresses', addressId);
            await updateDoc(addressRef, addressData);
            
        } catch (error) {
            console.error('Erro ao atualizar endereço:', error);
        }
    }

    // Remove padrão de todos os endereços
    async clearDefaultAddresses() {
        if (!this.currentUser || !this.db) return;

        try {
            const { collection, query, where, getDocs, doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const addressesRef = collection(this.db, 'addresses');
            const q = query(addressesRef, where('userId', '==', this.currentUser.uid), where('padrao', '==', true));
            
            const querySnapshot = await getDocs(q);
            
            const updatePromises = [];
            querySnapshot.forEach((docSnapshot) => {
                const addressRef = doc(this.db, 'addresses', docSnapshot.id);
                updatePromises.push(updateDoc(addressRef, { padrao: false }));
            });
            
            await Promise.all(updatePromises);
            
        } catch (error) {
            console.error('Erro ao limpar endereços padrão:', error);
        }
    }

    // Edita endereço
    editAddress(addressId) {
        const address = this.userAddresses.find(addr => addr.id === addressId);
        if (address) {
            this.showAddressModal(address);
        }
    }

    // Exclui endereço
    async deleteAddress(addressId) {
        if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

        try {
            const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const addressRef = doc(this.db, 'addresses', addressId);
            await deleteDoc(addressRef);
            
            // Recarrega endereços
            await this.loadUserAddresses();
            
        } catch (error) {
            console.error('Erro ao excluir endereço:', error);
        }
    }

    // Define endereço como padrão
    async setDefaultAddress(addressId) {
        try {
            // Remove padrão dos outros
            await this.clearDefaultAddresses();
            
            // Define este como padrão
            const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const addressRef = doc(this.db, 'addresses', addressId);
            await updateDoc(addressRef, { padrao: true });
            
            // Recarrega endereços
            await this.loadUserAddresses();
            
        } catch (error) {
            console.error('Erro ao definir endereço padrão:', error);
        }
    }

    // === GERENCIAMENTO DE PEDIDOS ===

    // Carrega histórico de pedidos
    async loadUserOrders() {
        if (!this.currentUser || !this.db) return;

        try {
            const { collection, query, where, orderBy, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const ordersRef = collection(this.db, 'orders');
            const q = query(
                ordersRef,
                where('userId', '==', this.currentUser.uid),
                orderBy('criadoEm', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            this.userOrders = [];
            
            querySnapshot.forEach((doc) => {
                this.userOrders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            this.renderOrders();
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    }

    // Renderiza lista de pedidos
    renderOrders() {
        const loadingDiv = document.getElementById('orders-loading');
        const emptyDiv = document.getElementById('orders-empty');
        const listDiv = document.getElementById('orders-list');
        
        if (loadingDiv) loadingDiv.classList.add('hidden');
        
        if (this.userOrders.length === 0) {
            if (emptyDiv) emptyDiv.classList.remove('hidden');
            if (listDiv) listDiv.classList.add('hidden');
            return;
        }
        
        if (emptyDiv) emptyDiv.classList.add('hidden');
        if (listDiv) {
            listDiv.classList.remove('hidden');
            listDiv.innerHTML = this.userOrders.map(order => this.createOrderCard(order)).join('');
        }
    }

    // Cria card de pedido
    createOrderCard(order) {
        const date = order.criadoEm?.toDate ? order.criadoEm.toDate() : new Date(order.criadoEm);
        const formattedDate = date.toLocaleDateString('pt-BR');
        const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);
        
        const itemsCount = order.itens?.length || 0;
        const itemsText = itemsCount === 1 ? '1 item' : `${itemsCount} itens`;
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Pedido #${order.id.slice(-6).toUpperCase()}</h4>
                        <p class="order-date">${formattedDate} às ${formattedTime}</p>
                    </div>
                    <div class="order-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="order-details">
                    <p class="order-items">${itemsText}</p>
                    <p class="order-total">Total: R$ ${(order.total || 0).toFixed(2)}</p>
                    ${order.entrega === 'delivery' ? '<p class="order-delivery">Entrega em domicílio</p>' : '<p class="order-pickup">Retirada no local</p>'}
                </div>
                <div class="order-actions">
                    <button class="btn secondary small view-order" data-order-id="${order.id}">
                        Ver Detalhes
                    </button>
                    <button class="btn primary small repeat-order" data-order-id="${order.id}">
                        Repetir Pedido
                    </button>
                </div>
            </div>
        `;
    }

    // Obtém classe CSS do status
    getStatusClass(status) {
        const classes = {
            'pendente': 'status-pending',
            'confirmado': 'status-confirmed',
            'preparando': 'status-preparing',
            'saiu_entrega': 'status-delivery',
            'entregue': 'status-delivered',
            'cancelado': 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    }

    // Obtém texto do status
    getStatusText(status) {
        const texts = {
            'pendente': 'Pendente',
            'confirmado': 'Confirmado',
            'preparando': 'Preparando',
            'saiu_entrega': 'Saiu para entrega',
            'entregue': 'Entregue',
            'cancelado': 'Cancelado'
        };
        return texts[status] || 'Pendente';
    }

    // === NAVEGAÇÃO ===

    // Mostra seção da conta
    showAccountSection(section) {
        this.hideAllSections();
        
        const sectionElement = document.getElementById(`${section}-section`);
        if (sectionElement) {
            sectionElement.classList.remove('hidden');
            
            // Carrega dados específicos da seção
            if (section === 'profile') {
                this.loadUserProfile();
            } else if (section === 'orders') {
                this.loadUserOrders();
            } else if (section === 'addresses') {
                this.loadUserAddresses();
            }
        }
    }

    // Mostra área "Minha Conta"
    showMyAccount() {
        this.hideAllSections();
        const myAccount = document.getElementById('my-account');
        if (myAccount) {
            myAccount.classList.remove('hidden');
            this.updateAccountInfo();
        }
    }

    // Atualiza informações da conta
    updateAccountInfo() {
        const accountName = document.getElementById('account-name');
        const accountPhone = document.getElementById('account-phone');
        
        if (this.currentUser) {
            if (accountName) {
                accountName.textContent = this.userProfile?.nome || 'Usuário';
            }
            if (accountPhone) {
                accountPhone.textContent = this.formatPhoneForDisplay(this.currentUser.phoneNumber || '');
            }
        }
    }

    // Formata telefone para exibição
    formatPhoneForDisplay(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length >= 11) {
            const ddd = cleanPhone.slice(-11, -9);
            const number = cleanPhone.slice(-9);
            return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`;
        }
        return phone;
    }

    // Esconde todas as seções
    hideAllSections() {
        const sections = [
            'hero', 'menu-navigation', 'promocoes', 'cardapio', 'cart', 
            'checkout', 'order-confirmation', 'login-modal', 'my-account',
            'profile-section', 'orders-section', 'addresses-section', 'address-modal'
        ];
        
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });
    }

    // === UTILITÁRIOS ===

    // Controla loading dos botões
    setButtonLoading(button, loading) {
        if (!button) return;
        
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

    // Mostra mensagem
    showMessage(element) {
        if (element) {
            element.classList.remove('hidden');
            setTimeout(() => {
                element.classList.add('hidden');
            }, 3000);
        }
    }

    // Esconde mensagem
    hideMessage(element) {
        if (element) {
            element.classList.add('hidden');
        }
    }

    // Salva pedido no histórico
    async saveOrder(orderData) {
        if (!this.currentUser || !this.db) return { success: false };

        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            
            const orderWithUser = {
                ...orderData,
                userId: this.currentUser.uid,
                criadoEm: new Date(),
                status: 'pendente'
            };
            
            const ordersRef = collection(this.db, 'orders');
            const docRef = await addDoc(ordersRef, orderWithUser);
            
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            return { success: false };
        }
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.userDataManager = new UserDataManager();
});

