# FarmToWindow

A farm-to-consumer e-commerce platform where farmers directly sell their products to customers.

## 📋 System Requirements

To run this full-stack project locally, your system must have the following software installed:

### 1. Java Development Kit (JDK) 17 or higher
- **Why?** Required to compile and run the Spring Boot backend.
- **Download:** [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or [OpenJDK 17](https://adoptium.net/temurin/releases/?version=17)
- **Verify:** Open your terminal and run `java -version` and `javac -version`

### 2. Apache Maven
- **Why?** Used to build the Spring Boot project and manage Java dependencies.
- **Download:** [Apache Maven](https://maven.apache.org/download.cgi)
- **Setup:** Extract the zip file and add the `bin` folder to your system's `PATH` Environment Variable.
- **Verify:** Open your terminal and run `mvn -version`

### 3. Node.js & npm
- **Why?** Required to run the React (Vite) frontend and install JavaScript packages.
- **Download:** [Node.js (LTS version recommended)](https://nodejs.org/)
- **Verify:** Open your terminal and run `node -v` and `npm -v`

### 4. MySQL Server
- **Why?** Relational database used to store users, products, and orders.
- **Download:** [MySQL Community Server](https://dev.mysql.com/downloads/installer/)
- **Setup:** 
  - Set the root password to **`root`** during installation. (Or change it in `backend/src/main/resources/application.properties` later).
  - Add the MySQL `bin` folder to your system's `PATH`.
- **Verify:** Open your terminal and run `mysql -V`

---

## 🚀 How to Run the Project

### Step 1: Initialize the Database
1. Open your terminal or a tool like **MySQL Workbench**.
2. Run the SQL script located at `database/schema.sql` to create the `farm_to_window` database and its tables.
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### Step 2: Start the Backend (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start processing API requests at `http://localhost:8080`.

### Step 3: Start the Frontend (React)
1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required Node packages (only needed the first time):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web application in your browser at `http://localhost:5173`.
# FarmToWindow
