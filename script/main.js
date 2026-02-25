/* =========================
   フワッと現れる
========================= */
let io = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                // 上方向フェードアップ
                if (e.target.classList.contains("reveal-up")) {
                    e.target.classList.add("is-in");
                }
                io.unobserve(e.target); // 一度発火したら監視解除
            }
        });
    },
    { threshold: 0.15 }
);
// reveal-upクラスを持つ要素をioに追加する
document.querySelectorAll(".reveal-up").forEach(function (el) {
    io.observe(el);
});

/* =========================
   右側の葉っぱの動き
========================= */
const leaf = document.querySelector(".right-edge");
const trigger = document.querySelector("#section-service");

window.addEventListener("scroll", function () {
    const triggerTop = trigger.offsetTop; // セクションのY位置
    const scrollY = window.scrollY; // 今のスクロール量
    const showPoint = triggerTop - 500; // しきい値

    // 表示、非表示の判定
    if (scrollY >= showPoint) {
        leaf.classList.add("is-active");
    } else {
        leaf.classList.remove("is-active");
    }
});

/* =========================
   丘を下げる動き
========================= */
const hills = document.querySelector(".layer.hills");
const speed = -0.4;

window.addEventListener("scroll", function () {
    const y = window.scrollY || 0;
    hills.style.transform = `translateY(${-y * speed}px)`;
});

/* =========================
   木漏れ日の動き
========================= */
const fields = Array.from(document.querySelectorAll(".apple-field"));

// フィールドの回数実行
function spawnAllApples() {
    fields.forEach(spawnApplesIn);
}

// 木漏れ日生成
function spawnApplesIn(field) {
    if (!field) return;
    field.innerHTML = "";

    // 表示領域のｗ・ｈを習得
    const vw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    );
    const vh = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

    // 画面サイズ基準の粒数（重ければ係数を上げる/下げる）
    const density = parseFloat(field.dataset.density || "1");
    const count = Math.round(((vw * vh) / 175000) * density);

    for (let i = 0; i < count; i++) {
        const a = document.createElement("div");

        a.className = "apple";
        a.style.setProperty("--x", (5 + Math.random() * 90).toFixed(2));
        a.style.setProperty("--y", (5 + Math.random() * 90).toFixed(2));
        a.style.setProperty("--delay", `${Math.random() * 4}s`);
        a.style.setProperty("--dur", `${6 + Math.random() * 5}s`);
        // CSSイメージ
        //.apple {
        //     left: calc(var(--x) * 1%);
        //     top: calc(var(--y) * 1%);
        //     animation-delay: var(--delay);
        //     animation-duration: var(--dur);
        // }

        a.addEventListener("animationiteration", function (e) {
            if (e.animationName !== "apple-pop") {
                return; // フィルタ
            }
            let randX = (5 + Math.random() * 90).toFixed(2);
            let randY = (5 + Math.random() * 90).toFixed(2);
            a.style.setProperty("--x", randX);
            a.style.setProperty("--y", randY);
        });

        field.appendChild(a);
    }
}

// 初回
spawnAllApples();

/* ==========================================
   ハンバーガーメニュー(jQueryでやってみた)
========================================== */
// ハンバーガークリック
$("#hamburger").on("click", function () {
    $(this).toggleClass("active");
    $("#mobile-nav").toggleClass("active");
    $("#nav-overlay").toggleClass("active");
});

// 背景タップで閉じる
$("#nav-overlay").on("click", function () {
    $("#hamburger").removeClass("active");
    $("#mobile-nav").removeClass("active");
    $(this).removeClass("active");
});

// リンククリック時に閉じる
$("#mobile-nav a").on("click", function () {
    setTimeout(function () {
        $("#hamburger").removeClass("active");
        $("#mobile-nav").removeClass("active");
        $("#nav-overlay").removeClass("active");
    }, 900);
});
