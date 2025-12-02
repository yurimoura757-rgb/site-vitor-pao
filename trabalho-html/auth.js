// Chaves para armazenar estados e dados no localStorage
const LOGGED_KEY = 'isLoggedInVitorPaes';
const USERNAME_KEY = 'loggedInUsername';
const USERS_DATA_KEY = 'vitorPaesUsers'; // NOVO: Chave para o "banco de dados" de usuários

// --- Funções Auxiliares de Dados ---

/**
 * Obtém a lista de usuários registrados (ou um array vazio se não houver).
 */
function getUsersData() {
    // Inicializa com um usuário padrão se for a primeira vez
    const defaultUser = {
        "cliente@email.com": { password: "123", name: "Cliente Teste" }
    };
    const usersJson = localStorage.getItem(USERS_DATA_KEY);
    return usersJson ? JSON.parse(usersJson) : defaultUser;
}

/**
 * Salva a lista de usuários no localStorage.
 */
function saveUsersData(users) {
    localStorage.setItem(USERS_DATA_KEY, JSON.stringify(users));
}


// --- Funções Principais de Autenticação ---

function isUserLoggedIn() {
    return localStorage.getItem(LOGGED_KEY) === 'true';
}

function updateAuthLink() {
    const container = document.getElementById('auth-link-container');
    if (!container) return; 

    if (isUserLoggedIn()) {
        const username = localStorage.getItem(USERNAME_KEY) || 'Cliente';
        // Mostra o nome do usuário logado e o botão Sair
        container.innerHTML = `
            <span style="color: #ffcc00; margin-right: 15px;">Olá, ${username}!</span>
            <a href="#" id="logout-button">Sair</a>
        `;
        document.getElementById('logout-button').addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });

    } else {
        // Mostra o link de Login
        container.innerHTML = `
            <a href="login.html">Login/Cadastrar</a>
        `;
    }
}

function handleLogin(email, password) {
    const users = getUsersData();
    const userData = users[email];

    if (userData && userData.password === password) {
        // Login bem-sucedido
        localStorage.setItem(LOGGED_KEY, 'true');
        localStorage.setItem(USERNAME_KEY, userData.name.split(' ')[0]); // Guarda só o primeiro nome
        
        alert(`Login realizado com sucesso! Bem-vindo(a), ${userData.name.split(' ')[0]}.`);
        window.location.href = 'index.html'; 

    } else {
        alert('Email ou Senha incorretos. Tente novamente.');
    }
}

function handleRegistration(name, email, password) {
    const users = getUsersData();

    // 1. Verifica se o email já existe
    if (users[email]) {
        alert('Este email já está cadastrado. Tente fazer login.');
        return;
    }

    // 2. Cria o novo usuário
    users[email] = {
        password: password, // Em um ambiente real, NUNCA armazene senhas sem criptografia!
        name: name
    };
    
    // 3. Salva a lista atualizada
    saveUsersData(users);

    alert(`Conta criada com sucesso para ${name.split(' ')[0]}! Faça seu login.`);
    
    // Opcional: Logar o usuário automaticamente após o cadastro (mude 'false' para 'true')
    const loginAutomatico = false; 

    if (loginAutomatico) {
        handleLogin(email, password);
    } else {
        // Redireciona para o formulário de login ou home
        window.location.href = 'login.html'; 
    }
}

function handleLogout() {
    localStorage.removeItem(LOGGED_KEY);
    localStorage.removeItem(USERNAME_KEY);
    alert('Você foi desconectado.');
    window.location.href = 'index.html'; 
}


// --- Inicialização e Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    updateAuthLink();

    // Listener para o formulário de LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            handleLogin(email, password);
        });
    }

    // Listener para o formulário de CADASTRO (NOVO)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            
            // Validação básica
            if (password.length < 3) {
                 alert('A senha deve ter pelo menos 3 caracteres.');
                 return;
            }

            handleRegistration(name, email, password);
        });
    }

    // Redirecionamento se já estiver logado
    if (document.title.includes('Acesso') && isUserLoggedIn()) {
         window.location.href = 'index.html';
    }
});