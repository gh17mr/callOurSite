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

    if (code === input) {
      document.getElementById("successMessage").style.display = "block";
      form.submit(); // يتم الإرسال الحقيقي هنا
    } else {
      alert("الرقم المدخل غير صحيح، حاول مرة أخرى");
      generateCaptcha(); // توليد كود جديد بعد المحاولة
    }
  });
});
