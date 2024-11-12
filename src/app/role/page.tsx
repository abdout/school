// /src/app/role-select.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const RoleSelect = () => {
  const router = useRouter();
  const [role, setRole] = useState("");

  const handleRoleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    if (selectedRole) {
      // Redirect to the page corresponding to the selected role
      router.push(`/${selectedRole}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-lg font-semibold mb-4">Select a Role to Browse</h1>
        <select
          className="border p-2 rounded w-full"
          value={role}
          onChange={handleRoleSelect}
        >
          <option value="">Choose a role</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
      </div>
    </div>
  );
};

export default RoleSelect;
