import { db } from "@/lib/db";
import FormModal from "./FormModal";
import { currentUser, currentRole } from "@/lib/auth";

// Add UserRole type definition
type UserRole = "admin" | "teacher" | "student" | "parent";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const user = await currentUser();
  const role = await currentRole() as UserRole | undefined;
  const currentUserId = user?.id;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await db.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await db.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await db.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await db.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await db.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await db.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await db.lesson.findMany({
          where: {
            ...(role === "teacher" && currentUserId 
              ? { teacherId: currentUserId } 
              : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;