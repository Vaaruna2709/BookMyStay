#  BookMyStay

BookMyStay is a full-stack Node.js web application that allows users to browse, list, and review travel stays around the world. It’s inspired by platforms like Airbnb and built using Express, MongoDB, and EJS templating.

---

##  Features

- User authentication (register/login/logout)
- Add and manage property listings
- Leave reviews for listings
- Interactive map integration to show listing locations
- Flash messages for user feedback
- Responsive UI using EJS and Bootstrap
- Database seeding with sample listings

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Templating:** EJS + ejs-mate  
- **Authentication:** Passport.js (Local Strategy)  
- **Frontend:** HTML, CSS, Bootstrap  

---

## 🖥️ Setup Locally:

1. Git Clone BookMyStay

```bash
git clone https://github.com/Vaaruna2709/BookMyStay.git
```

2. CD to BookMyStay

```bash
cd BookMyStay
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file and add the following:

```bash
MONGO_URL=mongodb://127.0.0.1:27017/bookMyStay
```

5. Seed the database

```bash
node init/index.js
```

---

## ▶️ Run Locally:

1. Run the dev server

```bash
npx nodemon app.js
```

> Or if nodemon is not installed globally:

```bash
node app.js
```

2. Open in browser:

```bash
http://localhost:8080
```

---

## 👤 Author

[Vaaruna Ramakrishnan](https://github.com/Vaaruna2709)
