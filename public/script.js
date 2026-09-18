async function loadDashboard() {
  const [statusRes, ticketsRes, incidentsRes] = await Promise.all([
    fetch('/status').then(r => r.json()),
    fetch('/tickets').then(r => r.json()),
    fetch('/incidents').then(r => r.json())
  ]);

  renderOverall(statusRes);
  renderSystems(statusRes.systems);
  renderTickets(ticketsRes);
  renderIncidents(incidentsRes);

  document.getElementById('last-updated').textContent =
    new Date().toLocaleTimeString();
}

function statusClass(status) {
  if (status === 'Operational') return 'ok';
  if (status === 'Degraded') return 'warn';
  return 'down';
}

function renderOverall(data) {
  const dot = document.getElementById('overall-dot');
  const text = document.getElementById('overall-text');
  dot.className = 'dot ' + statusClass(data.status);
  text.textContent = `${data.status} · ${data.uptime} uptime`;
}

function renderSystems(systems) {
  const grid = document.getElementById('systems-grid');
  grid.innerHTML = systems.map(sys => `
    <div class="system-cell">
      <span class="system-name">${sys.name}</span>
      <span class="system-right">
        <span class="dot ${statusClass(sys.status)}"></span>
        ${sys.latencyMs}ms
      </span>
    </div>
  `).join('');
}

function renderTickets(data) {
  document.getElementById('ticket-count').textContent = `${data.openCount} open`;
  const body = document.getElementById('ticket-body');
  body.innerHTML = data.tickets.map(t => `
    <tr>
      <td class="id">${t.id}</td>
      <td><span class="priority-badge ${t.priority}">${t.priority}</span></td>
      <td>${t.title}</td>
      <td>${t.assignee}</td>
      <td class="opened">${t.openedAt}</td>
      <td class="status-tag">${t.status}</td>
    </tr>
  `).join('');
}

function renderIncidents(data) {
  document.getElementById('incident-count').textContent = `${data.incidentCount} logged`;
  const list = document.getElementById('incident-timeline');
  list.innerHTML = data.incidents.map(i => `
    <li>
      <div class="incident-date">${i.date} · ${i.id}</div>
      <div class="incident-summary">${i.summary}</div>
      <div class="incident-meta">${i.system} · ${i.durationMinutes} min · ${i.resolved ? 'Resolved' : 'Ongoing'}</div>
    </li>
  `).join('');
}

loadDashboard();
setInterval(loadDashboard, 30000);