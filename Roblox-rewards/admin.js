document.addEventListener('DOMContentLoaded', function() {
  const PASSWORD = 'Ake-site-come';
  const loginForm = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('admin-password');
  const loginMessage = document.getElementById('admin-login-message');
  const adminContent = document.getElementById('admin-content');
  const withdrawTableBody = document.getElementById('withdraw-table-body');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const userTableBody = document.getElementById('user-table-body');

  function showAdminPanel() {
    loginForm.style.display = 'none';
    adminContent.style.display = 'block';
    renderUsers();
    renderWithdrawals();
  }

  function renderWithdrawals() {
    withdrawTableBody.innerHTML = '';
    let withdrawLog = [];
    if (localStorage.getItem('withdrawRequests')) {
      withdrawLog = JSON.parse(localStorage.getItem('withdrawRequests'));
    }
    if (withdrawLog.length === 0) {
      withdrawTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#ffb200;">No withdrawal requests yet.</td></tr>';
      return;
    }
    withdrawLog.forEach((req, idx) => {
      const tr = document.createElement('tr');
      const tdUser = document.createElement('td');
      const tdAmt = document.createElement('td');
      const tdTime = document.createElement('td');
      const tdStatus = document.createElement('td');
      tdUser.textContent = req.username;
      tdAmt.textContent = `R$${req.amount}`;
      tdTime.textContent = new Date(req.time).toLocaleString();
      if (req.status === 'pending') {
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.background = '#00ffb2';
        confirmBtn.style.color = '#181a2a';
        confirmBtn.style.fontWeight = 'bold';
        confirmBtn.style.border = 'none';
        confirmBtn.style.borderRadius = '6px';
        confirmBtn.style.padding = '0.3em 1em';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.onclick = function() {
          // Deduct amount from user's balance
          const balKey = `robuxBalance_${req.username}`;
          let bal = parseInt(localStorage.getItem(balKey) || '0', 10);
          if (bal < req.amount) bal = 0;
          else bal = bal - req.amount;
          localStorage.setItem(balKey, bal);
          // Set status to confirmed
          withdrawLog[idx].status = 'confirmed';
          localStorage.setItem('withdrawRequests', JSON.stringify(withdrawLog));
          renderWithdrawals();
          renderUsers();
        };
        tdStatus.appendChild(confirmBtn);
        tdStatus.appendChild(document.createTextNode(' (Pending)'));
      } else {
        tdStatus.textContent = 'Confirmed';
      }
      tr.appendChild(tdUser);
      tr.appendChild(tdAmt);
      tr.appendChild(tdTime);
      tr.appendChild(tdStatus);
      withdrawTableBody.appendChild(tr);
    });
  }

  // Helper: get all usernames ever logged in
  function getAllUsernames() {
    const keys = Object.keys(localStorage);
    const usernames = new Set();
    // Find all keys like 'robuxBalance' and 'redeemedPromos_USERNAME'
    keys.forEach(key => {
      if (key.startsWith('redeemedPromos_')) {
        usernames.add(key.replace('redeemedPromos_', ''));
      }
      if (key.startsWith('followProfileStatus_')) {
        usernames.add(key.replace('followProfileStatus_', ''));
      }
      if (key.startsWith('gameTimers')) {
        // skip
      }
    });
    // Also add usernames from withdrawal log
    if (localStorage.getItem('withdrawRequests')) {
      const withdrawLog = JSON.parse(localStorage.getItem('withdrawRequests'));
      withdrawLog.forEach(req => usernames.add(req.username));
    }
    return Array.from(usernames);
  }

  function renderUsers() {
    userTableBody.innerHTML = '';
    const usernames = getAllUsernames();
    let withdrawLog = [];
    if (localStorage.getItem('withdrawRequests')) {
      withdrawLog = JSON.parse(localStorage.getItem('withdrawRequests'));
    }
    usernames.forEach(username => {
      // Get current balance
      let balance = 0;
      if (localStorage.getItem(`robuxBalance_${username}`)) {
        balance = parseInt(localStorage.getItem(`robuxBalance_${username}`), 10) || 0;
      }
      // Sum total withdrawn
      const userWithdrawals = withdrawLog.filter(req => req.username === username);
      const totalWithdrawn = userWithdrawals.reduce((sum, req) => sum + parseInt(req.amount, 10), 0);
      // Estimate total earned: balance + total withdrawn
      const totalEarned = balance + totalWithdrawn;
      const tr = document.createElement('tr');
      const tdUser = document.createElement('td');
      const tdEarned = document.createElement('td');
      const tdBal = document.createElement('td');
      const tdWithd = document.createElement('td');
      tdUser.textContent = username;
      tdEarned.textContent = `R$${totalEarned}`;
      tdBal.textContent = `R$${balance}`;
      tdWithd.textContent = `R$${totalWithdrawn}`;
      tr.appendChild(tdUser);
      tr.appendChild(tdEarned);
      tr.appendChild(tdBal);
      tr.appendChild(tdWithd);
      userTableBody.appendChild(tr);
    });
    if (usernames.length === 0) {
      userTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#ffb200;">No users yet.</td></tr>';
    }
  }

  if (loginForm && passwordInput && loginMessage) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (passwordInput.value === PASSWORD) {
        showAdminPanel();
      } else {
        loginMessage.textContent = 'Incorrect password.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      adminContent.style.display = 'none';
      loginForm.style.display = 'flex';
      passwordInput.value = '';
      loginMessage.textContent = '';
    });
  }
}); 