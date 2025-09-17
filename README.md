<!DOCTYPE html>
<html>
<body>
    <h1>TaskVibes | Smart To-Do App with Weather Integration</h1>
    <p><em>A responsive React-Redux To-Do application with real-time weather updates, priority tasks, and secure authentication.</em></p>
    <img src="./scr/images/app-preview.png" alt="TaskVibe Screenshot">
    <h2>✨ Features</h2>
    <ul class="feature-list">
        <li><strong>Add/Delete Tasks</strong> with priorities (High/Medium/Low)</li>
        <li><strong>Weather API Integration</strong> (e.g., "Buy sunscreen" fetches local weather)</li>
        <li><strong>Redux Toolkit</strong> for state management + <strong>Redux Thunk</strong> for async API calls</li>
        <li><strong>Mock User Authentication</strong> (Login/Logout with <code>localStorage</code> persistence)</li>
        <li><strong>Mobile-First Responsive Design</strong> (CSS Grid/Flexbox)</li>
        <li><strong>Error Handling</strong> for API failures with user-friendly alerts</li>
    </ul>
    <h2>🚀 Live Demo</h2>
    <p>Available at: <a href="https://taskvibes.io">https://taskvibes.io</a></p>
    <p><em>Also accessible via Vercel: <a href="https://taskvibe-app.vercel.app">https://taskvibe-app.vercel.app</a></em></p>
    <h2>🛠️ Setup Instructions</h2>
    <ol>
        <li><strong>Clone the repo</strong>:
            <pre><code>git clone https://github.com/nathimike102/TaskVibes.git
cd TaskVibes</code></pre>
        </li>
        <li><strong>Install dependencies</strong>:
            <pre><code>npm install</code></pre>
        </li>
        <li><strong>Add API Key</strong>:
            <ul>
                <li>Sign up for <a href="https://www.weatherapi.com/">Weather API</a> (free tier).</li>
                <li>Create a <code>.env</code> file:
                    <pre><code>VITE_WEATHER_API_KEY=your_api_key_here</code></pre>
                </li>
            </ul>
        </li>
        <li><strong>Run the app</strong>:
            <pre><code>npm run dev</code></pre>
        </li>
    </ol>
    <h2>🌐 Custom Domain Setup</h2>
    <p>This project supports custom domain deployment. Here are examples of acceptable custom domain configurations:</p>
    <h3>Acceptable Domain Examples:</h3>
    <ul>
        <li><code>taskvibes.io</code> - Primary domain (currently used)</li>
        <li><code>www.taskvibes.io</code> - WWW subdomain</li>
        <li><code>app.taskvibes.io</code> - App subdomain</li>
        <li><code>taskvibes.com</code> - Alternative TLD</li>
        <li><code>my-taskvibes.netlify.app</code> - Platform-specific domain</li>
        <li><code>taskvibes-prod.herokuapp.com</code> - Environment-specific domain</li>
    </ul>
    <h3>Domain Configuration:</h3>
    <ol>
        <li>Update the <code>CNAME</code> file in the repository root with your domain</li>
        <li>Configure DNS settings with your domain provider:
            <ul>
                <li>For apex domains: Add A records pointing to GitHub Pages IPs</li>
                <li>For subdomains: Add CNAME record pointing to <code>nathimike102.github.io</code></li>
            </ul>
        </li>
        <li>Enable HTTPS in repository settings under Pages</li>
    </ol>
    <h2>📂 Project Structure</h2>
    <pre><code>src/
├── components/
│   ├── TaskInput.jsx    # Task creation form
│   ├── TaskList.jsx     # Task display + delete
├── features/
│   ├── authSlice.js     # React auth logic
│   ├── tasksSlice.js    # React tasks logic
├── services/
│   ├── weatherAPI.js    # Weather API service
├── App.js               # Main app router
├── index.css            # Global styles</code></pre>
    <h2>🔍 Why "TaskVibe"?</h2>
    <ul>
        <li><strong>Task</strong> → Core functionality (to-do management).</li>
        <li><strong>Vibe</strong> → Reflects the weather-integration feature ("vibe check" for tasks).</li>
        <li><strong>Modern & Memorable</strong> → Easy to brand and recall.</li>
    </ul>
    <h2>📸 Screenshots</h2>
    <div class="screenshot-grid">
        <div>
            <h3>Login Screen</h3>
            <img src="./screenshots/login.png" alt="Login Screen">
        </div>
        <div>
            <h3>Task List</h3>
            <img src="./screenshots/tasks.png" alt="Task List">
        </div>
        <div>
            <h3>Mobile View</h3>
            <img src="./screenshots/mobile.png" alt="Mobile View">
        </div>
    </div>
    <h2>📝 Submission Notes</h2>
    <ul>
        <li>Followed <strong>React best practices</strong> (hooks, component modularization).</li>
        <li>Used <strong>Redux Toolkit</strong> to minimize boilerplate.</li>
        <li><strong>100% responsive</strong> via CSS Grid/Flexbox.</li>
    </ul>
    <h2>🎯 Evaluation Checklist</h2>
    <ul class="checklist">
        <li><input type="checkbox" checked> All features implemented</li>
        <li><input type="checkbox" checked> Code well-organized and commented</li>
        <li><input type="checkbox" checked> Live demo deployed</li>
        <li><input type="checkbox" checked> README covers setup + features</li>
    </ul>
</body>
</html>
