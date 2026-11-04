import { NewsStory, StoryCluster } from "@/types/news";

// Simple token-based Jaccard similarity for headlines
function tokenize(text: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "the", "in", "on", "at", "for", "to", "of", "and", "or", "is",
    "are", "as", "by", "with", "from", "after", "its", "says",
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !stopWords.has(w))
  );
}

function calculateSimilarity(tokensA: Set<string>, tokensB: Set<string>): number {
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection++;
    }
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function clusterStories(stories: NewsStory[]): {
  clusteredStories: NewsStory[];
  clusters: StoryCluster[];
} {
  const clusters: StoryCluster[] = [];
  const processedStoryIds = new Set<string>();

  // Tokenize all stories
  const storyTokens = stories.map((s) => ({
    story: s,
    tokens: tokenize(s.title),
  }));

  for (let i = 0; i < storyTokens.length; i++) {
    const current = storyTokens[i];
    if (processedStoryIds.has(current.story.id)) continue;

    const matchedStories: NewsStory[] = [current.story];
    processedStoryIds.add(current.story.id);

    for (let j = i + 1; j < storyTokens.length; j++) {
      const candidate = storyTokens[j];
      if (processedStoryIds.has(candidate.story.id)) continue;

      const sim = calculateSimilarity(current.tokens, candidate.tokens);
      // If similarity >= 0.25, they cover the same event/development
      if (sim >= 0.25) {
        matchedStories.push(candidate.story);
        processedStoryIds.add(candidate.story.id);
      }
    }

    if (matchedStories.length > 1) {
      const clusterId = `cluster-${current.story.id}`;
      // Sort cluster stories by score descending
      matchedStories.sort((a, b) => b.score.total - a.score.total);
      const canonical = matchedStories[0];

      // Attach related sources to canonical story
      canonical.clusterId = clusterId;
      canonical.duplicateCount = matchedStories.length;
      canonical.relatedSources = matchedStories.slice(1).map((s) => ({
        title: s.title,
        source: s.source,
        url: s.url,
        publishedAt: s.publishedAt,
      }));

      // Find primary common theme
      const commonTokens: string[] = [];
      for (const t of current.tokens) {
        if (matchedStories.every((s) => tokenize(s.title).has(t))) {
          commonTokens.push(t);
        }
      }
      const keywordTheme =
        commonTokens.length > 0
          ? commonTokens.slice(0, 3).join(" ")
          : current.story.title.split(" ").slice(0, 4).join(" ");

      clusters.push({
        id: clusterId,
        canonicalStory: canonical,
        stories: matchedStories,
        keywordTheme,
        totalSources: matchedStories.length,
      });
    }
  }

  // Create list where clustered non-canonical stories are marked
  const clusteredStories = stories.map((s) => {
    // If it's part of a cluster, update its duplicate count
    for (const cl of clusters) {
      if (cl.canonicalStory.id === s.id) {
        return cl.canonicalStory;
      }
      if (cl.stories.some((sub) => sub.id === s.id)) {
        return {
          ...s,
          clusterId: cl.id,
          duplicateCount: cl.stories.length,
        };
      }
    }
    return s;
  });

  return {
    clusteredStories,
    clusters,
  };
}
