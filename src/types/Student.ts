export interface Student {
  id?: number;                // database id
  user_id?: string;           // 🔐 link with auth user (uuid)
  name: string;
  rollno: number;
  email: string;
  course: string;
  status: "Active" | "Inactive";   
}