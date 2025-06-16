
# Data Calculation Errors - Diagnostic Plan

## Issue Identification
Inconsistencies in score calculations, tier determinations, and category scoring across different components and displays.

## Root Cause Analysis

### 1. Data Flow Issues
**From testResultService.ts to SharedResultView**
- `transformCategoryScores` function may be altering data incorrectly
- Category score calculations inconsistent with actual user performance
- Weighted ranking vs standard ranking confusion

**User Answer Generation Logic**
- `generateUserAnswers` creates simulated answers that may not match actual scores
- Difficulty-based answer distribution may be incorrect
- Score-to-answer mapping algorithm needs validation

### 2. Category Scoring Inconsistencies
**categoryScoring.ts Implementation**
- `calculateCategoryScores` function returns different data structures
- Fluency level scoring vs skill category scoring confusion
- Mixed data types (arrays vs objects) causing transformation issues

**Score Transformation Logic**
- `transformCategoryScores` applies weighted adjustments that may be incorrect
- Expert-level scoring multipliers may be inappropriate
- Percentage calculations don't match raw scores

### 3. Tier Determination Issues
**Tier Calculation Logic**
- `determineUserTier` function may use incorrect thresholds
- Tier display vs actual performance mismatch
- Fluency tier definitions may not align with score ranges

### 4. Component-Specific Calculation Issues
**SharedResultStats Component**
- Estimated scores calculated differently than actual scores
- Fluency level breakdown uses hardcoded values instead of actual data
- Progress bar percentages may not reflect true performance

**SharedResultCharts Component**
- Radar chart data preparation inconsistencies
- Category score filtering may exclude relevant data
- Performance level calculations don't match displayed scores

## Specific Data Issues Identified

### Critical Calculation Errors
1. **Category Score Mismatch**: Displayed scores don't match calculated percentages
2. **Tier Assignment Inconsistency**: User tier doesn't align with percentage score
3. **Fluency Level Scores**: Hardcoded vs calculated values create discrepancies
4. **Answer Generation**: Simulated answers don't produce expected scores

### Data Structure Issues
1. **Mixed Data Types**: Some functions expect arrays, others objects
2. **Property Inconsistency**: Category scores have varying property names
3. **Null/Undefined Handling**: Missing data not handled gracefully
4. **Type Conversion**: String/number conversions may cause calculation errors

### Display Logic Issues
1. **Percentage Rounding**: Inconsistent rounding approaches
2. **Score Aggregation**: Total scores calculated differently in different places
3. **Progress Calculations**: Progress bars use different calculation methods
4. **Ranking Logic**: User rank calculation may be incorrect

## Data Flow Mapping

### Current Flow Analysis
```
SavedTestResult (DB) → 
SharedResultView → 
transformCategoryScores → 
SharedResultStats/SharedResultCharts → 
Display Components
```

### Issues in Each Step
1. **DB to SharedResultView**: category_scores field structure unclear
2. **transformCategoryScores**: Applies artificial adjustments that distort data
3. **Component Display**: Each component calculates percentages differently
4. **User Answer Generation**: Creates inconsistent answer patterns

## Proposed Solution Strategy

### Phase 1: Data Structure Standardization
1. Define consistent CategoryScore interface across all components
2. Standardize how category_scores are stored and retrieved
3. Ensure type safety throughout the data flow
4. Remove artificial score adjustments

### Phase 2: Calculation Logic Verification
1. Audit all score calculation functions for accuracy
2. Verify tier determination logic against actual thresholds
3. Validate user answer generation produces correct scores
4. Ensure percentage calculations are consistent

### Phase 3: Component Display Standardization
1. Use single source of truth for all score displays
2. Implement consistent rounding and formatting
3. Standardize progress bar and chart calculations
4. Remove duplicate calculation logic

## Testing Strategy

### Unit Tests Needed
- [ ] Category score calculation accuracy
- [ ] Tier determination for various score ranges
- [ ] User answer generation produces expected scores
- [ ] Percentage calculation consistency

### Integration Tests Needed
- [ ] Data flow from service to components
- [ ] Score display consistency across components
- [ ] Edge cases (0%, 100%, missing data)
- [ ] Multiple score scenarios validation

## Implementation Priority
1. **Critical**: Fix category score calculation logic
2. **Critical**: Standardize tier determination
3. **High**: Remove artificial score adjustments
4. **High**: Fix user answer generation accuracy
5. **Medium**: Standardize display calculations
6. **Low**: Improve error handling and edge cases
