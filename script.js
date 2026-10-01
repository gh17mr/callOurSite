/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
});


/* =========================================================
   ACTIVE NAVBAR LINK
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }

    });

    navLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );

    });

});


/* =========================================================
   PROJECT COUNTERS
========================================================= */

const counters = document.querySelectorAll(".counter");

let counterStarted = false;

function startCounters() {

    if (counterStarted) {
        return;
    }

    const section = document.querySelector("#projects");

    if (!section) {
        return;
    }

    if (section.getBoundingClientRect().top < window.innerHeight - 100) {

        counterStarted = true;

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = Math.ceil(target / 80);

            const timer = setInterval(() => {

                current += increment;

                if (current >= target) {

                    current = target;

                    clearInterval(timer);

                }

                counter.textContent = current;

            }, 20);

        });

    }

}

window.addEventListener("scroll", startCounters);

startCounters();


/* =========================================================
   CAPTCHA
========================================================= */

const captchaNumber = document.getElementById("captchaNumber");
const refreshCaptcha = document.getElementById("refreshCaptcha");

let currentCaptcha = generateCaptcha();

function generateCaptcha() {

    return Math.floor(1000 + Math.random() * 9000);

}

function refreshCaptchaCode() {

    currentCaptcha = generateCaptcha();

    if (captchaNumber) {
        captchaNumber.textContent = currentCaptcha;
    }

}


/* تغيير الكود عند الضغط على زر التحديث */

if (refreshCaptcha) {

    refreshCaptcha.addEventListener(
        "click",
        refreshCaptchaCode
    );

}


/* =========================================================
   CONSULTATION FORM
========================================================= */

const form = document.getElementById("consultationForm");

if (form) {

    const submitButton = form.querySelector(".submit-btn");

    form.addEventListener("submit", async event => {

        event.preventDefault();


        /* -------------------------------------------------
           العناصر
        ------------------------------------------------- */

        const captchaInput =
            document.getElementById("captchaInput");

        const message =
            document.getElementById("formMessage");


        /* -------------------------------------------------
           قراءة CAPTCHA
        ------------------------------------------------- */

        const input = captchaInput
            ? captchaInput.value.trim()
            : "";


        /* -------------------------------------------------
           التحقق من الحقول المطلوبة
        ------------------------------------------------- */

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        /* -------------------------------------------------
           التحقق من CAPTCHA
        ------------------------------------------------- */

        if (input !== String(currentCaptcha)) {

            message.innerHTML = `
                <div class="alert alert-danger">
                    كود التحقق غير صحيح، حاول مرة أخرى.
                </div>
            `;

            refreshCaptchaCode();

            if (captchaInput) {
                captchaInput.value = "";
            }

            return;

        }


        /* -------------------------------------------------
           حفظ نص الزر الأصلي
        ------------------------------------------------- */

        const originalButtonText =
            submitButton.innerHTML;


        /* -------------------------------------------------
           تعطيل زر الإرسال
        ------------------------------------------------- */

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm ms-2"
                role="status"
                aria-hidden="true">
            </span>
            جارٍ الإرسال...
        `;


        /* مسح الرسالة السابقة */

        message.innerHTML = "";


        /* -------------------------------------------------
           تجهيز البيانات
        ------------------------------------------------- */

        const formData = new FormData(form);


        /* عنوان الإيميل */

        formData.append(
            "_subject",
            "طلب استشارة جديد - موقع محمد الرحماني"
        );


        /* شكل الإيميل */

        formData.append(
            "_template",
            "table"
        );


        /* تعطيل CAPTCHA الخاص بـ FormSubmit
           لأن عندنا CAPTCHA خاص بالموقع */

        formData.append(
            "_captcha",
            "false"
        );


        /* -------------------------------------------------
           إرسال البيانات إلى FormSubmit
        ------------------------------------------------- */

        try {

            const response = await fetch(
                "https://formsubmit.co/ajax/gh17mr@gmail.com",
                {
                    method: "POST",

                    headers: {
                        "Accept": "application/json"
                    },

                    body: formData
                }
            );


            /* -------------------------------------------------
               التحقق من حالة الاتصال
               
               لا نعتمد على result.success
               لأن FormSubmit قد يرجعه بصيغ مختلفة.
               
               إذا كانت الاستجابة HTTP ناجحة،
               نعتبر الإرسال ناجحاً.
            ------------------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " + response.status
                );

            }


            /* -------------------------------------------------
               محاولة قراءة رد FormSubmit
               
               لا نعتمد عليه لتحديد النجاح.
            ------------------------------------------------- */

            let result = null;

            try {

                result = await response.json();

                console.log(
                    "FormSubmit response:",
                    result
                );

            } catch (jsonError) {

                console.log(
                    "Response is not JSON:",
                    jsonError
                );

            }


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            message.innerHTML = `
                <div class="alert alert-success">
                    تم إرسال طلب الاستشارة بنجاح.
                    سنتواصل معك قريباً.
                </div>
            `;


            /* -------------------------------------------------
               تفريغ النموذج
            ------------------------------------------------- */

            form.reset();


            /* -------------------------------------------------
               إنشاء CAPTCHA جديد
            ------------------------------------------------- */

            refreshCaptchaCode();


        } catch (error) {

            /* -------------------------------------------------
               ERROR
            ------------------------------------------------- */

            console.error(
                "Consultation form error:",
                error
            );


            message.innerHTML = `
                <div class="alert alert-danger">
                    حدث خطأ أثناء إرسال الطلب.
                    يرجى المحاولة مرة أخرى.
                </div>
            `;

        } finally {

            /* -------------------------------------------------
               إعادة زر الإرسال لحالته الطبيعية
            ------------------------------------------------- */

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonText;

        }

    });

}


/* =========================================================
   MOBILE NAVBAR
========================================================= */

document
    .querySelectorAll(".navbar-nav .nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            const collapse =
                document.querySelector(".navbar-collapse");

            if (
                collapse &&
                collapse.classList.contains("show")
            ) {

                const instance =
                    bootstrap.Collapse.getInstance(
                        collapse
                    );

                if (instance) {

                    instance.hide();

                }

            }

        });

    });


/* =========================================================
   SCROLL REVEAL ANIMATION
========================================================= */

const revealElements = document.querySelectorAll(
    ".service-card, .why-card, .project-stat, .about-highlight"
);


if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity .7s ease, transform .7s ease";

        observer.observe(element);

    });

} else {

    /* في المتصفحات التي لا تدعم IntersectionObserver */

    revealElements.forEach(element => {

        element.style.opacity = "1";

        element.style.transform =
            "translateY(0)";

    });

}