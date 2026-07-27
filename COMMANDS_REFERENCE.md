# 🚀 Complete Commands Reference

## Installation Commands

### Install Node.js Dependencies

**Backend**
```bash
cd c:\billling project\backend
npm install
```

**Frontend**
```bash
cd c:\billling project\frontend
npm install
```

---

## Environment Setup Commands

### Create Backend .env file
```bash
cd backend
echo MONGODB_URI=mongodb://localhost:27017/billing_db > .env
echo JWT_SECRET=your_jwt_secret_key_change_this >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo STRIPE_API_KEY=your_stripe_key >> .env
echo STRIPE_SECRET_KEY=your_stripe_secret >> .env
 
```

### Create Frontend .env file
```bash
cd ../frontend
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

---

## Development Server Commands

### Start MongoDB
```bash
# Windows - if installed locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

### Start Backend Server
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Billing Software Backend running on port 5000
MongoDB connected
```

### Start Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
webpack compiled successfully
Compiled successfully!
You can now view the app in your browser at http://localhost:3000
```

---

## Production Build Commands

### Build Backend (if needed)
```bash
cd backend
npm run build
```

### Build Frontend
```bash
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/`

---

## Database Commands

### MongoDB Connection Test
```bash
# Windows PowerShell
mongo mongodb://localhost:27017/billing_db

# Or
mongosh
```

### MongoDB Backup
```bash
mongodump --db billing_db --out ./backup
```

### MongoDB Restore
```bash
mongorestore --db billing_db ./backup/billing_db
```

---

## API Testing Commands

### Using curl (Command Line)

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Current User**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

### Using Postman
1. Import the collection (if provided)
2. Set `{{base_url}}` to `http://localhost:5000/api`
3. Set `{{token}}` in Auth tab
4. Test each endpoint

---

## Cleanup & Reset Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Delete node_modules (if issues)
```bash
# Backend
cd backend
rmdir node_modules /s /q
npm install

# Frontend
cd ../frontend
rmdir node_modules /s /q
npm install
```

### Clear MongoDB Data
```bash
mongo
> use billing_db
> db.dropDatabase()
```

---

## Deployment Commands

### Heroku Deployment (Backend)
```bash
# Install Heroku CLI first
heroku login
cd backend
heroku create billing-software-api
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_url
heroku config:set JWT_SECRET=your_secret
```

### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel
# Follow prompts
```

---

## Debugging Commands

### Check Node.js Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Check MongoDB Status
```bash
mongosh
> db.version()
```

### View Backend Logs
```bash
# Press Ctrl+C to stop
# Check console output for errors
```

### View Frontend Logs
```bash
# Open browser DevTools (F12)
# Check Console tab for errors
```

---

## Port Management Commands

### Check if Port is in Use
```bash
# Port 5000 (Backend)
netstat -ano | findstr :5000

# Port 3000 (Frontend)
netstat -ano | findstr :3000

# Port 27017 (MongoDB)
netstat -ano | findstr :27017
```

### Kill Process on Port
```bash
# Windows
taskkill /PID <process_id> /F

# Example: Kill process on port 5000
For /F "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /PID %a /F
```

---

## Git Commands (Version Control)

### Initialize Git (if not already done)
```bash
cd c:\billling project
git init
git add .
git commit -m "Initial commit: Billing Software"
```

### Push to GitHub
```bash
git remote add origin https://github.com/yourname/billing-software.git
git branch -M main
git push -u origin main
```

### Clone Existing Project
```bash
git clone https://github.com/yourname/billing-software.git
cd billing-software
npm install # in both backend and frontend
```

---

## Testing Commands

### Run Tests (when added)
```bash
# Backend
cd backend
npm test

# Frontend
cd ../frontend
npm test
```

### Check Code Quality
```bash
# Install ESLint if needed
npm install --save-dev eslint

# Run linter
npx eslint src/
```

---

## Package Management Commands

### Update Dependencies
```bash
# Backend
cd backend
npm update

# Frontend
cd ../frontend
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Install Specific Version
```bash
npm install package_name@version
```

### Uninstall Package
```bash
npm uninstall package_name
```

---

## Environment Variable Commands

### List All Environment Variables
```bash
# Windows PowerShell
Get-ChildItem env:

# Or display specific ones
$env:MONGODB_URI
```

