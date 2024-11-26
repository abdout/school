import { DocsConfig } from "./type";

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "",
      items: [
        // {
        //   title: "Home",
        //   href: "/",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },
        
        {
          title: "Student",
          href: "/root/list/students",
          visible: ["admin", "teacher"],
        },
        {
          title: "Teacher",
          href: "/root/list/teachers",
          visible: ["admin", "teacher"],
        },
        {
          title: "Parent",
          href: "/root/list/parents",
          visible: ["admin", "teacher"],
        },
        {
          title: "Subject",
          href: "/root/list/subjects",
          visible: ["admin"],
        },
        {
          title: "Lesson",
          href: "/root/list/lessons",
          visible: ["admin", "teacher"],
        },
        {
          title: "Exam",
          href: "/root/list/exams",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          title: "Assignment",
          href: "/root/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
            title: "Attendance",
            href: "/root/list/attendance",
            visible: ["admin", "teacher", "student", "parent"],
        },
        // {
        //     title: "Events",
        //     href: "/root/list/events",
        //     visible: ["admin", "teacher", "student", "parent"],
        // },
        // {
        //     title: "Messages",
        //     href: "/root/list/messages",
        //     visible: ["admin", "teacher", "student", "parent"],
        // },
        // {
        //     title: "Announcements",
        //     href: "/root/list/announcements",
        //     visible: ["admin", "teacher", "student", "parent"],
        // },
      ],
    },
    
  ],
};
