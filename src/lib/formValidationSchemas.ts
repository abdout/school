// import { z } from "zod";

// Note: Validation is currently disabled for testing. Re-enable validation by restoring constraints when ready.
import { z } from "zod";
export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(), // Removed min constraint for testing
  teachers: z.array(z.string()).optional(),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(), // Removed min constraint for testing
  capacity: z.coerce.number().optional(),
  gradeId: z.coerce.number().optional(),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(), // Removed min/max constraints for testing
  password: z.string().optional().or(z.literal("")),
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  img: z.string().optional(),
  bloodType: z.string().optional(),
  birthday: z.coerce.date().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional().or(z.literal("")),
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  img: z.string().optional(),
  bloodType: z.string().optional(),
  birthday: z.coerce.date().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  gradeId: z.coerce.string().optional(),
  classId: z.coerce.string().optional(),
  parentId: z.string().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  lessonId: z.coerce.number().optional(),
});

export type ExamSchema = z.infer<typeof examSchema>;
