import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import type { PromotionOpportunity } from '@/api/promotionService'

interface ThreadCardProps {
  thread: PromotionOpportunity
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              <a
                href={thread.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {thread.title}
              </a>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">r/{thread.subreddit}</Badge>
              <span>•</span>
              <span>{thread.score} upvotes</span>
              <span>•</span>
              <span>{thread.numComments} comments</span>
              <span>•</span>
              <span>Relevance: {thread.relevanceScore}/100</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {thread.selftext && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {thread.selftext}
          </p>
        </CardContent>
      )}
      {thread.topComments && thread.topComments.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Comment:</p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">{thread.topComments[0].body.substring(0, 200)}...</p>
              <p className="text-xs text-muted-foreground mt-2">
                by u/{thread.topComments[0].author} • {thread.topComments[0].score} upvotes
              </p>
            </div>
          </div>
        </CardContent>
      )}
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full"
        >
          <a href={thread.permalink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            View Thread
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

