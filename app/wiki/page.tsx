"use client";

import { allWikis } from "contentlayer/generated";
import Link from "next/link";
import { useState } from "react";

export default function WikiIndex() {
  const docs = [...allWikis].sort((a, b) => a.title.localeCompare(b.title));
  const [query, setQuery] = useState("");
  const filtered = docs.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">Elnsburg Wiki</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search wiki..."
        aria-label="Search wiki"
        className="w-full rounded border border-royal-gold/30 bg-night-sky/40 p-2"
      />
      <ul className="grid sm:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <li
            key={d._id}
            className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded"
          >
            <Link href={d.slug} className="font-heading text-royal-gold">
              {d.title}
            </Link>
            {d.tags?.length ? (
              <div className="text-xs mt-2 text-parchment/70">
                {d.tags.join(" • ")}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
