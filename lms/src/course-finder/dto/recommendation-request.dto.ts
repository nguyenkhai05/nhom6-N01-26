export class RecommendationRequestDto {
  goal?: 'FRONTEND' | 'BACKEND' | 'AI' | 'FOUNDATION' | string;
  knownSkills?: string[];
  budgetMaxVnd?: number;
  hoursPerWeek?: number;
}
