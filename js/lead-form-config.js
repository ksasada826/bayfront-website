/**
 * ステップ式リードフォームの質問・文言。差し替えはこのファイルだけ。
 * intro(n) の n はメール画面を含む質問数。doneP(email) は完了画面の文。
 */
window.BAYFRONT_LEAD_FORM = {
  timingEnabled: false,
  analytics: { gaMeasurementId: "G-DZPYBJJFDT" },
  steps: [
    {
      id: "service",
      q: { en: "What do you need help with?", ja: "どのような支援をお探しですか" },
      options: [
        { value: "entry_strategy", en: ["Japan market entry strategy", "Why Japan, why now, and where to start."], ja: ["日本進出の戦略づくり", "なぜ日本か、なぜ今か、どこから始めるかを固めます"] },
        { value: "partner_customer", en: ["Partner & customer development", "Mapping and opening doors with Japanese buyers and partners."], ja: ["提携先・顧客の開拓", "日本の買い手と提携先を洗い出し、商談の入口をつくります"] },
        { value: "japan_desk", en: ["Local Japan desk", "An ongoing local BD owner working for your HQ."], ja: ["日本の窓口（継続支援）", "本社に代わり、日本側の事業開発を継続して担当します"] },
        { value: "other", en: ["Something else", ""], ja: ["その他", ""] }
      ]
    },
    {
      id: "stage",
      q: { en: "Where are you with Japan today?", ja: "日本での現在の状況を教えてください" },
      options: [
        { value: "exploring", en: ["Exploring Japan", ""], ja: ["日本進出を検討し始めた", ""] },
        { value: "ready_outreach", en: ["Ready to start outreach", ""], ja: ["営業や提携の打診を始めたい", ""] },
        { value: "in_japan", en: ["Already in Japan, need traction", ""], ja: ["すでに日本で活動中で、成果を伸ばしたい", ""] }
      ]
    },
    {
      id: "timing",
      optional: true,
      q: { en: "When would you like to start?", ja: "いつ頃から始めたいですか" },
      options: [
        { value: "within_3m", en: ["Within 3 months", ""], ja: ["3か月以内", ""] },
        { value: "3_to_6m", en: ["In 3–6 months", ""], ja: ["3〜6か月後", ""] },
        { value: "just_exploring", en: ["Just exploring for now", ""], ja: ["まだ情報収集の段階", ""] }
      ]
    }
  ],
  copy: {
    en: {
      intro: (n) => `${n} quick questions. We'll reply by email.`,
      back: "Back",
      contactQ: "Where should we reply?",
      label: "Work email",
      placeholder: "you@company.com",
      send: "Send",
      error: "Enter an email address like name@company.com.",
      note: 'We use your email only to reply. See our <a href="/privacy/">Privacy Policy</a>.',
      doneQ: "Thanks. We received your request.",
      doneP: (email) => `We'll reply to ${email} by email.`,
      pref: "Add us as a preferred source on Google",
      sendError: "Something went wrong. Please try again in a moment.",
      sending: "Sending…"
    },
    ja: {
      intro: (n) => `${n}つの質問にお答えください。メールでご連絡します。`,
      back: "戻る",
      contactQ: "返信先のメールアドレスを教えてください",
      label: "メールアドレス",
      placeholder: "you@company.com",
      send: "送信する",
      error: "name@company.com の形で入力してください。",
      note: 'いただいたメールアドレスは返信のためだけに使います。<a href="/ja/privacy/">プライバシーポリシー</a>',
      doneQ: "受け付けました。",
      doneP: (email) => `${email} 宛てに、メールでご連絡します。`,
      pref: "Google の優先ソースに追加",
      sendError: "送信できませんでした。少し時間をおいて、もう一度お試しください。",
      sending: "送信中…"
    }
  }
};
