import { Star } from "lucide-react";
import { reviews } from "@/lib/reviews";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400" : "text-stone-700"}`}
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section
      id="opiniones"
      className="border-t border-stone-800/70 bg-stone-900/20"
    >
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          eyebrow="Opiniones"
          title="Lo que dicen nuestros clientes"
          intro="Reseñas de Google de quienes pasaron por la esquina de Santa Teresa y 25 de Mayo."
          align="center"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal
              key={review.name}
              delay={(index % 3) * 0.06}
              className="flex h-full flex-col rounded-xl border border-stone-800 bg-stone-900/40 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-bone">{review.name}</p>
                  <p className="text-xs text-stone-500">Google · {review.when}</p>
                </div>
                <Stars rating={review.rating} />
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-300">
                “{review.quote}”
              </p>

              {review.ownerReply ? (
                <div className="mt-4 rounded-lg border border-stone-800 bg-stone-950/60 p-3">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-terracotta">
                    Respuesta de La Balanza
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-400">
                    {review.ownerReply}
                  </p>
                </div>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
