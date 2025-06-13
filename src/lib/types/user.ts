export type User = {
  email: string;
  roles: Array<{ name: string }>;
  streak: number | null;
};
