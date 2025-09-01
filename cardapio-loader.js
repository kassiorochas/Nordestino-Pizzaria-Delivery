// Carregador dinâmico do cardápio a partir dos arquivos do Decap CMS
class CardapioLoader {
    constructor() {
        this.cardapio = {
            tradicionais: [],
            especiais: [],
            doces: [],
            bordas: [],
            bebidas: [],
            promocoes: []
        };
    }

    // Função para carregar um arquivo markdown e extrair os dados
    async carregarArquivo(categoria, arquivo) {
        try {
            const response = await fetch(`/data/cardapio/${categoria}/${arquivo}`);
            if (!response.ok) return null;
            
            const conteudo = await response.text();
            return this.parseMarkdown(conteudo);
        } catch (error) {
            console.error(`Erro ao carregar ${categoria}/${arquivo}:`, error);
            return null;
        }
    }

    // Parser simples para extrair frontmatter do markdown
    parseMarkdown(conteudo) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
        const match = conteudo.match(frontmatterRegex);
        
        if (!match) return null;
        
        const frontmatter = match[1];
        const dados = {};
        
        // Parse simples do YAML frontmatter
        frontmatter.split('\n').forEach(linha => {
            const [chave, ...valorArray] = linha.split(':');
            if (chave && valorArray.length > 0) {
                let valor = valorArray.join(':').trim();
                
                // Remove aspas se existirem
                if (valor.startsWith('"') && valor.endsWith('"')) {
                    valor = valor.slice(1, -1);
                }
                
                // Converte números
                if (!isNaN(valor) && valor !== '') {
                    valor = parseFloat(valor);
                }
                
                // Converte booleanos
                if (valor === 'true') valor = true;
                if (valor === 'false') valor = false;
                
                dados[chave.trim()] = valor;
            }
        });
        
        return dados;
    }

    // Carrega todos os itens de uma categoria
    async carregarCategoria(categoria) {
        // Lista de arquivos - em produção isso seria dinâmico
        const arquivos = await this.listarArquivos(categoria);
        const itens = [];
        
        for (const arquivo of arquivos) {
            const item = await this.carregarArquivo(categoria, arquivo);
            if (item && item.disponivel !== false) {
                itens.push(item);
            }
        }
        
        // Ordena por ordem de exibição
        itens.sort((a, b) => (a.ordem || 999) - (b.ordem || 999));
        
        return itens;
    }

    // Lista arquivos de uma categoria (simulado - em produção seria via API)
    async listarArquivos(categoria) {
        const arquivosPorCategoria = {
            tradicionais: ['margherita.md', 'calabresa.md'],
            especiais: [],
            doces: [],
            bordas: [],
            bebidas: ['coca-cola-2l.md'],
            promocoes: []
        };
        
        return arquivosPorCategoria[categoria] || [];
    }

    // Carrega todo o cardápio
    async carregarCardapio() {
        const categorias = ['tradicionais', 'especiais', 'doces', 'bordas', 'bebidas', 'promocoes'];
        
        for (const categoria of categorias) {
            this.cardapio[categoria] = await this.carregarCategoria(categoria);
        }
        
        return this.cardapio;
    }

    // Integração com o sistema existente
    async integrarComSistemaExistente() {
        await this.carregarCardapio();
        
        // Atualiza as variáveis globais do sistema existente
        if (window.menuData) {
            // Converte para o formato esperado pelo sistema atual
            window.menuData.tradicionais = this.converterParaFormatoAntigo(this.cardapio.tradicionais, 'pizza');
            window.menuData.especiais = this.converterParaFormatoAntigo(this.cardapio.especiais, 'pizza');
            window.menuData.doces = this.converterParaFormatoAntigo(this.cardapio.doces, 'pizza');
            window.menuData.bordas = this.converterParaFormatoAntigo(this.cardapio.bordas, 'borda');
            window.menuData.bebidas = this.converterParaFormatoAntigo(this.cardapio.bebidas, 'bebida');
            
            // Recarrega o menu na interface
            if (window.loadMenuItems) {
                window.loadMenuItems('tradicionais');
            }
        }
    }

    // Converte dados do CMS para o formato do sistema atual
    converterParaFormatoAntigo(itens, tipo) {
        return itens.map(item => {
            const itemConvertido = {
                id: this.gerarId(item.nome),
                name: item.nome,
                description: item.descricao || '',
                image: item.imagem || '',
                available: item.disponivel !== false
            };

            if (tipo === 'pizza') {
                itemConvertido.prices = {
                    media: item.preco_media || 0,
                    grande: item.preco_grande || 0
                };
            } else if (tipo === 'bebida') {
                itemConvertido.price = item.preco || 0;
                itemConvertido.volume = item.categoria || '';
            } else if (tipo === 'borda') {
                itemConvertido.price = item.preco || 0;
            }

            return itemConvertido;
        });
    }

    // Gera ID a partir do nome
    gerarId(nome) {
        return nome.toLowerCase()
            .replace(/[áàâã]/g, 'a')
            .replace(/[éèê]/g, 'e')
            .replace(/[íì]/g, 'i')
            .replace(/[óòôõ]/g, 'o')
            .replace(/[úù]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

// Inicializa o carregador quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new CardapioLoader();
    await loader.integrarComSistemaExistente();
});

