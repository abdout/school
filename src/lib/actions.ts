"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import { db } from "@/lib/db";

type CurrentState = { success: boolean; error: boolean };

// SUBJECT CRUD

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    const subjectId = data.id?.toString();

    await db.subject.update({
      where: { id: subjectId },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId.toString() })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await db.subject.delete({ where: { id } });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// CLASS CRUD

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await db.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId.toString(),
        supervisorId: data.supervisorId,
      },
    });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await db.class.update({
      where: { id: data.id?.toString() },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId.toString(),
        supervisorId: data.supervisorId,
      },
    });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await db.class.delete({ where: { id } });

    revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// TEACHER CRUD

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    if (!data.password) throw new Error("Password is required.");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "TEACHER",
        name: `${data.name} ${data.surname}`,
      },
    });

    await db.teacher.create({
      data: {
        userId: user.id,
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({
            id: subjectId.toString(),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const updateData: Partial<TeacherSchema> = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const teacherRecord = await db.teacher.findUnique({
      where: { id: data.id },
      select: { userId: true },
    });

    if (!teacherRecord) throw new Error("Teacher not found");

    // First update the teacher basic info
    await db.teacher.update({
      where: { id: data.id },
      data: {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
      },
    });

    // Then handle the subjects relationship
    if (data.subjects) {
      // Delete existing relationships
      await db.subjectTeacher.deleteMany({
        where: { teacherId: data.id }
      });

      // Create new relationships
      await db.subjectTeacher.createMany({
        data: data.subjects.map(subjectId => ({
          subjectId: subjectId.toString(),
          teacherId: data.id!
        }))
      });
    }

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await db.teacher.delete({ where: { id } });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// STUDENT CRUD

export const createStudent = async (
  currentState: CurrentState,
  data: Omit<StudentSchema, "userId" | "password"> & { password?: string }
) => {
  try {
    const classItem = await db.class.findUnique({
      where: { id: String(data.classId) },
    });

    if (!classItem) throw new Error("Class not found");

    const studentCount = await db.student.count({
      where: { classId: String(data.classId) },
    });

    if (studentCount >= classItem.capacity) {
      return { success: false, error: true, message: "Class capacity reached" };
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    const user = await db.user.create({
      data: {
        name: `${data.name} ${data.surname}`,
        email: data.email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    await db.student.create({
      data: {
        userId: user.id,
        name: data.name,
        surname: data.surname,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        classId: String(data.classId),
        gradeId: String(data.gradeId),
        parentId: String(data.parentId),
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: (err as Error).message };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: Omit<StudentSchema, "password"> & { password?: string; userId: string }
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is required." };
  }
  try {
    const updateData: Partial<StudentSchema> = { ...data };

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await db.user.update({
        where: { id: String(data.userId) },
        data: { password: hashedPassword },
      });
    }

    await db.student.update({
      where: { id: String(data.id) },
      data: {
        name: data.name,
        surname: data.surname,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        classId: String(data.classId),
        gradeId: String(data.gradeId),
        parentId: String(data.parentId),
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error((err as Error).message);
    return { success: false, error: true, message: (err as Error).message };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await db.student.delete({ where: { id } });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// EXAM CRUD

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await db.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: String(data.lessonId),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    await db.exam.update({
      where: { id: String(data.id) },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: String(data.lessonId),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await db.exam.delete({ where: { id } });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
