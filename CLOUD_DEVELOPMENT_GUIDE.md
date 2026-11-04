# Cloud Development Guide: Running Antigravity Without Local Storage

This guide explains how to develop entire projects using **Google Antigravity** and **GitHub Codespaces** 100% in the cloud—using **zero laptop disk space** or operating directly from your **mobile phone**.

---

## Why Use Cloud Development?
- **Zero Local Disk Space**: No gigabytes of `node_modules`, build artifacts, or cloned files stored on your laptop or phone.
- **Instant Environments**: Node.js, Python, git, and compilers run in GitHub's high-speed cloud containers.
- **Anywhere Access**: Pick up work on your phone, tablet, or another computer seamlessly.
- **Free Tier Available**: GitHub offers free monthly Codespaces hours (60 core-hours/month on personal accounts).

---

## Scenario A: Using Cloud on Your Laptop (Antigravity IDE Connected to Codespaces)

This gives you the comfort of a full desktop keyboard and screen, while ensuring all code, compilers, and dependencies stay in the cloud.

### Step 1: Create a Cloud Codespace
1. Go to your GitHub repository in your laptop browser (e.g., `https://github.com/gurusaiss/iMagic`).
2. Click the green **Code** button.
3. Switch to the **Codespaces** tab.
4. Click **Create codespace on main** (or select your target branch).
5. A cloud environment will boot in your browser within 15–30 seconds.

### Step 2: Connect Antigravity IDE to the Codespace
You can work directly in the browser or connect your desktop Antigravity IDE:
- **Option 1: Open from Browser into Antigravity Desktop**
  1. Inside the browser Codespace, press `F1` (or `Ctrl+Shift+P`).
  2. Type and select: `Codespaces: Open in Desktop`.
  3. Select **Antigravity** as the application.
- **Option 2: Connect via the GitHub Codespaces Extension in Antigravity**
  1. Open Antigravity on your laptop.
  2. Click Extensions (`Ctrl+Shift+X`), search for **GitHub Codespaces**, and click **Install**.
  3. Click the **Remote Explorer** icon in the left activity bar.
  4. Sign in to your GitHub account when prompted.
  5. Select your active Codespace from the list and click **Connect**.

### Step 3: Prompt Antigravity & Build
1. Open the Antigravity chat panel or open the terminal inside the connected window.
2. If using the CLI, run:
   ```bash
   agy
   ```
3. Give your instructions to Antigravity (e.g., *"Add side-by-side comparison page, test the build, and push to main"*).
4. Antigravity writes the code, executes `npm run build`, and commits directly inside GitHub's cloud container.
5. You can preview your Next.js app in your laptop browser through automatic port forwarding (`http://localhost:3000`).

---

## Scenario B: Using Cloud from Your Phone (No Laptop Required)

You can manage, build, test, and push code directly from your smartphone (iPhone or Android) using only your mobile web browser.

### Step 1: Open GitHub on Your Phone
1. Open your phone's web browser (**Safari**, **Chrome**, or **Firefox**).
2. Navigate to your repository: `https://github.com/gurusaiss/iMagic`.
3. **Tip**: Enable **"Desktop Site"** or **"Request Desktop Website"** in your mobile browser settings for the full GitHub layout.

### Step 2: Launch the Codespace
1. Tap the green **Code** button.
2. Tap the **Codespaces** tab.
3. Tap **Create codespace on main** (or tap your existing running codespace).
4. The full cloud VS Code web environment will open directly inside your mobile browser.

### Step 3: Run the Antigravity CLI (`agy`)
1. In the top-left hamburger menu (`☰`), tap **Terminal** $\to$ **New Terminal** (or use the bottom panel).
2. Start the Antigravity CLI in the terminal:
   ```bash
   agy
   ```
3. Type your requirements in plain English, for example:
   - *"Analyze Customer.png and add the UPI / QR and EMI payment options in checkout."*
   - *"Verify Next.js build runs cleanly and push all changes to main."*
4. Antigravity will autonomously:
   - Create and edit files.
   - Run tests and Next.js compiler checks.
   - Stage, commit, and push directly to GitHub `main`.

### Step 4: Previewing the Website on Your Phone
1. In Codespaces, run `npm run dev`.
2. Codespaces will display a notification: *"Your application running on port 3000 is available."*
3. Tap **Open in Browser** to test the live mobile view of your store directly on your phone screen!

---

## Important Best Practices & Tips

1. **Auto-Stop to Save Free Cloud Hours**:
   - Codespaces automatically pause after 30 minutes of inactivity, so you won't accidentally drain your free monthly quota.
   - You can also manually stop your Codespace when done: in GitHub, go to `github.com/codespaces` $\to$ click the three dots (`...`) next to your codespace $\to$ **Stop Codespace**.
2. **Deleting Codespaces After Project Completion**:
   - Once Antigravity has pushed all commits to your GitHub repo, you can delete the Codespace completely. Your code is permanently safe on GitHub!
3. **One-Command Install for Antigravity in Codespaces**:
   If `agy` is not pre-installed in your cloud container, run:
   ```bash
   npm install -g @google/antigravity
   ```
   or follow the on-screen prompt to authenticate with your Google account.
