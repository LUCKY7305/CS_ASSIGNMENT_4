
from flask import Flask, request, render_template_string
import subprocess
import ipaddress

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>Network Diagnostic Tool</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f1f5f9;
            margin: 0;
            padding: 40px;
        }

        .container {
            max-width: 750px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px #00000010;
        }

        h1 { color: #1e293b; }

        input {
            width: 95%;
            padding: 12px;
            margin: 12px 0;
        }

        button {
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            border: none;
            cursor: pointer;
        }

        .vulnerable { color: #dc2626; }
        .secure { color: #16a34a; }

        pre {
            background: #e2e8f0;
            padding: 15px;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        a { margin-right: 12px; }
    </style>
</head>

<body>
<div class="container">

    <h1>Network Diagnostic Tool</h1>

    <p>OS Command Injection Demonstration</p>

    <h2 class="{{ mode_class }}">{{ mode }}</h2>

    <p>{{ description }}</p>

    <form method="POST">

        <label>Enter an IP address:</label>

        <input
            type="text"
            name="ip"
            placeholder="127.0.0.1"
            value="{{ ip }}"
            required
        >

        <button type="submit">
            Check Connectivity
        </button>

    </form>

    {% if output %}
        <h3>Execution Result</h3>
        <pre>{{ output }}</pre>
    {% endif %}

    <hr>

    <a href="/">Home</a>
    <a href="/vulnerable">Vulnerable Version</a>
    <a href="/secure">Secured Version</a>

</div>
</body>
</html>
"""


# -----------------------------------------
# HOME PAGE
# -----------------------------------------

@app.route("/")
def home():

    return """
    <h1>Network Diagnostic Tool</h1>

    <p>OS Command Injection Security Project</p>

    <a href="/vulnerable">Vulnerable Implementation</a>
    <br><br>

    <a href="/secure">Secured Implementation</a>
    """


# -----------------------------------------
# 1. VULNERABLE IMPLEMENTATION
# -----------------------------------------

@app.route("/vulnerable", methods=["GET", "POST"])
def vulnerable():

    output = ""
    ip = ""

    if request.method == "POST":

        ip = request.form.get("ip", "")

        try:

            # INTENTIONALLY VULNERABLE:
            # User input is concatenated into a shell command.

            command = "ping -n 1 " + ip

            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )

            output = result.stdout + result.stderr

        except subprocess.TimeoutExpired:

            output = "Command timed out."

        except Exception as e:

            output = str(e)

    return render_template_string(
        HTML,
        mode="Vulnerable Implementation",
        mode_class="vulnerable",
        description="Demonstration of unsafe shell command execution.",
        output=output,
        ip=ip
    )


# -----------------------------------------
# 2. SECURED IMPLEMENTATION
# -----------------------------------------

@app.route("/secure", methods=["GET", "POST"])
def secure():

    output = ""
    ip = ""

    if request.method == "POST":

        ip = request.form.get("ip", "").strip()

        try:

            # STEP 1: Validate the IP address.

            ipaddress.ip_address(ip)

            # STEP 2: Execute using separate arguments.
            # shell=False prevents shell interpretation.

            result = subprocess.run(
                ["ping", "-n", "1", ip],
                shell=False,
                capture_output=True,
                text=True,
                timeout=10
            )

            output = result.stdout + result.stderr

        except ValueError:

            output = "BLOCKED: Invalid IP address."

        except subprocess.TimeoutExpired:

            output = "Command timed out."

        except Exception as e:

            output = str(e)

    return render_template_string(
        HTML,
        mode="Secured Implementation",
        mode_class="secure",
        description="Input validation and safe process execution.",
        output=output,
        ip=ip
    )


# -----------------------------------------
# START APPLICATION
# -----------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
