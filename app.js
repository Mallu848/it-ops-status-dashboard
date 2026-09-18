const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Mock data simulating an IT support operations dashboard
const systemStatus = {
  service: 'Auto Approve Loan Platform',
  status: 'Operational',
  uptime: '99.97%',
  lastChecked: new Date().toISOString()
};

const tickets = [
  { id: 'TCK-1042', priority: 'High', title: 'VPN client failing to authenticate', status: 'In Progress' },
  { id: 'TCK-1041', priority: 'Medium', title: 'Shared printer offline - Floor 3', status: 'Open' },
  { id: 'TCK-1039', priority: 'Low', title: 'New hire laptop provisioning', status: 'Open' },
  { id: 'TCK-1035', priority: 'High', title: 'Intune policy not syncing to device group', status: 'In Progress' }
];

const incidents = [
  { id: 'INC-204', date: '2026-09-10', summary: 'Entra ID conditional access policy blocked SSO for finance team', resolved: true },
  { id: 'INC-201', date: '2026-08-28', summary: 'Azure App Service instance restarted unexpectedly during deploy window', resolved: true }
];

// Simple landing page
app.get('/', (req, res) => {
  res.send(`
    <h1>IT Ops Status Dashboard</h1>
    <p>A mock internal ops dashboard, deployed via an automated Azure DevOps CI/CD pipeline.</p>
    <ul>
      <li><a href="/status">/status</a> - overall system health</li>
      <li><a href="/tickets">/tickets</a> - open support ticket queue</li>
      <li><a href="/incidents">/incidents</a> - recent incident log</li>
    </ul>
  `);
});

// Overall system health
app.get('/status', (req, res) => {
  res.json(systemStatus);
});

// Open ticket queue, sorted so High priority shows first
app.get('/tickets', (req, res) => {
  const sorted = [...tickets].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
  res.json({ openCount: sorted.length, tickets: sorted });
});

// Recent incident log
app.get('/incidents', (req, res) => {
  res.json({ incidentCount: incidents.length, incidents });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});