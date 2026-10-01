const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});


/* ================= NAVBAR ACTIVE LINK ================= */

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


/* ================= PROJECT COUNTERS ================= */

const counters = document.querySelectorAll(".counter");

let counterStarted = false;

function startCounters() {

    if (counterStarted) return;

    const section = document.querySelector("#projects");

    if (!section) return;

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


/* ================= CAPTCHA ================= */

const captchaNumber = document.getElementById("captchaNumber");
const refreshCaptcha = document.getElementById("refreshCaptcha");

let currentCaptcha = generateCaptcha();

function generateCaptcha() {

    return Math.floor(1000 + Math.random() * 9000);

}

function refreshCaptchaCode() {

    currentCaptcha = generateCaptcha();

    captchaNumber.textContent = currentCaptcha;

}

refreshCaptcha.addEventListener("click", refreshCaptchaCode);


/* ================= CONSULTATION FORM ================= */

const form = document.getElementById("consultationForm");
const submitButton = form.querySelector(".submit-btn");

form.addEventListener("submit", async event => {

    event.preventDefault();

    const input = document
        .getElementById("captchaInput")
        .value
        .trim();

    const message = document.getElementById("formMessage");


    /* ================= FORM VALIDATION ================= */

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    /* ================= CAPTCHA VALIDATION ================= */

    if (input !== String(currentCaptcha)) {

        message.innerHTML = `
            <div class="alert alert-danger">
                كود التحقق غير صحيح، حاول مرة أخرى.
            </div>
        `;

        refreshCaptchaCode();

        document.getElementById("captchaInput").value = "";

        return;

    }


    /* ================= SENDING ================= */

    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;

    submitButton.innerHTML = `
        <span
            class="spinner-border spinner-border-sm ms-2"
            role="status"
            aria-hidden="true">
        </span>
        جارٍ الإرسال...
    `;

    message.innerHTML = "";


    /* ================= FORM DATA ================= */

    const formData = new FormData(form);

    formData.append(
        "_subject",
        "طلب استشارة جديد - موقع محمد الرحماني"
    );

    formData.append("_template", "table");

    formData.append("_captcha", "false");

    formData.append("_honey", "");


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


        const result = await response.json();


        /* ================= DEBUG ================= */

        console.log(
            "FormSubmit response:",
            result
        );


        /* ================= CHECK SUCCESS ================= */

        /*
         * FormSubmit can return success as:
         *
         * true
         *
         * or:
         *
         * "true"
         */

        const success =
            result.success === true ||
            result.success === "true";


        if (!response.ok || !success) {

            throw new Error(
                result.message || "تعذر إرسال الطلب"
            );

        }


        /* ================= SUCCESS MESSAGE ================= */

        message.innerHTML = `
            <div class="alert alert-success">
                تم إرسال طلب الاستشارة بنجاح.
                سنتواصل معك قريباً.
            </div>
        `;


        /* ================= RESET FORM ================= */

        form.reset();

        refreshCaptchaCode();


    } catch (error) {

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

        submitButton.disabled = false;

        submitButton.innerHTML = originalButtonText;

    }

});


/* ================= MOBILE NAVBAR ================= */

document
    .querySelectorAll(".navbar-nav .nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            const collapse =
                document.querySelector(".navbar-collapse");

            if (collapse.classList.contains("show")) {

                const instance =
                    bootstrap.Collapse.getInstance(collapse);

                if (instance) {

                    instance.hide();

                }

            }

        });

    });


/* ================= REVEAL ANIMATION ================= */

const revealElements = document.querySelectorAll(
    ".service-card,.why-card,.project-stat,.about-highlight"
);

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(el => {

    el.style.opacity = "0";

    el.style.transform = "translateY(25px)";

    el.style.transition =
        "opacity .7s ease, transform .7s ease";

    observer.observe(el);

});