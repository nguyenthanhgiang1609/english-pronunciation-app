import Link from "next/link";
import { BookOpen, GraduationCap, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Mic className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
          SpeakEasy
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
          Practice English pronunciation with fun, interactive exercises
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-4 rounded-2xl bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">I&apos;m a Teacher</CardTitle>
            <CardDescription className="text-base">
              Create word lists and track student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-lg py-6 rounded-xl" size="lg">
              <Link href="/teacher">Enter Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/30">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto p-4 rounded-2xl bg-accent/20 mb-3 group-hover:bg-accent/30 transition-colors">
              <BookOpen className="w-10 h-10 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">I&apos;m a Student</CardTitle>
            <CardDescription className="text-base">
              Practice pronunciation and improve your speaking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full text-lg py-6 rounded-xl" size="lg">
              <Link href="/student">Start Practice</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Powered by Web Speech API for voice recognition
      </p>
    </main>
  );
}
