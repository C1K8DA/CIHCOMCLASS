let currentDate = new Date();
const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");

document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));

async function loadEvents() {
  const response = await fetch("Data/CventEvents.json");
  return await response.json();
}

async function renderCalendar() {
  const events = await loadEvents();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthYear.textContent = `${months[month]} ${year}`;
  calendar.innerHTML = "";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day-name");
    dayEl.textContent = day;
    calendar.appendChild(dayEl);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.innerHTML = `<strong>${day}</strong>`;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dailyEvents = events.filter(e => e.date === dateStr);

    if (dailyEvents.length > 0) {
      dailyEvents.slice(0, 2).forEach(ev => {
        const eventEl = document.createElement("a");
        eventEl.href = ev.link;
        eventEl.target = "_blank";
        eventEl.textContent = ev.title;
        eventEl.classList.add("event");
        dayCell.appendChild(eventEl);
      });

      if (dailyEvents.length > 2) {
        const moreBtn = document.createElement("button");
        moreBtn.classList.add("more-btn");
        moreBtn.textContent = `+${dailyEvents.length - 2} more`;
        moreBtn.setAttribute("aria-label", `${dailyEvents.length - 2} more events`);
        moreBtn.addEventListener("click", () => showPopup(dailyEvents));
        dayCell.appendChild(moreBtn);
      }
    }

    calendar.appendChild(dayCell);
  }
}

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  renderCalendar();
}

function showPopup(events) {
  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");

  const popup = document.createElement("div");
  popup.classList.add("popup");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => overlay.remove());

  const title = document.createElement("h3");
  title.textContent = "Events";

  popup.appendChild(closeBtn);
  popup.appendChild(title);

  events.forEach(ev => {
    const link = document.createElement("a");
    link.href = ev.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = ev.title;
    link.classList.add("event-popup");
    popup.appendChild(link);
  });

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

renderCalendar();
