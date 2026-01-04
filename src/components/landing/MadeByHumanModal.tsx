"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MadeByHumanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MadeByHumanModal({ open, onOpenChange }: MadeByHumanModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Made by a Human</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-muted-foreground">
            <p className="text-base text-foreground">
              I&apos;m{" "}
              <a
                href="https://x.com/coreyrab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Corey Rabazinski
              </a>
              . I built StaticKit.
            </p>

            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                Why This Exists
              </h3>
              <p>
                I work in marketing. For years, I&apos;ve had ideas for visuals
                sitting in my head&mdash;product shots with different backgrounds,
                variations of hero images, quick edits that shouldn&apos;t require
                a designer or a week in the queue.
              </p>
              <p>
                AI image tools got good enough to actually solve this. But most of
                them are either expensive, watermarked, or buried behind complex
                interfaces.
              </p>
              <p>
                StaticKit is my attempt to fix that. Upload an image, describe what
                you want, get a result. No accounts, no subscriptions. You bring
                your own API key and the cost is pennies.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                Why Open Source
              </h3>
              <p>
                I wanted to build something useful and share it openly. If it helps
                you ship faster, great. If you want to fork it and build something
                better, even better.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                What Else I&apos;m Working On
              </h3>
              <p>
                StaticKit is part of{" "}
                <a
                  href="https://tinyfunnels.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Tiny Funnels
                </a>
                , a small studio where I build AI-powered tools for marketing
                and sales teams. I share updates on{" "}
                <a
                  href="https://x.com/coreyrab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  X
                </a>
                .
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
