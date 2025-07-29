document.addEventListener('DOMContentLoaded', () => {
    const PIZZARIA_WHATSAPP = '5511954699633'; // NOVO WhatsApp da Pizzaria (com 55 na frente)
    const ENTREGA_PADRAO = 5.00; // Taxa de entrega padrão

    // Dados do Cardápio COMPLETOS (Extraído das fotos do cardápio real)
    const menuItems = [
        // PIZZAS TRADICIONAIS (Média R$33,00 | Grande R$36,00)
        { id: 'mussarela', name: 'Mussarela', description: 'Molho, mussarela, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-mussarela.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'calabresa', name: 'Calabresa', description: 'Molho, mussarela, calabresa e cebola.', category: 'tradicionais', image: 'images/pizza-calabresa.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'frango-catupiry', name: 'Frango c/ Catupiry', description: 'Molho, mussarela, frango, catupiry, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-catupiry.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'frango-com-cheddar', name: 'Frango c/ Cheddar', description: 'Molho, mussarela, frango, cheddar, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-cheddar.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'frango-acebolado', name: 'Frango Acebolado', description: 'Molho, mussarela, frango, cebola, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-frango-acebolado.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'especial-de-frango', name: 'Especial de Frango', description: 'Molho, frango, bacon, mussarela, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-especial-frango.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'tres-queijos', name: 'Três Queijos', description: 'Molho, mussarela, cheddar, catupiry, queijo parmesão, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-tres-queijos.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'bacon', name: 'Bacon', description: 'Molho, mussarela, bacon, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-bacon.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'baiana', name: 'Baiana', description: 'Molho, mussarela, calabresa moída, pimenta, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-baiana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'mista', name: 'Mista', description: 'Molho, mussarela, presunto, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-mista.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'napolitana', name: 'Napolitana', description: 'Molho, mussarela, tomate, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-napolitana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'romana', name: 'Romana', description: 'Molho, mussarela, presunto, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-romana.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'carioca', name: 'Carioca', description: 'Molho, mussarela, presunto, milho, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-carioca.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'caipira', name: 'Caipira', description: 'Molho, mussarela, frango desfiado, milho, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-caipira.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'portuguesa', name: 'Portuguesa', description: 'Molho, mussarela, presunto, ovo, cebola, azeitona, orégano.', category: 'tradicionais', image: 'images/pizza-portuguesa.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'quatro-queijos', name: 'Quatro Queijos', description: 'Molho, mussarela, provolone, parmesão, gorgonzola, orégano, azeitona.', category: 'tradicionais', image: 'images/pizza-quatro-queijos.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },

        // PIZZAS ESPECIAIS (Média R$45,00 | Grande R$55,00 ou Média R$40,00 | Grande R$43,00)
        { id: 'camarao', name: 'Camarão', description: 'Molho, mussarela, camarão, catupiry, orégano, azeitona.', category: 'especiais', image: 'images/pizza-camarao.jpeg', priceOptions: { media: { size: 'Média', price: 45.00 }, grande: { size: 'Grande', price: 55.00 } }, defaultSize: 'media' },
        { id: 'atum', name: 'Atum', description: 'Molho, mussarela, atum, cebola, orégano, azeitona.', category: 'especiais', image: 'images/pizza-atum.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'nordestina-pizza', name: 'Nordestina', description: 'Molho, mussarela, carne de sol desfiada, orégano, azeitona.', category: 'especiais', image: 'images/pizza-nordestina.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'a-moda', name: 'À Moda', description: 'Molho, mussarela, lombo canadense, bacon, catupiry, milho, azeitona, orégano.', category: 'especiais', image: 'images/pizza-a-moda.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'trindade', name: 'Trindade', description: 'Molho, mussarela, lombo canadense, bacon, catupiry, milho, azeitona, orégano.', category: 'especiais', image: 'images/pizza-trindade.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'italiano', name: 'Italiano', description: 'Molho, mussarela, champignon, queijo, azeitona, orégano.', category: 'especiais', image: 'images/pizza-italiano.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'modada-casa', name: 'Modada da Casa', description: 'Molho, mussarela, charque, creme cheese, azeitona, orégano.', category: 'especiais', image: 'images/pizza-modada-casa.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'strogonoff', name: 'Strogonoff', description: 'Molho, mussarela, frango, milho, batata palha, azeitona, orégano.', category: 'especiais', image: 'images/pizza-strogonoff.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },
        { id: 'palermo', name: 'Palermo', description: 'Molho, mussarela, charque, milho, cebola, azeitona, orégano.', category: 'especiais', image: 'images/pizza-palermo.jpeg', priceOptions: { media: { size: 'Média', price: 40.00 }, grande: { size: 'Grande', price: 43.00 } }, defaultSize: 'media' },

        // PIZZAS DOCES (Qualquer uma por Média R$33,00 | Grande R$36,00)
        { id: 'brigadeiro', name: 'Brigadeiro', description: 'Chocolate, granulado.', category: 'doces', image: 'images/pizza-brigadeiro.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'beijinho', name: 'Beijinho', description: 'Doce de leite, coco ralado.', category: 'doces', image: 'images/pizza-beijinho.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'cartola', name: 'Cartola', description: 'Banana, canela.', category: 'doces', image: 'images/pizza-cartola.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'romeu-e-julieta', name: 'Romeu e Julieta', description: 'Doce de goiaba, catupiry.', category: 'doces', image: 'images/pizza-romeu-e-julieta.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },
        { id: 'm-m', name: 'M&M', description: 'Chocolate, M&M.', category: 'doces', image: 'images/pizza-m-m.jpeg', priceOptions: { media: { size: 'Média', price: 33.00 }, grande: { size: 'Grande', price: 36.00 } }, defaultSize: 'media' },

        // BORDAS RECHEADAS (R$7,00 ou R$12,00)
        { id: 'borda-chocolate', name: 'Borda Recheada de Chocolate', description: 'Recheio cremoso de chocolate na borda.', category: 'bordas', image: 'images/borda-chocolate.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-catupiry', name: 'Borda Recheada de Catupiry', description: 'Recheio cremoso de Catupiry na borda.', category: 'bordas', image: 'images/borda-catupiry.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-cheddar', name: 'Borda Recheada de Cheddar', description: 'Recheio cremoso de Cheddar na borda.', category: 'bordas', image: 'images/borda-cheddar.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-goiabada', name: 'Borda Recheada de Goiabada', description: 'Recheio cremoso de Goiabada na borda.', category: 'bordas', image: 'images/borda-goiabada.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'borda-catupiry-origina', name: 'Borda Especial Catupiry Origina', description: 'Recheio generoso de Catupiry Original na borda.', category: 'bordas', image: 'images/borda-catupiry-origina.jpeg', priceOptions: { unica: { size: 'Única', price: 12.00 } }, defaultSize: 'unica' },
        { id: 'borda-creme-cheese', name: 'Borda Especial Creme Cheese', description: 'Recheio generoso de Creme Cheese na borda.', category: 'bordas', image: 'images/borda-creme-cheese.jpeg', priceOptions: { unica: { size: 'Única', price: 12.00 } }, defaultSize: 'unica' },

        // PASTÉIS (R$9,00 ou R$13,00)
        { id: 'pastel-queijo', name: 'Pastel de Queijo', description: 'Queijo.', category: 'pasteis', image: 'images/pastel-queijo.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-frango', name: 'Pastel de Frango', description: 'Frango.', category: 'pasteis', image: 'images/pastel-frango.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-calabresa', name: 'Pastel de Calabresa', description: 'Calabresa.', category: 'pasteis', image: 'images/pastel-calabresa.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-presunto', name: 'Pastel de Presunto', description: 'Presunto.', category: 'pasteis', image: 'images/pastel-presunto.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-calabresa-presunto', name: 'Pastel de Calabresa c/ Presunto', description: 'Calabresa e presunto.', category: 'pasteis', image: 'images/pastel-calabresa-presunto.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-queijo-frango', name: 'Pastel de Queijo c/ Frango', description: 'Queijo e frango.', category: 'pasteis', image: 'images/pastel-queijo-frango.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-queijo-calabresa', name: 'Pastel de Queijo c/ Calabresa', description: 'Queijo e calabresa.', category: 'pasteis', image: 'images/pastel-queijo-calabresa.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-queijo-presunto', name: 'Pastel de Queijo c/ Presunto', description: 'Queijo e presunto.', category: 'pasteis', image: 'images/pastel-queijo-presunto.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-frango-calabresa', name: 'Pastel de Frango c/ Calabresa', description: 'Frango e calabresa.', category: 'pasteis', image: 'images/pastel-frango-calabresa.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-frango-presunto', name: 'Pastel de Frango c/ Presunto', description: 'Frango e presunto.', category: 'pasteis', image: 'images/pastel-frango-presunto.jpeg', priceOptions: { unica: { size: 'Única', price: 9.00 } }, defaultSize: 'unica' },
        { id: 'pastel-camarao', name: 'Pastel de Camarão', description: 'Camarão.', category: 'pasteis', image: 'images/pastel-camarao.jpeg', priceOptions: { unica: { size: 'Única', price: 13.00 } }, defaultSize: 'unica' },
        { id: 'pastel-carne-sol', name: 'Pastel de Carne de Sol', description: 'Carne de Sol.', category: 'pasteis', image: 'images/pastel-carne-sol.jpeg', priceOptions: { unica: { size: 'Única', price: 13.00 } }, defaultSize: 'unica' },
        { id: 'pastel-carne-bacon', name: 'Pastel de Carne de Bacon', description: 'Carne de bacon.', category: 'pasteis', image: 'images/pastel-carne-bacon.jpeg', priceOptions: { unica: { size: 'Única', price: 13.00 } }, defaultSize: 'unica' },

        // COXINHAS (R$5,00)
        { id: 'coxinha-frango', name: 'Coxinha de Frango', description: 'Coxinha de massa cremosa com recheio de frango.', category: 'coxinhas', image: 'images/coxinha-frango.jpeg', priceOptions: { unica: { size: 'Única', price: 5.00 } }, defaultSize: 'unica' },
        { id: 'coxinha-queijo', name: 'Coxinha de Queijo', description: 'Coxinha de massa cremosa com recheio de queijo.', category: 'coxinhas', image: 'images/coxinha-queijo.jpeg', priceOptions: { unica: { size: 'Única', price: 5.00 } }, defaultSize: 'unica' },

        // ENROLADINHOS (R$4,00)
        { id: 'enroladinho-frango', name: 'Enroladinho de Frango', description: 'Enroladinho de frango.', category: 'enroladinhos', image: 'images/enroladinho-frango.jpeg', priceOptions: { unica: { size: 'Única', price: 4.00 } }, defaultSize: 'unica' },
        { id: 'enroladinho-misto', name: 'Enroladinho Misto', description: 'Enroladinho de massa com recheio misto.', category: 'enroladinhos', image: 'images/enroladinho-misto.jpeg', priceOptions: { unica: { size: 'Única', price: 4.00 } }, defaultSize: 'unica' },
        { id: 'enroladinho-salsicha', name: 'Enroladinho de Salsicha', description: 'Enroladinho de salsicha.', category: 'enroladinhos', image: 'images/enroladinho-salsicha.jpeg', priceOptions: { unica: { size: 'Única', price: 4.00 } }, defaultSize: 'unica' },

        // BATATAS (R$7,00)
        { id: 'batata-frita', name: 'Batata Frita', description: 'Porção de batata frita.', category: 'batatas', image: 'images/batata-frita.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },
        { id: 'batata-frita-cheddar-catupiry', name: 'Porção de Batata Frita c/ Cheddar ou Catupiry', description: 'Porção de batata frita com queijo cheddar ou catupiry.', category: 'batatas', image: 'images/batata-frita-cheddar-catupiry.jpeg', priceOptions: { unica: { size: 'Única', price: 7.00 } }, defaultSize: 'unica' },

        // BEBIDAS
        { id: 'refrigerante-coca-1l', name: 'Coca-Cola 1L', description: 'Refrigerante Coca-Cola 1 Litro.', category: 'bebidas', image: 'images/refri-coca-1l.jpeg', priceOptions: { unica: { size: '1L', price: 9.00 }, '2l': { size: '2L', price: 13.00 } }, defaultSize: 'unica' },
        { id: 'refrigerante-guarana-1l', name: 'Guaraná 1L', description: 'Refrigerante Guaraná Antarctica 1 Litro.', category: 'bebidas', image: 'images/refri-guarana.jpeg', priceOptions: { unica: { size: '1L', price: 7.00 }, '2l': { size: '2L', price: 10.00 } }, defaultSize: 'unica' },
        { id: 'refrigerante-fanta-1l', name: 'Fanta 1L', description: 'Refrigerante Fanta Laranja 1 Litro.', category: 'bebidas', image: 'images/refri-fanta-1l.jpeg', priceOptions: { unica: { size: '1L', price: 8.00 }, '2l': { size: '2L', price: 10.00 } }, defaultSize: 'unica' },
        { id: 'refrigerante-em-lata', name: 'Refrigerante em Lata', description: 'Refrigerante em Lata (vários sabores).', category: 'bebidas', image: 'images/refri-em-lata.jpeg', priceOptions: { unica: { size: 'Lata', price: 5.00 } }, defaultSize: 'unica' },
        { id: 'h2o-500ml', name: 'H2O 500ml', description: 'Bebida levemente gaseificada H2O 500ml.', category: 'bebidas', image: 'images/h2o-500ml.jpeg', priceOptions: { unica: { size: '500ml', price: 6.00 } }, defaultSize: 'unica' },
        { id: 'agua-mineral', name: 'Água Mineral 500ml', description: 'Água mineral sem gás 500ml.', category: 'bebidas', image: 'images/agua-mineral.jpeg', priceOptions: { unica: { size: '500ml', price: 3.00 } }, defaultSize: 'unica' }
    ];

    // Cardápio de Combos (IDs referem-se a itens reais no menuItems ou são únicos para combos)
    const comboItems = [
        {
            id: 'combo-pizza-refri', // ID CORRIGIDO
            name: 'Combo Pizza + Refri 1L',
            description: '1 Pizza Média Tradicional + 1 Refrigerante Guaraná 1L.',
            price: 36.00,
            image: 'images/combo-pizza-refri.jpeg',
            pizzasIncluded: 1 // Quantidade de pizzas no combo
        },
        {
            id: 'combo-dupla',
            name: 'Combo Pizza Dupla',
            description: '2 Pizzas Grandes Tradicionais.',
            price: 60.00,
            image: 'images/combo-pizza-dupla.jpeg',
            pizzasIncluded: 2 // Quantidade de pizzas no combo
        }
    ];

    let cart = []; // Armazena os itens no carrinho
    let currentModalItem = null; // Item atualmente no modal de detalhes de item
    let currentModalQuantity = 1; // Quantidade atual no modal de detalhes de item
    let currentComboAdding = null; // Combo que está sendo adicionado no modal de sabores

    // Elementos do DOM
    const logoContainer = document.querySelector('header .logo-container'); // NOVO: Elemento do logo
    const viewCartBtn = document.getElementById('view-cart-btn');
    const cartItemCount = document.getElementById('cart-item-count');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const menuCatBtns = document.querySelectorAll('.menu-cat-btn');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout');
    const orderConfirmationSection = document.getElementById('order-confirmation');
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
    const paymentPix = document.getElementById('payment-pix'); // NOVO: Opção PIX

    // Modal de Detalhes do Item (para itens individuais do cardápio)
    const itemDetailModal = document.getElementById('item-detail-modal');
    const closeModalBtn = itemDetailModal.querySelector('.close-button');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemOptions = document.getElementById('modal-item-options');
    const modalItemNotes = document.getElementById('item-notes'); // NOVO: Observações por item
    const modalPriceValue = document.getElementById('modal-price-value');
    const decreaseQuantityModalBtn = itemDetailModal.querySelector('.decrease-quantity-modal');
    const increaseQuantityModalBtn = itemDetailModal.querySelector('.increase-quantity-modal');
    const currentQuantityModalSpan = itemDetailModal.querySelector('.current-quantity-modal');
    const addToCartModalBtn = document.getElementById('add-to-cart-modal-btn');
    const addToCartToast = document.getElementById('add-to-cart-toast');

    // NOVO: Modal de Seleção de Sabores para Combos
    const comboFlavorModal = document.getElementById('combo-flavor-modal');
    const closeComboModalBtn = document.getElementById('close-combo-modal');
    const comboModalTitle = document.getElementById('combo-modal-title');
    const flavorSelectionContainer = document.getElementById('flavor-selection-container');
    const addComboToCartBtn = document.getElementById('add-combo-to-cart-btn');

    // Lista de pizzas tradicionais para seleção de combos
    const tradicionaisPizzas = menuItems.filter(item => item.category === 'tradicionais');

    // Funções Auxiliares
    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }

    function showToast(message) {
        addToCartToast.textContent = message;
        addToCartToast.classList.add('active');
        setTimeout(() => {
            addToCartToast.classList.remove('active');
        }, 2000); // Esconde o toast após 2 segundos
    }

    // Navegação de Seções
    function navigateToSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Renderiza itens do cardápio
    function renderMenuItems(category = 'tradicionais') {
        menuItemsContainer.innerHTML = ''; // Limpa os itens existentes

        const itemsToRender = menuItems.filter(item => item.category === category);

        if (itemsToRender.length === 0) {
            menuItemsContainer.innerHTML = '<p class="no-items-message">Nenhum item encontrado nesta categoria.</p>';
            return;
        }

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

        // Adiciona event listeners aos novos cards
        document.querySelectorAll('.menu-item-card').forEach(card => {
            card.addEventListener('click', (e) => {
                openItemDetailModal(card.dataset.itemId);
            });
        });
    }

    // Calcula e atualiza o carrinho
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

        const deliveryFee = deliveryOptionDelivery.checked && subtotal > 0 ? ENTREGA_PADRAO : 0;
        const total = subtotal + deliveryFee;

        cartSubtotalSpan.textContent = formatCurrency(subtotal);
        deliveryFeeSpan.textContent = formatCurrency(deliveryFee);
        cartTotalSpan.textContent = formatCurrency(total);
        cartItemCount.textContent = itemCount;

        // Adiciona event listeners para os botões de quantidade do carrinho
        document.querySelectorAll('.decrease-cart-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1); // Remove item se a quantidade for 0
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

        // Habilita/desabilita o botão de finalizar pedido
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
        }
    }

    // Abre o modal de detalhes do item
    function openItemDetailModal(itemId) {
        currentModalItem = menuItems.find(item => item.id === itemId);
        if (!currentModalItem) return;

        modalItemImage.src = currentModalItem.image;
        modalItemName.textContent = currentModalItem.name;
        modalItemDescription.textContent = currentModalItem.description;
        modalItemNotes.value = ''; // Limpa observações anteriores

        // Limpa e popula opções de tamanho/borda
        modalItemOptions.innerHTML = '';
        const priceKeys = Object.keys(currentModalItem.priceOptions);
        if (priceKeys.length > 1) {
            const selectLabel = document.createElement('label');
            selectLabel.textContent = 'Selecione o tamanho:';
            const select = document.createElement('select');
            select.id = 'modal-item-size-select';
            priceKeys.forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = currentModalItem.priceOptions[key].size;
                select.appendChild(option);
            });
            select.addEventListener('change', () => {
                const selectedPriceKey = select.value;
                modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[selectedPriceKey].price * currentModalQuantity);
            });
            modalItemOptions.appendChild(selectLabel);
            modalItemOptions.appendChild(select);
        } else {
            const singleOption = document.createElement('p');
            singleOption.textContent = `Tamanho: ${currentModalItem.priceOptions[priceKeys[0]].size}`;
            modalItemOptions.appendChild(singleOption);
        }

        currentModalQuantity = 1;
        currentQuantityModalSpan.textContent = currentModalQuantity;
        modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[currentModalItem.defaultSize]?.price || Object.values(currentModalItem.priceOptions)[0].price);

        itemDetailModal.classList.add('active');
    }

    function closeItemDetailModal() {
        itemDetailModal.classList.remove('active');
        currentModalItem = null;
        currentModalQuantity = 1;
        modalItemNotes.value = ''; // Limpa observações ao fechar
        document.getElementById('modal-item-size-select')?.removeEventListener('change', null); // Limpar listener
    }

    // Adicionar item ao carrinho a partir do modal
    addToCartModalBtn.addEventListener('click', () => {
        if (!currentModalItem) return;

        const selectedSizeElement = document.getElementById('modal-item-size-select');
        let selectedSizeKey = currentModalItem.defaultSize;
        if (selectedSizeElement) {
            selectedSizeKey = selectedSizeElement.value;
        }
        const itemNotes = modalItemNotes.value.trim();

        const itemToAdd = {
            id: currentModalItem.id + (selectedSizeKey ? '-' + selectedSizeKey : '') + (itemNotes ? '-' + itemNotes.replace(/\s/g, '_') : ''),
            name: currentModalItem.name,
            price: currentModalItem.priceOptions[selectedSizeKey].price,
            quantity: currentModalQuantity,
            selectedSize: currentModalItem.priceOptions[selectedSizeKey],
            options: itemNotes ? `(Obs: ${itemNotes})` : ''
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

    // Adicionar combo ao carrinho (Abre modal de seleção de sabores)
    document.querySelectorAll('.add-to-cart-promo').forEach(button => {
        button.addEventListener('click', (e) => {
            const comboId = e.target.dataset.itemId;
            currentComboAdding = comboItems.find(c => c.id === comboId);

            if (!currentComboAdding) {
                console.error('Combo não encontrado:', comboId); // Para depuração
                return;
            }

            comboModalTitle.textContent = currentComboAdding.name;
            flavorSelectionContainer.innerHTML = ''; // Limpa seleções anteriores

            // Cria um seletor de sabor para cada pizza incluída no combo
            for (let i = 0; i < currentComboAdding.pizzasIncluded; i++) {
                const flavorGroup = document.createElement('div');
                flavorGroup.classList.add('pizza-flavor-selector-group'); // Adiciona classe para estilização
                flavorGroup.innerHTML = `
                    <h5>Pizza ${i + 1}</h5>
                    <select class="pizza-flavor-select">
                        <option value="">Selecione o sabor</option>
                        ${tradicionaisPizzas.map(pizza => `<option value="${pizza.id}">${pizza.name}</option>`).join('')}
                    </select>
                `;
                flavorSelectionContainer.appendChild(flavorGroup);
            }

            comboFlavorModal.classList.add('active');
            updateAddComboToCartButton(); // Atualiza estado do botão
        });
    });

    // Valida seleções de sabor do combo
    flavorSelectionContainer.addEventListener('change', updateAddComboToCartButton);
    function updateAddComboToCartButton() {
        const selects = flavorSelectionContainer.querySelectorAll('.pizza-flavor-select');
        let allSelected = true;
        selects.forEach(select => {
            if (!select.value) {
                allSelected = false;
            }
        });

        if (allSelected) {
            addComboToCartBtn.disabled = false;
            addComboToCartBtn.classList.remove('disabled');
        } else {
            addComboToCartBtn.disabled = true;
            addComboToCartBtn.classList.add('disabled');
        }
    }

    // Adicionar combo com sabores selecionados ao carrinho
    addComboToCartBtn.addEventListener('click', () => {
        const selects = flavorSelectionContainer.querySelectorAll('.pizza-flavor-select');
        const selectedFlavors = Array.from(selects).map(select => {
            const pizza = tradicionaisPizzas.find(p => p.id === select.value);
            return pizza ? pizza.name : 'Sabor não selecionado';
        });

        const comboOptions = `(Sabores: ${selectedFlavors.join(', ')})`;

        const itemToAdd = {
            id: currentComboAdding.id + '-' + selectedFlavors.map(f => f.replace(/\s/g, '_')).join('-'), // ID único com sabores
            name: currentComboAdding.name,
            price: currentComboAdding.price,
            quantity: 1, // Combos são adicionados um por vez
            selectedSize: null,
            options: comboOptions
        };

        cart.push(itemToAdd); // Sempre adiciona um novo combo, mesmo que o mesmo já esteja no carrinho com outros sabores
        updateCart();
        showToast(`"${currentComboAdding.name}" adicionado ao carrinho!`);
        closeComboFlavorModal();
    });

    // Fechar modal de seleção de sabores
    closeComboModalBtn.addEventListener('click', closeComboFlavorModal);
    function closeComboFlavorModal() {
        comboFlavorModal.classList.remove('active');
        currentComboAdding = null;
    }

    // Event Listeners Gerais
    closeModalBtn.addEventListener('click', closeItemDetailModal);
    window.addEventListener('click', (event) => {
        if (event.target === itemDetailModal) {
            closeItemDetailModal();
        }
        if (event.target === comboFlavorModal) {
            closeComboFlavorModal();
        }
    });

    decreaseQuantityModalBtn.addEventListener('click', () => {
        if (currentModalQuantity > 1) {
            currentModalQuantity--;
            currentQuantityModalSpan.textContent = currentModalQuantity;
            const selectedSizeElement = document.getElementById('modal-item-size-select');
            const selectedPriceKey = selectedSizeElement ? selectedSizeElement.value : currentModalItem.defaultSize;
            modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[selectedPriceKey].price * currentModalQuantity);
        }
    });

    increaseQuantityModalBtn.addEventListener('click', () => {
        currentModalQuantity++;
        currentQuantityModalSpan.textContent = currentModalQuantity;
        const selectedSizeElement = document.getElementById('modal-item-size-select');
        const selectedPriceKey = selectedSizeElement ? selectedSizeElement.value : currentModalItem.defaultSize;
        modalPriceValue.textContent = formatCurrency(currentModalItem.priceOptions[selectedPriceKey].price * currentModalQuantity);
    });

    // Filtrar cardápio por categoria
    menuCatBtns.forEach(button => {
        button.addEventListener('click', () => {
            menuCatBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderMenuItems(button.dataset.category);
        });
    });

    // Botão Ver Carrinho
    viewCartBtn.addEventListener('click', () => {
        navigateToSection('cart');
        updateCart(); // Garante que o carrinho esteja atualizado
    });

    // Botão Continuar Comprando (do carrinho)
    continueShoppingBtn.addEventListener('click', () => {
        navigateToSection('cardapio'); // Volta para o cardápio
        document.getElementById('hero').classList.remove('hidden'); // Exibe o hero
        document.getElementById('promocoes').classList.remove('hidden'); // Exibe promoções
    });

    // Botão Voltar ao Carrinho (do checkout)
    backToCartBtn.addEventListener('click', () => {
        navigateToSection('cart');
    });

    // Evento de clique no logo para ir para Home (Hero)
    logoContainer.addEventListener('click', () => {
        navigateToSection('hero');
        document.getElementById('promocoes').classList.remove('hidden');
        document.getElementById('cardapio').classList.remove('hidden');
        // Reseta a categoria do cardápio para a padrão
        document.querySelector('.menu-cat-btn.active')?.classList.remove('active');
        document.querySelector('.menu-cat-btn[data-category="tradicionais"]').classList.add('active');
        renderMenuItems('tradicionais');
    });

    // Botão Finalizar Pedido
    checkoutBtn.addEventListener('click', () => {
        navigateToSection('checkout');
    });

    // Lógica para exibir/ocultar campos de endereço/troco/pix no checkout
    document.querySelectorAll('input[name="delivery-option"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (deliveryOptionDelivery.checked) {
                deliveryAddressGroup.classList.remove('hidden');
                deliveryAddressGroup.querySelectorAll('input').forEach(input => input.required = true);
                deliveryFeeSpan.textContent = formatCurrency(ENTREGA_PADRAO); // Atualiza visualmente a taxa
            } else {
                deliveryAddressGroup.classList.add('hidden');
                deliveryAddressGroup.querySelectorAll('input').forEach(input => input.required = false);
                deliveryFeeSpan.textContent = formatCurrency(0); // Zera visualmente a taxa
            }
            updateCart(); // Re-calcula o total com ou sem taxa de entrega
        });
    });

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (paymentMoney.checked) {
                changeForGroup.classList.remove('hidden');
            } else {
                changeForGroup.classList.add('hidden');
                document.getElementById('change-for').value = ''; // Limpa o valor do troco
            }
        });
    });

    // Validação básica do formulário antes de enviar para o WhatsApp
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        if (cart.length === 0) {
            showToast('Seu carrinho está vazio!');
            return;
        }

        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const orderNotes = document.getElementById('order-notes').value.trim();

        // Validação de campos obrigatórios
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
            // Dados PIX da pizzaria (fixos no código por enquanto)
            const pixKey = '81982687572'; // Chave PIX
            const pixName = 'Elisandra Ferreira de Andrade'; // Nome
            const pixBank = 'Banco do Brasil'; // Banco
            paymentDetails = `\nPIX (Favor enviar para):\nChave: ${pixKey}\nNome: ${pixName}\nBanco: ${pixBank}`;
        }


        // Construir mensagem do WhatsApp
        let message = `*NOVO PEDIDO - Nordestino Pizzaria*\n\n`;
        message += `*Cliente:* ${customerName}\n`;
        message += `*Contato:* ${customerPhone}\n\n`;

        message += `*Itens do Pedido:*\n`;
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} ${item.selectedSize ? '(' + item.selectedSize.size + ')' : ''} ${item.options || ''} = R$ ${formatCurrency(item.price * item.quantity)}\n`;
        });

        message += `\n*Resumo Financeiro:*\n`;
        message += `Subtotal: R$ ${cartSubtotalSpan.textContent}\n`; // Pega o texto já formatado
        if (deliveryOption === 'delivery') {
            message += `Taxa de Entrega: R$ ${deliveryFeeSpan.textContent}\n`; // Pega o texto já formatado
        }
        message += `*Total: R$ ${cartTotalSpan.textContent}*\n\n`; // Pega o texto já formatado

        message += `*Detalhes da Entrega:*\n`;
        message += `${deliveryOption === 'delivery' ? 'Entrega em domicílio' : 'Retirada no local'}${addressDetails}\n`;
        message += `*Pagamento:* ${paymentMethod === 'money' ? 'Dinheiro' : (paymentMethod === 'card' ? 'Cartão na entrega' : 'PIX')}${paymentDetails}\n\n`;
        
        if (orderNotes) {
            message += `*Observações do Pedido (Geral):* ${orderNotes}\n\n`;
        }
        
        message += `_Pedido enviado via App da Pizzaria._`;

        // Codificar a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${PIZZARIA_WHATSAPP}?text=${encodedMessage}`;

        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');

        // Limpar carrinho e exibir confirmação
        cart = [];
        updateCart(); // Limpa o display do carrinho
        checkoutForm.reset(); // Limpa o formulário
        deliveryAddressGroup.classList.remove('hidden'); // Garante que o endereço apareça ao fazer novo pedido
        changeForGroup.classList.add('hidden'); // Oculta o troco
        
        navigateToSection('order-confirmation');
    });

    // Inicialização
    renderMenuItems(); // Renderiza as pizzas tradicionais por padrão
    updateCart(); // Inicializa o contador do carrinho
});
