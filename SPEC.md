
# AI Fluency Assessment Platform - Technical Specification

## Project Overview

The AI Fluency Assessment Platform is a web application designed to evaluate users' understanding of artificial intelligence concepts through interactive assessments. The platform provides detailed feedback on performance and allows users to share and compare their results.

## Goals

1. Provide an accessible way for users to evaluate their AI knowledge
2. Offer comprehensive assessment tools with different difficulty levels
3. Create a community aspect through leaderboards and result sharing
4. Provide detailed feedback to help users understand their strengths and areas for improvement
5. Allow administrators to manage and monitor the system

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing a component-based architecture. Key architectural elements include:

- **Component Structure**: Follows a modular approach with reusable UI components
- **State Management**: Uses React's Context API and React Query for remote data
- **Routing**: Implements React Router for navigation
- **Styling**: Utilizes TailwindCSS with shadcn-ui components

### Backend Architecture

The backend is powered by Supabase, providing:

- **Database**: PostgreSQL database for storing questions, test types, and user results
- **Authentication**: User authentication and authorization (planned future feature)
- **APIs**: RESTful APIs for data access
- **File Storage**: Storage for any media assets (planned future feature)

### Data Flow

1. **Question Management**:
   - Questions are stored in a JSON file and migrated to the database
   - Questions are categorized and assigned difficulty levels
   - Test types define which questions are included in each assessment

2. **Test Taking Process**:
   - User selects a test type
   - System loads appropriate questions
   - User answers questions
   - System calculates results and stores them

3. **Result Processing**:
   - Scores are calculated based on correct answers
   - Category breakdowns are generated
   - Fluency tier is determined based on overall score
   - Results can be saved to the leaderboard and shared

## Database Schema

### Core Tables

1. **categories**
   - id (UUID, PK)
   - name (text)
   - description (text)
   - created_at (timestamp)

2. **questions**
   - id (UUID, PK)
   - category_id (UUID, FK to categories)
   - text (text)
   - difficulty (enum)
   - correct_answer (boolean)
   - is_active (boolean)
   - version (integer)
   - created_at (timestamp)
   - updated_at (timestamp)
   - parent_question_id (UUID, nullable)

3. **test_types**
   - id (UUID, PK)
   - name (text)
   - description (text)
   - question_limit (integer, nullable)
   - is_active (boolean)
   - created_at (timestamp)

4. **test_questions_map**
   - id (UUID, PK)
   - test_type_id (UUID, FK to test_types)
   - question_id (UUID, FK to questions)
   - created_at (timestamp)

5. **test_results**
   - id (UUID, PK)
   - user_id (UUID, nullable)
   - username (text, nullable)
   - overall_score (integer)
   - max_possible_score (integer)
   - percentage_score (numeric)
   - category_scores (jsonb)
   - tier_name (text)
   - questions_snapshot (jsonb)
   - public (boolean)
   - share_id (UUID)
   - created_at (timestamp)

6. **user_answers**
   - id (UUID, PK)
   - user_id (UUID, nullable)
   - question_id (UUID, FK to questions)
   - test_result_id (UUID, FK to test_results)
   - answer (boolean)
   - created_at (timestamp)

## Key Components

### Test Interface

The test interface presents questions to users and collects their answers. It includes:

- Question display with category and difficulty information
- Answer selection interface
- Navigation controls
- Progress tracking

### Results Dashboard

After completing a test, users see a comprehensive results dashboard that includes:

- Overall score and fluency tier
- Category breakdown of performance
- Options to save to leaderboard
- Sharing capabilities
- Visual representations of performance data

### Leaderboard

The leaderboard displays top performers, showing:

- Rank
- Username
- Score
- Fluency tier
- Test date

### Admin Panel

The admin panel provides system management capabilities:

- Data migration tools
- System diagnostics
- Database initialization

## Data Migration and Initialization

The system includes several utilities for managing data:

1. **JSON Data Migration**:
   - Reads from a structured JSON file
   - Populates categories, questions and test types
   - Maps questions to test types

2. **Database Migration**:
   - Alternative migration from hardcoded data
   - Creates categories, questions, and test mappings

3. **Auto-Initialization**:
   - Checks if the database is already populated
   - Automatically runs migration if needed
   - Shows notification of progress

## Future Enhancements

1. **User Authentication**:
   - User accounts and profiles
   - Saved test history
   - Personalized recommendations

2. **Advanced Analytics**:
   - Trend analysis of performance
   - Comparative analytics
   - Learning path recommendations

3. **Content Management**:
   - Admin interface for question management
   - Question versioning and updating
   - Test creation and customization

4. **Mobile Application**:
   - Native mobile experience
   - Offline test taking
   - Push notifications

## Technical Considerations

1. **Scalability**:
   - The database schema is designed to accommodate growth
   - Component architecture allows for extension
   - Supabase provides serverless scaling

2. **Performance**:
   - Questions are loaded on demand
   - Results are calculated client-side
   - Data is cached appropriately

3. **Security**:
   - Future implementation will include row-level security in Supabase
   - Shared results use UUIDs for security
   - Admin functions are protected

4. **Accessibility**:
   - UI components follow accessibility guidelines
   - Color contrast meets WCAG standards
   - Keyboard navigation support
