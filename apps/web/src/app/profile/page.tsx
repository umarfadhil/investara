import Link from "next/link";

import { ProfileRecommendationForm } from "@/components/investara/profile-recommendation-form";
import { Button } from "@/components/ui/button";
import { investorProfile } from "@/data/mock-projects";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Recommendation inputs</p>
          <h1 className="text-2xl font-semibold">Investor Profile</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/">Back to workspace</Link>
        </Button>
      </div>
      <ProfileRecommendationForm initialProfile={investorProfile} />
    </main>
  );
}

