export interface SchemaValidationResult {
  isValid: boolean;
  schemaType: "NewsArticle" | "Article" | "Organization" | "BreadcrumbList";
  jsonLdString: string;
  parsedObject: Record<string, unknown>;
  errors: string[];
  warnings: string[];
}

export interface CompatibilityCheck {
  id: string;
  category: "structure" | "editorial" | "seo" | "schema";
  title: string;
  description: string;
  weight: number;
  score: number; // 0 to weight
  status: "pass" | "warn" | "fail";
  details: string;
  recommendation?: string;
  isAutomated: boolean;
}

export interface AICompatibilityReport {
  overallScore: number; // 0 - 100
  potentialScore: number; // achievable with recommendations
  breakdown: {
    contentStructure: { score: number; max: 25 };
    editorialQuality: { score: number; max: 25 };
    seoReadiness: { score: number; max: 25 };
    structuredData: { score: number; max: 25 };
  };
  checks: CompatibilityCheck[];
  criticalWarnings: string[];
  recommendations: string[];
  jsonLdValidation: SchemaValidationResult;
  analyzedAt: string;
}
