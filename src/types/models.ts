export interface Track {
  _id: string;
  name: string;
  color: string;
}

export interface Entry {
  _id: string;
  track: string;
  title: string;
  notes: string;
  date: string;
}