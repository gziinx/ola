const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let date = new Date();


let todosEventos = []; // guarda todos os eventos do backend

async function buscarEventos() {
  try {

    const response = await fetch('http://localhost:3030/v1/sosbaby/calenders');
    const data = await response.json();

    if (response.ok && Array.isArray(data.dateCalender)) {
      todosEventos = data.dateCalender;
      marcarDiasComEventos(todosEventos);

      // NOVO: Carregar os eventos do dia atual no Card Azul por padrão
      const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const eventosHoje = todosEventos.filter(evento => evento.data_calendario.split('T')[0] === hoje);
      exibirEventosNoCardAzul(eventosHoje, hoje);
    }
    else {
      console.error('Nenhum evento encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
}

// Chama antes de renderizar calendário pela primeira vez
buscarEventos();

// Dentro do renderCalendar(), depois de criar os dias
function renderCalendar(direction) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

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
    }

    // Efeito de hover
    dayElement.addEventListener("mouseenter", () => dayElement.style.filter = "brightness(1.2)");
    dayElement.addEventListener("mouseleave", () => dayElement.style.filter = "brightness(1)");

    // Adiciona o dia no calendário
    daysContainer.appendChild(dayElement);
  }
  marcarDiasComEventos(todosEventos);
  // Animação opcional
  if (direction) {
    daysContainer.classList.add("fade");
    setTimeout(() => daysContainer.classList.remove("fade"), 200);

  }
}
// Marcar dias com eventos (mantém, caso seja usado por outras partes)






// Marcar os dias com eventos


prevBtn.addEventListener("click", () => { date.setMonth(date.getMonth() - 1); renderCalendar("prev"); });
nextBtn.addEventListener("click", () => { date.setMonth(date.getMonth() + 1); renderCalendar("next"); });

renderCalendar();

// ---------------- MODAL DE EVENTO ----------------
const botaoMais = document.querySelector('.botao-mais');
const modal = document.getElementById('modal');
const adicionarCor = document.getElementById('adicionar-cor');
const colorModal = document.getElementById('colorModal');
const colorPickerInput = document.getElementById('colorPickerInput');
const confirmColor = document.getElementById('confirmColor');
const cancelColor = document.getElementById('cancelColor');
const coresContainer = document.getElementById('cores-container');

const selectDia = document.querySelector('.grupo select:nth-child(1)');
const selectMes = document.querySelector('.grupo select:nth-child(2)');
const selectAno = document.querySelector('.grupo select:nth-child(3)');

// Preencher dias
for (let i = 1; i <= 31; i++) {
  const option = document.createElement('option');
  option.value = String(i).padStart(2, '0');
  option.textContent = i;
  selectDia.appendChild(option);
}

// Preencher meses
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
for (let i = 0; i < 12; i++) {
  const option = document.createElement('option');
  option.value = String(i + 1).padStart(2, '0');
  option.textContent = meses[i];
  selectMes.appendChild(option);
}

// Preencher anos
const anoAtual = new Date().getFullYear();
for (let i = anoAtual; i <= anoAtual + 10; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  selectAno.appendChild(option);
}

// Data atual como padrão
selectDia.value = String(new Date().getDate()).padStart(2, '0');
selectMes.value = String(new Date().getMonth() + 1).padStart(2, '0');
selectAno.value = new Date().getFullYear();

// Abrir modal
botaoMais.addEventListener('click', () => modal.style.display = 'flex');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// Mini modal de cor
adicionarCor.addEventListener('click', () => colorModal.style.display = 'flex');
cancelColor.addEventListener('click', () => colorModal.style.display = 'none');

// Confirmar nova cor
confirmColor.addEventListener('click', () => {
  const novaCor = document.createElement('div');
  novaCor.classList.add('cor');
  const hex = colorPickerInput.value.toUpperCase();
  novaCor.style.backgroundColor = hex;
  novaCor.dataset.hex = hex; // salva no dataset
  coresContainer.insertBefore(novaCor, adicionarCor);
  colorModal.style.display = 'none';
  document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
  novaCor.classList.add('selecionada');
});

// Selecionar cor (pré-definida ou nova)
coresContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('cor')) {
    document.querySelectorAll('.cor').forEach(c => c.classList.remove('selecionada'));
    e.target.classList.add('selecionada');
  }
});

// Definir primeira cor selecionada
const primeiraCor = document.querySelector('.cor:not(.mais)');
if (primeiraCor) primeiraCor.classList.add('selecionada');

