    // --- Dados de Simulação ---

    const contacts = [
        { id: '1', name: 'Clínica Pediatra X', type: 'clinic' },
        { id: '2', name: 'Dr. Souza', type: 'doctor' },
        { id: '3', name: 'Hospitalis', type: 'hospital' }
    ];

    const sampleMessages = [
        {
            id: '1',
            text: 'Olá, gostaria de agendar uma consulta para minha filha.',
            sender: 'contact',
            timestamp: '11:11'
        },
        {
            id: '2',
            text: 'Claro! Posso ajudar com o agendamento. Qual seria a melhor data e horário para você?',
            sender: 'user',
            timestamp: '11:11'
        }
    ];

    // VARIÁVEL JÁ EXISTENTE
    let messages = [...sampleMessages]; 

    // Estado
    let selectedContact = contacts[0];


    // --- Funções Auxiliares de Renderização e Ícones ---

/**
 * Retorna o SVG do ícone especificado (Baseado no Lucide-React).
 * @param {string} name - Nome do ícone ('user', 'arrow-left', 'search', 'camera', 'mic').
 * @param {string} className - Classes CSS adicionais para cor e tamanho.
 * @returns {string} HTML do SVG.
 */
function getIconSVG(name, className = 'text-white') {
    const icons = {
        'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
        'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        'camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
        'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>'
    };

    const viewBox = "0 0 24 24";
    // Classes base: 'icon' (para tamanho) + 'stroke-2' (para espessura da linha)
    const baseClasses = "icon stroke-2";
    
    return `<svg class="${baseClasses} ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg>`;
}



    /**
     * Retorna o HTML para um item de contato.
     * @param {Object} contact - O objeto de contato.
     * @param {boolean} isSelected - Se o contato está selecionado.
     * @returns {string} HTML do item de contato.
     */
    function renderContactItem(contact, isSelected) {
        const selectedClass = isSelected ? 'selected' : '';
        // Usando o novo sistema de ícones
        const iconHtml = getIconSVG('user', 'text-white');
        
        return `
            <button
                class="contact-item ${selectedClass}"
                data-contact-id="${contact.id}"
            >
                <div class="contact-avatar">
                    ${iconHtml}
                </div>
                <div class="contact-info">
                    <h3 class="contact-name">${contact.name}</h3>
                    <p class="contact-type">${contact.type}</p>
                </div>
            </button>
        `;
    }

    /**
     * Retorna o HTML para uma bolha de mensagem.
     * @param {Object} message - O objeto de mensagem.
     * @returns {string} HTML da bolha de mensagem.
     */
    function renderMessageBubble(message) {
        const isUser = message.sender === 'user';
        const alignClass = isUser ? 'user' : 'contact';
        const contentClass = isUser ? 'user' : 'contact';
        const timestampClass = isUser ? 'timestamp-user' : 'timestamp-contact';

        // Ícone pequeno do remetente
        // Usamos 'icon-small' no className para aplicar o tamanho pequeno no CSS
        const senderIconHtml = getIconSVG('user', isUser ? 'icon-small sender-icon-inner user' : 'icon-small sender-icon-inner contact');

        return `
            <div class="message-bubble ${alignClass}">
                <div class="message-content ${contentClass}">
                    <p class="text-sm leading-relaxed">${message.text}</p>
                    <div class="flex items-center gap-2 mt-2">
                        ${!isUser ? `<div class="sender-icon contact">${senderIconHtml}</div>` : ''}
                        <span class="text-xs ${timestampClass}">
                            ${message.timestamp}
                        </span>
                        ${isUser ? `<div class="sender-icon user">${senderIconHtml}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Retorna o HTML completo para a área de chat (header, mensagens e input).
     * @param {Object} contact - O contato selecionado.
     * @param {Object[]} currentMessages - A lista de mensagens.
     * @returns {string} HTML da área de chat.
     */
    function renderChatArea(contact, currentMessages) {
        const contactName = contact ? contact.name : 'MÉDICO';
        const messagesHtml = currentMessages.map(renderMessageBubble).join('');
        const userIconBig = getIconSVG('user', 'text-white');
        const cameraIcon = getIconSVG('camera', 'text-white/70');
        const micIcon = getIconSVG('mic', 'text-white');

        return `
            <div class="chat-header">
                <div class="flex items-center gap-3">
                    <div class="chat-header-avatar">
                        ${userIconBig}
                    </div>
                    <div>
                        <h2 class="chat-header-name">${contactName.toUpperCase()}</h2>
                        <p class="chat-header-status">Online</p>
                    </div>
                </div>
            </div>

            <div id="message-area" class="message-area space-y-4">
                ${messagesHtml}
            </div>

            <div class="chat-input-area">
                <div class="flex items-center gap-3">
                    <div class="flex-1 relative">
                        <input
                            type="text"
                            id="new-message-input"
                            placeholder="Mensagem"
                            class="message-input"
                        />
                        <button class="camera-button">
                            ${cameraIcon}
                        </button>
                    </div>
                    <button id="send-message-button" class="mic-button">
                        ${micIcon}
                    </button>
                </div>
            </div>
        `;
    }


    // --- Lógica Principal da Aplicação ---

    /**
     * Atualiza a lista de contatos na sidebar e aplica o estado de seleção.
     */
    function updateContactList() {
        const contactListElement = document.getElementById('contact-list');
        if (!contactListElement) return;

        const listHtml = contacts.map(c => renderContactItem(c, c.id === selectedContact?.id)).join('');
        contactListElement.innerHTML = listHtml;
    }

    /**
     * Atualiza a área principal do chat com o contato e as mensagens atuais.
     */
    function updateChatArea() {
        const chatPlaceholder = document.getElementById('chat-content-placeholder');
        
        if (selectedContact) {
            // Renderiza o chat se houver um contato selecionado
            chatPlaceholder.innerHTML = renderChatArea(selectedContact, messages);
            chatPlaceholder.classList.remove('flex', 'items-center', 'justify-center');
            chatPlaceholder.style.display = 'flex'; 
            chatPlaceholder.style.flexDirection = 'column';

            // Anexa event listeners aos novos elementos
            attachChatListeners();
            // CHAMADA CORRIGIDA: Rola para o final após a renderização
            scrollToBottom(); 
        } else {
            // Exibe o placeholder se nenhum contato estiver selecionado
            chatPlaceholder.innerHTML = '<p class="text-placeholder">Selecione um contato para iniciar a conversa</p>';
            chatPlaceholder.classList.add('flex', 'items-center', 'justify-center');
            chatPlaceholder.style.flexDirection = 'row'; 
        }
    }

    /**
     * Rola a área de mensagens para a última mensagem.
     */
    function scrollToBottom() {
        const messageArea = document.getElementById('message-area');
        if (messageArea) {
            // Garante que a rolagem ocorra após o browser renderizar o novo conteúdo
            setTimeout(() => {
                messageArea.scrollTop = messageArea.scrollHeight;
            }, 0);
        }
    }

    /**
     * Lógica para enviar uma nova mensagem.
     */
    function sendMessage() {
        // CORREÇÃO: Pegamos o elemento do input novamente, pois ele é recriado em updateChatArea()
        const inputElement = document.getElementById('new-message-input');
        const messageText = inputElement ? inputElement.value.trim() : '';
    
        if (messageText) {
            const now = new Date();
            const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
            const newMessage = {
                id: Date.now().toString(),
                text: messageText,
                sender: 'user',
                timestamp: timestamp
            };
    
            // 1. Adiciona a nova mensagem
            messages = [...messages, newMessage];
    
            // 2. Limpa o input
            inputElement.value = '';
    
            // 3. Re-renderiza a área de mensagens (destrói e recria o input)
            updateChatArea(); 
            
            // 4. CORREÇÃO: Após a re-renderização, pegamos o NOVO input e colocamos o foco nele
            const newInputElement = document.getElementById('new-message-input');
            if (newInputElement) {
                newInputElement.focus();
            }
        }
    }


    // --- Event Listeners ---

    /**
     * Adiciona listeners para selecionar um contato.
     */
    function attachContactListListeners() {
        // CORREÇÃO DOS ÍCONES: Adiciona os ícones de Voltar e Lupa na sidebar
        const arrowLeftButton = document.querySelector('.icon-button');
        if (arrowLeftButton) {
            arrowLeftButton.innerHTML = getIconSVG('arrow-left', 'w-5 h-5 text-gray-600');
        }

        const searchIconContainer = document.querySelector('.icon-search-container');
        if (searchIconContainer) {
            searchIconContainer.innerHTML = getIconSVG('search', 'w-4 h-4 text-gray-400');
        }


        document.getElementById('contact-list').addEventListener('click', (e) => {
            const button = e.target.closest('.contact-item');
            if (button) {
                const contactId = button.dataset.contactId;
                const newContact = contacts.find(c => c.id === contactId);
                
                if (newContact) {
                    selectedContact = newContact;
                    messages = [...sampleMessages]; 

                    updateContactList();
                    updateChatArea();
                }
            }
        });
    }

    /**
     * Adiciona listeners para enviar a mensagem (botão e tecla Enter).
     */
    function attachChatListeners() {
        const sendButton = document.getElementById('send-message-button');
        const inputElement = document.getElementById('new-message-input');

        if (sendButton) {
            sendButton.onclick = sendMessage;
        }

        if (inputElement) {
            // Impede o enter de adicionar nova linha e chama sendMessage
            inputElement.onkeypress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            };
        }
    }

    // --- Inicialização ---

    /**
     * Inicializa a aplicação ao carregar o DOM.
     */
    document.addEventListener('DOMContentLoaded', () => {
        messages = [...sampleMessages];

        // Chamada inicial para popular a lista de contatos e adicionar listeners
        updateContactList();
        attachContactListListeners();
        // Chamada inicial para renderizar a área de chat (incluindo ícones de input)
        updateChatArea();
    });