### Set Temporary Environment Variable
```bash
# Windows PowerShell
$env:MONGODB_URI="mongodb://localhost:27017/billing_db"

# Windows CMD
set MONGODB_URI=mongodb://localhost:27017/billing_db
```

---

## File System Commands

### Create Directories
```bash
mkdir backend
mkdir frontend
mkdir backend\models
mkdir backend\routes
mkdir frontend\src\pages
```

### Copy Files
```bash
copy source.js destination.js
```

### Move Files
```bash
move oldpath\file.js newpath\file.js
```

### Delete Files
```bash
del filename.js
rmdir directory /s /q
```

---

## Docker Commands (if containerizing)

### Build Docker Image
```bash
docker build -t billing-software-backend .
```

### Run Docker Container
```bash
docker run -p 5000:5000 billing-software-backend
```

### Stop Docker Container
```bash
docker stop container_id
```

---

## Useful Package Scripts

### Available Scripts (in package.json)

**Backend**
```bash
npm run dev      # Start with nodemon (development)
npm start        # Start production server
npm test         # Run tests
```

**Frontend**
```bash
npm start        # Start development server
npm run build    # Create production build
npm test         # Run tests
npm run eject    # Eject from Create React App
```

---

## Quick Start Command Sequence

### Complete Setup in One Go
```bash
# Navigate to project
cd c:\billling project

# Install backend
cd backend
npm install
echo MONGODB_URI=mongodb://localhost:27017/billing_db > .env
echo JWT_SECRET=test_secret >> .env
echo PORT=5000 >> .env
cd ..

# Install frontend
cd frontend
npm install
echo REACT_APP_API_URL=http://localhost:5000/api > .env
cd ..

# Start MongoDB (in separate terminal)
mongod

# Start Backend (in terminal 1)
cd backend
npm run dev

# Start Frontend (in terminal 2)
cd frontend
npm start
```

---

## Troubleshooting Commands

### Clear Browser Cache
```bash
# In browser DevTools
Ctrl + Shift + Delete
```

### Force Refresh
```bash
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Check Connectivity
```bash
# Test backend
curl http://localhost:5000/api/auth/me

# Test frontend
curl http://localhost:3000
```

### View System Info
```bash
# Windows
systeminfo

# Check OS
ver
```

---

## Backup Commands

### Backup Project
```bash
# Create ZIP
tar -czf billing-software-backup.tar.gz c:\billling project\

# Or use robocopy
robocopy c:\billling project\ d:\backup\billing-software /E
```

### Backup Database
```bash
mongodump --db billing_db --archive=billing_backup.archive
```

### Restore Database
```bash
mongorestore --archive=billing_backup.archive
```

---

## Performance Monitoring Commands

### Check System Resources
```bash
# Windows Task Manager alternative
tasklist /V

# Memory usage
Get-Process | Sort-Object -Property WorkingSet -Descending
```

### Monitor Port Activity
```bash
netstat -an | findstr LISTENING
```

---

## Security Commands

### Generate Strong Password
```bash
# PowerShell
-join ([char[]]'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*' | Get-Random -Count 32)
```

### Encrypt .env File (future)
```bash
# When implementing encryption
npm install dotenv-vault
dotenv-vault encrypt
```

---

## Useful Aliases (Optional)

### Create Shortcuts
```bash
# Add to PowerShell profile
function Start-Backend { cd c:\billling project\backend; npm run dev }
function Start-Frontend { cd c:\billling project\frontend; npm start }
function Start-App { Start-Backend; Start-Frontend }
```

---

## Documentation Commands

### Generate API Documentation (future)
```bash
npm install -g swagger-ui-express
npm install swagger-jsdoc
```

### Build Documentation
```bash
npm run docs
```

---

## Continuous Integration Commands

### CI/CD with GitHub Actions
```bash
# Create workflow
mkdir -p .github/workflows
```

---

## Version Control Commands (Complete)

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Check Status
```bash
git status
git log --oneline
```

### Create Branch
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

### Merge Branch
```bash
git checkout main
git merge feature/new-feature
```

---

**Total Commands**: 100+

**Frequently Used**: 5-10

**Most Important**: 3
1. `npm install` - Install dependencies
2. `npm run dev` / `npm start` - Start servers
3. `mongod` - Start database

---

**Save this file for quick reference!**