// ---------------- BOTÃO SALVAR ----------------
const salvarBtn = document.getElementById('salvar');
salvarBtn.addEventListener('click', async () => {
  const dia = selectDia.value;
  const mes = selectMes.value;
  const ano = selectAno.value;
  const hora = document.querySelector('.hora-input').value;
  const titulo = document.querySelector('input[placeholder="Escreva o título"]').value;
  const descricao = document.querySelector('textarea').value;

  // Capturar cor correta
  let corSelecionadaDiv = document.querySelector('.cor.selecionada');
  let corSelecionada = '';
  if (corSelecionadaDiv) {
    // Primeiro tenta pegar do dataset (nova cor)
    corSelecionada = corSelecionadaDiv.dataset.hex || '';
    // Se dataset vazio, pega do CSS
    if (!corSelecionada) {
      const computed = getComputedStyle(corSelecionadaDiv).backgroundColor;
      // Converte rgb para HEX
      const rgb = computed.match(/\d+/g);
      if (rgb) corSelecionada = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
    }
  }

  const alarmeAtivo = document.getElementById('toggle').checked ? 1 : 0;
  const idUser = 1;

  const novoEvento = {
    data_calendario: `${ano}-${mes}-${dia}`,
    hora_calendario: hora.length === 5 ? hora + ':00' : hora,
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    cor: corSelecionada || '#708EF1',
    alarme_ativo: alarmeAtivo,
    id_user: Number(idUser)
  };

  console.log("Objeto que será enviado:", novoEvento);

  try {
    const response = await fetch('http://localhost:3030/v1/sosbaby/calender/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoEvento)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Evento salvo com sucesso!');
      modal.style.display = 'none';
      location.reload()
      console.log(data);

    } else {
      alert('Erro ao salvar evento: ' + data.message);
      console.log(data);
    }

  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro interno ao salvar evento');
  }
});



//LISTAR O DIA ATUAL

