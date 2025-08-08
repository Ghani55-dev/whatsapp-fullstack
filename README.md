# 📱 WhatsApp Fullstack Clone

A fully functional **WhatsApp-style chat application** built using the MERN stack with real-time messaging using **Socket.IO**, featuring unread badges, status ticks, mobile responsiveness, and dynamic chat creation without needing Postman.

---

## 🔗 Live Demo

👉 [https://whatsapp-fullstack.vercel.app](https://whatsapp-fullstack.vercel.app)

---

## 🛠 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React.js            |
| Backend    | Node.js + Express   |
| Database   | MongoDB Atlas       |
| Realtime   | Socket.IO           |
| Deployment | Vercel + GitHub     |

---

## 📸 Features

- ✅ Add new users and send messages via UI
- ✅ Real-time messaging with Socket.IO
- ✅ Unread message badges
- ✅ Message status: ✓ sent, ✓✓ delivered, ✓✓ read
- ✅ Sidebar search & last message preview
- ✅ Responsive UI for mobile/desktop
- ✅ Back button for mobile views
- ✅ Typing indicator (optional plan)

---

## 📁 Project Structure

```bash
whatsapp-fullstack/
├── backend/                 # Express.js API
│   ├── models/Message.js
│   ├── routes/webhook.js
│   └── index.js
├── whatsapp-frontend/       # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── ChatWindow.js
│   │   │   └── SendBox.js
│   │   ├── App.js
│   │   └── App.css
├── .gitignore
└── README.md

🚀 How to Run Locally
Make sure you have Node.js and MongoDB installed (or use MongoDB Atlas)

1. Clone the repo
git clone https://github.com/yourgitid/whatsapp-fullstack.git
cd whatsapp-fullstack

2. Backend Setup (/backend)
cd backend
npm install
Create a .env file inside /backend:


MONGO_URI=your-mongodb-uri
Run server:


node index.js
3. Frontend Setup (/whatsapp-frontend)

cd ../whatsapp-frontend
npm install
npm start
The app runs at http://localhost:3000 by default

🧠 Future Enhancements (Optional)
🔐 Authentication (Google Login)

📁 Media & image sharing

🌍 Multi-language support

🔔 Push notifications

📝 Message delete/edit

📬 Contact
Developer: Ganesh
GitHub: @Ghani55-dev