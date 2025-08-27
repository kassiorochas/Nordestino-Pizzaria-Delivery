document.addEventListener('DOMContentLoaded', () => {

// ==== Compact menu + offset scroll helpers (safe inject) ====
function _np_getFixedHeadersHeight(){
    const header = document.querySelector('header');
    const menu = document.getElementById('menu-navigation');
    let h = 0;
    if (header) h += header.getBoundingClientRect().height;
    if (menu)  h += menu.getBoundingClientRect().height;
    return h + 8; // breathe a bit
}
function _np_scrollToCardapioWithOffset(){
    const section = document.getElementById('cardapio');
    if (!section) return;
    const y = section.getBoundingClientRect().top + window.scrollY - _np_getFixedHeadersHeight();
    window.scrollTo({ top: y, behavior: 'smooth' });
}
function _np_updateMenuCompact(){
    const menu = document.getElementById('menu-navigation');
    if (!menu) return;
    // Fica compacto quando a página está rolada o suficiente para o menu "grudar"
    const hero = document.getElementById('hero');
    const headerH = document.querySelector('header')?.getBoundingClientRect().height || 0;
    const trigger = hero ? (hero.getBoundingClientRect().bottom <= headerH + 10) : (window.scrollY > 20);
    if (trigger) menu.classList.add('compact');
    else menu.classList.remove('compact');
}
window.addEventListener('scroll', _np_updateMenuCompact, { passive: true });
document.addEventListener('DOMContentLoaded', _np_updateMenuCompact);

    const PIZZARIA_WHATSAPP = '5581993613802'; // WhatsApp da Pizzaria
    const ENTREGA_PADRAO = 3.00; // Taxa de entrega padrão

    
    // =========================
    // NAVEGAÇÃO ENTRE SEÇÕES
    // =========================
    function navigateToSection(targetId) {
        const sections = ['hero','menu-navigation','promocoes','cardapio','cart','checkout','order-confirmation'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const show = (ids) => ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('hidden');
        });

        if (targetId === 'hero') {
            show(['hero','menu-navigation','promocoes','cardapio']);
        } else if (targetId === 'cardapio') {
            show(['menu-navigation','cardapio']);
        } else if (sections.includes(targetId)) {
            show([targetId]);
        }

        // Sempre levar ao topo para evitar que o usuário fique perdido
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // =========================
    // DADOS DO CARDÁPIO
    // =========================
    const menuItems = [
        // PIZZAS TRADICIONAIS (Média R$33,00 | Grande R$36,00)
        { id: 'mussarela', name: 'Mussarela', description: 'Molho, mussarela, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-mussarela.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'calabresa', name: 'Calabresa', description: 'Molho, mussarela, calabresa e cebola.', category: 'tradicionais', image: 'images/pizza-calabresa.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'frango-catupiry', name: 'Frango c/ Catupiry', description: 'Molho, mussarela, frango, catupiry, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-catupiry.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'frango-com-cheddar', name: 'Frango c/ Cheddar', description: 'Molho, mussarela, frango, cheddar, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-cheddar.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'frango-acebolado', name: 'Frango Acebolado', description: 'Molho, mussarela, frango, cebola, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-acebolado.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'especial-de-frango', name: 'Especial de Frango', description: 'Molho, frango, bacon, mussarela, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-especial-frango.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'tres-queijos', name: 'Três Queijos', description: 'Molho, mussarela, cheddar, catupiry, queijo parmesão, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-tres-queijos.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'bacon', name: 'Bacon', description: 'Molho, mussarela, bacon, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-bacon.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'baiana', name: 'Baiana', description: 'Molho, mussarela, calabresa moída, pimenta, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-baiana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'mista', name: 'Mista', description: 'Molho, mussarela, presunto, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-mista.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'napolitana', name: 'Napolitana', description: 'Molho, mussarela, tomate, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-napolitana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'romana', name: 'Romana', description: 'Molho, mussarela, presunto, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-romana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'carioca', name: 'Carioca', description: 'Molho, mussarela, presunto, milho, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-carioca.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'caipira', name: 'Caipira', description: 'Molho, mussarela, frango desfiado, milho, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-caipira.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'portuguesa', name: 'Portuguesa', description: 'Molho, mussarela, presunto, ovo, cebola, azeitona, orégano.', category: 'tradicionais', image: 'images/pizza-portuguesa.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'quatro-queijos', name: 'Quatro Queijos', description: 'Molho, mussarela, provolone, parmesão, gorgonzola, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-quatro-queijos.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },

        // PIZZAS ESPECIAIS
        { id: 'camarao', name: 'Camarão', description: 'Molho, mussarela, camarão, catupiry, orégano, azeitona.', category: 'especiais', image: 'images/pizza-camarao.jpeg', priceOptions: { media: { size: 'Média', price: 45.00 }, grande: { size: 'Grande', price: 55.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'atum', name: 'Atum', description: 'Molho, mussarela, atum, cebola, orégano, azeitona.', category: 'especiais', image: 'images/pizza-atum.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'nordestina-pizza', name: 'Nordestina', description: 'Molho, mussarela, carne de sol desfiada, orégano, azeitona.', category: 'especiais', image: 'images/pizza-nordestina.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'a-moda', name: 'À Moda', description: 'Molho, mussarela, lombo canadense, bacon, catupiry, milho, azeitona, orégano.', category: 'especiais', image: 'images/pizza-a-moda.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'trindade', name: 'Trindade', description: 'Molho, mussarela, lombo canadense, bacon, catupiry, milho, azeitona, orégano.', category: 'especiais', image: 'images/pizza-trindade.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'italiano', name: 'Italiano', description: 'Molho, mussarela, champignon, queijo, azeitona, orégano.', category: 'especiais', image: 'images/pizza-italiano.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'modada-casa', name: 'Modada da Casa', description: 'Molho, mussarela, charque, creme cheese, azeitona, orégano.', category: 'especiais', image: 'images/pizza-modada-casa.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'strogonoff', name: 'Strogonoff', description: 'Molho, mussarela, frango, milho, batata palha, azeitona, orégano.', category: 'especiais', image: 'images/pizza-strogonoff.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'palermo', name: 'Palermo', description: 'Molho, mussarela, charque, milho, cebola, azeitona, orégano.', category: 'especiais', image: 'images/pizza-palermo.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'grande', allowTwoFlavors: true },

        // PIZZAS DOCES
        { id: 'brigadeiro', name: 'Brigadeiro', description: 'Chocolate, granulado.', category: 'doces', image: 'images/pizza-brigadeiro.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'beijinho', name: 'Beijinho', description: 'Doce de leite, coco ralado.', category: 'doces', image: 'images/pizza-beijinho.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'cartola', name: 'Cartola', description: 'Banana, canela.', category: 'doces', image: 'images/pizza-cartola.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'romeu-e-julieta', name: 'Romeu e Julieta', description: 'Doce de goiaba, catupiry.', category: 'doces', image: 'images/pizza-romeu-e-julieta.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },
        { id: 'm-m', name: 'M&M', description: 'Chocolate, M&M.', category: 'doces', image: 'images/pizza-m-m.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'grande', allowTwoFlavors: true },

        // BORDAS
        { id: 'borda-chocolate', name: 'Borda Recheada de Chocolate', description: 'Recheio cremoso de chocolate na borda.', category: 'bordas', image: 'images/borda-chocolate.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-catupiry', name: 'Borda Recheada de Catupiry', description: 'Recheio cremoso de Catupiry na borda.', category: 'bordas', image: 'images/borda-catupiry.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-cheddar', name: 'Borda Recheada de Cheddar', description: 'Recheio cremoso de Cheddar na borda.', category: 'bordas', image: 'images/borda-cheddar.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-goiabada', name: 'Borda Recheada de Goiabada', description: 'Recheio cremoso de Goiabada na borda.', category: 'bordas', image: 'images/borda-goiabada.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-catupiry-origina', name: 'Borda Especial Catupiry Origina', description: 'Recheio generoso de Catupiry Original na borda.', category: 'bordas', image: 'images/borda-catupiry-origina.jpeg', priceOptions: { unica: { size: 'Única', price: 12.00 } }, defaultSize: 'unica' },
        { id: 'borda-creme-cheese', name: 'Borda Especial Creme Cheese', description: 'Recheio generoso de Creme Cheese na borda.', category: 'bordas', image: 'images/borda-creme-cheese.jpeg', priceOptions: { unica: { size: 'Única', price: 12.00 } }, defaultSize: 'unica' },

        // BEBIDAS
        {
            id: 'refrigerante-coca-1l',
            name: 'Coca-Cola 1L/2L',
            description: 'Coca-Cola tradicional.',
            category: 'bebidas',
            image: 'images/refri-coca-1l.jpeg',
            priceOptions: { '1l': { size: '1L', price: 9.00 }, '2l': { size: '2L', price: 13.00 } },
            defaultSize: '1l'
        },
        {
            id: 'guarana',
            name: 'Guaraná',
            description: 'Refrigerante Guaraná.',
            category: 'bebidas',
            image: 'images/refri-guarana-1l.jpeg',
            priceOptions: { '1l': { size: '1L', price: 7.00 }, '2l': { size: '2L', price: 10.00 } },
            defaultSize: '1l'
        },
        {
            id: 'refrigerante-fanta-1l',
            name: 'Fanta 1L/2L',
            description: 'Fanta Laranja.',
            category: 'bebidas',
            image: 'images/refri-fanta-1l.jpeg',
            priceOptions: { '1l': { size: '1L', price: 8.00 }, '2l': { size: '2L', price: 10.00 } },
            defaultSize: '1l'
        },
        { id: 'refrigerante-em-lata', name: 'Refrigerante em Lata', description: 'Refrigerante em Lata (vários sabores).', category: 'bebidas', image: 'images/refri-em-lata.jpeg', priceOptions: { unica: { size: 'Lata', price: 5.00 } }, defaultSize: 'unica' },
        { id: 'h2o-500ml', name: 'H2O 500ml', description: 'Bebida levemente gaseificada H2O 500ml.', category: 'bebidas', image: 'images/h2o-500ml.jpeg', priceOptions: { unica: { size: '500ml', price: 6.00 } }, defaultSize: 'unica' },
        { id: 'agua-mineral', name: 'Água Mineral 500ml', description: 'Água mineral sem gás 500ml.', category: 'bebidas', image: 'images/agua-mineral.jpeg', priceOptions: { unica: { size: '500ml', price: 2.00 } }, defaultSize: 'unica' }
    ];

    // Força pizzas a abrirem com 'Grande' como padrão
    (function () {
        try {
            menuItems.forEach(item => {
                if (["tradicionais", "especiais", "doces"].includes(item.category)) {
                    item.allowTwoFlavors = true;
                    item.defaultSize = 'grande';
                }
            });
        } catch (e) { console.warn('Default grande patch:', e); }
    })();

    // =========================
    // COMBOS (agora com includesBeverage)
    // =========================
    const comboItems = [
        {
            id: 'combo-pizza-refri',
            name: 'Combo Pizza + Refri 1L',
            description: '1 Pizza Grande + 1 Refrigerante Guaraná 1L.',
            price: 36.00,
            image: 'images/combo-pizza-refri.jpeg',
            pizzasIncluded: 1,
            includesBeverage: true // <- ESTE dispensa o lembrete
        },
        {
            id: 'combo-dupla',
            name: 'Combo Pizza Dupla',
            description: '2 Pizzas Grandes Tradicionais.',
            price: 60.00,
            image: 'images/combo-pizza-dupla.jpeg',
            pizzasIncluded: 2,
            includesBeverage: false // <- NÃO dispensa o lembrete
        }
    ];

    // =========================
    // ESTADO & ELEMENTOS
    // =========================
    let cart = [];
    let currentModalItem = null;
    let currentModalQuantity = 1;
    let currentComboAdding = null;

    const logoContainer = document.querySelector('header .logo-container');

    // Tornar o logo "clicável" como HOME, inclusive via teclado
    if (logoContainer) {
        logoContainer.setAttribute('role', 'button');
        logoContainer.setAttribute('aria-label', 'Ir para o início');
        logoContainer.style.cursor = 'pointer';
        logoContainer.tabIndex = 0;
        logoContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToSection('hero');
                document.getElementById('promocoes')?.classList.remove('hidden');
                document.getElementById('cardapio')?.classList.remove('hidden');
            }
        });
    }
    const viewCartBtn = document.getElementById('view-cart-btn');
    const cartItemCount = document.getElementById('cart-item-count');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const cartSection = document.getElementById('cart');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const deliveryFeeSpan = document.getElementById('delivery-fee');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const backToCartBtn = document.getElementById('back-to-cart-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const deliveryOptionDelivery = document.getElementById('delivery-option-delivery');
    const deliveryAddressGroup = document.getElementById('delivery-address-group');
    const changeForGroup = document.getElementById('change-for-group');
    const paymentMoney = document.getElementById('payment-money');
    const paymentPix = document.getElementById('payment-pix');

    // Modal de item
    const itemDetailModal = document.getElementById('item-detail-modal');
    const closeModalBtn = itemDetailModal.querySelector('.close-button');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemOptions = document.getElementById('modal-item-options');
    const modalItemNotes = document.getElementById('item-notes');
    const modalPriceValue = document.getElementById('modal-price-value');
    const decreaseQuantityModalBtn = itemDetailModal.querySelector('.decrease-quantity-modal');
    const increaseQuantityModalBtn = itemDetailModal.querySelector('.increase-quantity-modal');
    const currentQuantityModalSpan = itemDetailModal.querySelector('.current-quantity-modal');
    const addToCartModalBtn = document.getElementById('add-to-cart-modal-btn');

    // Modal de sabores do combo
    const comboFlavorModal = document.getElementById('combo-flavor-modal');
    const closeComboModalBtn = document.getElementById('close-combo-modal');
    const comboModalTitle = document.getElementById('combo-modal-title');
    const flavorSelectionContainer = document.getElementById('flavor-selection-container');
    const addComboToCartBtn = document.getElementById('add-combo-to-cart-btn');

    const tradicionaisPizzas = menuItems.filter(item => item.category === 'tradicionais');
    const especiaisPizzas = menuItems.filter(item => item.category === 'especiais');
    const comboEligiblePizzas = [...tradicionaisPizzas, ...especiaisPizzas];

    // =========================
    // UTILS
    // === Helpers (meio a meio por MÉDIA) ===
    function _np_findItemByName(name) {
        try { return menuItems.find(i => i.name === name); } catch(e){ return null; }
    }
    function _np_priceBy(sizeKey, item) {
        try { return item && item.priceOptions && item.priceOptions[sizeKey] ? item.priceOptions[sizeKey].price : 0; } catch(e){ return 0; }
    }
    function _np_computeHalfHalfAverage(sizeKey, flavor1Name, flavor2Name, fallbackItem) {
        const itemA = _np_findItemByName(flavor1Name) || fallbackItem;
        const pA = _np_priceBy(sizeKey, itemA);
        if (!flavor2Name) return pA || _np_priceBy(sizeKey, fallbackItem);
        const itemB = _np_findItemByName(flavor2Name);
        const pB = _np_priceBy(sizeKey, itemB);
        // Regra: MÉDIA aritmética dos dois sabores
        return (pA + pB) / 2;
    }
    function _np_updateCardPriceDisplay(itemId, newPrice) {
        try {
            const card = document.querySelector('.menu-item-card[data-item-id="' + itemId + '"]');
            if (!card) return;
            const priceEl = card.querySelector('.item-price');
            if (!priceEl) return;
            priceEl.textContent = 'R$ ' + formatCurrency(newPrice);
        } catch(e) {}
    }

    // =========================
    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }

    function showToast(message) {
        // Criar container se não existir
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Criar toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Adicionar ao container
        toastContainer.appendChild(toast);
        
        // Ativar animação
        setTimeout(() => toast.classList.add('active'), 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    function showMainContent() {
        // Mostra todas as seções principais, exceto o carrinho e a confirmação
        document.getElementById('hero').style.display = 'block';
        document.getElementById('promocoes').style.display = 'block';
        document.getElementById('cardapio').style.display = 'block';
        document.getElementById('menu-navigation').style.display = 'block'; // Garante que o menu de navegação seja exibido
        document.getElementById('cart').classList.add('hidden');
        document.getElementById('checkout').classList.add('hidden');
        document.getElementById('order-confirmation').classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Adiciona o listener de evento para o botão 'Continuar Comprando'
    continueShoppingBtn.addEventListener('click', showMainContent);

    
// Mostrar/ocultar filtros de bebidas conforme categoria ativa
function toggleBebidasFiltros(category) {
    const filtros = document.getElementById('bebidas-filtros');
    if (!filtros) return;
    // Sempre ocultar os filtros de bebidas
    filtros.classList.add('hidden');
}

function renderMenuItems(category = 'tradicionais') {
        menuItemsContainer.innerHTML = '';
        const itemsToRender = menuItems.filter(item => item.category === category);
        if (itemsToRender.length === 0) {
            menuItemsContainer.innerHTML = '<p class="no-items-message">Nenhum item encontrado nesta categoria.</p>';
            return;
        }

        // Caso especial: BEBIDAS com tamanhos 1L e 2L separados em cards distintos
        if (category === 'bebidas') {
            itemsToRender.forEach(item => {
                let criouVariantes = false;

                ['1l','2l'].forEach(sizeKey => {
                    if (item.priceOptions && item.priceOptions[sizeKey]) {
                        criouVariantes = true;
                        const card = document.createElement('div');
                        card.classList.add('menu-item-card');
                        card.dataset.itemId = item.id;
                        card.dataset.itemCategory = item.category;
                        card.dataset.sizeKey = sizeKey;

                        // Tenta limpar sufixo "1L/2L" do nome original para evitar repetição
                        let baseName = item.name.replace(/\s*1L\/2L\s*/gi, '').trim();
                        if (!baseName) baseName = item.name;
                        const displayName = baseName + ' ' + item.priceOptions[sizeKey].size;

                        const price = item.priceOptions[sizeKey].price;
                        card.innerHTML = `
                            <img src="${item.image}" alt="${displayName}">
                            <div class="item-info">
                                <h4>${displayName}</h4>
                                <p>${item.description}</p>
                                <p class="item-price">R$ ${formatCurrency(price)}</p>
                            </div>
                        `;
                        menuItemsContainer.appendChild(card);
                    }
                });

                // Itens sem 1L/2L continuam aparecendo normalmente (ex.: Lata, Água/Suco)
                if (!criouVariantes) {
                    const card = document.createElement('div');
                    card.classList.add('menu-item-card');
                    card.dataset.itemId = item.id;
                    card.dataset.itemCategory = item.category;
                    const defaultPrice = item.priceOptions[item.defaultSize]?.price || Object.values(item.priceOptions)[0].price;
                    card.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                            <p class="item-price">R$ ${formatCurrency(defaultPrice)}</p>
                        </div>
                    `;
                    menuItemsContainer.appendChild(card);
                }
            });
        } else {
            // Demais categorias: comportamento padrão (um card por item)
            itemsToRender.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('menu-item-card');
                card.dataset.itemId = item.id;
                card.dataset.itemCategory = item.category;
                const defaultPrice = item.priceOptions[item.defaultSize]?.price || Object.values(item.priceOptions)[0].price;
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <p class="item-price">R$ ${formatCurrency(defaultPrice)}</p>
                    </div>
                `;
                menuItemsContainer.appendChild(card);
            });
        }

        // Clique abre o modal já com o tamanho pré-selecionado (se houver)
        document.querySelectorAll('.menu-item-card').forEach(card => {
            const preSize = card.dataset.sizeKey ? card.dataset.sizeKey : null;
            card.addEventListener('click', () => openItemDetailModal(card.dataset.itemId, preSize));
        });
    }
// =========================
    // CARRINHO
    // =========================
    function updateCart() {
        cartItemsDiv.innerHTML = '';
        let subtotal = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.quantity}x ${item.name}</h4>
                        <p>${item.selectedSize ? item.selectedSize.size : ''} ${item.options || ''}</p>
                    </div>
                    <p class="cart-item-price">R$ ${formatCurrency(item.price * item.quantity)}</p>
                    <div class="cart-item-quantity-control">
                        <button data-index="${index}" class="decrease-cart-item">-</button>
                        <span>${item.quantity}</span>
                        <button data-index="${index}" class="increase-cart-item">+</button>
                    </div>
                `;
                cartItemsDiv.appendChild(cartItemDiv);
                subtotal += item.price * item.quantity;
                itemCount += item.quantity;
            });
        }

        const total = subtotal; // Não adicionar taxa automaticamente
        cartSubtotalSpan.textContent = formatCurrency(subtotal);
        cartTotalSpan.textContent = formatCurrency(total);
        cartItemCount.textContent = itemCount;

        // Adicionar mensagem informativa sobre taxa de entrega
        const deliveryInfoDiv = document.getElementById('delivery-info-message');
        if (deliveryInfoDiv && itemCount > 0) {
            deliveryInfoDiv.innerHTML = '💡 Se escolher entrega em domicílio, será acrescida uma taxa de R$ 3,00';
            deliveryInfoDiv.classList.remove('hidden');
        } else if (deliveryInfoDiv) {
            deliveryInfoDiv.classList.add('hidden');
        }

        // Sempre manter carrinho visível
        const cartButton = document.getElementById('view-cart-btn');
        cartButton.classList.remove('cart-empty');
        // Adicionar animação de pulse no contador quando item é adicionado
        if (itemCount > 0) {
            const cartCount = cartButton.querySelector('.cart-count');
            cartCount.style.animation = 'none';
            setTimeout(() => {
                cartCount.style.animation = 'pulse 0.5s ease-in-out';
            }, 10);
        }

        const cartCtaMessage = document.getElementById('cart-cta-message');

        if (itemCount > 0) {
            viewCartBtn.classList.add('cart-with-items');

            // *** Regra do lembrete: só conta bebida OU combo com bebida (Combo 1) ***
            const hasBeverage = cart.some(item =>
                item.category === 'bebidas' || item.includesBeverage === true
            );

            if (!hasBeverage) {
                // IMPORTANTE: usa return no onclick e previne o default
                cartCtaMessage.innerHTML =
                    '🥤 Que tal uma bebida gelada para acompanhar? ' +
                    '<a href="#" onclick="return showBeverages(event)" style="color: white; text-decoration: underline;">Ver bebidas</a>';
                cartCtaMessage.classList.remove('hidden');
            } else {
                cartCtaMessage.innerHTML =
                    '🎉 Ótima escolha! Clique em "Finalizar Pedido" para concluir seu pedido.';
                cartCtaMessage.classList.remove('hidden');
            }

            checkoutBtn.classList.add('checkout-btn-enhanced');
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        } else {
            viewCartBtn.classList.remove('cart-with-items');
            cartCtaMessage.classList.add('hidden');
            checkoutBtn.classList.remove('checkout-btn-enhanced');
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        }

        // quantidade -/+
        document.querySelectorAll('.decrease-cart-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        document.querySelectorAll('.increase-cart-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart[index].quantity++;
                updateCart();
            });
        });

        // botão finalizar
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        }
        if (typeof updateCartWithDelivery === 'function') { try { updateCartWithDelivery(); } catch(e){} }
    }

    // Detalhe do item
    function openItemDetailModal(itemId, preselectSizeKey = null) {
        currentModalItem = menuItems.find(item => item.id === itemId);
        if (!currentModalItem) return;

        modalItemImage.src = currentModalItem.image;
        modalItemName.textContent = currentModalItem.name;
        modalItemDescription.textContent = currentModalItem.description;
        modalItemNotes.value = '';
        modalItemOptions.innerHTML = '';

        // Sabores (meio a meio)
        if (currentModalItem.allowTwoFlavors) {
            const flavorSelectionDiv = document.createElement("div");
            flavorSelectionDiv.classList.add("flavor-selection-group");
            flavorSelectionDiv.innerHTML = `
                <p><strong>Você pode incluir até dois sabores.</strong></p>
                <label for="flavor1-select">Sabor 1:</label>
                <select id="flavor1-select" required>
                    <option value="${currentModalItem.name}">${currentModalItem.name}</option>
                </select>
                <label for="flavor2-select">Sabor 2 (Opcional):</label>
                <select id="flavor2-select">
                    <option value="">Nenhum (apenas ${currentModalItem.name})</option>
                </select>
            `;
            modalItemOptions.appendChild(flavorSelectionDiv);
            try {
                const __f1 = document.getElementById('flavor1-select');
                const __f2 = document.getElementById('flavor2-select');
                const __size = () => (document.getElementById('modal-item-size-select') ? document.getElementById('modal-item-size-select').value : (Object.keys(currentModalItem.priceOptions)[0]));
                const __refresh = () => {
                    const f1 = __f1 ? (__f1.value || currentModalItem.name) : currentModalItem.name;
                    const f2 = __f2 ? (__f2.value || '') : '';
                    const unit = f2 ? _np_computeHalfHalfAverage(__size(), f1, f2, currentModalItem) : _np_priceBy(__size(), currentModalItem);
                    try { modalPriceValue.textContent = formatCurrency(unit * currentModalQuantity); } catch(e){}
                };
                __f1 && __f1.addEventListener('change', __refresh);
                __f2 && __f2.addEventListener('change', __refresh);
            } catch(e){}
            // Recalcula preço (MÉDIA) ao mudar sabores/tamanho - não substitui handlers existentes
            function _np_refreshModalPriceAverage() {
                try {
                    const sizeSel = document.getElementById('modal-item-size-select');
                    const sizeKey = sizeSel ? sizeSel.value : (Object.keys(currentModalItem.priceOptions)[0]);
                    const f1El = document.getElementById('flavor1-select');
                    const f2El = document.getElementById('flavor2-select');
                    const flavor1 = f1El && f1El.value ? f1El.value : currentModalItem.name;
                    const flavor2 = f2El && f2El.value ? f2El.value : '';
                    const unit = _np_computeHalfHalfAverage(sizeKey, flavor1, flavor2, currentModalItem);
                    // Apenas atualiza a exibição; não altera a lógica de carrinho existente
                    try { modalPriceValue.textContent = formatCurrency(unit * currentModalQuantity); } catch(e){}
                    _np_updateCardPriceDisplay(currentModalItem.id, unit);
                } catch(e){}
            }
            try {
                document.getElementById('flavor1-select')?.addEventListener('change', _np_refreshModalPriceAverage);
                document.getElementById('flavor2-select')?.addEventListener('change', _np_refreshModalPriceAverage);
            } catch(e){}


            const flavor1Select = document.getElementById("flavor1-select");
            const flavor2Select = document.getElementById("flavor2-select");

            let availableFlavors = [];
            if (currentModalItem.category === 'tradicionais' || currentModalItem.category === 'especiais') {
                availableFlavors = menuItems.filter(item =>
                    (item.category === 'tradicionais' || item.category === 'especiais') &&
                    item.id !== currentModalItem.id
                );
            } else if (currentModalItem.category === 'doces') {
                availableFlavors = menuItems.filter(item =>
                    item.category === 'doces' &&
                    item.id !== currentModalItem.id
                );
            }

            availableFlavors.forEach(flavor => {
                const option1 = document.createElement("option");
                option1.value = flavor.name;
                option1.textContent = flavor.name;
                flavor1Select.appendChild(option1);
            });
            availableFlavors.forEach(flavor => {
                const option2 = document.createElement("option");
                option2.value = flavor.name;
                option2.textContent = flavor.name;
                flavor2Select.appendChild(option2);
            });
        }

        // Tamanho
        const priceKeys = Object.keys(currentModalItem.priceOptions);
        if (priceKeys.length > 1) {
            const selectLabel = document.createElement('label');
            selectLabel.textContent = 'Tamanho:';
            selectLabel.setAttribute('for', 'modal-item-size-select');

            const select = document.createElement('select');
            select.id = 'modal-item-size-select';

            priceKeys.forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${currentModalItem.priceOptions[key].size} - R$ ${formatCurrency(currentModalItem.priceOptions[key].price)}`;
                select.appendChild(option);
            });

            const defaultKey = (preselectSizeKey && priceKeys.includes(preselectSizeKey))
                ? preselectSizeKey
                : (priceKeys.includes('grande') ? 'grande' : currentModalItem.defaultSize);
            select.value = defaultKey;

            select.addEventListener('change', (e) => {
                const f1El = document.getElementById('flavor1-select');
                const f2El = document.getElementById('flavor2-select');
                const flavor1 = f1El ? (f1El.value || currentModalItem.name) : currentModalItem.name;
                const flavor2 = f2El ? (f2El.value || '') : '';
                const unit = flavor2 ? _np_computeHalfHalfAverage(e.target.value, flavor1, flavor2, currentModalItem) : currentModalItem.priceOptions[e.target.value].price;
                modalPriceValue.textContent = formatCurrency(unit * currentModalQuantity);
            });

            modalItemOptions.appendChild(selectLabel);
            modalItemOptions.appendChild(select);
            try {
                select.addEventListener('change', function(){
                    if (typeof _np_refreshModalPriceAverage === 'function') _np_refreshModalPriceAverage();
                });
            } catch(e){}

        } else {
            const singleOption = document.createElement('p');
            singleOption.textContent = `Tamanho: ${currentModalItem.priceOptions[priceKeys[0]].size}`;
            modalItemOptions.appendChild(singleOption);
        }

        currentModalQuantity = 1;
        currentQuantityModalSpan.textContent = currentModalQuantity;
        try { if (typeof _np_refreshModalPriceAverage === 'function') _np_refreshModalPriceAverage(); } catch(e){}


        const initialSizeKey = (preselectSizeKey && Object.keys(currentModalItem.priceOptions).includes(preselectSizeKey)) ? preselectSizeKey : (Object.keys(currentModalItem.priceOptions).includes('grande') ? 'grande' : currentModalItem.defaultSize);
        modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[initialSizeKey]?.price || Object.values(currentModalItem.priceOptions)[0].price);

        itemDetailModal.classList.add('active');
    }

    function closeItemDetailModal() {
        itemDetailModal.classList.remove('active');
        currentModalItem = null;
        currentModalQuantity = 1;
        modalItemNotes.value = '';
        document.getElementById('modal-item-size-select')?.removeEventListener('change', null);
    }

    addToCartModalBtn.addEventListener('click', () => {
        if (!currentModalItem) return;

        const selectedSizeElement = document.getElementById('modal-item-size-select');
        let selectedSizeKey = Object.keys(currentModalItem.priceOptions).includes('grande') ? 'grande' : currentModalItem.defaultSize;
        if (selectedSizeElement) selectedSizeKey = selectedSizeElement.value;

        const itemNotes = modalItemNotes.value.trim();

        let flavorOptions = '';
        if (currentModalItem.allowTwoFlavors) {
            const flavor1Select = document.getElementById('flavor1-select');
            const flavor2Select = document.getElementById('flavor2-select');
            const flavor1 = flavor1Select ? flavor1Select.value : currentModalItem.name;
            const flavor2 = flavor2Select ? flavor2Select.value : '';
            if (flavor2) {
                flavorOptions = `(Meio a meio: ${flavor1} + ${flavor2})`;
            } else {
                flavorOptions = `(${flavor1})`;
            }
        }

        
        const itemToAdd = {
            id: currentModalItem.id + (selectedSizeKey ? '-' + selectedSizeKey : '') + (flavorOptions ? '-' + flavorOptions.replace(/\s/g, '_').replace(/[()]/g, '') : '') + (itemNotes ? '-' + itemNotes.replace(/\s/g, '_') : ''),
            name: currentModalItem.name,
            price: (function(){
                const f1El = document.getElementById('flavor1-select');
                const f2El = document.getElementById('flavor2-select');
                const flavor1 = f1El ? (f1El.value || currentModalItem.name) : currentModalItem.name;
                const flavor2 = f2El ? (f2El.value || '') : '';
                if (flavor2) {
                    return _np_computeHalfHalfAverage(selectedSizeKey, flavor1, flavor2, currentModalItem);
                }
                return currentModalItem.priceOptions[selectedSizeKey].price;
            })(),
            quantity: currentModalQuantity,
            selectedSize: currentModalItem.priceOptions[selectedSizeKey],
            options: (flavorOptions + (itemNotes ? ` (Obs: ${itemNotes})` : '')).trim(),
            category: currentModalItem.category
        };

        const existingItemIndex = cart.findIndex(item => item.id === itemToAdd.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += itemToAdd.quantity;
        } else {
            cart.push(itemToAdd);
        }

        updateCart();
        closeItemDetailModal();
        showToast(`"${itemToAdd.name}" adicionado ao carrinho!`);
    });

    // =========================
    // COMBO (modal de sabores)
    // =========================
    document.querySelectorAll('.add-to-cart-promo').forEach(button => {
        button.addEventListener('click', (e) => {
            const comboId = e.target.dataset.itemId;
            currentComboAdding = comboItems.find(c => c.id === comboId);
            const eligible = (currentComboAdding && currentComboAdding.id === 'combo-dupla') ? tradicionaisPizzas : (typeof comboEligiblePizzas !== 'undefined' ? comboEligiblePizzas : [...tradicionaisPizzas, ...especiaisPizzas]);
            if (!currentComboAdding) {
                console.error('Combo não encontrado:', comboId);
                return;
            }

            comboModalTitle.textContent = currentComboAdding.name;
            flavorSelectionContainer.innerHTML = '';

            for (let i = 0; i < currentComboAdding.pizzasIncluded; i++) {
                const flavorGroup = document.createElement('div');
                flavorGroup.classList.add('pizza-flavor-selector-group');
                flavorGroup.innerHTML = `
                    <h5>Pizza ${i + 1}</h5>
                    <label for="combo-flavor1-${i}">Sabor 1:</label>
                    <select id="combo-flavor1-${i}" class="pizza-flavor-select" required>
                        <option value="">Selecione o sabor</option>
                        ${eligible.map(pizza => `<option value="${pizza.name}">${pizza.name}</option>`).join('')}
                    </select>
                    <label for="combo-flavor2-${i}">Sabor 2 (Opcional - Meio a meio):</label>
                    <select id="combo-flavor2-${i}" class="pizza-flavor-select-optional">
                        <option value="">Nenhum</option>
                        ${eligible.map(pizza => `<option value="${pizza.name}">${pizza.name}</option>`).join('')}
                    </select>
                `;
                flavorSelectionContainer.appendChild(flavorGroup);
            }

            comboFlavorModal.classList.add('active');
            updateAddComboToCartButton();
        });
    });

    function updateAddComboToCartButton() {
        const selects = flavorSelectionContainer.querySelectorAll('.pizza-flavor-select');
        let allSelected = true;
        selects.forEach(select => { if (!select.value) allSelected = false; });
        if (allSelected) {
            addComboToCartBtn.disabled = false;
            addComboToCartBtn.classList.remove('disabled');
        } else {
            addComboToCartBtn.disabled = true;
            addComboToCartBtn.classList.add('disabled');
        }
        if (typeof updateCartWithDelivery === 'function') { try { updateCartWithDelivery(); } catch(e){} }
    }
    flavorSelectionContainer.addEventListener('change', updateAddComboToCartButton);

    addComboToCartBtn.addEventListener('click', () => {
        const flavorGroups = flavorSelectionContainer.querySelectorAll('.pizza-flavor-selector-group');
        const selectedFlavors = Array.from(flavorGroups).map((group, index) => {
            const flavor1Select = group.querySelector(`#combo-flavor1-${index}`);
            const flavor2Select = group.querySelector(`#combo-flavor2-${index}`);
            const flavor1 = flavor1Select ? flavor1Select.value : '';
            const flavor2 = flavor2Select ? flavor2Select.value : '';
            return flavor2 ? `Meio a meio: ${flavor1} + ${flavor2}` : (flavor1 || 'Sabor não selecionado');
        });

        const comboOptions = `(Sabores: ${selectedFlavors.join(', ')})`;
        // Cálculo de preço do Combo baseado nos sabores selecionados (Grande) e regra de meio a meio
        function getMenuItemByName(nm) {
            return menuItems.find(it => it.name === nm);
        }
        let computedPrice = 0;
        selectedFlavors.forEach(sf => {
            if (sf.startsWith('Meio a meio:')) {
                const parts = sf.replace('Meio a meio:', '').split('+').map(s => s.trim());
                const a = getMenuItemByName(parts[0]);
                const b = getMenuItemByName(parts[1]);
                const pa = a && a.priceOptions?.grande?.price ? a.priceOptions.grande.price : 0;
                const pb = b && b.priceOptions?.grande?.price ? b.priceOptions.grande.price : 0;
                computedPrice += (pa / 2) + (pb / 2);
            } else {
                const it = getMenuItemByName(sf);
                const p = it && it.priceOptions?.grande?.price ? it.priceOptions.grande.price : currentComboAdding.price;
                computedPrice += p;
            }
        });


        const itemToAdd = {
            id: currentComboAdding.id + '-' + selectedFlavors.map(f => f.replace(/\s/g, '_').replace(/[():]/g, '')).join('-'),
            name: currentComboAdding.name,
            price: computedPrice,
            quantity: 1,
            selectedSize: null,
            options: comboOptions,
            isCombo: true,
            includesBeverage: !!currentComboAdding.includesBeverage, // <- marca se este combo inclui bebida
            category: 'combo'
        };

        cart.push(itemToAdd);
        updateCart();
        showToast(`"${currentComboAdding.name}" adicionado ao carrinho!`);
        closeComboFlavorModal();
    });

    function closeComboFlavorModal() {
        comboFlavorModal.classList.remove('active');
        currentComboAdding = null;
    }
    closeComboModalBtn.addEventListener('click', closeComboFlavorModal);

    // Event listener para fechar modal de item (CORREÇÃO DO BUG)
    closeModalBtn.addEventListener('click', closeItemDetailModal);

    // Event listeners para botões de quantidade do modal
    decreaseQuantityModalBtn.addEventListener('click', () => {
        if (currentModalQuantity > 1) {
            currentModalQuantity--;
            currentQuantityModalSpan.textContent = currentModalQuantity;
            
            // Atualizar preço
            const selectedSizeElement = document.getElementById('modal-item-size-select');
            let selectedSizeKey = Object.keys(currentModalItem.priceOptions).includes('grande') ? 'grande' : currentModalItem.defaultSize;
            if (selectedSizeElement) selectedSizeKey = selectedSizeElement.value;
            
            modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[selectedSizeKey].price * currentModalQuantity);
        }
    });

    increaseQuantityModalBtn.addEventListener('click', () => {
        currentModalQuantity++;
        currentQuantityModalSpan.textContent = currentModalQuantity;
        
        // Atualizar preço
        const selectedSizeElement = document.getElementById('modal-item-size-select');
        let selectedSizeKey = Object.keys(currentModalItem.priceOptions).includes('grande') ? 'grande' : currentModalItem.defaultSize;
        if (selectedSizeElement) selectedSizeKey = selectedSizeElement.value;
        
        modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[selectedSizeKey].price * currentModalQuantity);
    });

    // Fechar modal clicando fora dele
    itemDetailModal.addEventListener('click', (e) => {
        if (e.target === itemDetailModal) {
            closeItemDetailModal();
        }
    });

    comboFlavorModal.addEventListener('click', (e) => {
        if (e.target === comboFlavorModal) {
            closeComboFlavorModal();
        }
    });

    // =========================
    // NAVEGAÇÃO / BOTÕES
    // =========================
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Só processa se o botão tem data-category (ignora filtros de bebidas)
            if (!btn.dataset.category) return;
            
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            renderMenuItems(cat);
            if (typeof toggleBebidasFiltros === 'function') toggleBebidasFiltros(cat);
            
            // Fazer scroll automático para a seção do cardápio com delay para garantir renderização
            setTimeout(() => {
                document.getElementById('menu-navigation')?.classList.add('compact');
                _np_scrollToCardapioWithOffset();
            }, 80);
        });
    });

    viewCartBtn.addEventListener('click', () => {
        navigateToSection('cart');
        updateCart();
    });

    continueShoppingBtn.addEventListener('click', () => {
        document.getElementById('menu-navigation')?.classList.add('compact');
        navigateToSection('cardapio');
        document.getElementById('hero').classList.remove('hidden');
        document.getElementById('promocoes').classList.remove('hidden');
    });

    backToCartBtn.addEventListener('click', () => {
        navigateToSection('cart');
    });

    logoContainer.addEventListener('click', () => {
        document.getElementById('menu-navigation')?.classList.remove('compact');
        navigateToSection('hero');
        document.getElementById('promocoes').classList.remove('hidden');
        document.getElementById('cardapio').classList.remove('hidden');
        document.querySelector('.menu-cat-btn.active')?.classList.remove('active');
        document.querySelector('.menu-cat-btn[data-category="tradicionais"]')?.classList.add('active');
        renderMenuItems('tradicionais');
    });

    checkoutBtn.addEventListener('click', () => {
        navigateToSection('checkout');
        updateCartWithDelivery();
    });

    function updateCartWithDelivery() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = deliveryOptionDelivery.checked ? ENTREGA_PADRAO : 0;
        const total = subtotal + deliveryFee;

        // Atualizar elementos da página de checkout
        const checkoutSubtotalSpan = document.getElementById('checkout-subtotal');
        const checkoutDeliveryFeeSpan = document.getElementById('checkout-delivery-fee');
        const checkoutTotalSpan = document.getElementById('checkout-total');
        
        if (checkoutSubtotalSpan) checkoutSubtotalSpan.textContent = formatCurrency(subtotal);
        if (checkoutDeliveryFeeSpan) checkoutDeliveryFeeSpan.textContent = formatCurrency(deliveryFee);
        if (checkoutTotalSpan) checkoutTotalSpan.textContent = formatCurrency(total);
        
        // Mostrar/ocultar linha da taxa de entrega
        const deliveryFeeRow = document.getElementById('delivery-fee-row');
        if (deliveryFeeRow) {
            if (deliveryOptionDelivery.checked) {
                deliveryFeeRow.classList.remove('hidden');
            } else {
                deliveryFeeRow.classList.add('hidden');
            }
        }
        
        // Atualizar também o carrinho principal (sem taxa)
        cartSubtotalSpan.textContent = formatCurrency(subtotal);
        cartTotalSpan.textContent = formatCurrency(subtotal); // Sempre subtotal no carrinho
    }

    document.querySelectorAll('input[name="delivery-option"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (deliveryOptionDelivery.checked) {
                deliveryAddressGroup.classList.remove('hidden');
                deliveryAddressGroup.querySelectorAll('input').forEach(input => input.required = true);
            } else {
                deliveryAddressGroup.classList.add('hidden');
                deliveryAddressGroup.querySelectorAll('input').forEach(input => input.required = false);
            }
            updateCartWithDelivery();
        });
    });

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (paymentMoney.checked) {
                changeForGroup.classList.remove('hidden');
            } else {
                changeForGroup.classList.add('hidden');
                document.getElementById('change-for').value = '';
            }
        });
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            showToast('Seu carrinho está vazio!');
            return;
        }

        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const orderNotes = document.getElementById('order-notes').value.trim();

        if (!customerName || !customerPhone) {
            showToast('Por favor, preencha seu nome e telefone.');
            return;
        }
        if (deliveryOption === 'delivery') {
            const customerAddress = document.getElementById('customer-address').value.trim();
            const customerNeighborhood = document.getElementById('customer-neighborhood').value.trim();
            if (!customerAddress || !customerNeighborhood) {
                showToast('Por favor, preencha o endereço completo para entrega.');
                return;
            }
        }

        let addressDetails = '';
        if (deliveryOption === 'delivery') {
            const customerAddress = document.getElementById('customer-address').value.trim();
            const customerNeighborhood = document.getElementById('customer-neighborhood').value.trim();
            const customerComplement = document.getElementById('customer-complement').value.trim();
            addressDetails = `\nEndereço: ${customerAddress}, ${customerNeighborhood}${customerComplement ? ' (' + customerComplement + ')' : ''}`;
        } else {
            addressDetails = '\nOpção: Retirada no Local';
        }

        let paymentDetails = '';
        if (paymentMethod === 'money') {
            const changeFor = document.getElementById('change-for').value.trim();
            if (changeFor && parseFloat(changeFor) > 0) {
                paymentDetails = `\nTroco para: R$ ${formatCurrency(parseFloat(changeFor))}`;
            } else {
                paymentDetails = '\nDinheiro (sem troco especificado)';
            }
        } else if (paymentMethod === 'card') {
            paymentDetails = '\nCartão na Entrega';
        } else if (paymentMethod === 'pix') {
            const pixKey = '81982687572';
            const pixName = 'Elisandra Ferreira de Andrade';
            const pixBank = 'Banco do Brasil';
            paymentDetails = `\nPIX (Favor enviar para):\nChave: ${pixKey}\nNome: ${pixName}\nBanco: ${pixBank}`;
        }

        let message = `*NOVO PEDIDO - Nordestino Pizzaria*\n\n`;
        message += `*Cliente:* ${customerName}\n`;
        message += `*Contato:* ${customerPhone}\n\n`;

        message += `*Itens do Pedido:*\n`;
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} ${item.selectedSize ? '(' + item.selectedSize.size + ')' : ''} ${item.options || ''} = R$ ${formatCurrency(item.price * item.quantity)}\n`;
        });

        message += `\n*Resumo Financeiro:*\n`;
        message += `Subtotal: R$ ${cartSubtotalSpan.textContent}\n`;
        if (deliveryOption === 'delivery') {
            const deliveryFeeText = document.getElementById('delivery-fee')?.textContent || '0,00';
            message += `Taxa de Entrega: R$ ${deliveryFeeText}\n`;
        }
        message += `*Total: R$ ${cartTotalSpan.textContent}*\n\n`;

        message += `*Detalhes da Entrega:*\n`;
        message += `${deliveryOption === 'delivery' ? 'Entrega em domicílio' : 'Retirada no local'}${addressDetails}\n`;
        message += `*Pagamento:* ${paymentMethod === 'money' ? 'Dinheiro' : (paymentMethod === 'card' ? 'Cartão na entrega' : 'PIX')}${paymentDetails}\n\n`;

        if (orderNotes) {
            message += `*Observações do Pedido (Geral):* ${orderNotes}\n\n`;
        }

        message += `_Pedido enviado via App da Pizzaria._`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${PIZZARIA_WHATSAPP}&text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        setTimeout(() => {
            cart = [];
            updateCart();
            checkoutForm.reset();
            deliveryAddressGroup.classList.remove('hidden');
            changeForGroup.classList.add('hidden');
            navigateToSection('order-confirmation');
        }, 500);
    });

    // =========================
    // HORÁRIO DE FUNCIONAMENTO
    // =========================
    function checkOperatingHours() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour + (currentMinute / 60);

        let isOpen = false;
        let message = '';

        if (dayOfWeek === 1) {
            message = '🍕 Olá! Estamos fechados às segundas-feiras, mas você pode agendar seu pedido para amanhã! Funcionamento: Terça a Sábado: 18h às 22h | Domingo: 17h às 22h';
        } else if (dayOfWeek >= 2 && dayOfWeek <= 6) {
            if (currentTime >= 18 && currentTime < 22) {
                isOpen = true;
            } else {
                message = '🕐 Estamos fora do horário de atendimento, mas você pode agendar seu pedido! Funcionamento: Terça a Sábado: 18h às 22h | Domingo: 17h às 22h';
            }
        } else if (dayOfWeek === 0) {
            if (currentTime >= 17 && currentTime < 22) {
                isOpen = true;
            } else {
                message = '🕐 Estamos fora do horário de atendimento, mas você pode agendar seu pedido! Funcionamento: Terça a Sábado: 18h às 22h | Domingo: 17h às 22h';
            }
        }

        if (!isOpen && message) showOperatingHoursAlert(message);
    }

    function showOperatingHoursAlert(message) {
        const existingAlert = document.querySelector('.operating-hours-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = 'operating-hours-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-message">${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.insertBefore(alert, document.body.firstChild);
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================
    renderMenuItems(); // Tradicionais por padrão
    updateCart();
    checkOperatingHours();
    document.querySelector('.category-btn[data-category="tradicionais"]').classList.add('active');

    // *** FUNÇÃO GLOBAL corrigida: abre a aba "Bebidas" ***
    function showBeverages(ev) {
        if (ev) ev.preventDefault();
        // Mostrar seção cardápio
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        document.getElementById('cardapio').classList.remove('hidden');
        // Ativar botão de bebidas e disparar o clique (reuso do listener da categoria)
        const bebidasBtn = document.querySelector('.category-btn[data-category="bebidas"]');
        if (bebidasBtn) {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            bebidasBtn.classList.add('active');
            bebidasBtn.click(); // renderiza os itens de bebidas
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }
    // expõe a função para o onclick do link
    window.showBeverages = showBeverages;
});


try {
    checkoutBtn.addEventListener('click', () => {
        setTimeout(()=>document.getElementById('customer-name')?.focus(), 0);
        if (typeof updateCartWithDelivery === 'function') { try { updateCartWithDelivery(); } catch(e){} }
    });
} catch(e) {}

try {
    document.getElementById('customer-phone')?.addEventListener('input', (e)=>{
        e.target.value = e.target.value.replace(/\D/g,'');
    });
} catch(e) {}


// =========================
// VALIDAÇÕES MELHORADAS
// =========================

// Validação de telefone brasileiro
function validateBrazilianPhone(phone) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return false;
    }
    
    // Verifica se o DDD é válido (11-99)
    const ddd = cleanPhone.substring(0, 2);
    if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
        return false;
    }
    
    // Para celular (11 dígitos), o 9º dígito deve ser 9
    if (cleanPhone.length === 11 && cleanPhone[2] !== '9') {
        return false;
    }
    
    return true;
}

// Formatação de telefone brasileiro
function formatBrazilianPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
        return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
        return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

// Aplicar validações ao formulário
try {
    const phoneInput = document.getElementById('customer-phone');
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const neighborhoodInput = document.getElementById('customer-neighborhood');
    
    if (phoneInput) {
        // Formatação automática do telefone
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            e.target.value = value;
            
            // Aplica formatação visual
            if (value.length >= 10) {
                e.target.style.borderColor = validateBrazilianPhone(value) ? '#28a745' : '#dc3545';
            } else {
                e.target.style.borderColor = '';
            }
        });
        
        // Validação ao sair do campo
        phoneInput.addEventListener('blur', function(e) {
            const phone = e.target.value;
            if (phone && !validateBrazilianPhone(phone)) {
                showValidationError(e.target, 'Por favor, insira um telefone válido com DDD (ex: 81999887766)');
            } else {
                clearValidationError(e.target);
                if (phone) {
                    e.target.value = formatBrazilianPhone(phone);
                }
            }
        });
    }
    
    // Validação de nome
    if (nameInput) {
        nameInput.addEventListener('blur', function(e) {
            const name = e.target.value.trim();
            if (name && name.length < 2) {
                showValidationError(e.target, 'Nome deve ter pelo menos 2 caracteres');
            } else if (name && !/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
                showValidationError(e.target, 'Nome deve conter apenas letras');
            } else {
                clearValidationError(e.target);
            }
        });
    }
    
    // Validação condicional de endereço
    function validateAddressFields() {
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked')?.value;
        
        if (deliveryOption === 'delivery') {
            if (addressInput && !addressInput.value.trim()) {
                showValidationError(addressInput, 'Endereço é obrigatório para entrega');
                return false;
            }
            if (neighborhoodInput && !neighborhoodInput.value.trim()) {
                showValidationError(neighborhoodInput, 'Bairro é obrigatório para entrega');
                return false;
            }
        }
        
        clearValidationError(addressInput);
        clearValidationError(neighborhoodInput);
        return true;
    }
    
    // Aplicar validação de endereço quando a opção de entrega mudar
    document.querySelectorAll('input[name="delivery-option"]').forEach(radio => {
        radio.addEventListener('change', validateAddressFields);
    });
    
    // Validação no envio do formulário
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar nome
            if (!nameInput.value.trim()) {
                showValidationError(nameInput, 'Nome é obrigatório');
                isValid = false;
            }
            
            // Validar telefone
            if (!phoneInput.value.trim()) {
                showValidationError(phoneInput, 'Telefone é obrigatório');
                isValid = false;
            } else if (!validateBrazilianPhone(phoneInput.value)) {
                showValidationError(phoneInput, 'Telefone inválido');
                isValid = false;
            }
            
            // Validar endereço se for entrega
            if (!validateAddressFields()) {
                isValid = false;
            }
            
            // Validar método de pagamento
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
            if (!paymentMethod) {
                alert('Por favor, selecione um método de pagamento');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
                // Focar no primeiro campo com erro
                const firstError = document.querySelector('.input-error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
} catch (error) {
    console.log('Erro ao aplicar validações:', error);
}

// Funções auxiliares para mostrar/limpar erros de validação
function showValidationError(input, message) {
    clearValidationError(input);
    
    input.classList.add('input-error');
    input.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '4px';
    
    input.parentNode.appendChild(errorDiv);
}

function clearValidationError(input) {
    if (input) {
        input.classList.remove('input-error');
        input.style.borderColor = '';
        
        const errorDiv = input.parentNode.querySelector('.validation-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// Adicionar estilos CSS para campos com erro
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .input-error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .validation-error {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 4px;
        display: block;
    }
    
    .input-group input:focus.input-error,
    .input-group textarea:focus.input-error,
    .input-group select:focus.input-error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(validationStyles);


// =========================
// MELHORIAS DE ACESSIBILIDADE
// =========================

// Atualizar aria-label do carrinho dinamicamente
function updateCartAccessibility() {
    const cartButton = document.getElementById('view-cart-btn');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartButton) {
        const itemText = cartCount === 1 ? 'item' : 'itens';
        cartButton.setAttribute('aria-label', `Ver carrinho de compras - ${cartCount} ${itemText}`);
    }
}

// Interceptar a função updateCart existente para adicionar acessibilidade
const originalUpdateCart = window.updateCart;
if (typeof originalUpdateCart === 'function') {
    window.updateCart = function() {
        originalUpdateCart.apply(this, arguments);
        updateCartAccessibility();
    };
} else {
    // Se updateCart não existir ainda, criar um observer
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const cartCount = document.getElementById('cart-item-count');
                if (cartCount && mutation.target === cartCount) {
                    updateCartAccessibility();
                }
            }
        });
    });
    
    const cartCountElement = document.getElementById('cart-item-count');
    if (cartCountElement) {
        observer.observe(cartCountElement, { childList: true, characterData: true, subtree: true });
    }
}

// Melhorar navegação por teclado nos botões de categoria
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Adicionar skip link para melhor navegação
const skipLink = document.createElement('a');
skipLink.href = '#cardapio';
skipLink.textContent = 'Pular para o cardápio';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-red);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10001;
    transition: top 0.3s;
`;

skipLink.addEventListener('focus', function() {
    this.style.top = '6px';
});

skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