async function listarEventosDoDiaAtual() {
  const hoje = new Date().toISOString().split('T')[0]; // "2025-10-16"

  try {
    const response = await fetch('http://localhost:3030/v1/sosbaby/calenders');
    const data = await response.json();

    console.log('Dados do backend:', data);

    if (response.ok && Array.isArray(data.dateCalender)) {
      // Extrai apenas a parte da data (YYYY-MM-DD) para comparar
      const eventosHoje = data.dateCalender.filter(evento =>
        evento.data_calendario.split('T')[0] === hoje
      );

      console.log('Eventos do dia atual:', eventosHoje);
      exibirEventosHoje(eventosHoje);

      marcarDiasComEventos(data.dateCalender);
    } else {
      console.error('Nenhum evento encontrado');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

function formatarHora(horaUTC) {
  const date = new Date(horaUTC);
  // Pega hora e minuto no fuso local
  let h = date.getUTCHours();
  let m = date.getUTCMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatarData(dataISO) {
  const date = new Date(dataISO);
  const dia = String(date.getUTCDate()).padStart(2, '0');
  const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
  const ano = date.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Localize onde você define a função exibirEventosHoje e substitua por esta:
/**
 * Exibe a lista de eventos no Card Azul (Container Lateral).
 * @param {Array<Object>} eventos - Lista de eventos para a data.
 * @param {string} dataSelecionada - A data YYYY-MM-DD.
 */
function exibirEventosNoCardAzul(eventos, dataSelecionada) {
  const container = document.getElementById('eventos-hoje'); // Assumindo este é o container dentro do Card Azul
  const dataFormatada = formatarData(dataSelecionada + 'T00:00:00Z'); // Formata a data para DD/MM/AAAA

  container.innerHTML = ''; // Limpa o conteúdo anterior

  // Atualiza o título do card azul (Assumindo que o h2 dentro de .card-azul tem um id)
  const tituloCard = document.querySelector('.card-azul h2');
  if (tituloCard) {
    tituloCard.textContent = `Eventos para ${dataFormatada}`;
  }

  if (eventos.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #0c0c0c;">Sem eventos para esta data 🎉</p>';
    return;
  }

  eventos.sort((a, b) => {
    // ... (Sua lógica de ordenação por hora, que está correta) ...
    const dateA = new Date(a.hora_calendario);
    const dateB = new Date(b.hora_calendario);
    const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
    const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();
    return minutosA - minutosB;
  });

  eventos.forEach(ev => {
    const card = document.createElement('div');
    card.classList.add('card-branco');

    card.innerHTML = `
      <div class="circulo" style="background-color: ${ev.cor || '#708EF1'}"></div>
      <div class="conteudo">
          <h3>${ev.titulo}</h3>
          <p>${formatarData(ev.data_calendario)} - ${formatarHora(ev.hora_calendario)}</p>
      </div>
      <div class="lixo" data-id="${ev.id_calendario}">
          <img src="../img/image.png" alt="Excluir">
      </div>`;

    container.appendChild(card);
    // ... (Sua lógica de exclusão, mantida) ...
    card.querySelector('.lixo').addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm('Deseja realmente excluir este evento?')) {
        try {
          const response = await fetch(`http://localhost:3030/v1/sosbaby/calender/${id}`, { method: 'DELETE' });
          const data = await response.json();

          if (response.ok) {
            alert('Evento excluído com sucesso!');

            // Após a exclusão, recarregamos os eventos e atualizamos o card
            await buscarEventos(); // Recarrega todos os eventos
            const dataExcluida = ev.data_calendario.split('T')[0];
            const eventosAtualizados = todosEventos.filter(e => e.data_calendario.split('T')[0] === dataExcluida);
            exibirEventosNoCardAzul(eventosAtualizados, dataExcluida);
            renderCalendar(); // Redesenha o calendário para remover o ponto, se necessário

          } else {
            alert('Erro ao excluir evento: ' + data.message);
          }
        } catch (error) {
          console.error('Erro ao excluir:', error);
          alert('Erro interno ao excluir evento');
        }
      }
    });
  });
}





function marcarDiasComEventos(eventos) {
  const diasDoMes = document.querySelectorAll('.dia');
  const tooltipContainer = document.getElementById("tooltip-global-container");

  // Limpa pontos antigos
  diasDoMes.forEach(dia => {
    const pontoExistente = dia.querySelector('.ponto-evento');
    if (pontoExistente) pontoExistente.remove();
  });

  // Limpa tooltips antigos
  tooltipContainer.innerHTML = "";

  const eventosPorData = {};
  eventos.forEach(ev => {
    const data = ev.data_calendario.split('T')[0];
    if (!eventosPorData[data]) eventosPorData[data] = [];
    eventosPorData[data].push(ev);
  });

  diasDoMes.forEach(dia => {
    const dataDia = dia.getAttribute('data-data');

    if (eventosPorData[dataDia]) {
      let eventosDoDia = eventosPorData[dataDia];

      // 1. ORDENAR OS EVENTOS PELA HORA
      eventosDoDia.sort((a, b) => {
        // Converte as strings de hora em objetos Date
        const dateA = new Date(a.hora_calendario);
        const dateB = new Date(b.hora_calendario);

        // Calcula o valor em minutos apenas da hora/minuto em UTC
        const minutosA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes();
        const minutosB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes();

        return minutosA - minutosB; // Ordena crescentemente (mais cedo -> mais tarde)
      });
      // Ponto sempre visível
      const ponto = document.createElement('span');
      ponto.classList.add('ponto-evento');
      dia.appendChild(ponto);
      dia.classList.add('has-event');

      // NOVO: Adiciona o evento de clique
      dia.addEventListener('click', () => {
        // 1. Carrega os eventos do dia no Card Azul
        exibirEventosNoCardAzul(eventosDoDia, dataDia);

        // 2. Remove o destaque (classe 'selected-day') de todos os dias
        document.querySelectorAll('.dia').forEach(d => d.classList.remove('selected-day'));

        // 3. Adiciona o destaque ao dia clicado
        dia.classList.add('selected-day');
      });

      // Criar tooltip no container global
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      // Mantendo a posição absoluta para o container global (sem precisar de top/left inicial aqui)
      tooltip.innerHTML = eventosDoDia.map(ev => {
        const hora = formatarHora(ev.hora_calendario);
        return `<div class="tooltip-evento">
                      <div class="circulo" style="background-color:${ev.cor || '#708EF1'}"></div>
                      <h4 class="titulo-tooltip">${ev.titulo}</h4>
                      <p class="hora-tooltip">${hora}</p>
                  </div>`;
      }).join("");

      tooltipContainer.appendChild(tooltip);

      // Mostrar/ocultar tooltip no hover
      dia.addEventListener('mouseenter', () => {
        // 1. Garante que o display está block para calcular o tamanho
        tooltip.style.display = "block";

        // 2. Calcula e posiciona
        const rect = dia.getBoundingClientRect();

        // Posicionamento acima do dia, centralizado horizontalmente
        const tooltipTop = rect.top + window.scrollY - tooltip.offsetHeight - 8;
        const tooltipLeft = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;

        // Limite direito da tela
        const screenWidth = document.documentElement.clientWidth;
        const safeLeft = Math.max(10, Math.min(tooltipLeft, screenWidth - tooltip.offsetWidth - 10)); // Garante margem de 10px

        tooltip.style.top = `${tooltipTop}px`;
        tooltip.style.left = `${safeLeft}px`;

        // 3. Adiciona a classe 'show' para a animação de opacidade/transform
        setTimeout(() => { // Pequeno delay para garantir que o posicionamento já foi aplicado
          tooltip.classList.add("show");
        }, 10);
      });

      dia.addEventListener('mouseleave', () => {
        // 1. Remove a classe 'show'
        tooltip.classList.remove("show");

        // 2. Após a transição de opacidade/transform, oculta completamente
        setTimeout(() => {
          if (!tooltip.classList.contains("show")) { // Checa se não houve mouseenter logo em seguida
            tooltip.style.display = "none";
          }
        }, 200); // 200ms é a duração da transição no seu CSS
      });
    }
  });
  // ---------------------- FIM DA CORREÇÃO ----------------------
}

document.querySelectorAll('.lixo').forEach(lixo => {
  lixo.addEventListener('click', async (e) => {
    const id = e.currentTarget.dataset.id;
    if (confirm('Deseja realmente excluir este evento?')) {
      try {
        const response = await fetch(`http://localhost:3030/v1/sosbaby/calender/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
          alert('Evento excluído com sucesso!');
          listarEventosDoDiaAtual(); // Atualiza os cards
        } else {
          alert('Erro ao excluir evento: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro interno ao excluir evento');
      }
    }
  });
});

