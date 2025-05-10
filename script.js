document.addEventListener('DOMContentLoaded', function() {
  // Load username
  const username = localStorage.getItem('robloxUsername');
  document.getElementById('dashboard-username').textContent = username ? `Welcome, ${username}!` : 'Welcome!';
  // Robux balance
  function getBalance() {
    const username = localStorage.getItem('robloxUsername');
    return parseInt(localStorage.getItem(`robuxBalance_${username}`) || '0', 10);
  }
  function setBalance(val) {
    const username = localStorage.getItem('robloxUsername');
    localStorage.setItem(`robuxBalance_${username}`, val);
    document.getElementById('robux-balance').textContent = `R$${val}`;
  }
  setBalance(getBalance());
  // Real time tracking for game timers
  const GAME_MAX_SECONDS = 3600; // 1 hour
  const gameTimers = {
    'car-legend': 0,
    'ultimate-punch': 0,
    'titan-grip': 0,
    'scythe-sword': 0,
    'shadow-slayer': 0,
    'superhero-flight': 0
  };
  let gameWindowRefs = {};
  let gameIntervals = {};
  let gameCompleted = {};
  let gameStartTimestamps = {};
  // Load timers and timestamps from localStorage
  if (localStorage.getItem('gameTimers')) {
    Object.assign(gameTimers, JSON.parse(localStorage.getItem('gameTimers')));
  }
  if (localStorage.getItem('gameCompleted')) {
    gameCompleted = JSON.parse(localStorage.getItem('gameCompleted'));
  }
  if (localStorage.getItem('gameStartTimestamps')) {
    gameStartTimestamps = JSON.parse(localStorage.getItem('gameStartTimestamps'));
  }
  function saveTimers() {
    localStorage.setItem('gameTimers', JSON.stringify(gameTimers));
    localStorage.setItem('gameCompleted', JSON.stringify(gameCompleted));
    localStorage.setItem('gameStartTimestamps', JSON.stringify(gameStartTimestamps));
  }
  function formatTime(sec) {
    const h = String(Math.floor(sec/3600)).padStart(2,'0');
    const m = String(Math.floor((sec%3600)/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${h}:${m}:${s}`;
  }
  function updateAllTimers() {
    Object.keys(gameTimers).forEach(game => {
      const el = document.getElementById('timer-' + game);
      if (el) {
        const timeLeft = GAME_MAX_SECONDS - gameTimers[game];
        el.textContent =
          gameTimers[game] >= GAME_MAX_SECONDS
            ? 'Time left: 00:00:00'
            : 'Time left: ' + formatTime(timeLeft);
      }
    });
  }
  updateAllTimers();
  // Real time interval update
  function startGameTimerInterval(game) {
    if (gameIntervals[game]) clearInterval(gameIntervals[game]);
    gameIntervals[game] = setInterval(() => {
      if (!gameWindowRefs[game] || gameWindowRefs[game].closed) {
        clearInterval(gameIntervals[game]);
        gameIntervals[game] = null;
        return;
      }
      // Calculate elapsed time
      if (gameStartTimestamps[game]) {
        const now = Date.now();
        const elapsed = Math.floor((now - gameStartTimestamps[game]) / 1000);
        let total = (gameTimers[game] || 0) + elapsed;
        if (total >= GAME_MAX_SECONDS) total = GAME_MAX_SECONDS;
        const el = document.getElementById('timer-' + game);
        if (el) {
          const timeLeft = GAME_MAX_SECONDS - total;
          el.textContent =
            total >= GAME_MAX_SECONDS
              ? 'Time left: 00:00:00'
              : 'Time left: ' + formatTime(timeLeft);
        }
        if (total >= GAME_MAX_SECONDS && !gameCompleted[game]) {
          gameTimers[game] = GAME_MAX_SECONDS;
          gameCompleted[game] = true;
          clearInterval(gameIntervals[game]);
          gameIntervals[game] = null;
          saveTimers();
          setBalance(getBalance() + 10);
          refreshBalanceDisplay();
          alert('One hour is complete, thanks for playing! R$10 has been added to your balance.');
          gameTimers[game] = 0;
          gameCompleted[game] = false;
          gameStartTimestamps[game] = null;
          saveTimers();
          updateAllTimers();
        }
      }
    }, 1000);
  }
  // On dashboard focus, update all timers and resume intervals if needed
  window.addEventListener('focus', function() {
    Object.keys(gameTimers).forEach(game => {
      // If game tab is open and not completed, resume interval
      if (
        gameWindowRefs[game] &&
        !gameWindowRefs[game].closed &&
        !gameIntervals[game] &&
        (gameTimers[game] < GAME_MAX_SECONDS)
      ) {
        startGameTimerInterval(game);
      }
      // If timer was running, update timer value based on real time
      if (gameStartTimestamps[game]) {
        const now = Date.now();
        const elapsed = Math.floor((now - gameStartTimestamps[game]) / 1000);
        let total = (gameTimers[game] || 0) + elapsed;
        if (total > GAME_MAX_SECONDS) total = GAME_MAX_SECONDS;
        gameTimers[game] = total;
        saveTimers();
        updateAllTimers();
      }
    });
  });
  // When user clicks Play, start/resume timer and show time left
  document.querySelectorAll('.play-game-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const game = btn.dataset.game;
      const url = btn.getAttribute('href');
      if (gameWindowRefs[game] && !gameWindowRefs[game].closed) {
        gameWindowRefs[game].focus();
        return;
      }
      const win = window.open(url, '_blank');
      if (!win) {
        alert('Please allow popups for this site to track your play time!');
        return;
      }
      gameWindowRefs[game] = win;
      if (gameTimers[game] >= GAME_MAX_SECONDS || gameCompleted[game]) {
        gameTimers[game] = 0;
        gameCompleted[game] = false;
        gameStartTimestamps[game] = null;
        saveTimers();
        updateAllTimers();
      }
      // Start or resume real time tracking
      if (!gameStartTimestamps[game]) {
        gameStartTimestamps[game] = Date.now();
        saveTimers();
      }
      startGameTimerInterval(game);
    });
  });
  // Navigation
  const navButtons = document.querySelectorAll('.dashboard-nav button');
  const sections = {
    earn: document.getElementById('section-earn'),
    rewards: document.getElementById('section-rewards'),
    event: document.getElementById('section-event'),
    profile: document.getElementById('section-profile'),
    withdraw: document.getElementById('section-withdraw'),
  };
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.keys(sections).forEach(key => sections[key].style.display = 'none');
      sections[btn.dataset.section].style.display = 'block';
    });
  });
  // Logout
  document.getElementById('logout-btn').onclick = function() {
    localStorage.removeItem('robloxUsername');
    localStorage.removeItem('robuxBalance');
    localStorage.removeItem('gameTimers');
    localStorage.removeItem('gameCompleted');
    localStorage.removeItem('gameStartTimestamps');
    window.location.href = 'index.html';
  };
  // Show reward message and add R$10 if user returns and completed a game
  window.addEventListener('focus', function() {
    let rewardGiven = false;
    Object.keys(gameCompleted).forEach(game => {
      if (gameCompleted[game] && gameTimers[game] >= GAME_MAX_SECONDS) {
        setBalance(getBalance() + 10);
        alert('One hour is complete, thanks for playing! R$10 has been added to your balance.');
        gameTimers[game] = 0;
        gameCompleted[game] = false;
        rewardGiven = true;
      }
    });
    if (rewardGiven) {
      saveTimers();
      updateAllTimers();
    }
  });
  // Idle detection logic
  let idleTimeout = null;
  let isIdle = false;
  const IDLE_LIMIT = 180000; // 3 minutes in ms
  function resetIdleTimer() {
    isIdle = false;
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      isIdle = true;
      // Pause all running game timers
      Object.keys(gameIntervals).forEach(game => {
        if (gameIntervals[game]) {
          clearInterval(gameIntervals[game]);
          gameIntervals[game] = null;
        }
      });
      // Optionally, show a message
      if (!document.getElementById('idle-warning')) {
        const note = document.createElement('div');
        note.id = 'idle-warning';
        note.style.color = '#ff4b4b';
        note.style.fontWeight = 'bold';
        note.style.margin = '1em 0';
        note.textContent = 'You have been idle for too long. Move your mouse or press a key to resume earning Robux.';
        document.querySelector('.dashboard-section').prepend(note);
      }
    }, IDLE_LIMIT);
    // Remove warning if user is active
    const warn = document.getElementById('idle-warning');
    if (warn) warn.remove();
  }
  ['mousemove','keydown','mousedown','touchstart'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, true);
  });
  resetIdleTimer();
  // Follow Roblox Profile Task Timer System
  const robloxUsername = localStorage.getItem('robloxUsername') || '';
  const followProfileKey = `followProfileStatus_${robloxUsername}`;
  const followProfileStatus = localStorage.getItem(followProfileKey) || 'incomplete';
  const followProfileStatusSpan = document.getElementById('follow-profile-status');
  const followProfileTaskLi = document.getElementById('follow-profile-task');
  const followProfileTimerSpan = document.getElementById('follow-profile-timer');
  function updateFollowProfileUI(status) {
    if (status === 'complete') {
      followProfileStatusSpan.innerHTML = '<span style="color:#00ffb2;font-size:1.3em;vertical-align:middle;">✔️ Completed</span>';
      followProfileTaskLi.classList.add('task-completed');
      if (followProfileTimerSpan) followProfileTimerSpan.textContent = '';
    } else {
      followProfileStatusSpan.innerHTML = '';
      followProfileTaskLi.classList.remove('task-completed');
    }
  }
  updateFollowProfileUI(followProfileStatus);
  let followProfileWindow = null;
  let followProfileInterval = null;
  let followProfileTimer = 0;
  const FOLLOW_PROFILE_TIME = 15; // seconds
  // Reset timer if not completed on refresh
  if (followProfileStatus !== 'complete') {
    localStorage.setItem(followProfileKey, 'incomplete');
    updateFollowProfileUI('incomplete');
  }
  const followProfileLink = document.getElementById('follow-profile-link');
  if (followProfileLink) {
    followProfileLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (localStorage.getItem(followProfileKey) === 'complete') {
        updateFollowProfileUI('complete');
        return;
      }
      if (followProfileWindow && !followProfileWindow.closed) {
        followProfileWindow.focus();
        return;
      }
      followProfileWindow = window.open('https://www.roblox.com/users/1959890949/profile/', '_blank');
      if (!followProfileWindow) {
        alert('Please allow popups for this site to track your follow time!');
        return;
      }
      followProfileTimer = 0;
      if (followProfileInterval) clearInterval(followProfileInterval);
      if (followProfileTimerSpan) followProfileTimerSpan.textContent = `Time left: 00:${String(FOLLOW_PROFILE_TIME).padStart(2,'0')}`;
      followProfileInterval = setInterval(() => {
        if (followProfileWindow.closed) {
          clearInterval(followProfileInterval);
          followProfileInterval = null;
          followProfileTimer = 0;
          if (followProfileTimerSpan) followProfileTimerSpan.textContent = '';
          return;
        }
        followProfileTimer++;
        const timeLeft = FOLLOW_PROFILE_TIME - followProfileTimer;
        if (followProfileTimerSpan) {
          followProfileTimerSpan.textContent = `Time left: 00:${String(timeLeft).padStart(2,'0')}`;
        }
        if (followProfileTimer >= FOLLOW_PROFILE_TIME) {
          clearInterval(followProfileInterval);
          followProfileInterval = null;
          setBalance(getBalance() + 3); // FIX: update balance first
          localStorage.setItem(followProfileKey, 'complete');
          updateFollowProfileUI('complete');
          alert('Thanks for following! R$3 has been added to your balance.');
        }
      }, 1000);
    });
  }
  // Withdraw section logic
  function updateWithdrawUI() {
    const withdrawBalance = document.getElementById('withdraw-balance');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const withdrawUsername = document.getElementById('withdraw-username');
    const withdrawAmount = document.getElementById('withdraw-amount');
    let valid = false;
    if (withdrawBalance) withdrawBalance.textContent = `R$${getBalance()}`;
    if (withdrawBtn && withdrawUsername && withdrawAmount) {
      const amt = parseInt(withdrawAmount.value, 10);
      valid = getBalance() >= 10 && withdrawUsername.value.trim() === username && amt >= 10 && amt <= getBalance();
      withdrawBtn.disabled = !valid;
      withdrawBtn.textContent = valid ? 'Confirm' : 'Confirm';
    }
  }
  const withdrawForm = document.getElementById('withdraw-form');
  const withdrawBtn = document.getElementById('withdraw-btn');
  const withdrawUsername = document.getElementById('withdraw-username');
  const withdrawAmount = document.getElementById('withdraw-amount');
  const withdrawMessage = document.getElementById('withdraw-message');
  if (withdrawForm && withdrawBtn && withdrawUsername && withdrawAmount) {
    withdrawUsername.addEventListener('input', updateWithdrawUI);
    withdrawAmount.addEventListener('input', updateWithdrawUI);
    updateWithdrawUI();
    withdrawForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const amt = parseInt(withdrawAmount.value, 10);
      if (getBalance() < 10) {
        withdrawMessage.textContent = 'You need at least R$10 to withdraw.';
        withdrawMessage.style.color = '#ff4b4b';
        return;
      }
      if (withdrawUsername.value.trim() !== username) {
        withdrawMessage.textContent = 'Username does not match your account.';
        withdrawMessage.style.color = '#ff4b4b';
        return;
      }
      if (amt < 10 || amt > getBalance()) {
        withdrawMessage.textContent = 'Enter a valid amount (min R$10, max your balance).';
        withdrawMessage.style.color = '#ff4b4b';
        return;
      }
      // Add withdrawal request with status 'pending', do NOT deduct balance yet
      const withdrawLogKey = 'withdrawRequests';
      let withdrawLog = [];
      if (localStorage.getItem(withdrawLogKey)) {
        withdrawLog = JSON.parse(localStorage.getItem(withdrawLogKey));
      }
      withdrawLog.push({ username, amount: amt, time: new Date().toISOString(), status: 'pending' });
      localStorage.setItem(withdrawLogKey, JSON.stringify(withdrawLog));
      withdrawBtn.disabled = true;
      withdrawBtn.textContent = 'Pending...';
      withdrawMessage.textContent = `Withdrawal request for R$${amt} submitted! Awaiting admin confirmation.`;
      withdrawMessage.style.color = '#00ffb2';
    });
  }
  // Update withdraw UI on balance change
  const origSetBalance = setBalance;
  setBalance = function(val) {
    origSetBalance(val);
    refreshBalanceDisplay();
    updateWithdrawUI();
  };
  // Promo code logic for Rewards section
  const PROMO_CODES = [
    '24k_Ake', 'Ake1087', 'Subscribe-to-my-channel', 'Robux4You', 'AkeIsKing', 'GoldenAke', 'AkePlays', 'AkeRewards', 'AkeRobux', 'Ake2024',
    'AkeBoost', 'AkeVIP', 'AkeGroup', 'AkePromo', 'AkeWin', 'AkeQuest', 'AkeBonus', 'AkeDaily', 'AkeEvent', 'AkeGift', 'AkePower',
    'AkeSquad', 'AkeCrew', 'AkeLegit', 'AkeMaster', 'AkeLuck', 'AkeShine', 'AkeShout', 'AkeEpic', 'AkeStar', 'AkeHero', 'AkeWave',
    'AkeMagic', 'AkeDream', 'AkeSpark', 'AkeCode', 'AkePrize', 'AkeRush', 'AkeSpin', 'AkeDrop', 'AkeBlast', 'AkeFun', 'AkePlayz',
    'AkeTime', 'AkeJoin', 'AkeFollow', 'AkeShare', 'AkeInvite', 'AkeEarn', 'AkeCash', 'AkeRich', 'AkePro', 'AkeGamer', 'AkeBuilder',
    'AkeCraft', 'AkeQuest2', 'AkeWin2', 'AkeBonus2', 'AkeDaily2', 'AkeEvent2', 'AkeGift2', 'AkePower2', 'AkeSquad2', 'AkeCrew2',
    'AkeLegit2', 'AkeMaster2', 'AkeLuck2', 'AkeShine2', 'AkeShout2', 'AkeEpic2', 'AkeStar2', 'AkeHero2', 'AkeWave2', 'AkeMagic2',
    'AkeDream2', 'AkeSpark2', 'AkeCode2', 'AkePrize2', 'AkeRush2', 'AkeSpin2', 'AkeDrop2', 'AkeBlast2', 'AkeFun2', 'AkePlayz2',
    'AkeTime2', 'AkeJoin2', 'AkeFollow2', 'AkeShare2', 'AkeInvite2', 'AkeEarn2', 'AkeCash2', 'AkeRich2', 'AkePro2', 'AkeGamer2',
    'AkeBuilder2', 'AkeCraft2', 'AkeRoblox', 'AkeRoblox2', 'AkeRoblox3', 'AkeRoblox4', 'AkeRoblox5'
  ];
  const PROMO_REWARD = 15;
  const promoForm = document.getElementById('promo-form');
  const promoInput = document.getElementById('promo-code');
  const promoBtn = document.getElementById('promo-btn');
  const promoMessage = document.getElementById('promo-message');
  const promoKey = `redeemedPromos_${username}`;
  let redeemedPromos = [];
  if (localStorage.getItem(promoKey)) {
    redeemedPromos = JSON.parse(localStorage.getItem(promoKey));
  }
  function saveRedeemedPromos() {
    localStorage.setItem(promoKey, JSON.stringify(redeemedPromos));
  }
  if (promoForm && promoInput && promoBtn && promoMessage) {
    promoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const code = promoInput.value.trim();
      if (!PROMO_CODES.includes(code)) {
        promoMessage.textContent = 'Invalid promo code.';
        promoMessage.style.color = '#ff4b4b';
        return;
      }
      if (redeemedPromos.includes(code)) {
        promoMessage.textContent = 'You have already used this code.';
        promoMessage.style.color = '#ffb200';
        return;
      }
      setBalance(getBalance() + PROMO_REWARD);
      refreshBalanceDisplay();
      redeemedPromos.push(code);
      saveRedeemedPromos();
      promoMessage.textContent = `Success! R$${PROMO_REWARD} has been added to your balance.`;
      promoMessage.style.color = '#00ffb2';
      promoInput.value = '';
    });
  }
  // Helper to always update the balance display
  function refreshBalanceDisplay() {
    document.getElementById('robux-balance').textContent = `R$${getBalance()}`;
  }

  // Always display the correct balance after setting username
  refreshBalanceDisplay();

  // MutationObserver to update balance if username changes (extra safety)
  const usernameObserver = new MutationObserver(() => {
    refreshBalanceDisplay();
  });
  const usernameEl = document.getElementById('dashboard-username');
  if (usernameEl) {
    usernameObserver.observe(usernameEl, { childList: true });
  }

  // Profile section: update info when shown
  function updateProfileSection() {
    const username = localStorage.getItem('robloxUsername') || '';
    const balance = getBalance();
    if (document.getElementById('profile-username')) {
      document.getElementById('profile-username').textContent = username;
    }
    if (document.getElementById('profile-roblox-username')) {
      document.getElementById('profile-roblox-username').textContent = username;
    }
    if (document.getElementById('profile-balance')) {
      document.getElementById('profile-balance').textContent = `R$${balance}`;
    }
  }
  // Show profile info when Profile tab is clicked
  const profileTabBtn = document.querySelector('.dashboard-nav button[data-section="profile"]');
  if (profileTabBtn) {
    profileTabBtn.addEventListener('click', updateProfileSection);
  }

  // Hamburger menu logic for mobile
  const hamburger = document.getElementById('dashboard-hamburger');
  const mobileMenu = document.getElementById('dashboard-mobile-menu');
  const nav = document.getElementById('dashboard-nav');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      if (mobileMenu.style.display === 'block') {
        mobileMenu.style.display = 'none';
      } else {
        mobileMenu.style.display = 'block';
      }
    });
    // Hide mobile menu when a menu item is clicked, and switch section
    mobileMenu.querySelectorAll('.mobile-menu-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        mobileMenu.style.display = 'none';
        // Switch section
        const section = btn.getAttribute('data-section');
        document.querySelectorAll('.dashboard-nav button').forEach(navBtn => {
          if (navBtn.getAttribute('data-section') === section) {
            navBtn.click();
          }
        });
      });
    });
  }
});
