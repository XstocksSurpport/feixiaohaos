(function () {
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Copy wallet address
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-copy");
      const el = document.getElementById(id);
      if (!el) return;

      const text = el.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "已复制";
        btn.classList.add("copied");
        showToast("地址已复制到剪贴板");
        setTimeout(() => {
          btn.textContent = "复制地址";
          btn.classList.remove("copied");
        }, 2000);
      } catch {
        showToast("复制失败，请手动选择地址");
      }
    });
  });

  // File upload UI
  document.querySelectorAll(".file-upload").forEach((wrap) => {
    const input = wrap.querySelector('input[type="file"]');
    const nameEl = wrap.querySelector(".file-name");
    const btn = wrap.querySelector(".btn-file");
    const maxSize = parseInt(wrap.dataset.max, 10);
    const placeholder = nameEl.dataset.placeholder || "未选择任何文件";

    btn.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) {
        nameEl.textContent = placeholder;
        nameEl.classList.remove("has-file");
        return;
      }

      if (file.size > maxSize) {
        const mb = (maxSize / 1048576).toFixed(0);
        showToast(`文件过大，请上传不超过 ${mb} MB 的文件`);
        input.value = "";
        nameEl.textContent = placeholder;
        nameEl.classList.remove("has-file");
        return;
      }

      nameEl.textContent = file.name;
      nameEl.classList.add("has-file");
    });
  });

  // Intro character count (Chinese-aware approximation)
  const intro = document.getElementById("intro");
  const introCount = document.getElementById("intro-count");

  function countChars(str) {
    return [...str].length;
  }

  intro.addEventListener("input", () => {
    const len = countChars(intro.value);
    introCount.textContent = len;
    introCount.parentElement.style.color =
      len < 100 || len > 400 ? "#e74c3c" : "";
  });

  // Form submit
  const form = document.getElementById("listing-form");
  const sectorError = document.getElementById("sector-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const sectors = form.querySelectorAll('input[name="sector"]:checked');
    if (sectors.length === 0) {
      sectorError.hidden = false;
      sectorError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    sectorError.hidden = true;

    const introLen = countChars(intro.value.trim());
    if (introLen < 100 || introLen > 400) {
      showToast("项目介绍需在 100-400 字之间");
      intro.focus();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "提交中…";

    // Demo: no backend — simulate success
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "提交";
      showToast("提交成功！我们将在 3-5 个工作日内审核并与您联系。");
      form.reset();
      introCount.textContent = "0";
      document.querySelectorAll(".file-name").forEach((el) => {
        el.textContent = el.dataset.placeholder || "未选择任何文件";
        el.classList.remove("has-file");
      });
    }, 1200);
  });

  document
    .querySelectorAll('input[name="sector"]')
    .forEach((cb) =>
      cb.addEventListener("change", () => {
        if (form.querySelectorAll('input[name="sector"]:checked').length > 0) {
          sectorError.hidden = true;
        }
      })
    );
})();
