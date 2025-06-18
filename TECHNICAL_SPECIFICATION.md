
# AI Fluency Assessment Platform - Complete Technical Specification

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Experience & Pages](#user-experience--pages)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Question System](#question-system)
7. [Assessment Logic](#assessment-logic)
8. [Scoring & Tiers](#scoring--tiers)
9. [Component Architecture](#component-architecture)
10. [API & Services](#api--services)
11. [UI/UX Design System](#uiux-design-system)
12. [Data Flow](#data-flow)
13. [Admin Panel](#admin-panel)
14. [Sharing & Leaderboard](#sharing--leaderboard)
15. [Technical Implementation](#technical-implementation)
16. [Deployment & Infrastructure](#deployment--infrastructure)

## Project Overview

### Purpose
The AI Fluency Assessment Platform is a comprehensive web application designed to evaluate users' understanding and proficiency with artificial intelligence concepts, tools, and best practices. The platform provides self-assessment capabilities, detailed performance analytics, tier-based fluency classifications, and community features through leaderboards and result sharing.

### Core Objectives
- **Assessment**: Provide accurate, comprehensive evaluation of AI knowledge across multiple domains
- **Education**: Offer detailed feedback and learning paths to improve AI fluency
- **Community**: Enable users to share results and compare performance with peers
- **Analytics**: Generate insights into user performance patterns and knowledge gaps
- **Accessibility**: Ensure the platform is accessible to users with varying technical backgrounds

### Target Audience
- AI practitioners and enthusiasts
- Professionals looking to validate their AI knowledge
- Students learning about artificial intelligence
- Organizations assessing team AI capabilities
- Recruiters evaluating candidate AI competency

## System Architecture

### Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with shadcn-ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Edge Functions)
- **State Management**: React Query (@tanstack/react-query) + React Context
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

### Architecture Patterns
- **Component-Driven Development**: Modular, reusable components
- **Service Layer Pattern**: Separated business logic from UI components
- **Repository Pattern**: Abstracted data access through service layers
- **Observer Pattern**: Real-time updates using Supabase subscriptions
- **Strategy Pattern**: Pluggable scoring algorithms and question selection strategies

## User Experience & Pages

### 1. Landing Page (`/`)
**Purpose**: Welcome users and provide entry points to assessments

**Components**:
- Hero section with platform introduction
- Assessment type selection (Quick vs Comprehensive)
- Fluency tier explanation
- Learning path overview
- Sample results carousel
- Call-to-action buttons

**User Actions**:
- Start Quick Assessment (20 questions, ~10 minutes)
- Start Comprehensive Assessment (50+ questions, ~25 minutes)
- View fluency tier information
- Explore learning paths
- Access leaderboard

### 2. Test Interface (`/test/:type`)
**Purpose**: Conduct the actual assessment

**Components**:
- Test header with progress and metadata
- Progress bar with completion percentage
- Question card with category/difficulty indicators
- Answer selection interface (True/False with confidence levels)
- Navigation controls (Previous/Next/Complete)
- Time tracking display
- Save progress functionality

**User Experience Flow**:
1. Test initialization and question loading
2. Question presentation with clear formatting
3. Answer collection with immediate feedback
4. Progress tracking throughout assessment
5. Validation before test completion
6. Smooth transitions between questions

### 3. Results Dashboard (`/results`)
**Purpose**: Display comprehensive assessment results

**Sections**:
- **Overall Score Card**: Total score, percentage, fluency tier
- **Category Breakdown**: Performance across AI domains
- **Difficulty Analysis**: Performance by question complexity
- **Visual Analytics**: Radar charts, bar charts, trend analysis
- **Detailed Question Review**: Question-by-question breakdown
- **Action Items**: Save to leaderboard, share results, retake options
- **Learning Recommendations**: Personalized improvement suggestions

### 4. Shared Results View (`/shared/:shareId`)
**Purpose**: Display publicly shared assessment results

**Features**:
- Read-only result display
- Performance visualization
- Question breakdown (if available)
- Sharer attribution
- "Take Your Own Assessment" call-to-action

### 5. Leaderboard (`/leaderboard`)
**Purpose**: Community comparison and competition

**Features**:
- Paginated ranking display
- Multiple sorting options (score, date, tier)
- Filtering by time period and test type
- Performance statistics
- User search functionality
- Anonymous and named results

### 6. Admin Panel (`/admin`)
**Purpose**: System management and content administration

**Sections**:
- Database status monitoring
- Question management (CRUD operations)
- Test type configuration
- Migration tools (JSON import, legacy data)
- Test data generation
- User role management
- System diagnostics

### 7. Authentication (`/auth`)
**Purpose**: User login and registration for admin features

**Features**:
- Email/password authentication
- Password reset functionality
- Admin role verification
- Secure session management

## Database Schema

### Tables Overview

#### 1. `categories`
Stores AI knowledge domains and subject areas.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Sample Data**:
- Prompt Engineering: Crafting effective AI prompts
- AI Ethics: Responsible AI usage and considerations
- Technical Concepts: Core AI/ML technical knowledge
- Practical Applications: Real-world AI implementation

#### 2. `questions`
Core assessment questions with versioning support.

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  difficulty difficulty_level NOT NULL,
  correct_answer BOOLEAN NOT NULL,
  explanation TEXT,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  parent_question_id UUID REFERENCES questions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Difficulty Levels** (ENUM):
- `novice`: Basic AI awareness
- `advanced-beginner`: Fundamental understanding
- `competent`: Practical knowledge
- `proficient`: Advanced application
- `expert`: Mastery level

#### 3. `test_types`
Defines different assessment formats and configurations.

```sql
CREATE TABLE test_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  question_limit INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Standard Test Types**:
- Quick Assessment: 20 questions, balanced distribution
- Comprehensive Assessment: 50 questions, comprehensive coverage

#### 4. `test_questions_map`
Maps questions to specific test types for balanced distribution.

```sql
CREATE TABLE test_questions_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type_id UUID REFERENCES test_types(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 5. `test_results`
Stores completed assessment results and metadata.

```sql
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  username TEXT,
  overall_score INTEGER NOT NULL,
  max_possible_score INTEGER NOT NULL,
  percentage_score NUMERIC NOT NULL,
  tier_name TEXT NOT NULL,
  category_scores JSONB NOT NULL,
  questions_snapshot JSONB,
  public BOOLEAN DEFAULT false,
  share_id UUID DEFAULT gen_random_uuid(),
  is_test_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 6. `user_answers`
Individual answer records for detailed analysis.

```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  test_result_id UUID REFERENCES test_results(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  answer BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 7. `user_roles`
Role-based access control for admin features.

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Indexes and Performance Optimization

```sql
-- Performance indexes
CREATE INDEX idx_questions_category_difficulty ON questions(category_id, difficulty);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;
CREATE INDEX idx_test_results_public_score ON test_results(public, overall_score DESC) WHERE public = true;
CREATE INDEX idx_test_results_share_id ON test_results(share_id);
CREATE INDEX idx_user_answers_test_result ON user_answers(test_result_id);

-- Unique constraints
ALTER TABLE test_questions_map ADD CONSTRAINT unique_test_question UNIQUE(test_type_id, question_id);
```

## Authentication & Authorization

### User Types
1. **Anonymous Users**: Can take assessments, limited features
2. **Registered Users**: Full access, saved history (future feature)
3. **Admin Users**: Full system access, content management

### Security Implementation
- Supabase Auth integration
- Row Level Security (RLS) policies
- JWT token validation
- Protected routes with role verification
- Secure admin panel access

### Admin Functions
```sql
-- Admin role verification
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
$$;
```

## Question System

### Question Types
All questions follow a True/False format for consistency and ease of analysis.

### Question Categories & Distribution

#### 1. Prompt Engineering (25% of questions)
- Effective prompt construction
- Prompt optimization techniques
- Context management
- Output refinement strategies

**Sample Questions**:
- "Adding specific examples to prompts generally improves AI output quality"
- "The order of instructions in a prompt rarely affects the AI's response"
- "Using role-based prompts (e.g., 'You are an expert...') can improve response accuracy"

#### 2. AI Ethics (25% of questions)
- Bias detection and mitigation
- Privacy considerations
- Transparency requirements
- Responsible AI deployment

**Sample Questions**:
- "AI systems can perpetuate societal biases present in their training data"
- "It's always acceptable to use AI-generated content without disclosure"
- "Regular auditing of AI systems is essential for ethical deployment"

#### 3. Technical Concepts (25% of questions)
- Machine learning fundamentals
- AI model types and capabilities
- Limitations and constraints
- Technical terminology

**Sample Questions**:
- "Large Language Models can reliably perform mathematical calculations"
- "Transfer learning allows AI models to apply knowledge from one domain to another"
- "AI models always improve with more training data"

#### 4. Practical Applications (25% of questions)
- Real-world use cases
- Implementation strategies
- Tool selection
- Workflow integration

**Sample Questions**:
- "AI can completely replace human creativity in content generation"
- "Combining multiple AI tools often produces better results than using a single tool"
- "AI-generated code should always be reviewed by human developers"

### Difficulty Progression
Questions are distributed across five difficulty levels with increasing complexity:

- **Novice** (20%): Basic awareness, simple concepts
- **Advanced Beginner** (25%): Fundamental understanding
- **Competent** (25%): Practical application knowledge
- **Proficient** (20%): Advanced concepts and nuanced understanding
- **Expert** (10%): Mastery-level insights and edge cases

### Question Management
- Version control system for question updates
- Active/inactive status for content management
- Explanation system for learning enhancement
- Category and difficulty tagging
- Parent-child relationships for question variants

## Assessment Logic

### Test Selection Algorithm
The system uses a balanced distribution algorithm to ensure fair and comprehensive assessment:

```typescript
// Balanced question selection strategy
const selectQuestions = (testType: string, limit: number) => {
  const distribution = {
    categories: ['prompt-engineering', 'ai-ethics', 'technical-concepts', 'practical-applications'],
    difficulties: ['novice', 'advanced-beginner', 'competent', 'proficient', 'expert'],
    categoryWeight: 0.25, // 25% per category
    difficultyDistribution: [0.2, 0.25, 0.25, 0.2, 0.1] // Novice to Expert
  };
  
  return balancedSelection(distribution, limit);
};
```

### Scoring Methodology
- **Binary Scoring**: Each correct answer = 1 point
- **No Penalty**: Incorrect answers = 0 points (encourages honest self-assessment)
- **Percentage Calculation**: (Correct Answers / Total Questions) × 100
- **Category Breakdown**: Individual scores per knowledge domain
- **Difficulty Analysis**: Performance across complexity levels

### Self-Assessment Approach
The platform uses a self-assessment methodology where users evaluate their own knowledge:
- Questions are framed as knowledge/capability statements
- Users respond True/False based on their self-perceived competence
- This approach encourages honest reflection and learning awareness
- Reduces test anxiety compared to traditional quiz formats

## Scoring & Tiers

### Fluency Tier System
Users are classified into five fluency tiers based on their overall assessment score:

#### 1. Novice (0-20% score)
- **Description**: "Just beginning to explore AI concepts and applications"
- **Characteristics**: Basic awareness, limited practical experience
- **Recommendations**: Foundational learning, basic terminology, introductory courses

#### 2. Aware (21-40% score)
- **Description**: "Familiar with basic AI concepts but limited practical experience"
- **Characteristics**: Understands fundamental concepts, minimal hands-on experience
- **Recommendations**: Practical tutorials, tool exploration, basic project work

#### 3. Competent (41-60% score)
- **Description**: "Can effectively use AI tools for common tasks and applications"
- **Characteristics**: Regular AI tool usage, understands best practices
- **Recommendations**: Advanced techniques, specialized applications, workflow optimization

#### 4. Proficient (61-80% score)
- **Description**: "Advanced AI user who can tackle complex problems and optimize workflows"
- **Characteristics**: Strategic AI implementation, advanced prompt engineering
- **Recommendations**: Teaching others, contributing to AI communities, specialized domains

#### 5. Expert (81-100% score)
- **Description**: "AI expert capable of leading implementation and teaching others"
- **Characteristics**: Deep understanding, thought leadership, innovation
- **Recommendations**: Research contributions, mentoring, cutting-edge applications

### Score Calculation Engine
```typescript
interface ScoreCalculation {
  overallScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  categoryScores: CategoryScore[];
  tier: FluencyTier;
  timestamp: Date;
}

const calculateResults = (questions: Question[], answers: UserAnswer[]): ScoreCalculation => {
  const correctAnswers = answers.filter(answer => answer.answer === true).length;
  const percentageScore = (correctAnswers / questions.length) * 100;
  const tier = determineUserTier(percentageScore);
  const categoryScores = calculateCategoryBreakdown(questions, answers);
  
  return {
    overallScore: correctAnswers,
    maxPossibleScore: questions.length,
    percentageScore,
    categoryScores,
    tier,
    timestamp: new Date()
  };
};
```

## Component Architecture

### Architectural Principles
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Flexible component composition
- **Props Interface Design**: Clear, typed interfaces for all components
- **Error Boundaries**: Graceful error handling at component level
- **Performance Optimization**: Lazy loading, memoization, efficient re-renders

### Core Component Hierarchy

#### 1. Layout Components
```
App
├── Router
├── Header
├── Main Content Area
└── Footer (future)
```

#### 2. Page Components
```
Pages/
├── Index (Landing)
├── TestInterface
├── ResultsDashboard
├── SharedResultView
├── Leaderboard
├── Admin
└── Auth
```

#### 3. Feature Components
```
Features/
├── Test/
│   ├── TestHeader
│   ├── QuestionCard
│   ├── ProgressBar
│   ├── TestNavigation
│   └── TestTimer
├── Results/
│   ├── ScoreCard
│   ├── CategoryBreakdown
│   ├── ScoreChart
│   ├── QuestionBreakdown
│   └── ShareResults
├── Leaderboard/
│   ├── LeaderboardTable
│   ├── PaginationControls
│   ├── SortControls
│   └── FilterControls
└── Admin/
    ├── DatabaseStatus
    ├── MigrationControls
    ├── TestHarness
    └── UserManagement
```

#### 4. Shared Components
```
Shared/
├── UI/ (shadcn-ui components)
├── Forms/
├── Charts/
├── Loading/
└── Error/
```

### Component Design Patterns

#### Container/Presenter Pattern
```typescript
// Container Component (Logic)
const TestContainer: React.FC = () => {
  const { questions, answers, handleAnswer } = useTestState();
  return <TestPresenter questions={questions} onAnswer={handleAnswer} />;
};

// Presenter Component (UI)
const TestPresenter: React.FC<TestPresenterProps> = ({ questions, onAnswer }) => {
  return <div>/* Pure UI implementation */</div>;
};
```

#### Custom Hooks Pattern
```typescript
// Encapsulated business logic
const useTestState = (testType: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // ... logic
  return { questions, currentIndex, handleAnswer, handleNext };
};
```

#### Service Layer Pattern
```typescript
// Abstracted data access
export const questionService = {
  fetchQuestions: (testType: string) => Promise<Question[]>,
  saveAnswers: (answers: UserAnswer[]) => Promise<void>,
  calculateResults: (questions: Question[], answers: UserAnswer[]) => TestResult
};
```

## API & Services

### Service Layer Architecture

#### 1. Question Service (`questionService.ts`)
- **Purpose**: Question data management and test configuration
- **Methods**:
  - `getQuestionsForTest(testType)`: Fetch balanced question set
  - `fetchCategories()`: Get all question categories
  - `convertDBQuestionToAppFormat()`: Transform database records

#### 2. Test Result Service (`testResultService.ts`)
- **Purpose**: Assessment result persistence and retrieval
- **Methods**:
  - `saveTestResult()`: Store completed assessment
  - `fetchLeaderboard()`: Get public results with pagination
  - `fetchResultByShareId()`: Retrieve shared results
  - `toggleResultPublic()`: Update result visibility

#### 3. User Answer Service (`userAnswerService.ts`)
- **Purpose**: Individual answer tracking and analysis
- **Methods**:
  - `saveUserAnswers()`: Store user responses
  - `fetchUserAnswersForTest()`: Retrieve test-specific answers

#### 4. Category Service (`categoryService.ts`)
- **Purpose**: Knowledge domain management
- **Methods**:
  - `fetchCategories()`: Get all categories
  - `createCategory()`: Add new knowledge domain

### Data Access Patterns

#### Repository Pattern Implementation
```typescript
interface QuestionRepository {
  findByTestType(testType: string): Promise<Question[]>;
  findByCategory(categoryId: string): Promise<Question[]>;
  create(question: CreateQuestionRequest): Promise<Question>;
  update(id: string, updates: UpdateQuestionRequest): Promise<Question>;
}

class SupabaseQuestionRepository implements QuestionRepository {
  async findByTestType(testType: string): Promise<Question[]> {
    // Supabase implementation
  }
}
```

#### Service Layer with Error Handling
```typescript
export class QuestionService {
  constructor(private repository: QuestionRepository) {}
  
  async getQuestionsForTest(testType: string): Promise<Question[]> {
    try {
      const questions = await this.repository.findByTestType(testType);
      return this.validateAndTransform(questions);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw new ServiceError('Unable to load assessment questions');
    }
  }
}
```

### Supabase Integration

#### Database Functions
```sql
-- Balanced question selection
CREATE OR REPLACE FUNCTION populate_test_questions(
  test_type_name TEXT,
  question_limit INTEGER DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Implementation for balanced question distribution
$$;

-- Admin question management
CREATE OR REPLACE FUNCTION admin_insert_question(
  question_text TEXT,
  category_id UUID,
  difficulty TEXT,
  correct_answer BOOLEAN,
  explanation_text TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Secure question insertion with validation
$$;
```

#### Real-time Subscriptions (Future Enhancement)
```typescript
// Real-time leaderboard updates
const subscribeToLeaderboard = () => {
  return supabase
    .channel('leaderboard-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'test_results',
      filter: 'public=eq.true'
    }, handleNewResult)
    .subscribe();
};
```

## UI/UX Design System

### Design Principles
- **Accessibility First**: WCAG 2.1 AA compliance
- **Progressive Enhancement**: Works without JavaScript
- **Mobile Responsive**: Mobile-first design approach
- **Consistent Theming**: Unified color palette and typography
- **Clear Information Hierarchy**: Logical content organization

### Color Palette
```css
:root {
  /* Primary Colors */
  --ai-purple: #8B5CF6;
  --ai-purple-light: #A78BFA;
  --ai-purple-dark: #7C3AED;
  
  /* Secondary Colors */
  --ai-blue: #3B82F6;
  --ai-green: #10B981;
  --ai-yellow: #F59E0B;
  --ai-red: #EF4444;
  
  /* Neutral Colors */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-500: #6B7280;
  --gray-700: #374151;
  --gray-900: #111827;
}
```

### Typography Scale
```css
/* Typography */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
```

### Component Design Tokens
```typescript
// Design system tokens
export const designTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
};
```

### Responsive Design Breakpoints
```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 0 1rem;
}

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Clear focus indicators
- **Alternative Text**: Descriptive alt text for images
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Data Flow

### State Management Architecture

#### 1. Server State (React Query)
```typescript
// Question fetching with caching
const useQuestions = (testType: string) => {
  return useQuery({
    queryKey: ['questions', testType],
    queryFn: () => questionService.getQuestionsForTest(testType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Leaderboard with real-time updates
const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => testResultService.fetchLeaderboard(),
    refetchInterval: 30000 // 30 seconds
  });
};
```

#### 2. Client State (React Context + useState)
```typescript
// Test state management
const TestContext = createContext<TestContextType | null>(null);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  return (
    <TestContext.Provider value={{ /* state and actions */ }}>
      {children}
    </TestContext.Provider>
  );
};
```

#### 3. URL State (React Router)
```typescript
// Route-based state management
const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/test/:testType', element: <TestInterface /> },
  { path: '/results/:resultId?', element: <ResultsDashboard /> },
  { path: '/shared/:shareId', element: <SharedResultView /> },
  { path: '/leaderboard', element: <LeaderboardPage /> },
  { path: '/admin', element: <AdminPanel /> }
];
```

### Data Flow Patterns

#### 1. Assessment Flow
```
User Starts Test
    ↓
Load Questions (API) → Cache in React Query
    ↓
Present Questions → Store Answers in Local State
    ↓
Submit Answers → Calculate Results → Save to Database
    ↓
Display Results → Option to Share/Save
```

#### 2. Result Sharing Flow
```
User Completes Assessment
    ↓
Generate Share ID → Save to Database (public=true)
    ↓
Create Shareable URL → Copy to Clipboard
    ↓
Shared Link Access → Fetch by Share ID → Display Results
```

#### 3. Admin Data Management Flow
```
Admin Login → Role Verification
    ↓
Access Admin Panel → Database Status Check
    ↓
Content Management → CRUD Operations → Database Updates
    ↓
Migration Tools → Data Import/Export → Validation
```

## Admin Panel

### Administrative Features

#### 1. Database Management
- **Connection Status**: Real-time database health monitoring
- **Table Statistics**: Record counts, storage usage
- **Performance Metrics**: Query performance, slow queries
- **Backup Status**: Backup verification and scheduling

#### 2. Question Management
- **CRUD Operations**: Create, read, update, delete questions
- **Bulk Import**: JSON file question import with validation
- **Category Management**: Add/edit knowledge domains
- **Version Control**: Question versioning and history
- **Quality Assurance**: Question review and approval workflow

#### 3. Test Configuration
- **Test Type Management**: Create custom assessment types
- **Question Distribution**: Configure category/difficulty balance
- **Time Limits**: Set assessment duration constraints
- **Scoring Rules**: Customize scoring algorithms

#### 4. User Management
- **Role Assignment**: Grant/revoke admin privileges
- **User Activity**: Monitor user engagement metrics
- **Account Management**: User account administration

#### 5. Analytics Dashboard
- **Usage Statistics**: Assessment completion rates
- **Performance Analytics**: Average scores, difficulty analysis
- **Trend Monitoring**: Score trends over time
- **Geographic Distribution**: User location insights

#### 6. Content Migration Tools
- **JSON Import**: Import questions from structured JSON files
- **Database Migration**: Legacy data conversion utilities
- **Data Validation**: Content integrity verification
- **Backup/Restore**: System backup and restoration tools

### Admin Security
- **Role-Based Access**: Multi-level permission system
- **Audit Logging**: Comprehensive action logging
- **Session Management**: Secure admin session handling
- **IP Restrictions**: Geographic access controls (optional)

## Sharing & Leaderboard

### Result Sharing System

#### 1. Share ID Generation
```typescript
// Generate secure, unique share identifiers
const generateShareId = (): string => {
  return crypto.randomUUID(); // UUIDv4 for security
};

// Create shareable URL
const createShareUrl = (shareId: string): string => {
  return `${window.location.origin}/shared/${shareId}`;
};
```

#### 2. Privacy Controls
- **Public/Private Toggle**: User controls result visibility
- **Anonymous Sharing**: Option to share without username
- **Expiration Settings**: Time-limited sharing (future feature)
- **Access Controls**: Restricted sharing options (future feature)

#### 3. Shared Result Display
- **Read-Only Interface**: Non-interactive result view
- **Performance Visualization**: Charts and breakdowns
- **Attribution**: Proper crediting of result owner
- **Call-to-Action**: Encourage viewers to take assessment

### Leaderboard System

#### 1. Ranking Algorithm
```typescript
// Multi-criteria ranking system
interface RankingCriteria {
  primarySort: 'score' | 'percentage' | 'tier';
  secondarySort: 'date' | 'username';
  direction: 'asc' | 'desc';
}

const calculateRank = (results: TestResult[], criteria: RankingCriteria) => {
  return results.sort((a, b) => {
    // Primary sort implementation
    if (a[criteria.primarySort] !== b[criteria.primarySort]) {
      return criteria.direction === 'desc' 
        ? b[criteria.primarySort] - a[criteria.primarySort]
        : a[criteria.primarySort] - b[criteria.primarySort];
    }
    // Secondary sort for tie-breaking
    return sortBySecondary(a, b, criteria.secondarySort);
  });
};
```

#### 2. Filtering and Pagination
- **Time-Based Filters**: Daily, weekly, monthly, all-time
- **Test Type Filters**: Quick vs comprehensive assessments
- **Tier Filters**: Show only specific fluency levels
- **Pagination**: Efficient loading of large result sets
- **Search**: Find specific users or results

#### 3. Performance Optimization
- **Caching Strategy**: Redis caching for frequently accessed data
- **Pagination**: Limit database queries with pagination
- **Indexing**: Optimized database indexes for sorting
- **Real-time Updates**: Live leaderboard updates (future feature)

## Technical Implementation

### Performance Optimization

#### 1. Frontend Optimization
```typescript
// Lazy loading for route-based code splitting
const LazyTestInterface = lazy(() => import('./components/TestInterface'));
const LazyResultsDashboard = lazy(() => import('./components/ResultsDashboard'));
const LazyAdminPanel = lazy(() => import('./components/AdminPanel'));

// Memoization for expensive calculations
const MemoizedScoreChart = memo(ScoreChart);
const MemoizedQuestionBreakdown = memo(QuestionBreakdown);

// Virtual scrolling for large lists
const VirtualizedLeaderboard = ({ items }: { items: LeaderboardEntry[] }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={64}
      itemData={items}
    >
      {LeaderboardRow}
    </FixedSizeList>
  );
};
```

#### 2. Database Optimization
```sql
-- Optimized queries with proper indexing
CREATE INDEX CONCURRENTLY idx_test_results_leaderboard 
ON test_results(public, overall_score DESC, created_at DESC) 
WHERE public = true;

-- Materialized views for complex analytics
CREATE MATERIALIZED VIEW leaderboard_summary AS
SELECT 
  tier_name,
  COUNT(*) as user_count,
  AVG(percentage_score) as avg_score,
  DATE_TRUNC('day', created_at) as date_bucket
FROM test_results 
WHERE public = true 
GROUP BY tier_name, DATE_TRUNC('day', created_at);

-- Refresh strategy for materialized views
CREATE OR REPLACE FUNCTION refresh_leaderboard_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_summary;
END;
$$ LANGUAGE plpgsql;
```

#### 3. Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});

// Service worker for offline support (future enhancement)
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
};
```

### Error Handling

#### 1. Error Boundaries
```typescript
class AssessmentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Assessment error:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### 2. API Error Handling
```typescript
// Centralized error handling
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  
  if (error && typeof error === 'object' && 'message' in error) {
    return new ApiError(
      (error as any).message,
      (error as any).status || 500,
      (error as any).code || 'UNKNOWN_ERROR'
    );
  }
  
  return new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
};
```

### Security Implementation

#### 1. Input Validation
```typescript
// Zod schemas for type-safe validation
const questionSchema = z.object({
  text: z.string().min(10).max(500),
  category_id: z.string().uuid(),
  difficulty: z.enum(['novice', 'advanced-beginner', 'competent', 'proficient', 'expert']),
  correct_answer: z.boolean(),
  explanation: z.string().optional()
});

const validateQuestionInput = (input: unknown): Question => {
  return questionSchema.parse(input);
};
```

#### 2. SQL Injection Prevention
```typescript
// Parameterized queries with Supabase
const fetchQuestionsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId) // Automatically parameterized
    .eq('is_active', true);
    
  if (error) throw new Error(error.message);
  return data;
};
```

#### 3. Cross-Site Scripting (XSS) Prevention
```typescript
// Content sanitization
import DOMPurify from 'dompurify';

const sanitizeUserContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

## Deployment & Infrastructure

### Hosting Architecture
- **Frontend**: Deployed on Vercel/Netlify with CDN
- **Backend**: Supabase managed infrastructure
- **Database**: PostgreSQL on Supabase
- **Storage**: Supabase Storage for file uploads
- **DNS**: Custom domain with SSL certificates

### Environment Configuration
```env
# Production Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-domain.com
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Monitoring and Analytics
- **Error Tracking**: Sentry for error monitoring
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-focused analytics (Plausible/Fathom)
- **Uptime Monitoring**: Status page and alerting
- **Database Monitoring**: Supabase built-in monitoring

### Backup and Recovery
- **Database Backups**: Automated daily backups via Supabase
- **Code Repository**: GitHub with protected main branch
- **Environment Variables**: Secure storage in deployment platform
- **Disaster Recovery**: Documented recovery procedures

### Scaling Considerations
- **Database**: Supabase automatic scaling
- **CDN**: Global content delivery for static assets
- **Edge Functions**: Supabase Edge Functions for custom logic
- **Caching**: Multi-layer caching strategy
- **Rate Limiting**: API rate limiting to prevent abuse

---

## Implementation Timeline

### Phase 1: Core Assessment (Complete)
- Basic question system and database schema
- Test interface and scoring logic
- Results dashboard with basic visualizations
- Landing page and navigation

### Phase 2: Enhanced Features (Complete)
- Detailed question breakdown
- Advanced visualizations and charts
- Sharing system and leaderboard
- Admin panel with content management

### Phase 3: Future Enhancements
- User authentication and profiles
- Saved assessment history
- Advanced analytics and insights
- Mobile application
- API for third-party integrations
- Multi-language support
- Adaptive difficulty based on performance
- Team/organization accounts
- Custom question sets
- Real-time collaborative features

---

This specification provides a comprehensive blueprint for recreating the AI Fluency Assessment Platform from scratch, covering every aspect from user experience to technical implementation details.
