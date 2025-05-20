# Car Repair Payment Management System (CRPMS)
## Beginner's Setup Guide

This is a web application for managing car repair payments and services. Don't worry if you're new to this - we'll guide you through each step! 😊

### Before You Start
You'll need these programs installed on your computer:
- Node.js (version 14 or newer) - Download from [nodejs.org](https://nodejs.org)
- MySQL Server - Download from [mysql.com](https://mysql.com)
- A code editor like Visual Studio Code (recommended for beginners)

### Step-by-Step Setup Guide

1. **Get the Project Files**
   - Download or clone this repository to your computer
   - Put it in a folder where you can easily find it

2. **Set Up the Database**
   - Open MySQL Workbench or your MySQL command line
   - Create a new database:
     ```sql
     CREATE DATABASE garage_management;
     ```
   - Import the provided `garage_management.sql` file into your database
   - If you're not sure how, ask for help or check MySQL's import guide

3. **Set Up the Backend**
   - Open your terminal/command prompt
   - Navigate to the project folder
   - Type these commands one by one:
     ```bash
     cd backend-project
     npm install
     npm run dev
     ```
   - Wait until you see a message saying the server is running
   - Keep this terminal window open!

4. **Set Up the Frontend**
   - Open a new terminal/command prompt window
   - Navigate to the project folder again
   - Type these commands one by one:
     ```bash
     cd frontend-project
     npm install
     npm run dev
     ```
   - Wait until you see a URL (usually http://localhost:5173)

5. **Access the Website**
   - Open your web browser
   - Go to http://localhost:5173
   - You should see the CRPMS homepage!

### Common Problems and Solutions

❌ **If Nothing Works:**
- Make sure you have all the required programs installed
- Try closing all terminal windows and starting over
- Make sure you're in the correct folders when running commands

❌ **If You See Error Messages:**
- Read the error message carefully - it often tells you what's wrong
- Make sure your MySQL server is running
- Check if all the installation commands completed successfully
- Try running `npm install` again

❌ **Still Having Problems?**
- Take a screenshot of any error messages
- Check the more detailed README files in the backend and frontend folders
- Ask for help from the project maintainers

Remember: It's normal to run into issues when setting up a project for the first time. Don't get discouraged! 💪
