import promotionService, {
  type PromotionOpportunitiesResponse,
} from "@/api/promotionService";
import { ThreadCard } from "@/components/ThreadCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

export function PromotionSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PromotionOpportunitiesResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["crossfit", "workout"]);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [subredditsInput, setSubredditsInput] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    websiteDescription?: string;
    keywords?: string;
  }>({});

  const addKeyword = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && keywords.length < 5 && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordsInput("");
      setValidationErrors({ ...validationErrors, keywords: undefined });
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeywordsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (keywordsInput.trim()) {
        addKeyword(keywordsInput);
      }
    }
  };

  const addSubreddit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !subreddits.includes(trimmed)) {
      setSubreddits([...subreddits, trimmed]);
      setSubredditsInput("");
    }
  };

  const removeSubreddit = (index: number) => {
    setSubreddits(subreddits.filter((_, i) => i !== index));
  };

  const handleSubredditsKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (subredditsInput.trim()) {
        addSubreddit(subredditsInput);
      }
    }
  };

  const handleSearch = async () => {
    // Add any remaining input as a tag before validating
    let finalKeywords = [...keywords];
    let finalSubreddits = [...subreddits];

    if (
      keywordsInput.trim() &&
      finalKeywords.length < 5 &&
      !finalKeywords.includes(keywordsInput.trim())
    ) {
      finalKeywords = [...finalKeywords, keywordsInput.trim()];
    }
    if (
      subredditsInput.trim() &&
      !finalSubreddits.includes(subredditsInput.trim())
    ) {
      finalSubreddits = [...finalSubreddits, subredditsInput.trim()];
    }

    // Update state
    if (finalKeywords.length !== keywords.length) {
      setKeywords(finalKeywords);
    }
    if (finalSubreddits.length !== subreddits.length) {
      setSubreddits(finalSubreddits);
    }
    setKeywordsInput("");
    setSubredditsInput("");

    // Validate with final values
    const errors: { websiteDescription?: string; keywords?: string } = {};

    if (!websiteDescription.trim()) {
      errors.websiteDescription = "Website description is required";
    }

    if (finalKeywords.length === 0) {
      errors.keywords = "At least 1 keyword is required";
    } else if (finalKeywords.length > 5) {
      errors.keywords = "Maximum 5 keywords allowed";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Perform search with final values
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Use subreddits array or default to ["all"]
      const subredditsToUse =
        finalSubreddits.length > 0 ? finalSubreddits : ["all"];

      const data = await promotionService.findPromotionOpportunities(
        websiteDescription.trim(),
        finalKeywords,
        {
          subreddits: subredditsToUse,
          maxThreads: 10,
          maxCommentsPerThread: 1,
        }
      );
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Promotion Opportunities</CardTitle>
          <CardDescription>
            Search for relevant Reddit threads where you can promote your
            product or service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website-description">
              Website Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="website-description"
              value={websiteDescription}
              onChange={(e) => setWebsiteDescription(e.target.value)}
              placeholder="Describe your product or service (e.g., WOD-GPT generates custom CrossFit workouts for free)"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
            {validationErrors.websiteDescription && (
              <p className="text-sm text-destructive">
                {validationErrors.websiteDescription}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">
              Keywords <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-md border border-input bg-background">
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                    aria-label={`Remove ${keyword}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {keywords.length < 5 && (
                <Input
                  id="keywords"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  onKeyDown={handleKeywordsKeyDown}
                  onBlur={() => {
                    if (keywordsInput.trim()) {
                      addKeyword(keywordsInput);
                    }
                  }}
                  placeholder={
                    keywords.length === 0
                      ? "Type and press Enter or comma to add (max 5)"
                      : "Add keyword..."
                  }
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 flex-1 min-w-[200px]"
                />
              )}
            </div>
            {validationErrors.keywords && (
              <p className="text-sm text-destructive">
                {validationErrors.keywords}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Add 1-5 keywords by typing and pressing Enter or comma. Click X to
              remove.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subreddits">Subreddits (Optional)</Label>
            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] rounded-md border border-input bg-background">
              {subreddits.map((subreddit, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  r/{subreddit}
                  <button
                    type="button"
                    onClick={() => removeSubreddit(index)}
                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                    aria-label={`Remove ${subreddit}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                id="subreddits"
                value={subredditsInput}
                onChange={(e) => setSubredditsInput(e.target.value)}
                onKeyDown={handleSubredditsKeyDown}
                onBlur={() => {
                  if (subredditsInput.trim()) {
                    addSubreddit(subredditsInput);
                  }
                }}
                placeholder={
                  subreddits.length === 0
                    ? "Leave empty for all subreddits, or type and press Enter to add"
                    : "Add subreddit..."
                }
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 flex-1 min-w-[200px]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to search all subreddits, or add specific subreddits.
              Click X to remove.
            </p>
          </div>

          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading ? "Searching..." : "Find Opportunities"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Found {results.totalOpportunities} promotion opportunities
                across {results.threadCount} threads
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-4">
            {results.results.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
