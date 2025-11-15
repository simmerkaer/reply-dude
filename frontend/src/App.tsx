import { PromotionSearch } from '@/components/PromotionSearch'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Reply Dude</h1>
          <p className="text-muted-foreground">
            Reddit Promotion Service for WOD-GPT
          </p>
        </div>
        <PromotionSearch />
      </div>
    </div>
  )
}

export default App

