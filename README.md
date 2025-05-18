
# AI Fluency Assessment Platform

## Project Overview

This AI Fluency Assessment Platform allows users to test and evaluate their understanding of AI concepts through interactive assessments. The platform offers two types of tests:

1. **Quick Assessment** - A shorter test with selected questions
2. **Comprehensive Assessment** - A complete evaluation covering all categories

Users can view their results with detailed breakdowns by category, save their scores to a leaderboard, and share their results with others.

## Features

- Multiple test types with different question sets
- Detailed score analysis with category breakdowns
- Public leaderboard to compare results
- Result sharing via unique links
- Admin panel for data management and system diagnostics

## Project Information

**URL**: https://lovable.dev/projects/a739b7bc-156f-46b7-8e77-b9ab6c9a7a1f

## Getting Started

To run this project locally:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **UI Components**: shadcn-ui
- **State Management**: React Query
- **Backend**: Supabase
- **Build Tool**: Vite

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components and routes
- `src/utils/` - Utility functions and helpers
- `src/services/` - API service calls
- `src/data/` - JSON data for questions
- `src/integrations/` - External service integrations

## Database Initialization

The application automatically initializes the database with test questions on first start in development mode. You can also manually trigger data migration and system checks using the Admin panel at `/admin`.

## More Information

For more detailed system design and architecture information, see [SPEC.md](SPEC.md).

## Deployment

Simply open [Lovable](https://lovable.dev/projects/a739b7bc-156f-46b7-8e77-b9ab6c9a7a1f) and click on Share -> Publish.

## Custom Domains

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
