import { db } from "@/lib/db";
import { Day, UserSex, UserRole } from "@prisma/client";

async function main() {
  // Create Users for each role
  const adminUser = await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      role: UserRole.ADMIN,
    },
  });

  const teacherUser = await db.user.create({
    data: {
      name: "Teacher User",
      email: "teacher@example.com",
      role: UserRole.TEACHER,
    },
  });

  const parentUser = await db.user.create({
    data: {
      name: "Parent User",
      email: "parent@example.com",
      role: UserRole.PARENT,
    },
  });

  const studentUser = await db.user.create({
    data: {
      name: "Student User",
      email: "student@example.com",
      role: UserRole.STUDENT,
    },
  });

  // Create Admin
  await db.admin.create({
    data: {
      userId: adminUser.id,
      username: "admin1",
    },
  });

  // Create Teacher with subjects and classes
  const teacher = await db.teacher.create({
    data: {
      userId: teacherUser.id,
      name: "Teacher Name",
      surname: "Teacher Surname",
      phone: "123-456-7890",
      address: "123 Teacher Lane",
      bloodType: "A+",
      sex: UserSex.MALE,
      birthday: new Date("1980-01-01"),
    },
  });

  // Create Parent
  const parent = await db.parent.create({
    data: {
      userId: parentUser.id,
      name: "Parent Name",
      surname: "Parent Surname",
      phone: "123-456-7891",
      address: "123 Parent St",
    },
  });

  // Create Grade
  const grade = await db.grade.create({
    data: {
      level: 1,
    },
  });

  // Create Class with Teacher as Supervisor
  const class1 = await db.class.create({
    data: {
      name: "1A",
      capacity: 20,
      gradeId: grade.id,
      supervisorId: teacher.id,
    },
  });

  // Create Subject
  const subject = await db.subject.create({
    data: {
      name: "Mathematics",
    },
  });

  // Link Teacher to Subject via SubjectTeacher join model
  await db.subjectTeacher.create({
    data: {
      subjectId: subject.id,
      teacherId: teacher.id,
    },
  });

  // Create Student associated with Parent and Class
  const student = await db.student.create({
    data: {
      userId: studentUser.id,
      name: "Student Name",
      surname: "Student Surname",
      phone: "987-654-3210",
      address: "456 Student Rd",
      bloodType: "O-",
      sex: UserSex.FEMALE,
      parentId: parent.id,
      gradeId: grade.id,
      classId: class1.id,
      birthday: new Date("2010-05-15"),
    },
  });

  // Create Lesson and link to Subject, Class, and Teacher
  const lesson = await db.lesson.create({
    data: {
      name: "Math Lesson 1",
      day: Day.MONDAY,
      startTime: new Date("2024-11-12T09:00:00Z"),
      endTime: new Date("2024-11-12T10:30:00Z"),
      subjectId: subject.id,
      classId: class1.id,
      teacherId: teacher.id,
    },
  });

  // Create Exam associated with Lesson
  await db.exam.create({
    data: {
      title: "Math Exam 1",
      startTime: new Date("2024-11-13T09:00:00Z"),
      endTime: new Date("2024-11-13T10:00:00Z"),
      lessonId: lesson.id,
    },
  });

  // Create Assignment associated with Lesson
  await db.assignment.create({
    data: {
      title: "Math Assignment 1",
      startDate: new Date("2024-11-14"),
      dueDate: new Date("2024-11-21"),
      lessonId: lesson.id,
    },
  });

  // Create Attendance record for Student
  await db.attendance.create({
    data: {
      date: new Date("2024-11-12"),
      present: true,
      studentId: student.id,
      lessonId: lesson.id,
    },
  });

  // Create Result for Exam and Assignment
  await db.result.create({
    data: {
      score: 85,
      studentId: student.id,
      examId: lesson.id,
    },
  });

  await db.result.create({
    data: {
      score: 90,
      studentId: student.id,
      assignmentId: lesson.id,
    },
  });

  // Create Event for Class
  await db.event.create({
    data: {
      title: "Class 1A Field Trip",
      description: "Field trip to the local museum.",
      startTime: new Date("2024-11-15T09:00:00Z"),
      endTime: new Date("2024-11-15T15:00:00Z"),
      classId: class1.id,
    },
  });

  // Create Announcement for Class
  await db.announcement.create({
    data: {
      title: "Homework Reminder",
      description: "Don't forget to complete your math homework by Friday.",
      date: new Date("2024-11-11"),
      classId: class1.id,
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
