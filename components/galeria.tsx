"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { galleryImages } from "@/lib/site";
import { SectionHeading } from "@/components/section-heading";

export function Galeria() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="galeria" className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Galería"
        title="Un rincón con historia"
        intro="La esquina verde, el salón entre plantas, la bodega y la mesa servida."
        align="center"
      />

      <div className="mt-14 columns-2 gap-3 md:columns-3 md:gap-4">
        {galleryImages.map((image, index) => (
          <motion.figure
            key={image.src}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{
              duration: 0.6,
              delay: (index % 3) * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group mb-3 break-inside-avoid overflow-hidden rounded-xl border border-stone-800 md:mb-4"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
