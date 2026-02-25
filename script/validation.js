/* ===========================================
   FITサイトお問い合わせフォーム
   バリデーション → 確認画面 → GAS送信
=========================================== */
let isSubmitting = false;
const GAS_URL =
    "https://script.google.com/macros/s/AKfycbznG2cKnpB0vyBnhpJn5t6L55BGhpOmveNdnnQlZ6y8SoVomParXu0ugnfDXEqYU4Cp/exec";

document.addEventListener("DOMContentLoaded", () => {
    /* -----------------------------------------
   共通ユーティリティ
----------------------------------------- */

    function setValid(ruleEl, ok) {
        ruleEl.classList.toggle("valid", ok);
        ruleEl.classList.toggle("invalid", !ok);
    }

    function setupValidation({ inputEl, panelEl, rules, onInput }) {
        panelEl.hidden = true;

        inputEl.addEventListener("focus", () => {
            panelEl.hidden = false;
            onInput();
        });

        inputEl.addEventListener("blur", () => {
            if (isSubmitting) return; // submit時のみ blur を無視
            panelEl.hidden = true;
        });

        inputEl.addEventListener("input", onInput);

        return onInput;
    }

    /* -----------------------------------------
   ご用件（チェックボックス）
----------------------------------------- */

    const topicGroup = document.querySelectorAll('input[name="topic"]');
    const topicPanel = document.getElementById("topic-panel");

    const topicRules = {
        required: topicPanel.querySelector('[data-rule="required"]'),
        allowed: topicPanel.querySelector('[data-rule="allowed"]'),
    };

    const allowedTopics = [
        "pruning",
        "garden",
        "weeding",
        "plantcare",
        "chemical",
        "other",
    ];

    function validateTopic() {
        const checked = [...topicGroup].filter((cb) => cb.checked);
        const hasChecked = checked.length > 0;

        setValid(topicRules.required, hasChecked);

        const invalid = checked.some((cb) => !allowedTopics.includes(cb.value));
        setValid(topicRules.allowed, hasChecked && !invalid);
    }

    topicGroup.forEach((cb) => {
        cb.addEventListener("change", () => {
            topicPanel.hidden = false;
            validateTopic();
        });
    });

    /* -----------------------------------------
   お名前
----------------------------------------- */

    const nameInput = document.getElementById("name");
    const namePanel = document.getElementById("name-panel");

    const nameRules = {
        required: namePanel.querySelector('[data-rule="required"]'),
        length: namePanel.querySelector('[data-rule="length"]'),
        charset: namePanel.querySelector('[data-rule="charset"]'),
    };

    const allowedNameRegex =
        /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3000・ー]+$/;

    function validateName() {
        const v = nameInput.value;

        setValid(nameRules.required, v.length > 0);
        setValid(nameRules.length, v.length > 0 && v.length <= 30);
        setValid(nameRules.charset, v.length > 0 && allowedNameRegex.test(v));
    }

    setupValidation({
        inputEl: nameInput,
        panelEl: namePanel,
        rules: nameRules,
        onInput: validateName,
    });

    /* -----------------------------------------
   メール
----------------------------------------- */

    const emailInput = document.getElementById("email");
    const emailPanel = document.getElementById("email-panel");

    const emailRules = {
        required: emailPanel.querySelector('[data-rule="required"]'),
        format: emailPanel.querySelector('[data-rule="format"]'),
        nozenkaku: emailPanel.querySelector('[data-rule="nozenkaku"]'),
        localdomain: emailPanel.querySelector('[data-rule="localdomain"]'),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail() {
        const v = emailInput.value;

        setValid(emailRules.required, v.length > 0);

        if (v.length === 0) {
            setValid(emailRules.format, false);
            setValid(emailRules.nozenkaku, false);
            setValid(emailRules.localdomain, false);
            return;
        }

        setValid(emailRules.nozenkaku, !/[^\x00-\x7F]/.test(v));
        setValid(emailRules.format, emailRegex.test(v));

        const parts = v.split("@");
        setValid(
            emailRules.localdomain,
            parts.length === 2 && parts[0] && parts[1]
        );
    }

    setupValidation({
        inputEl: emailInput,
        panelEl: emailPanel,
        rules: emailRules,
        onInput: validateEmail,
    });

    /* -----------------------------------------
   電話番号
----------------------------------------- */

    const telInput = document.getElementById("tel");
    const telPanel = document.getElementById("tel-panel");

    const telRules = {
        required: telPanel.querySelector('[data-rule="required"]'),
        format: telPanel.querySelector('[data-rule="format"]'),
        length: telPanel.querySelector('[data-rule="length"]'),
        hyphen: telPanel.querySelector('[data-rule="hyphen"]'),
    };

    function validateTel() {
        const v = telInput.value;

        setValid(telRules.required, v.length > 0);
        setValid(telRules.format, /^[0-9\-]+$/.test(v));

        const digits = v.replace(/-/g, "");
        setValid(telRules.length, digits.length === 10 || digits.length === 11);

        const pattern = /^0\d{1,3}-\d{1,4}-\d{3,4}$/;
        setValid(telRules.hyphen, v.length > 0 && pattern.test(v));
    }

    setupValidation({
        inputEl: telInput,
        panelEl: telPanel,
        rules: telRules,
        onInput: validateTel,
    });

    /* -----------------------------------------
   ご予算
----------------------------------------- */

    const budgetSelect = document.getElementById("budget");
    const budgetPanel = document.getElementById("budget-panel");

    const budgetRules = {
        required: budgetPanel.querySelector('[data-rule="required"]'),
        allowed: budgetPanel.querySelector('[data-rule="allowed"]'),
    };

    const allowedBudgetValues = [
        "〜 10万円",
        "10〜30万円",
        "30〜50万円",
        "50〜100万円",
        "100万円〜",
        "相談したい",
    ];

    function validateBudget() {
        const v = budgetSelect.value;

        setValid(budgetRules.required, v.length > 0);
        setValid(budgetRules.allowed, allowedBudgetValues.includes(v));
    }

    budgetSelect.addEventListener("focus", () => {
        budgetPanel.hidden = false;
        validateBudget();
    });
    budgetSelect.addEventListener("blur", () => {
        budgetPanel.hidden = true;
    });
    budgetSelect.addEventListener("change", validateBudget);

    /* -----------------------------------------
   お問い合わせ内容
----------------------------------------- */

    const messageInput = document.getElementById("message");
    const messagePanel = document.getElementById("message-panel");

    const msgRules = {
        required: messagePanel.querySelector('[data-rule="required"]'),
        length: messagePanel.querySelector('[data-rule="length"]'),
        charset: messagePanel.querySelector('[data-rule="charset"]'),
    };

    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F02F}]/u;

    function validateMessage() {
        const v = messageInput.value;

        setValid(msgRules.required, v.length > 0);
        setValid(msgRules.length, v.length > 0 && v.length <= 1000);
        setValid(msgRules.charset, v.length > 0 && !emojiRegex.test(v));
    }

    setupValidation({
        inputEl: messageInput,
        panelEl: messagePanel,
        rules: msgRules,
        onInput: validateMessage,
    });

    /* -----------------------------------------
   ご用件のバリテーション非表示（他項目時）
----------------------------------------- */
    const otherInputs = [
        nameInput,
        emailInput,
        telInput,
        budgetSelect,
        messageInput,
    ];

    otherInputs.forEach((el) => {
        el.addEventListener("focus", () => {
            topicPanel.hidden = true;
        });
    });

    /* -----------------------------------------
   Enterで次項目へ移動（復旧版）
----------------------------------------- */

    const order = [nameInput, emailInput, telInput, budgetSelect, messageInput];

    order.forEach((el, i) => {
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const next = order[i + 1];
                if (next) next.focus();
            }
        });
    });

    /* -----------------------------------------
   フォーム → 確認画面への切替（submitはこれ1つ）
----------------------------------------- */

    const mainForm = document.querySelector(".fit-form");
    const confirmScreen = document.getElementById("confirm-screen");
    const confirmList = document.querySelector(".fit-confirm-list");
    const confirmBack = document.getElementById("confirm-back");
    const confirmSubmit = document.getElementById("confirm-submit");

    mainForm.addEventListener("submit", (e) => {
        e.preventDefault();

        validateTopic();
        validateName();
        validateEmail();
        validateTel();
        validateBudget();
        validateMessage();

        const invalid = document.querySelector(".fit-valid-panel .invalid");

        if (invalid) {
            document.querySelectorAll(".fit-valid-panel").forEach((panel) => {
                if (panel.querySelector(".invalid")) panel.hidden = false;
            });

            const target = invalid.closest(".fit-row, fieldset");
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        buildConfirmScreen();
        mainForm.hidden = true;
        confirmScreen.hidden = false;
    });

    /* -----------------------------------------
   確認画面の内容生成
----------------------------------------- */

    function buildConfirmScreen() {
        const topic = [
            ...document.querySelectorAll("input[name='topic']:checked"),
        ]
            .map((cb) => cb.nextElementSibling.textContent.trim())
            .join("、");

        confirmList.innerHTML = `
        <dt>ご用件</dt><dd>${topic || "（未入力）"}</dd>
        <dt>お名前</dt><dd>${nameInput.value}</dd>
        <dt>メールアドレス</dt><dd>${emailInput.value}</dd>
        <dt>お電話</dt><dd>${telInput.value}</dd>
        <dt>ご予算</dt><dd>${budgetSelect.value}</dd>
        <dt>お問い合わせ内容</dt><dd>${messageInput.value.replace(
            /\n/g,
            "<br>"
        )}</dd>
    `;
    }

    /* -----------------------------------------
   戻る
----------------------------------------- */

    confirmBack.addEventListener("click", () => {
        confirmScreen.hidden = true;
        mainForm.hidden = false;
    });

    /* -----------------------------------------
   GAS送信
----------------------------------------- */

    confirmSubmit.addEventListener("click", async () => {
        const payload = {
            topic: [
                ...document.querySelectorAll("input[name='topic']:checked"),
            ].map((cb) => cb.nextElementSibling.textContent.trim()),
            name: nameInput.value,
            email: emailInput.value,
            tel: telInput.value,
            budget: budgetSelect.value,
            message: messageInput.value,
        };

        try {
            await fetch(GAS_URL, {
                method: "POST",
                // CORS と戦わない
                mode: "no-cors",
                // シンプルヘッダーにしてプリフライトも避ける
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload),
            });

            // レスポンスの中身は読めない前提で、
            // 送信が「投げられた」時点で成功扱いにする
            window.location.href = "/thanks.html";
        } catch (e) {
            alert("通信エラーが発生しました。");
            console.error(e);
        }
    });
});
