function simpleHash(input) {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
      }
      return "h_" + Math.abs(hash);
    }

    const ENCRYPTION_SECRET = "forge-fit-demo-secret-2026";

    function xorCipher(str, key) {
      let output = "";
      for (let i = 0; i < str.length; i++) {
        output += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return output;
    }

    function encryptData(obj, userEmail) {
      const payload = JSON.stringify(obj);
      const key = ENCRYPTION_SECRET + "|" + userEmail;
      return btoa(xorCipher(payload, key));
    }

    function decryptData(encoded, userEmail) {
      try {
        const key = ENCRYPTION_SECRET + "|" + userEmail;
        const decoded = atob(encoded);
        const decrypted = xorCipher(decoded, key);
        return JSON.parse(decrypted);
      } catch {
        return null;
      }
    }

    const STORAGE_KEYS = {
      USERS: "forgeFit_users",
      SESSION: "forgeFit_session"
    };

    function loadUsers() {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }

    function saveUsers(users) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    function setSession(email) {
      localStorage.setItem(STORAGE_KEYS.SESSION, email);
    }

    function clearSession() {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    function getSession() {
      return localStorage.getItem(STORAGE_KEYS.SESSION);
    }

    function loadUserData(email) {
      const key = "forgeFit_user_" + simpleHash(email);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return decryptData(raw, email);
    }

    function saveUserData(email, data) {
      const key = "forgeFit_user_" + simpleHash(email);
      const encrypted = encryptData(data, email);
      localStorage.setItem(key, encrypted);
    }

    const defaultUserData = (goal = "lean") => ({
      goal,
      workouts: [],
      meals: [],
      measurements: [],
      hydrationLiters: 0
    });

    let currentUserEmail = null;
    let currentUserGoal = "lean";
    let currentData = defaultUserData("lean");

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".main .section");
    const themeToggle = document.getElementById("themeToggle");
    const navAuthState = document.getElementById("navAuthState");
    const navAuthText = document.getElementById("navAuthText");

    const authTabs = document.querySelectorAll(".tab-auth");
    const signupGoalField = document.getElementById("signupGoalField");
    const authForm = document.getElementById("authForm");
    const authEmail = document.getElementById("authEmail");
    const authPassword = document.getElementById("authPassword");
    const authGoal = document.getElementById("authGoal");
    const authButtonLabel = document.getElementById("authButtonLabel");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const authMessage = document.getElementById("authMessage");
    const guestModeLink = document.getElementById("guestModeLink");

    const primaryCta = document.getElementById("primaryCta");
    const viewDemoDashboard = document.getElementById("viewDemoDashboard");

    const plansGrid = document.getElementById("plansGrid");
    const planTabs = document.querySelectorAll(".section[data-section='plans'] .tab");

    const timelineRow = document.getElementById("timelineRow");

    const statWorkouts = document.getElementById("statWorkouts");
    const statCalories = document.getElementById("statCalories");
    const statConsistency = document.getElementById("statConsistency");
    const statHydration = document.getElementById("statHydration");
    const statWorkoutsBar = document.getElementById("statWorkoutsBar");
    const statCaloriesBar = document.getElementById("statCaloriesBar");
    const statConsistencyBar = document.getElementById("statConsistencyBar");
    const statHydrationBar = document.getElementById("statHydrationBar");

    const statWorkoutsBig = document.getElementById("statWorkoutsBig");
    const statWorkoutsBigBar = document.getElementById("statWorkoutsBigBar");
    const statWorkoutsTrend = document.getElementById("statWorkoutsTrend");
    const statCaloriesBig = document.getElementById("statCaloriesBig");
    const statCaloriesBigBar = document.getElementById("statCaloriesBigBar");
    const statCaloriesTrend = document.getElementById("statCaloriesTrend");
    const statWeight = document.getElementById("statWeight");
    const statWeightBar = document.getElementById("statWeightBar");
    const statWeightMeta = document.getElementById("statWeightMeta");

    const workoutTableBody = document.querySelector("#workoutTable tbody");
    const activityFeed = document.getElementById("activityFeed");

    const logWorkoutType = document.getElementById("logWorkoutType");
    const logWorkoutDuration = document.getElementById("logWorkoutDuration");
    const logWorkoutIntensity = document.getElementById("logWorkoutIntensity");
    const logWorkoutBtn = document.getElementById("logWorkoutBtn");

    const logMealName = document.getElementById("logMealName");
    const logMealCalories = document.getElementById("logMealCalories");
    const logMealProtein = document.getElementById("logMealProtein");
    const logMealBtn = document.getElementById("logMealBtn");

    const measureWeight = document.getElementById("measureWeight");
    const measureChest = document.getElementById("measureChest");
    const measureWaist = document.getElementById("measureWaist");
    const measureArms = document.getElementById("measureArms");
    const measureLegs = document.getElementById("measureLegs");
    const logMeasurementBtn = document.getElementById("logMeasurementBtn");

    const contactForm = document.getElementById("contactForm");
    const contactMessageStatus = document.getElementById("contactMessageStatus");

    function showSection(id) {
      sections.forEach(sec => {
        sec.classList.toggle("hidden", sec.getAttribute("data-section") !== id);
      });
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("data-section") === id);
      });
    }

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        const id = link.getAttribute("data-section");
        showSection(id);
      });
    });

    primaryCta.addEventListener("click", () => {
      showSection("plans");
      planTabs.forEach(tab => {
        tab.classList.toggle("active", tab.getAttribute("data-plan") === currentUserGoal);
      });
      renderPlans(currentUserGoal);
    });

    viewDemoDashboard.addEventListener("click", () => {
      showSection("dashboard");
    });

    function applyThemeFromStorage() {
      const stored = localStorage.getItem("forgeFit_theme");
      if (stored === "light") {
        document.body.classList.add("light");
      }
    }
    applyThemeFromStorage();

    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light");
      localStorage.setItem("forgeFit_theme", isLight ? "light" : "dark");
    });

    let authMode = "login";

    authTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        authTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        authMode = tab.getAttribute("data-auth");
        signupGoalField.style.display = authMode === "signup" ? "block" : "none";
        authButtonLabel.textContent = authMode === "signup" ? "Sign up" : "Login";
        authMessage.style.display = "none";
      });
    });

    guestModeLink.addEventListener("click", () => {
      currentUserEmail = null;
      currentUserGoal = "lean";
      currentData = defaultUserData("lean");
      navAuthText.textContent = "Guest mode · Demo data only";
      navAuthState.classList.remove("pill-logout");
      navAuthState.innerHTML = `
        <span class="pill-dot"></span>
        <span id="navAuthText">Guest mode · Demo data only</span>
      `;
      renderAll();
    });

    function setLoggedInUI(email) {
      const initial = email ? email[0].toUpperCase() : "?";
      navAuthState.classList.add("pill-logout");
      navAuthState.innerHTML = `
        <div class="user-pic">${initial}</div>
        <span>${email}</span>
        <span class="link-sm" id="logoutLink">Logout</span>
      `;
      const logoutLink = document.getElementById("logoutLink");
      logoutLink.addEventListener("click", () => {
        clearSession();
        currentUserEmail = null;
        currentUserGoal = "lean";
        currentData = defaultUserData("lean");
        navAuthState.classList.remove("pill-logout");
        navAuthState.innerHTML = `
          <span class="pill-dot"></span>
          <span id="navAuthText">Guest mode · Demo data only</span>
        `;
        renderAll();
      });
    }

    function tryAutoLogin() {
      const sessionEmail = getSession();
      if (sessionEmail) {
        const users = loadUsers();
        if (users[sessionEmail]) {
          const userData = loadUserData(sessionEmail) || defaultUserData(users[sessionEmail].goal);
          currentUserEmail = sessionEmail;
          currentUserGoal = users[sessionEmail].goal || "lean";
          currentData = userData;
          setLoggedInUI(sessionEmail);
        }
      }
    }
    tryAutoLogin();

    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      authMessage.style.display = "none";
      authMessage.style.color = "var(--danger)";
      const email = authEmail.value.trim().toLowerCase();
      const password = authPassword.value;
      if (!email || !password) {
        authMessage.textContent = "Please fill in email and password.";
        authMessage.style.display = "block";
        return;
      }
      const users = loadUsers();
      if (authMode === "signup") {
        if (users[email]) {
          authMessage.textContent = "Account already exists. Try login instead.";
          authMessage.style.display = "block";
          return;
        }
        const hashed = simpleHash(password);
        const goal = authGoal.value || "lean";
        users[email] = { password: hashed, goal };
        saveUsers(users);
        const data = defaultUserData(goal);
        saveUserData(email, data);
        if (rememberMeCheckbox.checked) setSession(email);
        currentUserEmail = email;
        currentUserGoal = goal;
        currentData = data;
        setLoggedInUI(email);
        authMessage.textContent = "Account created and logged in.";
        authMessage.style.color = "var(--success)";
        authMessage.style.display = "block";
      } else {
        if (!users[email]) {
          authMessage.textContent = "No account found. Sign up first.";
          authMessage.style.display = "block";
          return;
        }
        const hashed = simpleHash(password);
        if (hashed !== users[email].password) {
          authMessage.textContent = "Incorrect password. Try again.";
          authMessage.style.display = "block";
          return;
        }
        const data = loadUserData(email) || defaultUserData(users[email].goal);
        if (rememberMeCheckbox.checked) setSession(email);
        currentUserEmail = email;
        currentUserGoal = users[email].goal || "lean";
        currentData = data;
        setLoggedInUI(email);
        authMessage.textContent = "Login successful.";
        authMessage.style.color = "var(--success)";
        authMessage.style.display = "block";
      }
      renderAll();
    });

    const planPresets = {
      lean: [
        {
          title: "Lean · 5‑day Hypertrophy Split",
          label: "Recomposition",
          meta: ["Push", "Pull", "Legs", "Upper", "Full body"],
          subtitle: "Volume‑balanced to retain muscle while dropping body fat.",
          details: [
            "Day 1: Push – Bench press, incline DB press, shoulder press, triceps dips (3–4 × 8–12, rest 90s).",
            "Day 2: Pull – Rows, pulldowns, face pulls, curls (3–4 × 8–12, rest 90s).",
            "Day 3: Legs – Squats, RDLs, lunges, calves (3–4 × 8–12, rest 90s)."
          ]
        },
        {
          title: "Lean · Macro roadmap",
          label: "Nutrition",
          meta: ["200–400 kcal deficit", "High protein", "Moderate carbs"],
          subtitle: "Target 1.6–2.2 g/kg protein, 0.8–1 g/kg fats, rest from carbs.",
          details: [
            "Protein: Lean meats, eggs, paneer, tofu, Greek yogurt.",
            "Carbs: Oats, rice, potatoes, fruits for training fuel.",
            "Fats: Nuts, seeds, olive oil for hormones and satiety."
          ]
        },
        {
          title: "Lean · Sample day",
          label: "Meals",
          meta: ["~2,000–2,200 kcal", "Natural foods"],
          subtitle: "Example: 70 kg person in mild deficit.",
          details: [
            "Breakfast: Oats + whey + banana (~450 kcal, 30 g protein).",
            "Lunch: Rice + chicken + veggies (~550 kcal, 40 g protein).",
            "Dinner: Roti + paneer + salad (~550 kcal, 35 g protein)."
          ]
        }
      ],
      bulk: [
        {
          title: "Bulky · 5‑day Strength Split",
          label: "Muscle gain",
          meta: ["Push", "Pull", "Legs", "Upper", "Power"],
          subtitle: "Higher load with controlled surplus for lean mass gain.",
          details: [
            "Day 1: Heavy push – 3–5 × 5–8 on compound presses, rest 2–3 min.",
            "Day 2: Heavy pull – 3–5 × 5–8 rows/pulls, rest 2–3 min.",
            "Day 3: Heavy legs – squats, deadlifts, accessories, rest 2–3 min."
          ]
        },
        {
          title: "Bulky · Macro roadmap",
          label: "Nutrition",
          meta: ["200–300 kcal surplus", "Protein 1.6–2 g/kg"],
          subtitle: "Subtle surplus to keep fat gain manageable.",
          details: [
            "Prioritize whole foods but allow flexibility for adherence.",
            "Distribute protein across 3–5 meals for better muscle protein synthesis.",
            "Stay consistent with similar meal timing around training."
          ]
        },
        {
          title: "Bulky · Sample day",
          label: "Meals",
          meta: ["~2,600–2,800 kcal", "Performance focus"],
          subtitle: "Example: 70 kg person in lean surplus.",
          details: [
            "Breakfast: Paratha + eggs + yogurt (~650 kcal, 35 g protein).",
            "Pre‑workout: Fruit + whey (~300 kcal, 25 g protein).",
            "Post‑workout: Rice + dal + chicken (~700 kcal, 45 g protein)."
          ]
        }
      ],
      maintain: [
        {
          title: "Maintenance · 4‑day Hybrid Split",
          label: "Balanced",
          meta: ["Upper/Lower", "Full body", "Conditioning"],
          subtitle: "Blend of strength and cardio to maintain performance.",
          details: [
            "Day 1: Upper – compound presses and pulls, 3–4 × 6–10.",
            "Day 2: Lower – squats, hinges, lunges, 3–4 × 6–10.",
            "Day 3: Full body + conditioning – circuits, intervals."
          ]
        },
        {
          title: "Maintenance · Macro roadmap",
          label: "Nutrition",
          meta: ["Near maintenance", "Flexible dieting"],
          subtitle: "Calories roughly equal to total daily energy expenditure.",
          details: [
            "Protein remains high to preserve lean mass.",
            "Carbs flex up or down with activity level.",
            "Occasional treats are fine within weekly calorie balance."
          ]
        },
        {
          title: "Maintenance · Sample day",
          label: "Meals",
          meta: ["~2,300–2,400 kcal", "Lifestyle"],
          subtitle: "Example: 70 kg person (moderately active).",
          details: [
            "Breakfast: Idli/dosa + sambar (~400 kcal, 15 g protein).",
            "Lunch: Rice + dal + fish (~650 kcal, 35 g protein).",
            "Dinner: Roti + chana + salad (~550 kcal, 25 g protein)."
          ]
        }
      ]
    };

    function renderPlans(goal) {
      const data = planPresets[goal] || [];
      plansGrid.innerHTML = "";
      data.forEach(plan => {
        const card = document.createElement("div");
        card.className = "plan-card";
        card.innerHTML = `
          <div class="plan-title-row">
            <div class="plan-title">${plan.title}</div>
            <div class="plan-label ${
              goal === "lean" ? "pill-goal-lean" : goal === "bulk" ? "pill-goal-bulk" : "pill-goal-maint"
            }">${plan.label}</div>
          </div>
          <div class="plan-meta">
            ${plan.meta.map(m => `<span class="tag-pill">${m}</span>`).join("")}
          </div>
          <div class="plan-subtitle">${plan.subtitle}</div>
          <ul class="list-compact">
            ${plan.details.map(item => `<li>${item}</li>`).join("")}
          </ul>
        `;
        plansGrid.appendChild(card);
      });
    }

    planTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        planTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const goal = tab.getAttribute("data-plan");
        currentUserGoal = goal === "maintain" ? "maintain" : goal;
        if (currentUserEmail) {
          const users = loadUsers();
          if (users[currentUserEmail]) {
            users[currentUserEmail].goal = currentUserGoal;
            saveUsers(users);
          }
          saveUserData(currentUserEmail, currentData);
        }
        renderPlans(currentUserGoal);
        renderTimeline(currentUserGoal);
      });
    });

    function getGoalTimeline(goal) {
      if (goal === "bulk") {
        return [
          {
            label: "1 month",
            main: "+0.5–1.0 kg",
            metric: "Slight strength & muscle increase.",
            tag: "Learning phase"
          },
          {
            label: "3 months",
            main: "+1.5–3.0 kg",
            metric: "Notable strength gains, fuller look.",
            tag: "Visible change"
          },
          {
            label: "6 months",
            main: "+3–5 kg",
            metric: "Improved lifts and fullness.",
            tag: "Intermediate"
          },
          {
            label: "12 months",
            main: "+5–7+ kg",
            metric: "Long‑term lean mass growth.",
            tag: "Advanced"
          }
        ];
      } else if (goal === "maintain") {
        return [
          {
            label: "1 month",
            main: "Energy & routine",
            metric: "Consistent 3–4× training per week.",
            tag: "Habits"
          },
          {
            label: "3 months",
            main: "Performance stability",
            metric: "Lifts and weight stable, better stamina.",
            tag: "Baseline"
          },
          {
            label: "6 months",
            main: "Improved health markers",
            metric: "Better sleep, recovery and mood.",
            tag: "Well‑being"
          },
          {
            label: "12 months",
            main: "Lifestyle identity",
            metric: "Training integrated as default lifestyle.",
            tag: "Identity"
          }
        ];
      }
      return [
        {
          label: "1 month",
          main: "-1–2 kg",
          metric: "Initial water & fat loss.",
          tag: "Kick‑off"
        },
        {
          label: "3 months",
          main: "-3–6 kg",
          metric: "Noticeable waist reduction.",
          tag: "Visible change"
        },
        {
          label: "6 months",
          main: "-6–10 kg",
          metric: "Stronger, leaner, better definition.",
          tag: "Recomp"
        },
        {
          label: "12 months",
          main: "-10+ kg",
          metric: "Major recomposition and habits locked in.",
          tag: "New baseline"
        }
      ];
    }

    function renderTimeline(goal) {
      const items = getGoalTimeline(goal);
      timelineRow.innerHTML = "";
      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "timeline-card";
        card.innerHTML = `
          <div class="timeline-label">${item.label}</div>
          <div class="timeline-main">${item.main}</div>
          <div class="timeline-metric">${item.metric}</div>
          <div class="timeline-tag">${item.tag}</div>
          <div class="timeline-halo"></div>
        `;
        timelineRow.appendChild(card);
      });
    }

    function addActivity(type, description) {
      const date = new Date().toLocaleDateString();
      currentData.activity = currentData.activity || [];
      currentData.activity.unshift({ date, type, description });
      if (currentData.activity.length > 12) currentData.activity.pop();
      if (currentUserEmail) saveUserData(currentUserEmail, currentData);
    }

    function renderActivity() {
      activityFeed.innerHTML = "";
      const items = currentData.activity || [];
      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "activity-item";
        empty.innerHTML = `
          <div class="activity-main">
            <div class="activity-title">No activity yet</div>
            <div class="activity-meta">Logs you add here will show up as a timeline of effort.</div>
          </div>
          <span class="activity-tag">Start today</span>
        `;
        activityFeed.appendChild(empty);
        return;
      }
      items.forEach(item => {
        const tag =
          item.type === "workout" ? "Workout" : item.type === "meal" ? "Meal" : "Measurement";
        const el = document.createElement("div");
        el.className = "activity-item";
        el.innerHTML = `
          <div class="activity-main">
            <div class="activity-title">${item.date}</div>
            <div class="activity-meta">${item.description}</div>
          </div>
          <span class="activity-tag">${tag}</span>
        `;
        activityFeed.appendChild(el);
      });
    }

    logWorkoutBtn.addEventListener("click", () => {
      const type = logWorkoutType.value.trim() || "Workout";
      const duration = parseInt(logWorkoutDuration.value, 10) || 0;
      const intensity = logWorkoutIntensity.value;
      const date = new Date().toLocaleDateString();
      currentData.workouts.push({ date, type, duration, intensity });
      addActivity("workout", `${type} · ${duration} min · ${intensity} intensity`);
      if (currentUserEmail) saveUserData(currentUserEmail, currentData);
      logWorkoutType.value = "";
      logWorkoutDuration.value = "";
      renderDashboard();
    });

    logMealBtn.addEventListener("click", () => {
      const name = logMealName.value.trim() || "Meal";
      const calories = parseInt(logMealCalories.value, 10) || 0;
      const protein = parseInt(logMealProtein.value, 10) || 0;
      const date = new Date().toLocaleDateString();
      currentData.meals.push({ date, name, calories, protein });
      addActivity("meal", `${name} · ${calories} kcal · ${protein} g protein`);
      if (currentUserEmail) saveUserData(currentUserEmail, currentData);
      logMealName.value = "";
      logMealCalories.value = "";
      logMealProtein.value = "";
      renderDashboard();
    });

    logMeasurementBtn.addEventListener("click", () => {
      const weight = parseFloat(measureWeight.value);
      const chest = parseFloat(measureChest.value);
      const waist = parseFloat(measureWaist.value);
      const arms = parseFloat(measureArms.value);
      const legs = parseFloat(measureLegs.value);
      const date = new Date().toLocaleDateString();
      const m = { date, weight, chest, waist, arms, legs };
      currentData.measurements.push(m);
      addActivity(
        "measurement",
        `Weight ${weight || "?"} kg · Waist ${waist || "?"} cm · Chest ${chest || "?"} cm`
      );
      if (currentUserEmail) saveUserData(currentUserEmail, currentData);
      measureWeight.value = "";
      measureChest.value = "";
      measureWaist.value = "";
      measureArms.value = "";
      measureLegs.value = "";
      renderDashboard();
    });

    function renderDashboard() {
      workoutTableBody.innerHTML = "";
      const workouts = currentData.workouts.slice().reverse().slice(0, 6);
      workouts.forEach(w => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${w.date}</td>
          <td>${w.type}</td>
          <td>${w.duration} min</td>
          <td>${w.intensity}</td>
        `;
        workoutTableBody.appendChild(tr);
      });

      const recent7 = currentData.workouts.slice(-7);
      const weekly = recent7.length;
      statWorkouts.textContent = `${weekly} sessions`;
      statWorkoutsBar.style.width = Math.min(weekly / 5 * 100, 100) + "%";
      statWorkoutsBig.textContent = weekly;
      statWorkoutsBigBar.style.width = Math.min(weekly / 5 * 100, 100) + "%";
      statWorkoutsTrend.textContent = `${weekly} this week`;

      const recentMeals = currentData.meals.slice(-10);
      let totalCalories = 0;
      recentMeals.forEach(m => {
        totalCalories += m.calories || 0;
      });
      const avgCalories = recentMeals.length ? Math.round(totalCalories / recentMeals.length) : 0;
      const targetCalories = currentUserGoal === "bulk" ? 2600 : currentUserGoal === "maintain" ? 2300 : 2000;
      const ratio = targetCalories ? (avgCalories / targetCalories) : 0;
      statCalories.textContent = `${avgCalories} kcal`;
      statCaloriesBar.style.width = Math.min(ratio * 100, 100) + "%";
      statCaloriesBig.textContent = `${avgCalories} kcal`;
      statCaloriesBigBar.style.width = Math.min(ratio * 100, 100) + "%";
      statCaloriesTrend.textContent = `${avgCalories ? Math.round(ratio * 100) : 0}% of goal`;

      const totalDays = 7;
      const daysWithWorkout = Math.min(weekly, totalDays);
      const consistency = Math.round((daysWithWorkout / totalDays) * 100);
      statConsistency.textContent = `${consistency}%`;
      statConsistencyBar.style.width = consistency + "%";

      const hydration = currentData.hydrationLiters || 0;
      const hydrationTarget = 3;
      const hydrationRatio = Math.min(hydration / hydrationTarget, 1);
      statHydration.textContent = `${hydration.toFixed(1)} / ${hydrationTarget} L`;
      statHydrationBar.style.width = hydrationRatio * 100 + "%";

      const lastMeasure = currentData.measurements.slice(-1)[0];
      if (lastMeasure && lastMeasure.weight) {
        statWeight.textContent = `${lastMeasure.weight} kg`;
        const baseline =
          currentUserGoal === "bulk"
            ? lastMeasure.weight - 2
            : currentUserGoal === "maintain"
            ? lastMeasure.weight
            : lastMeasure.weight + 2;
        const diff = lastMeasure.weight - baseline;
        const delta = diff.toFixed(1);
        statWeightBar.style.width = Math.min(Math.abs(diff) / 5 * 100, 100) + "%";
        if (currentUserGoal === "bulk") {
          statWeightMeta.textContent = delta >= 0 ? `+${delta} kg vs baseline` : `${delta} kg vs baseline`;
          statWeightMeta.className = delta >= 0 ? "stat-trend-up" : "stat-trend-down";
        } else if (currentUserGoal === "lean") {
          statWeightMeta.textContent = delta <= 0 ? `${delta} kg vs baseline` : `+${delta} kg vs baseline`;
          statWeightMeta.className = delta <= 0 ? "stat-trend-up" : "stat-trend-down";
        } else {
          statWeightMeta.textContent = Math.abs(diff) < 1 ? "Goal‑aligned" : `${delta} kg drift`;
          statWeightMeta.className = Math.abs(diff) < 1 ? "stat-trend-up" : "stat-trend-down";
        }
      } else {
        statWeight.textContent = "— kg";
        statWeightBar.style.width = "0%";
        statWeightMeta.textContent = "Log your first measurements";
        statWeightMeta.className = "";
      }
      renderActivity();
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactMessageStatus.textContent = "Message captured in demo mode. Wire this to your email/API in production.";
      contactMessageStatus.style.display = "block";
      setTimeout(() => {
        contactMessageStatus.style.display = "none";
      }, 3000);
      contactForm.reset();
    });

    function renderAll() {
      renderPlans(currentUserGoal);
      renderTimeline(currentUserGoal);
      renderDashboard();
    }

    renderAll();