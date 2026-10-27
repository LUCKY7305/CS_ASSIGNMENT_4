"""
Web Server Security - SQL Injection Demonstration Platform
Indian Institute of Information Technology Allahabad
Department of Information Technology | Cyber Security (IT-30001)

Course Instructor: Dr. Soumyadev Maity
Topic: SQL Injection - Authentication Bypass (Variant 1)

This application demonstrates:
  1. Vulnerable implementation: Dynamic string-concatenated SQL query allowing auth bypass.
  2. Working exploit: Bypassing credentials using malicious payloads (e.g. `admin' --`).
  3. Mitigated implementation: Defense using Parameterized Queries (Prepared Statements).
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import sqlite3
import os
import database

app = Flask(__name__)
app.secret_key = "cybersec_it30001_assignment_secret_key"

# Ensure database is created on startup
if not os.path.exists(database.DB_PATH):
    database.init_db()

@app.route("/")
def index():
    """Main demonstration page with interactive login & exploit tester."""
    logged_in_user = session.get("user")
    conn = database.get_db_connection()
    logs = conn.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 10").fetchall()
    users_sample = conn.execute("SELECT id, username, full_name, role FROM users").fetchall()
    conn.close()
    return render_template(
        "index.html",
        logged_in_user=logged_in_user,
        logs=logs,
        users_sample=users_sample
    )

@app.route("/login", methods=["POST"])
def login():
    """
    Handles authentication attempts in either 'vulnerable' or 'mitigated' mode.
    Returns JSON response for asynchronous visual inspection or redirects.
    """
    mode = request.form.get("mode", "vulnerable")
    username = request.form.get("username", "").strip()
    password = request.form.get("password", "")
    is_ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.form.get("format") == "json"

    conn = database.get_db_connection()
    cursor = conn.cursor()

    executed_query = ""
    success = False
    user_record = None
    error_message = None
    analysis = {}

    try:
        if mode == "vulnerable":
            # ================================================================
            # VULNERABLE IMPLEMENTATION (Flawed Code Path)
            # Root Cause: Untrusted user input directly concatenated into SQL.
            # Metacharacters like single-quote (') break out of the string literal,
            # and '--' or '#' comments out the remaining password logic.
            # ================================================================
            executed_query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
            
            # Execute raw dynamic query
            cursor.execute(executed_query)
            user_record = cursor.fetchone()

            if user_record:
                success = True
                user_dict = dict(user_record)
                session["user"] = user_dict
                analysis = {
                    "verdict": "VULNERABILITY EXPLOITED: Authentication Bypassed!",
                    "explanation": (
                        f"The input `{username}` escaped the SQL string literal. "
                        "The comment syntax `--` truncated the password check, forcing the query "
                        f"to evaluate successfully for user '{user_dict['username']}' without validating any password."
                    ),
                    "authenticated_as": user_dict["username"],
                    "role": user_dict["role"]
                }
            else:
                error_message = "Authentication failed: No user record matched the criteria."
                analysis = {
                    "verdict": "Authentication Failed",
                    "explanation": "The query returned 0 rows. The credentials or SQL syntax did not produce a valid record."
                }

        else:
            # ================================================================
            # MITIGATED IMPLEMENTATION (Secure Defense)
            # Solution: Parameterized Queries (Prepared Statements).
            # The database engine treats parameter values strictly as literal data,
            # never interpreting them as executable SQL commands or metacharacters.
            # ================================================================
            executed_query = "SELECT * FROM users WHERE username = ? AND password = ?"
            parameters = (username, password)

            # Execute securely with bound parameters
            cursor.execute(executed_query, parameters)
            user_record = cursor.fetchone()

            if user_record:
                success = True
                user_dict = dict(user_record)
                session["user"] = user_dict
                analysis = {
                    "verdict": "Legitimate Authentication Successful",
                    "explanation": f"Authenticated successfully as {user_dict['username']} using valid matching credentials.",
                    "authenticated_as": user_dict["username"],
                    "role": user_dict["role"]
                }
            else:
                error_message = "Authentication failed: Invalid credentials or payload neutralized."
                analysis = {
                    "verdict": "ATTACK NEUTRALIZED: Authentication Blocked!",
                    "explanation": (
                        "Parameterized query treated the payload strictly as a string literal. "
                        f"SQLite searched for an exact username named literally `{username}`, which does not exist. "
                        "No code injection or syntax altering occurred."
                    )
                }

        # Log the attempt in audit_logs table
        status_label = "SUCCESS (EXPLOITED)" if (success and mode == "vulnerable" and ("'" in username or "--" in username)) else ("SUCCESS" if success else "BLOCKED / FAILED")
        conn.execute(
            "INSERT INTO audit_logs (mode, input_username, executed_query, status) VALUES (?, ?, ?, ?)",
            (mode, username, str(executed_query), status_label)
        )
        conn.commit()

    except sqlite3.Error as e:
        error_message = f"Database Syntax Error: {str(e)}"
        analysis = {
            "verdict": "SQL Syntax Error Triggered",
            "explanation": f"Unbalanced quotes or invalid SQL syntax caused SQLite error: {str(e)}"
        }
        conn.execute(
            "INSERT INTO audit_logs (mode, input_username, executed_query, status) VALUES (?, ?, ?, ?)",
            (mode, username, str(executed_query), f"SQL ERROR: {str(e)}")
        )
        conn.commit()
    finally:
        conn.close()

    if is_ajax:
        return jsonify({
            "success": success,
            "mode": mode,
            "input_username": username,
            "executed_query": executed_query,
            "error": error_message,
            "analysis": analysis,
            "redirect_url": url_for("dashboard") if success else None
        })

    if success:
        return redirect(url_for("dashboard"))
    else:
        flash(error_message or "Authentication failed", "danger")
        return redirect(url_for("index"))

@app.route("/dashboard")
def dashboard():
    """Confidential dashboard displaying sensitive records upon successful authentication."""
    user = session.get("user")
    if not user:
        flash("Access denied. Please authenticate first.", "warning")
        return redirect(url_for("index"))

    conn = database.get_db_connection()
    all_users = []
    if user["role"] in ["admin", "instructor"]:
        all_users = conn.execute("SELECT id, username, full_name, role, email, confidential_data FROM users").fetchall()
    conn.close()

    return render_template("dashboard.html", user=user, all_users=all_users)



@app.route("/logout")
def logout():
    """Terminates user session."""
    session.pop("user", None)
    flash("Session terminated successfully.", "info")
    return redirect(url_for("index"))

@app.route("/api/reset-db", methods=["POST"])
def reset_db():
    """Resets database to clean initial state."""
    database.init_db()
    session.clear()
    return jsonify({"success": True, "message": "Database and logs successfully reset."})

if __name__ == "__main__":
    print("=" * 60)
    print("Web Server Security Assignment: SQL Injection Lab")
    print("Indian Institute of Information Technology Allahabad")
    print("Running on http://127.0.0.1:5000")
    print("=" * 60)
    app.run(debug=True, host="127.0.0.1", port=5000)
