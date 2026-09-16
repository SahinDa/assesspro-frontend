import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Loader2, ShieldCheck } from 'lucide-react';

interface AppLoaderProps {
  message?: string;
}

const PLATFORM_PERKS = [
  {
    tag: 'INTELLIGENCE',
    title: 'Automating your assessments',
    subtitle: 'Generating structured feedback in seconds',
    progress: 32,
  },
  {
    tag: 'ANALYTICS',
    title: 'Benchmarking performance',
    subtitle: 'Real-time role tracking and skill insights',
    progress: 68,
  },
  {
    tag: 'COLLABORATION',
    title: 'Connecting your organization',
    subtitle: 'Syncing cohorts and evaluator reports',
    progress: 96,
  },
];

export function AppLoader({ message }: AppLoaderProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (message) return;

    const timer = setInterval(() => {
      setFade(false);
      const switchTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % PLATFORM_PERKS.length);
        setFade(true);
      }, 200);

      return () => clearTimeout(switchTimeout);
    }, 2200);

    return () => clearInterval(timer);
  }, [message]);

  const perk = PLATFORM_PERKS[index];
  const progressValue = message ? 80 : perk.progress;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 md:p-12 bg-background select-none">
      
      {/* 1. Header with shadcn Badges */}
      <header className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-[11px] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">SYSTEM CONNECTED</span>
        </div>

        <Badge variant="secondary" className="font-semibold text-xs tracking-tight">
          Assess<span className="text-primary font-bold">Pro</span>
        </Badge>
      </header>

      {/* 2. shadcn Card as Central Content Container */}
      <Card className="w-full max-w-sm shadow-md border-border/80 my-auto">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          {/* Brand Icon Shield */}
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <Loader2 className="absolute h-10 w-10 animate-spin text-muted-foreground/30 stroke-[1.5]" />
          </div>

          <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase mb-1">
            {message ? 'INITIALIZING' : perk.tag}
          </Badge>

          {/* Smooth Text Container */}
          <div className="h-14 flex flex-col items-center justify-center">
            <div
              className={`transition-all duration-300 ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
              }`}
            >
              <CardTitle className="text-base font-semibold tracking-tight">
                {message || perk.title}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {message ? 'Preparing your session...' : perk.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2 pb-4">
          <Separator />
          
          {/* shadcn Progress component */}
          <div className="space-y-1.5 pt-1">
            <Progress
              value={progressValue}
              className="h-1.5 w-full bg-secondary transition-all duration-700 ease-out"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>INITIALIZING</span>
              <span>{progressValue}%</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Encrypted workspace connection</span>
          </div>
        </CardFooter>
      </Card>

      {/* 3. Footer */}
      <footer className="w-full max-w-md flex justify-center text-xs text-muted-foreground/80 font-mono">
        AssessPro Platform 
      </footer>

    </div>
  );
}