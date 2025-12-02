// Chave para armazenar o carrinho no localStorage
const CARRINHO_KEY = 'carrinhoDePizzasVitorPaes';

// --- Funções de Manipulação do Carrinho ---

/**
 * Carrega os itens do carrinho do localStorage ou retorna um array vazio.
 */
function getCarrinho() {
    const carrinhoJson = localStorage.getItem(CARRINHO_KEY);
    return carrinhoJson ? JSON.parse(carrinhoJson) : [];
}

/**
 * Salva o array de itens no localStorage.
 */
function salvarCarrinho(carrinho) {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
}

/**
 * Adiciona um item ao carrinho.
 */
function adicionarAoCarrinho(nomePizza, precoPizza) {
    const carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.nome === nomePizza);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ 
            nome: nomePizza, 
            preco: precoPizza, 
            quantidade: 1 
        });
    }

    salvarCarrinho(carrinho);
    atualizarContadorCarrinho();
}

/**
 * Atualiza o número exibido no ícone do carrinho.
 */
function atualizarContadorCarrinho() {
    const carrinho = getCarrinho();
    // Soma a quantidade de todos os itens no carrinho
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    const contadorElement = document.getElementById('contador-carrinho');

    if (contadorElement) {
        contadorElement.textContent = totalItens;
        // Mostra o contador se houver itens, senão esconde
        contadorElement.style.display = totalItens > 0 ? 'inline' : 'none';
    }
}

/**
 * Renderiza os itens do carrinho na página "carrinho.html".
 */
function renderizarCarrinho() {
    const container = document.getElementById('itens-carrinho');
    const resumo = document.getElementById('carrinho-resumo');
    
    // Se não estiver na página carrinho.html, apenas retorna
    if (!container) return; 

    const carrinho = getCarrinho();
    container.innerHTML = ''; 
    resumo.innerHTML = '';
    
    if (carrinho.length === 0) {
        container.innerHTML = '<p class="alert alert-info text-center">🍕 Seu carrinho está vazio. Adicione algumas pizzas!</p>';
        return;
    }
    
    let totalGeral = 0;

    carrinho.forEach((item, index) => {
        const itemTotal = item.preco * item.quantidade;
        totalGeral += itemTotal;
        
        const itemCol = document.createElement('div');
        itemCol.classList.add('col-12', 'carrinho-item');
        itemCol.innerHTML = `
            <div class="card p-3 shadow-sm d-flex flex-row align-items-center justify-content-between">
                <div>
                    <h5 class="mb-1">${item.nome}</h5>
                    <p class="mb-0 text-muted">R$ ${item.preco.toFixed(2).replace('.', ',')} x ${item.quantidade}</p>
                </div>
                <div class="d-flex align-items-center">
                    <h5 class="me-3 mb-0 text-success">Total: R$ ${itemTotal.toFixed(2).replace('.', ',')}</h5>
                    <button class="btn btn-sm btn-outline-danger btn-remover" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(itemCol);
    });

    // Adiciona o resumo e o total
    resumo.innerHTML = `
        <div class="card p-3 bg-light">
            <h4 class="mb-0">Total do Pedido: <span class="text-danger">R$ ${totalGeral.toFixed(2).replace('.', ',')}</span></h4>
        </div>
    `;

    // Adiciona event listeners para os botões de remover item
    document.querySelectorAll('.btn-remover').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const indexParaRemover = parseInt(evento.currentTarget.getAttribute('data-index'));
            removerItemCarrinho(indexParaRemover);
        });
    });
}

/**
 * Remove um item do carrinho pelo seu índice.
 */
function removerItemCarrinho(index) {
    const carrinho = getCarrinho();
    
    if (index >= 0 && index < carrinho.length) {
        // Remove 1 item no índice especificado
        carrinho.splice(index, 1); 
        salvarCarrinho(carrinho);
        renderizarCarrinho(); // Renderiza novamente a lista
        atualizarContadorCarrinho();
    }
}


// --- Inicialização e Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualiza o contador na página inicial
    atualizarContadorCarrinho();

    // 2. Adiciona listeners para os botões "Comprar" (na página pizza.html)
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    
    botoesComprar.forEach(botao => {
        botao.addEventListener('click', (evento) => {
            // Usa o 'closest' para encontrar o elemento pai .card-body.info
            const cardInfo = evento.currentTarget.closest('.card-body.info');
            
            // Obtém os dados da pizza a partir dos atributos de dados (data-*) do botão
            const nome = evento.currentTarget.getAttribute('data-nome');
            const preco = parseFloat(evento.currentTarget.getAttribute('data-preco'));
            
            adicionarAoCarrinho(nome, preco);
            // Feedback simples e direto
            alert(`"${nome}" adicionada ao carrinho!`); 
            
            // Impede a propagação do clique para o card (que você tem um listener)
            evento.stopPropagation(); 
        });
    });

    // 3. Renderiza a lista do carrinho (se estiver na página carrinho.html)
    renderizarCarrinho();

    // 4. Adiciona listener ao botão de Limpar Carrinho (na página carrinho.html)
    const btnLimpar = document.getElementById('btn-limpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja remover todos os itens do carrinho?")) {
                localStorage.removeItem(CARRINHO_KEY);
                renderizarCarrinho();
                atualizarContadorCarrinho();
            }
        });
    }

    // 5. Adiciona listener ao botão de Finalizar Pedido (simulação)
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            const carrinho = getCarrinho();
            if (carrinho.length === 0) {
                alert("O carrinho está vazio. Adicione itens antes de finalizar.");
                return;
            }
            // Simulação de finalização de pedido
            alert(`Pedido finalizado! ${carrinho.reduce((total, item) => total + item.quantidade, 0)} itens. O pagamento será processado na próxima etapa.`);
            // Opcional: Limpar o carrinho após a finalização
            localStorage.removeItem(CARRINHO_KEY);
            renderizarCarrinho();
            atualizarContadorCarrinho();
        });
    }
    
   
});