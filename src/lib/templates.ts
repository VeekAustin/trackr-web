export interface TemplateTrack {
  name: string;
  color: string;
}

export interface TrackTemplate {
  id: string;
  name: string;
  blurb: string;
  tracks: TemplateTrack[];
}

export const TRACK_TEMPLATES: TrackTemplate[] = [
  {
    id: "developer",
    name: "Developer",
    blurb: "Ship, learn, and keep the job search moving.",
    tracks: [
      { name: "building", color: "#38bdf8" },
      { name: "learning", color: "#818cf8" },
      { name: "job hunting", color: "#fbbf24" },
    ],
  },
  {
    id: "teacher",
    name: "Teacher",
    blurb: "Lessons, preparation, and marking in one place.",
    tracks: [
      { name: "teaching", color: "#fbbf24" },
      { name: "lesson prep", color: "#2dd4bf" },
      { name: "marking", color: "#fb923c" },
    ],
  },
  {
    id: "trader",
    name: "Trader",
    blurb: "Trades, journaling, and the study behind them.",
    tracks: [
      { name: "trading", color: "#34d399" },
      { name: "journaling", color: "#818cf8" },
      { name: "study", color: "#38bdf8" },
    ],
  },
  {
    id: "student",
    name: "Student",
    blurb: "Courses, revision, and projects.",
    tracks: [
      { name: "courses", color: "#818cf8" },
      { name: "revision", color: "#fbbf24" },
      { name: "projects", color: "#2dd4bf" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    blurb: "Training sessions you can look back on.",
    tracks: [
      { name: "strength", color: "#fb923c" },
      { name: "cardio", color: "#f472b6" },
      { name: "mobility", color: "#34d399" },
    ],
  },
];