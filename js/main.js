const siteNav = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const contactForm = document.getElementById("contact-form");
const formHint = document.getElementById("form-hint");

const isJa = document.documentElement.lang === "ja";

const formCopy = isJa
  ? {
      sending: "送信中…",
      ok: "送信しました。内容を確認のうえ、メールでご返信します。",
      err: "送信に失敗しました。しばらくしてからもう一度お試しください。",
      needKey: "フォームの送信先がまだ接続されていません（Web3Forms のキー設定が必要です）。"
    }
  : {
      sending: "Sending…",
      ok: "Thanks — we received your message and will reply by email.",
      err: "Something went wrong. Please try again in a moment.",
      needKey: "Form is not connected yet. The site owner still needs to add a Web3Forms access key."
    };

function setNavOpen(open) {
  if (!siteNav || !navToggle) return;
  siteNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute(
    "aria-label",
    open
      ? (isJa ? "メニューを閉じる" : "Close menu")
      : (isJa ? "メニューを開く" : "Open menu")
  );
}

function setFormHint(text, state) {
  if (!formHint) return;
  formHint.textContent = text || "";
  formHint.classList.remove("is-error", "is-ok");
  if (state === "error") formHint.classList.add("is-error");
  if (state === "ok") formHint.classList.add("is-ok");
}

function formAccessKey() {
  const cfg = window.BAYFRONT_FORM || {};
  return (cfg.accessKey || "").trim();
}

if (navToggle) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setNavOpen(!siteNav.classList.contains("is-open"));
  });
}

if (navLinks) {
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setNavOpen(false);
});

document.addEventListener("click", (e) => {
  if (!siteNav || !siteNav.classList.contains("is-open")) return;
  if (!siteNav.contains(e.target)) setNavOpen(false);
});

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = formAccessKey();
    if (!key) {
      setFormHint(formCopy.needKey, "error");
      return;
    }
    if (!contactForm.reportValidity()) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    setFormHint(formCopy.sending, null);

    const fd = new FormData(contactForm);
    const payload = {
      access_key: key,
      subject: isJa
        ? "Bayfront Partners — website inquiry (JA)"
        : "Bayfront Partners — website inquiry (EN)",
      from_name: "Bayfront Partners site",
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      botcheck: fd.get("botcheck") ? true : false
    };

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
        contactForm.reset();
        setFormHint(formCopy.ok, "ok");
      } else {
        setFormHint(formCopy.err, "error");
      }
    } catch (_err) {
      setFormHint(formCopy.err, "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
