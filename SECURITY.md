# Security Policy

## 1. Supported Versions

We only actively support and patch the latest stable version of this project.  
If you are using an older release, please consider updating to ensure you receive the latest security fixes.

| Version        | Supported            |
| -------------- | -------------------- |
| latest (main)  | ✅                   |
| older versions | ⚠️ Best-effort basis |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**.  
Instead, report it responsibly by contacting the maintainers directly via email or private channel.

**Report via:**

- 📧 Email: [kamil.naskret.dev@gmail.pl](kamil.naskret.dev@gmail.pl)
- 🔒 Subject: "Security vulnerability report – [Aureo]"

Please include:

- A detailed description of the issue
- Steps to reproduce
- Potential impact or severity
- Suggested mitigation if known

We aim to respond within **48 hours** and will work with you to resolve the issue responsibly before public disclosure.

---

## 3. Handling Sensitive Data

- Never commit API keys, tokens, passwords, or any credentials.
- Always store sensitive values in a local \`.env\` file.
- \`.env\` files **must** be added to \`.gitignore\` and never shared publicly.
- Use environment variables for configuration and secrets management.

---

## 4. Dependency Management

- Regularly run:
  \`\`\`bash
  npm audit
  npm outdated
  \`\`\`
- Keep dependencies up-to-date to reduce exposure to known vulnerabilities.
- Avoid using unmaintained or unofficial packages.

---

## 5. Access and Permissions

- Use the principle of **least privilege** when granting permissions.
- Do not share access tokens or private keys across environments.
- Protect all CI/CD secrets (GitHub Actions, etc.) with organization-level policies.

---

## 6. Responsible Disclosure

We follow the [Responsible Disclosure Guidelines](https://en.wikipedia.org/wiki/Responsible_disclosure).  
If you responsibly disclose a vulnerability:

- You will be credited (if desired).
- We will collaborate on a coordinated public disclosure date.
- We will fix the issue before publicizing the vulnerability.

---

## 7. Additional Security Practices

- Enable 2FA (Two-Factor Authentication) for all maintainers.
- Use signed commits for release branches.
- Prefer HTTPS over HTTP for all external services.
- Regularly review GitHub security alerts and Dependabot reports.

---

**Thank you for helping us keep this project and its community safe!** 💚
