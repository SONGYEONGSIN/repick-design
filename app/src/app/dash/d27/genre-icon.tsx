import {
  Newspaper,
  Clapperboard,
  MonitorPlay,
  Film,
  Trophy,
  Compass,
  Baby,
  Music4,
  BookOpen,
} from "lucide-react";
import type { Genre } from "./data";

type IconComponent = typeof Newspaper;

const GENRE_ICONS: Record<Genre, IconComponent> = {
  뉴스: Newspaper,
  드라마: Clapperboard,
  예능: MonitorPlay,
  영화: Film,
  스포츠: Trophy,
  다큐: Compass,
  키즈: Baby,
  뮤직: Music4,
  시사교양: BookOpen,
};

export function GenreIcon({ genre, className }: { genre: Genre; className?: string }) {
  const Icon = GENRE_ICONS[genre];
  return <Icon className={className} aria-hidden="true" />;
}
