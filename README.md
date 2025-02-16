
# Car Rental System 🚗  

This is a full-stack car rental system built using React & TypeScript for the front end and Spring Boot (Spring Security, JPA) for the back end, with MySQL as the database. The system allows users to easily browse, book, and manage car rentals.  

---

## Features  
- **User Authentication**: Secure login and registration using Spring Security.  
- **Car Management**: View, add, update, and delete cars with details like model, price per day, year, and brand.  
- **Rental Management**: Book cars, manage reservations, and print invoices.  
- **Customer Dashboard**: Separate pages for customers to view available cars and their rental history.  
- **Admin Panel**: Manage cars, brands, and rental records.  
- **Responsive Design**: Optimized for both desktop and mobile devices.  

---

## Tech Stack  
- **Frontend**: React & TypeScript  
- **Backend**: Spring Boot (Spring Security, JPA)  
- **Database**: MySQL  

---

## Prerequisites  
Make sure you have the following installed on your system:  
- [Node.js](https://nodejs.org/)  
- [Java 17+](https://adoptium.net/)  
- [MySQL](https://www.mysql.com/)  

---

## Getting Started  

### 1. Clone the Repository  
```bash
git clone https://github.com/<your-username>/carrental.git
cd carrental
```

### 2. Backend Setup (Spring Boot)  
1. Navigate to the Spring Boot project folder:  
   ```bash
   cd backend
   ```
2. Update `application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/car_rental_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

---

### 3. Frontend Setup (React & TypeScript)  
1. Navigate to the React project folder:  
   ```bash
   cd frontend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the React development server:  
   ```bash
   npm start
   ```

---

## Usage  
- Visit `http://localhost:3000` to access the frontend.  
- Backend runs on `http://localhost:8080`.  
- Admin can manage cars, brands, and rental records.  
- Customers can browse available cars and manage their bookings.  

---

## Screenshots  
Add some screenshots here to showcase your application.

---

## Contributing  
Feel free to submit issues, fork the repository, and send pull requests. Contributions are welcome!  

---

## License  
This project is licensed under the MIT License.  

---

## Contact  
For any questions or feedback, feel free to reach out!  
