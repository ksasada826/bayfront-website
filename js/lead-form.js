(function () {
  const cfg = window.BAYFRONT_LEAD_FORM || {};
  const root = document.getElementById("lead-form");
  const panel = document.getElementById("lead-panel");
  const intro = document.getElementById("lead-intro");
  if (!root || !panel) return;

  const lang = document.documentElement.lang === "ja" ? "ja" : "en";
  const copy = (cfg.copy && cfg.copy[lang]) || {};
  const timingEnabled = !!cfg.timingEnabled;
  const steps = (cfg.steps || []).filter((step) => !step.optional || timingEnabled);
  const total = steps.length + 1;

  const progress = root.querySelector(".progress");
  const countEl = root.querySelector(".count");
  const barFill = root.querySelector(".bar i");
  const backBtn = root.querySelector(".back");
  const botInput = root.querySelector('input[name="botcheck"]');

  const state = { i: 0, answers: {}, email: "", done: false };
  let advanceTimer = 0;
  let gaStarted = false;

  const needKey = lang === "ja"
    ? "フォームの送信先がまだ接続されていません（Web3Forms のキー設定が必要です）。"
    : "Form is not connected yet. The site owner still needs to add a Web3Forms access key.";

  function track(name, params) {
    const id = String((cfg.analytics && cfg.analytics.gaMeasurementId) || "").trim();
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!gaStarted) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", id);
      gaStarted = true;
    }
    window.gtag("event", name, params);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function optionByValue(stepId, value) {
    const step = (cfg.steps || []).find((item) => item.id === stepId);
    if (!step) return null;
    return (step.options || []).find((item) => item.value === value) || null;
  }

  function optionHeading(stepId, value) {
    const option = optionByValue(stepId, value);
    if (!option || !option[lang]) return "";
    return option[lang][0] || "";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());
  }

  function waitMs() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
  }

  function formatJst(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date);
    const map = {};
    parts.forEach((part) => { map[part.type] = part.value; });
    return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute} (JST)`;
  }

  function fillIntro() {
    if (!intro) return;
    intro.textContent = typeof copy.intro === "function" ? copy.intro(total) : String(copy.intro || "");
  }

  function focusQuestion() {
    const heading = panel.querySelector(".q");
    if (heading) heading.focus();
  }

  function currentStepId() {
    return state.i < steps.length ? steps[state.i].id : "contact";
  }

  function viewEvent() {
    track("lead_step_view", {
      step_number: state.i + 1,
      step_id: currentStepId(),
      lang: lang
    });
  }

  function render(moveFocus) {
    if (state.done) {
      if (progress) progress.hidden = true;
      const doneBody = typeof copy.doneP === "function"
        ? copy.doneP(escapeHtml(state.email))
        : escapeHtml(copy.doneP || "");
      panel.innerHTML = `<div class="done"><h2 class="q" tabindex="-1">${escapeHtml(copy.doneQ || "")}</h2><p>${doneBody}</p></div>`;
      if (moveFocus) focusQuestion();
      return;
    }

    if (progress) progress.hidden = false;
    if (countEl) {
      countEl.innerHTML = `${pad(state.i + 1)} <small>/ ${pad(total)}</small>`;
    }
    if (barFill) barFill.style.width = `${((state.i + 1) / total) * 100}%`;
    if (backBtn) {
      backBtn.hidden = state.i === 0;
      backBtn.disabled = state.i === 0;
      backBtn.textContent = copy.back || "";
    }

    if (state.i < steps.length) {
      const step = steps[state.i];
      const picked = state.answers[step.id];
      const buttons = (step.options || []).map((option) => {
        const pair = option[lang] || ["", ""];
        const title = escapeHtml(pair[0] || "");
        const desc = pair[1] ? `<span class="opt-desc">${escapeHtml(pair[1])}</span>` : "";
        const on = picked === option.value ? " is-picked" : "";
        return `<button type="button" class="opt${on}" data-value="${escapeHtml(option.value)}"><span class="opt-title">${title}</span>${desc}</button>`;
      }).join("");
      const question = (step.q && step.q[lang]) || "";
      panel.innerHTML = `<h2 class="q" tabindex="-1">${escapeHtml(question)}</h2><div class="options">${buttons}</div>`;
      panel.querySelectorAll(".opt").forEach((btn) => {
        btn.addEventListener("click", () => pick(step, btn));
      });
    } else {
      const recap = steps.map((step) => `<li>${escapeHtml(optionHeading(step.id, state.answers[step.id]))}</li>`).join("");
      panel.innerHTML = `<h2 class="q" tabindex="-1">${escapeHtml(copy.contactQ || "")}</h2>
        <ul class="recap">${recap}</ul>
        <form id="email-form" novalidate>
          <div class="field">
            <label for="lead-email">${escapeHtml(copy.label || "")}</label>
            <input id="lead-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="${escapeHtml(copy.placeholder || "")}" value="${escapeHtml(state.email)}" aria-describedby="lead-error">
            <p class="error" id="lead-error" role="alert"></p>
          </div>
          <button type="submit" class="send">${escapeHtml(copy.send || "")}</button>
          <p class="note">${copy.note || ""}</p>
        </form>`;
      const form = document.getElementById("email-form");
      const input = document.getElementById("lead-email");
      form.addEventListener("submit", submit);
      input.addEventListener("input", () => {
        state.email = input.value;
        if (input.getAttribute("aria-invalid") === "true" && validEmail(state.email)) {
          input.removeAttribute("aria-invalid");
          document.getElementById("lead-error").textContent = "";
        }
      });
    }

    if (moveFocus) focusQuestion();
  }

  function pick(step, btn) {
    if (advanceTimer) return;
    state.answers[step.id] = btn.getAttribute("data-value");
    btn.parentElement.querySelectorAll(".opt").forEach((item) => {
      item.classList.toggle("is-picked", item === btn);
    });
    track("lead_answer", { step_id: step.id, answer: state.answers[step.id] });
    advanceTimer = window.setTimeout(() => {
      advanceTimer = 0;
      state.i += 1;
      render(true);
      viewEvent();
    }, waitMs());
  }

  function setError(message, invalid) {
    const input = document.getElementById("lead-email");
    const errorEl = document.getElementById("lead-error");
    if (errorEl) errorEl.textContent = message || "";
    if (!input) return;
    if (invalid) {
      input.setAttribute("aria-invalid", "true");
      input.focus();
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  async function submit(event) {
    event.preventDefault();
    const input = document.getElementById("lead-email");
    const button = event.target.querySelector('button[type="submit"]');
    state.email = input.value.trim();
    if (!validEmail(state.email)) {
      setError(copy.error || "", true);
      track("lead_submit_error", { reason: "invalid_email" });
      return;
    }

    const key = String((window.BAYFRONT_FORM && window.BAYFRONT_FORM.accessKey) || "").trim();
    if (!key) {
      setError(needKey, false);
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = copy.sending || "";
    }
    setError("", false);

    const payload = {
      access_key: key,
      subject: lang === "ja"
        ? "Bayfront Partners — website lead (JA)"
        : "Bayfront Partners — website lead (EN)",
      from_name: "Bayfront Partners site",
      email: state.email,
      submitted_at: formatJst(new Date()),
      page_url: location.href,
      referrer: document.referrer || "(direct)",
      lang: lang,
      botcheck: !!(botInput && botInput.checked)
    };
    steps.forEach((step) => {
      payload[step.id] = optionHeading(step.id, state.answers[step.id]);
    });

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const submitParams = { lang: lang, timing: "" };
        steps.forEach((step) => { submitParams[step.id] = state.answers[step.id] || ""; });
        track("lead_submit", submitParams);
        state.done = true;
        render(true);
        return;
      }
      setError(copy.sendError || "", false);
      track("lead_submit_error", { reason: "rejected" });
    } catch (_err) {
      setError(copy.sendError || "", false);
      track("lead_submit_error", { reason: "network" });
    }

    if (button) {
      button.disabled = false;
      button.textContent = copy.send || "";
    }
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (advanceTimer) {
        window.clearTimeout(advanceTimer);
        advanceTimer = 0;
      }
      if (state.i <= 0) return;
      state.i -= 1;
      render(true);
      viewEvent();
    });
  }

  fillIntro();
  render(false);
  viewEvent();
})();
