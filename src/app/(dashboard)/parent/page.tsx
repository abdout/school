import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { db } from "@/lib/db"; // Changed import to use db
import { currentUser } from "@/lib/auth"; // Import current user

const ParentPage = async () => {
  const user = await currentUser();

  if (!user) {
    return <p>User not found</p>;
  }

  const students = await db.student.findMany({
    where: {
      parentId: user.id, // Use `user.id` from currentUser instead of Clerk's `userId`
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="">
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
