🚀 Overview
-----------

SurveyX is a comprehensive, full-stack survey management application designed to simplify the process of creating, distributing, and analyzing surveys with advanced features and intelligent insights. The purpose of this project was to apply concepts/skills learned in cs50, while simultaneously applying skills/technologies learned outside of the program.


### Video Demo: https://youtu.be/eI9Gq7Zta9g

✨ Features
----------

### User Management

*   Secure user registration and authentication
    
*   Role-based access control
    
*   Profile management
    

### Survey Creation

*   Dynamic survey design
    
*   Multiple question types
    
    *   Text input
        
    *   Multiple choice
        
    *   Rating scales
        
    *   Dropdown selections
        
*   Survey linking and sharing
    
*   Draft and published states
    

### Response Collection

*   Anonymous and authenticated responses
    
*   Real-time response tracking
    
*   Unique respondent identification
    

### Analytics

*   AI-powered insights generation
    
*   Comprehensive response visualization
    
*   Exportable analytics reports
    

💻 Tech Stack
-------------

### Backend

*   **Language**: Java 17
    
*   **Framework**: Spring Boot
    
*   **Security**: Spring Security, JWT
    
*   **ORM**: JPA/Hibernate
    
*   **Database**: PostgreSQL
    
*   **Testing**: JUnit, Mockito
    

### Frontend

*   **Framework**: React
    
*   **State Management**: React Hooks
    
*   **Routing**: React Router
    
*   **HTTP Client**: Axios
    
*   **Styling**: Bootstrap, CSS
    
*   **Authentication**: JWT Token
    

### Additional Technologies

*   OpenAI API (for insights generation)
    
*   UUID for unique identifiers
    
*   JSON for data interchange
    

🔧 Prerequisites
----------------

*   Java Development Kit (JDK) 17+
    
*   Node.js 14+
    
*   PostgreSQL 12+
    
*   Maven
    
*   npm or yarn
    

# 📦 Installation

## Backend Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/surveyx.git
    ```

2. **Navigate to the backend directory**
    ```bash
    cd surveyx/backend
    ```

3. **Configure `application.properties`**
    - Update the database credentials in `application.properties` file.

4. **Build the project**
    ```bash
    mvn clean install
    ```

5. **Run the application**
    ```bash
    mvn spring-boot:run
    ```

## Frontend Setup

1. **Navigate to the frontend directory**
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Start the development server**
    ```bash
    npm start
    ```



📡 API Documentation
--------------------

## Authentication Endpoints

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | /api/auth/signup      | Register new user      |
| POST   | /api/auth/login       | User authentication    |

## Survey Endpoints

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| GET    | /api/surveys          | List all surveys       |
| GET    | /api/surveys/{id}     | Get survey details     |
| POST   | /api/surveys          | Create new survey      |
| PUT    | /api/surveys/{id}     | Update survey          |
| DELETE | /api/surveys/{id}     | Delete survey          |


### Comprehensive Endpoint List

#### Authentication Endpoints

*   POST /api/auth/signup: Register a new user
    
*   POST /api/auth/login: User login
    

#### Survey Endpoints

*   GET /api/surveys: Retrieve all surveys
    
*   GET /api/surveys/{surveyId}: Get specific survey
    
*   POST /api/surveys: Create a new survey
    
*   PUT /api/surveys/{surveyId}: Update survey
    
*   DELETE /api/surveys/{surveyId}: Delete survey
    
*   PUT /api/surveys/{surveyId}/publish: Publish survey
    

#### Question Endpoints

*   GET /api/questions/survey/{surveyId}: Get questions for a survey
    
*   POST /api/questions: Create a question
    
*   PUT /api/questions/{questionId}: Update question
    
*   DELETE /api/questions/{questionId}: Delete question
    

#### Response Endpoints

*   POST /api/responses/survey/{surveyId}: Submit survey responses
    
*   GET /api/responses/survey/{surveyId}: Get survey responses
    

#### Analytics Endpoints

*   GET /api/analytics/survey/{surveyId}: Get survey analytics
    
*   POST /api/analytics/survey/{surveyId}: Generate survey analytics
    

#### Public Survey Submission

*   GET /survey/{surveyLink}: View survey
    
*   POST /survey/api/{surveyLink}/submit: Submit survey responses
    

🔒 Security
-----------

### Authentication Mechanisms

*   JWT-based authentication
    
*   Password hashing with BCrypt
    
*   Stateless session management
    
*   Role-based access control
    

### Security Configurations

*   CORS configuration
    
*   Endpoint protection
    
*   Secure token validation
    

🌈 Frontend Components
----------------------

### Key React Components

*   Login: User authentication
    
*   Signup: User registration
    
*   SurveyList: Survey management
    
*   SurveyForm: Survey creation/editing
    
*   QuestionForm: Dynamic question creation
    
*   ResponseSubmission: Survey response collection
    
*   SurveyAnalytics: Insight generation
    

🗄️ Database Schema
-------------------

## Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,  -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Surveys Table
```sql
CREATE TABLE surveys (
    survey_id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,  -- Optional: Expiration date for the survey
    -- status ENUM('draft', 'active', 'closed') DEFAULT 'draft',
    survey_link VARCHAR(255) UNIQUE  -- Unique link for respondents
    -- response_count INT DEFAULT 0  
);
```

## Questions Table
```sql
CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    survey_id INT REFERENCES surveys(survey_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'multiple_choice', 'rating', 'dropdown') NOT NULL,
    answer_options TEXT[],  -- Array to store answer options for multiple-choice/dropdown
    required BOOLEAN DEFAULT TRUE,  -- Whether the question is mandatory
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Responses Table
```sql
CREATE TABLE responses (
    response_id SERIAL PRIMARY KEY,
    survey_id INT REFERENCES surveys(survey_id) ON DELETE CASCADE,
    respondent_id UUID,  -- Optional: This can be null for anonymous responses
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    answer_text TEXT,  -- For text-based questions
    -- answer_type ENUM('text', 'multiple_choice', 'rating', 'dropdown') NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Survey Analytics Table (AI Analysis)
```sql
CREATE TABLE survey_analytics (
    analytics_id SERIAL PRIMARY KEY,
    survey_id INT REFERENCES surveys(survey_id) ON DELETE CASCADE,
    analysis_summary TEXT,  
    insights JSONB,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```



