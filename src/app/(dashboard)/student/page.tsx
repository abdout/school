import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { db } from "@/lib/db"; // Changed import to use db
import { currentUser } from "@/lib/auth"; // Import currentUser from Auth.js

const StudentPage = async () => {
  const user = await currentUser();

  if (!user) {
    return <p>User not found</p>;
  }

  const classItem = await db.class.findMany({
    where: {
      students: { some: { id: user.id } }, // Use `user.id` from currentUser
    },
  });

  if (classItem.length === 0) {
    return <p>No class found for this student</p>;
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem[0].name})</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
