export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  heightCm?: number;
  weightKg?: number;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  userId: string;
  exerciseId?: string;
  exerciseName: string;
  bodyPart?: string;
  target?: string;
  gifUrl?: string;
  sets: WorkoutSet[];
  durationMin?: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export type NewWorkout = Omit<Workout, "id" | "createdAt">;

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
  description?: string;
  difficulty?: string;
  category?: string;
}

export interface GymPlace {
  id: string;
  name: string;
  type: "gym" | "park";
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  openNow?: boolean;
}
