import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface AvatarInitialsProps {
  name: string;
  className?: string;
}

const colors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColor(name: string) {
  let hash = 0;

  for (const char of name) {
    hash += char.charCodeAt(0);
  }

  return colors[hash % colors.length];
}

export default function AvatarInitials({
  name,
  className,
}: AvatarInitialsProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        className={cn(
          "font-semibold",
          getColor(name)
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}