function generateCaptcha() {
  const code = Math.floor(1000 + Math.random() * 9000); // كود 4 أرقام
  document.getElementById("captchaCode").textContent = code;
}

document.addEventListener("DOMContentLoaded", function () {
  generateCaptcha(); // توليد الكابتشا أول مرة

  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const code = document.getElementById("captchaCode").textContent.trim();
    const input = document.getElementById("captchaInput").value.trim();

    if (code !== input) {
      alert("الرقم المدخل غير صحيح، حاول مرة أخرى");
      generateCaptcha();
      return;
    }

    const formData = new FormData(form);

    fetch("https://formsubmit.co/ajax/gh17mr@gmail.com", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        document.getElementById("successMessage").style.display = "block";
        form.reset();
        generateCaptcha();
      } else {
        alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
      }
    })
    .catch(error => {
      alert("تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت.");
    });
  });
});
