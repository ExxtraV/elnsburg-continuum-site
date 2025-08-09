import { allWikis } from "contentlayer/generated";
import Link from "next/link";

export default function WikiIndex() {
  const docs = [...allWikis].sort((a,b)=> a.title.localeCompare(b.title));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Elnsburg Wiki</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {docs.map(d => (
          <li key={d._id} className="border p-4 rounded">
            <Link href={d.slug} className="font-medium">{d.title}</Link>
            {d.tags?.length ? <div className="text-xs mt-2">{d.tags.join(" • ")}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
