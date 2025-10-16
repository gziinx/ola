const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let date = new Date();

// ---------------- RENDER CALENDÁRIO ----------------
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

  // Criar dias
  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;

    const dayOfWeek = new Date(year, month, day).getDay();
    const color = (dayOfWeek === 0 || dayOfWeek === 6) ? "#f34a4a" : "#4a6ef5";

    const today = new Date();
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayElement.classList.add("today");
      dayElement.style.fontWeight = "bold";
    }
    dayElement.style.color = color;

    // Hover
    dayElement.addEventListener("mouseenter", () => dayElement.style.filter = "brightness(1.2)");
    dayElement.addEventListener("mouseleave", () => dayElement.style.filter = "brightness(1)");

    daysContainer.appendChild(dayElement);
  }

  if (direction) {
    daysContainer.classList.add("fade");
    setTimeout(() => daysContainer.classList.remove("fade"), 200);
  }
}

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
  option.value = String(i).padStart(2,'0');
  option.textContent = i;
  selectDia.appendChild(option);
}

// Preencher meses
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
for (let i = 0; i < 12; i++) {
  const option = document.createElement('option');
  option.value = String(i+1).padStart(2,'0');
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
selectDia.value = String(new Date().getDate()).padStart(2,'0');
selectMes.value = String(new Date().getMonth()+1).padStart(2,'0');
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
  if(e.target.classList.contains('cor')){
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
      if(rgb) corSelecionada = '#' + rgb.map(x => parseInt(x).toString(16).padStart(2,'0')).join('').toUpperCase();
    }
  }

  const alarmeAtivo = document.getElementById('toggle').checked ? 1 : 2;
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

    if(response.ok){
      alert('Evento salvo com sucesso!');
      modal.style.display = 'none';
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
