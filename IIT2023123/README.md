# OS Command Injection — In-band Variant

## 1. Project Information

**Course:** Cyber Security (IT-30001)  
**Institute:** Indian Institute of Information Technology Allahabad  
**Semester:** Autumn 2026  
**Vulnerability Category:** OS Command Injection  
**Variant:** In-band Command Injection  

## 2. Project Overview

This project demonstrates an In-band OS Command Injection vulnerability in a web-based Network Diagnostic Tool.

The application accepts an IP address from the user and executes a ping command through the operating system.

Two implementations are provided:

- **Vulnerable Implementation:** Uses unsafe shell command execution with `shell=True`.
- **Secured Implementation:** Uses IP address validation and argument-vector execution with `shell=False`.

## 3. Technologies Used

- Python
- Flask
- Subprocess module
- IP Address Validation (`ipaddress`)
- HTML and CSS
- Windows Command Prompt

## 4. Vulnerability Demonstration

In the vulnerable implementation, user input is concatenated directly into an operating-system command.

This allows shell metacharacters to alter the intended command and execute additional commands.

A harmless test command was used in the local application to demonstrate successful injection.

The injected command output is displayed directly on the webpage, demonstrating the In-band variant.

## 5. Root Cause

The root cause is the direct concatenation of untrusted user input into a shell command, combined with shell execution.

## 6. Mitigation Implemented

The secured implementation uses:

1. IP address validation using Python's `ipaddress` module.
2. Argument-vector execution using `subprocess.run()`.
3. `shell=False` to avoid shell interpretation.

The same test input is rejected by the secured implementation.

## 7. Other Mitigation Techniques

- **Avoid the shell:** Avoid invoking shell commands whenever possible.
- **Parameterised execution:** Pass executable arguments separately instead of constructing shell command strings.
- **Allow-list validation:** Restrict user input to explicitly permitted values.
- **Least privilege:** Run applications with minimum necessary operating-system permissions.

## 8. Testing Results

| Test Case | Vulnerable Version | Secured Version |
|---|---|---|
| Normal IP address | Successful | Successful |
| Injection test | Successful injection | Rejected |
| Command output | Displayed | Injected command not executed |

## 9. Project Structure

- `app.py` — Flask application containing both implementations.
- `requirements.txt` — Python dependencies.
- `screenshots/` — Evidence of vulnerability and mitigation.
- `README.md` — Project documentation.

## 10. Ownership Declaration

| Member Name | Roll Number | Category | Variant |
|---|---|---|---|
| [Your Name] | [Your Roll Number] | OS Command Injection | In-band |

## 11. Execution Instructions

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

**Note:** This application is intended only for local, authorised security demonstration and testing.