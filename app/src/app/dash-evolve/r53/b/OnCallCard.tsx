import Image from "next/image";
import { Card, CardHeader, Badge } from "./ui";
import { ON_CALL } from "./data";

export function OnCallCard({ id }: { id?: string }) {
  return (
    <Card id={id} colSpan="col-span-1 md:col-span-1 lg:col-span-4" rowSpan="lg:row-span-1">
      <CardHeader title="On-call now" description={ON_CALL[0].window} />
      <ul className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
        {ON_CALL.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
            <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={`https://images.unsplash.com/photo-${entry.avatarId}?w=64&h=64&fit=crop&crop=faces&q=80`}
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-zinc-900">{entry.name}</span>
              <span className="block truncate text-[11px] text-zinc-500">{entry.role}</span>
            </span>
            <Badge tone={entry.shift === "Primary" ? "green" : "zinc"}>{entry.shift}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
