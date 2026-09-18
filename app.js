const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const systems = [
  { name: 'Core Banking API', status: 'Operational', latencyMs: 42 },
  { name: 'Identity (Entra ID) SSO', status: 'Operational', latencyMs: 88 },
  { name: 'VPN Gateway', status: 'Degraded', latencyMs: 310 },
  { name: 'Email / Exchange Online', status: 'Operational', latencyMs: 61 },
  { name: 'Loan Origination Portal', status: 'Operational', latencyMs: 55 }
];

const tickets = [
  { id: 'TCK-1042', priority: 'High', title: 'VPN client failing to authenticate', status: 'In Progress', assignee: 'R. Antony', openedAt: '09:14' },
  { id: 'TCK-1041', priority: 'Medium', title: 'Shared printer offline - Floor 3', status: 'Open', assignee: 'Unassigned', openedAt: '08:52' },
  { id: 'TCK-1039', priority: 'Low', title: 'New hire laptop provisioning', status: 'Open', assignee: 'R. Antony', openedAt: 'Yesterday' },
  { id: 'TCK-1035', priority: 'High', title: 'Intune policy not syncing to device group', status: 'In Progress', assignee: 'J. Diaz', openedAt: 'Yesterday' }
];

const incidents = [
  { id: 'INC-204', date: '2026-09-10', summary: 'Entra ID conditional access policy blocked SSO for finance team', resolved: true, durationMinutes: 22, system: 'Identity (Entra ID) SSO' },
  { id: 'INC-201', date: '2026-08-28', summary: 'Azure App Service instance restarted unexpectedly during deploy window', resolved: true, durationMinutes: 8, system: 'Loan Origination Portal' }
];

function overallStatus() {
  if (systems.some(s => s.status === 'Down')) return 'Down';
  if (systems.some(s => s.status === 'Degraded')) return 'Degraded';
  return 'Operational';
}

app.get('/status', (req, res) => {
  res.json({
    service: 'Auto Approve Loan Platform',
    status: overallStatus(),
    uptime: '99.97%',
    lastChecked: new Date().toISOString(),
    systems
  });
});

app.get('/tickets', (req, res) => {
  const order = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...tickets].sort((a, b) => order[a.priority] - order[b.priority]);
  res.json({ openCount: sorted.length, tickets: sorted });
});

app.get('/incidents', (req, res) => {
  res.json({ incidentCount: incidents.length, incidents });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});