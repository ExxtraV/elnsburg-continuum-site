import { allWikis } from "contentlayer/generated";
import Link from "next/link";

export default function HomePage() {
  const wiki = [...allWikis].slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-heading text-royal-gold">Elnsburg Continuum Wiki</h1>
        <p className="text-parchment/80 max-w-2xl">
          Explore the lore, characters, and locations of the Elnsburg Continuum. Read the companion webnovel at {""}
          <a
            href="https://www.run-write.com/elnsburg"
            className="underline text-royal-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Run Write
          </a>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-heading text-royal-gold">From the Wiki</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {wiki.map((w) => (
            <li
              key={w._id}
              className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded"
            >
              <Link href={w.slug} className="font-heading text-royal-gold">
                {w.title}
              </Link>
              {w.summary && (
                <p className="text-sm mt-2 text-parchment/80">{w.summary}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
