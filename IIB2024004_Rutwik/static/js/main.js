/**
 * Simple client logic for SQL Injection Demo
 */

document.addEventListener("DOMContentLoaded", () => {
    const btnVulnerable = document.getElementById("btn-mode-vulnerable");
    const btnMitigated = document.getElementById("btn-mode-mitigated");
    const modeInput = document.getElementById("mode");
    const modeIndicator = document.getElementById("mode-indicator");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const btnFillPayload = document.getElementById("btn-fill-payload");
    const form = document.getElementById("login-form");
    const btnSubmit = document.getElementById("btn-submit");
    
    const resultBox = document.getElementById("result-box");
    const resultTitle = document.getElementById("result-title");
    const resultText = document.getElementById("result-text");
    const resultQuery = document.getElementById("result-query");
    const dashboardBtnWrapper = document.getElementById("dashboard-btn-wrapper");

    // Mode Toggle
    btnVulnerable.addEventListener("click", () => {
        modeInput.value = "vulnerable";
        btnVulnerable.classList.add("active-vulnerable");
        btnMitigated.classList.remove("active-mitigated");
        modeIndicator.textContent = "Mode: Vulnerable (String Concatenation)";
        modeIndicator.className = "badge badge-red";
        resultBox.style.display = "none";
    });

    btnMitigated.addEventListener("click", () => {
        modeInput.value = "mitigated";
        btnMitigated.classList.add("active-mitigated");
        btnVulnerable.classList.remove("active-vulnerable");
        modeIndicator.textContent = "Mode: Mitigated (Parameterized Query)";
        modeIndicator.className = "badge badge-green";
        resultBox.style.display = "none";
    });

    // Auto-fill Payload
    btnFillPayload.addEventListener("click", () => {
        usernameInput.value = "admin' --";
        passwordInput.value = "12345";
    });

    // Form Submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Checking...";

        try {
            const formData = new FormData(form);
            formData.append("format", "json");

            const response = await fetch("/login", {
                method: "POST",
                headers: { "X-Requested-With": "XMLHttpRequest" },
                body: formData
            });

            const data = await response.json();
            displayResult(data);
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Test Login →";
        }
    });

    function displayResult(data) {
        resultBox.style.display = "block";
        resultQuery.textContent = data.executed_query;

        if (data.success && data.mode === "vulnerable") {
            resultBox.className = "result-box exploit";
            resultTitle.innerHTML = "⚠️ Exploit Successful! Logged in as Admin!";
            resultText.innerHTML = "<strong>Why it worked:</strong> The payload <code>admin' --</code> broke out of the SQL query. The <code>--</code> commented out the password verification, so SQLite logged you in without checking any password.";
            dashboardBtnWrapper.innerHTML = `
                <a href="/dashboard" class="btn btn-danger btn-block">
                    Open Admin Dashboard &rarr;
                </a>
            `;
        } else if (data.success && data.mode === "mitigated") {
            resultBox.className = "result-box blocked";
            resultTitle.innerHTML = "✅ Legitimate Login Successful";
            resultText.innerHTML = "Valid credentials matched in database.";
            dashboardBtnWrapper.innerHTML = `
                <a href="/dashboard" class="btn btn-primary btn-block">
                    Open User Dashboard &rarr;
                </a>
            `;
        } else {
            resultBox.className = "result-box blocked";
            resultTitle.innerHTML = "🛡️ Attack Blocked! Access Denied";
            resultText.innerHTML = "<strong>Why it failed:</strong> Mitigated mode uses Parameterized Queries. The database treated <code>admin' --</code> strictly as a plain text username, not executable SQL. Because no user has that exact username, login was rejected safely.";
            dashboardBtnWrapper.innerHTML = "";
        }
    }
});
