const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let date = new Date();

function renderCalendar(direction) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo
  const lastDate = new Date(year, month + 1, 0).getDate();

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  monthYear.textContent = `${months[month]} ${year}`;
  daysContainer.innerHTML = "";

  // Espaços antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysContainer.appendChild(empty);
  }

  // Criar os dias
  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;

    const dayOfWeek = new Date(year, month, day).getDay();
    let color;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      color = "#f34a4a"; // finais de semana
    } else {
      color = "#4a6ef5"; // dias úteis
    }

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add("today");
      dayElement.style.color = color.black;
      dayElement.style.fontWeight = "bold";
    } else {
      dayElement.style.color = color;
    }

    // Hover suave
    dayElement.addEventListener("mouseenter", () => {
      dayElement.style.filter = "brightness(1.2)";
    });
    dayElement.addEventListener("mouseleave", () => {
      dayElement.style.filter = "brightness(1)";
    });

    daysContainer.appendChild(dayElement);
  }

  // Animação ao mudar mês
  if (direction) {
    daysContainer.classList.add("fade");
    setTimeout(() => {
      daysContainer.classList.remove("fade");
    }, 200);
  }
}

prevBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar("prev");
});

nextBtn.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar("next");
});

renderCalendar();
