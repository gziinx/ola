    const daysContainer = document.getElementById("days");
    const monthYear = document.getElementById("month-year");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    // Variáveis de estado
    let date = new Date();
    let todosEventos = []; // Armazena todos os eventos do backend

    // Elemento onde os eventos serão listados (Card Azul)
    // Certifique-se de ter um elemento com este ID no HTML da sua nova tela
    const eventosContainer = document.getElementById('eventos-hoje');
    // E um elemento para o título do card lateral
    const tituloCard = document.getElementById('card-azul-titulo'); 


    // ---------------- FUNÇÕES DE FORMATAÇÃO ----------------

    /**
     * Formata a hora de um objeto Date para "HH:MM" (em UTC, conforme o padrão do seu backend).
     * @param {string | Date} horaUTC - A string de data/hora (ISO) ou objeto Date.
     * @returns {string} Hora formatada "HH:MM".
     */
    function formatarHora(horaUTC) {
        const dateObj = new Date(horaUTC);
        // Usamos getUTCHours/Minutes para manter a hora exata salva no banco (que parece estar em UTC)
        let h = dateObj.getUTCHours();
        let m = dateObj.getUTCMinutes();
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    /**
     * Formata uma data ISO para "DD/MM/AAAA" (em UTC).
     * @param {string} dataISO - A string de data/hora ISO (e.g., "2025-10-23T03:00:00.000Z").
     * @returns {string} Data formatada "DD/MM/AAAA".
     */
    function formatarData(dataISO) {
        const dateObj = new Date(dataISO);
        const dia = String(dateObj.getUTCDate()).padStart(2, '0');
        const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const ano = dateObj.getUTCFullYear();
        return `${dia}/${mes}/${ano}`;
    }


    // ---------------- FUNÇÕES PRINCIPAIS ----------------

    /**
     * Busca os eventos no backend e inicializa o calendário.
     */
    async function buscarEventos() {
        try {
            // Altere a URL se necessário na nova aplicação
            const response = await fetch('http://localhost:3030/v1/sosbaby/calenders');
            const data = await response.json();

            if (response.ok && Array.isArray(data.dateCalender)) {
                todosEventos = data.dateCalender;
                
                // Renderiza o calendário com os eventos
                renderCalendar();

                // Carrega os eventos do dia atual no Card Azul por padrão
                const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const eventosHoje = todosEventos.filter(evento => 
                    evento.data_calendario.split('T')[0] === hoje
                );
                
                exibirEventosNoCardAzul(eventosHoje, hoje, true); // O 'true' marca o dia atual
            } else {
                console.error('Nenhum evento encontrado');
                renderCalendar(); // Renderiza o calendário vazio se não houver eventos
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            renderCalendar(); // Renderiza o calendário mesmo com erro
        }
    }


    /**
     * Renderiza o mês atual no calendário.
     * @param {string} [direction] - Indica a direção da transição ('prev' ou 'next').
     */
    function renderCalendar(direction) {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1).getDay(); // Dia da semana do primeiro dia (0=Dom)
        const lastDate = new Date(year, month + 1, 0).getDate(); // Último dia do mês

        const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        monthYear.textContent = `${months[month]} ${year}`;
        daysContainer.innerHTML = "";

        // Espaços antes do primeiro dia
        for (let i = 0; i < firstDay; i++) {
            daysContainer.appendChild(document.createElement("div"));
        }

        // Criar os dias
        for (let day = 1; day <= lastDate; day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;
            dayElement.classList.add("dia");

            const dataCompleta = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.setAttribute("data-data", dataCompleta);

            const dayOfWeek = new Date(year, month, day).getDay();
            const color = (dayOfWeek === 0 || dayOfWeek === 6) ? "#f34a4a" : "#4a6ef5";
            dayElement.style.color = color;

            // Destacar o dia atual
            const today = new Date();
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayElement.classList.add("hoje");
                // Se for o dia atual, adicione a classe de seleção inicial
                const hojeStr = today.toISOString().split('T')[0];
                const dataElementStr = dayElement.getAttribute("data-data");
                if (hojeStr === dataElementStr) {
                    dayElement.classList.add('selected-day');
                }
            }

            // Adiciona o dia no calendário
            daysContainer.appendChild(dayElement);
        }
        
        // Marca os pontos e adiciona o listener de clique
        marcarDiasComEventos(todosEventos); 

        // Animação opcional
        if (direction) {
            daysContainer.classList.add("fade");
            setTimeout(() => daysContainer.classList.remove("fade"), 200);
        }
    }


    /**
     * Adiciona um ponto nos dias que possuem eventos e o listener de clique.
     * @param {Array<Object>} eventos - Lista completa de eventos.
     */
    function marcarDiasComEventos(eventos) {
        const diasDoMes = document.querySelectorAll('.dia');
        const tooltipContainer = document.getElementById("tooltip-global-container"); // Certifique-se que este container existe no seu HTML

        // Limpa tooltips antigos
        if (tooltipContainer) {
            tooltipContainer.innerHTML = "";
        }

        const eventosPorData = {};
        eventos.forEach(ev => {
            // Obtém apenas YYYY-MM-DD
            const data = ev.data_calendario.split('T')[0]; 
            if (!eventosPorData[data]) eventosPorData[data] = [];
            eventosPorData[data].push(ev);
        });

        diasDoMes.forEach(dia => {
            const dataDia = dia.getAttribute('data-data');

            // Limpa ponto anterior, se houver
            const pontoExistente = dia.querySelector('.ponto-evento');
            if (pontoExistente) pontoExistente.remove();
            dia.classList.remove('has-event');


            if (eventosPorData[dataDia]) {
                let eventosDoDia = eventosPorData[dataDia];

                // Ordena os eventos pela hora
                eventosDoDia.sort((a, b) => {
                    const dateA = new Date(a.hora_calendario);
                    const dateB = new Date(b.hora_calendario);
                    const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
                    const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();
                    return minutosA - minutosB; 
                });

                // Adiciona o ponto visual
                const ponto = document.createElement('span');
                ponto.classList.add('ponto-evento');
                dia.appendChild(ponto);
                dia.classList.add('has-event');

                // Adiciona o evento de clique para listar os eventos do dia
                dia.addEventListener('click', () => {
                    // 1. Carrega os eventos do dia no Card Azul
                    exibirEventosNoCardAzul(eventosDoDia, dataDia);

                    // 2. Remove o destaque (classe 'selected-day') de todos os dias
                    document.querySelectorAll('.dia').forEach(d => d.classList.remove('selected-day'));

                    // 3. Adiciona o destaque ao dia clicado
                    dia.classList.add('selected-day');
                });

                // Lógica de Tooltip (se for reutilizada)
                if (tooltipContainer) {
                    const tooltip = document.createElement('div');
                    tooltip.classList.add('tooltip');
                    tooltip.innerHTML = eventosDoDia.map(ev => {
                        const hora = formatarHora(ev.hora_calendario);
                        return `<div class="tooltip-evento">
                                    <div class="circulo" style="background-color:${ev.cor || '#708EF1'}"></div>
                                    <h4 class="titulo-tooltip">${ev.titulo}</h4>
                                    <p class="hora-tooltip">${hora}</p>
                                </div>`;
                    }).join("");

                    tooltipContainer.appendChild(tooltip);

                    // Event listeners de hover para o tooltip (mantidos, ajuste o CSS conforme necessário)
                    dia.addEventListener('mouseenter', () => {
                        tooltip.style.display = "block";
                        const rect = dia.getBoundingClientRect();
                        const tooltipTop = rect.top + window.scrollY - tooltip.offsetHeight - 8;
                        const tooltipLeft = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
                        const screenWidth = document.documentElement.clientWidth;
                        const safeLeft = Math.max(10, Math.min(tooltipLeft, screenWidth - tooltip.offsetWidth - 10)); 

                        tooltip.style.top = `${tooltipTop}px`;
                        tooltip.style.left = `${safeLeft}px`;

                        setTimeout(() => { tooltip.classList.add("show"); }, 10);
                    });

                    dia.addEventListener('mouseleave', () => {
                        tooltip.classList.remove("show");
                        setTimeout(() => {
                            if (!tooltip.classList.contains("show")) {
                                tooltip.style.display = "none";
                            }
                        }, 200); 
                    });
                }
            }
        });
    }


    /**
     * Exibe a lista de eventos no Card Azul (Container Lateral).
     * @param {Array<Object>} eventos - Lista de eventos para a data.
     * @param {string} dataSelecionada - A data YYYY-MM-DD.
     * @param {boolean} isToday - Flag para saber se é o dia atual.
     */
    function exibirEventosNoCardAzul(eventos, dataSelecionada, isToday = false) {
        if (!eventosContainer) {
            console.warn('O elemento com ID "eventos-hoje" não foi encontrado. Eventos não serão exibidos.');
            return;
        }
        
        // Adiciona uma hora fictícia para o formatador de data funcionar corretamente com fuso UTC
        const dataFormatada = formatarData(dataSelecionada + 'T00:00:00Z'); 

        eventosContainer.innerHTML = ''; // Limpa o conteúdo anterior

        // Atualiza o título do card lateral
        if (tituloCard) {
            tituloCard.textContent = isToday ? `Eventos de Hoje (${dataFormatada})` : `Eventos para ${dataFormatada}`;
        }

        if (eventos.length === 0) {
            eventosContainer.innerHTML = '<p style="text-align: center; color: #0c0c0c;">Sem eventos para esta data 🎉</p>';
            return;
        }

        // Ordenação (já deve estar ordenada se vindo da marcarDiasComEventos, mas garante)
        eventos.sort((a, b) => {
            const dateA = new Date(a.hora_calendario);
            const dateB = new Date(b.hora_calendario);
            const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
            const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();
            return minutosA - minutosB;
        });

        eventos.forEach(ev => {
            const card = document.createElement('div');
            // Você pode precisar adicionar classes CSS específicas para o seu estilo (ex: card-branco)
            card.classList.add('card-evento'); 

            card.innerHTML = `
                <div class="circulo-evento" style="background-color: ${ev.cor || '#708EF1'}"></div>
                <div class="conteudo-evento">
                    <h3>${ev.titulo}</h3>
                    <p>${formatarData(ev.data_calendario)} - ${formatarHora(ev.hora_calendario)}</p>
                    <p class="descricao-evento">${ev.descricao || ''}</p>
                </div>`; // Removido o botão de lixeira (exclusão)

            eventosContainer.appendChild(card);
        });
    }


    // ---------------- LISTENERS DE NAVEGAÇÃO ----------------

    prevBtn.addEventListener("click", () => { 
        date.setMonth(date.getMonth() - 1); 
        renderCalendar("prev"); 
    });

    nextBtn.addEventListener("click", () => { 
        date.setMonth(date.getMonth() + 1); 
        renderCalendar("next"); 
    });


    // ---------------- INICIALIZAÇÃO ----------------

    // Inicia a busca e renderização do calendário
    buscarEventos();