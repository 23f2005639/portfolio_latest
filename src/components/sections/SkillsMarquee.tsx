import { Marquee } from "@/components/magic/Marquee";
import { profile } from "@/data/profile";

export function SkillsMarquee() {
  return (
    <section className="border-y border-border bg-secondary/30 py-10">
      <Marquee speed="normal" pauseOnHover>
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground cursor-default whitespace-nowrap px-6"
          >
            {skill}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
