"use client";

import { useEffect, useState } from "react";
import AddFundsForm from "@/components/admin/AddFundsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  amount: number;
  points: number;
  createdAt: Date;
  profile?: {
    phone?: string | null;
    address?: string | null;
    // Add other profile fields as needed
  } | null;
}

interface UserProfileClientProps {
  user: User;
}

export default function UserProfileClient({ user }: UserProfileClientProps) {
  const [currentBalance, setCurrentBalance] = useState(user.amount);
  const { toast } = useToast();

  const handleSuccessfulFundsAdd = (newBalance: number) => {
    setCurrentBalance(newBalance);

    // Show a success toast notification
    toast({
      title: "Funds added successfully",
      description: `New balance: $${newBalance.toFixed(2)}`,
      variant: "success",
    });
  };

  const [points, setPoints] = useState(user.points)

const redeemPoints = () => {
 setPoints
}

  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          User Profile: {user.name}
        </h1>
        <div className="mt-2 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-500">Role: </span>
          <span className="text-indigo-700 font-semibold">{user.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <Tabs defaultValue="details" className="w-full">
              <div className="px-6 pt-6 border-b border-gray-200">
                <TabsList className="mb-0">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="details" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Email
                      </p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Account Status
                      </p>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            user.isApproved ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></span>
                        <span>
                          {user.isApproved ? "Approved" : "Pending Approval"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Balance
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        ${currentBalance.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Points
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {user.points}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Created
                      </p>
                      <p className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {user.profile && (
                      <>
                        {user.profile.phone && (
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Phone
                            </p>
                            <p className="text-gray-900">
                              {user.profile.phone}
                            </p>
                          </div>
                        )}

                        {user.profile.address && (
                          <div className="bg-gray-50 p-4 rounded-md col-span-2">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Address
                            </p>
                            <p className="text-gray-900">
                              {user.profile.address}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <p className="text-gray-500">
                      User activity logs will be displayed here.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        {user.role == "BUYER" ?
        
        <div>
          <AddFundsForm
            userId={user.id}
            userName={user.name}
            currentBalance={currentBalance}
            onSuccess={handleSuccessfulFundsAdd}
            />
        </div>
         :
         <>
         <Button
         onClick={redeemPoints}
         >Redeem Points</Button>
         </>
         }         
      </div>
    </>
  );
}
// "use client"; // Client-side component

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Users, Search, ArrowLeft } from "lucide-react";
// import { motion } from "framer-motion"; // For animations

// export default function UsersClient({ users }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState(users);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = users.filter(
//       (user) =>
//         user.name.toLowerCase().includes(lowercasedQuery) ||
//         user.email.toLowerCase().includes(lowercasedQuery) ||
//         user.role.toLowerCase().includes(lowercasedQuery)
//     );
//     setFilteredUsers(filtered);
//   }, [searchQuery, users]);

//   return (
//     <div className="container mx-auto py-6 px-4">
//       {/* Back to Dashboard Button */}
//       <Link
//         href="/dashboard"
//         className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-all duration-300 ease-in-out"
//       >
//         <ArrowLeft size={16} className="mr-1" />
//         Back to Dashboard
//       </Link>

//       {/* Header & Search Box */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div className="flex items-center">
//           <Users size={28} className="text-indigo-700 mr-3" />
//           <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full md:w-80">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search size={16} className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 ease-in-out"
//             placeholder="Search users..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* User Table with Fixed Alignment */}
//       <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             {/* Table Header (Fixed Alignment) */}
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide w-1/4">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide w-1/4">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide w-1/6">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide w-1/6">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide w-1/6">
//                   Balance
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide w-1/6">
//                   Points
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide w-1/6">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             {/* Table Body (Data Rows) */}
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredUsers.map((user, index) => (
//                 <motion.tr
//                   key={user.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                   className="hover:bg-gray-100 transition-all duration-300 ease-in-out"
//                 >
//                   {/* Name (Left Aligned) */}
//                   <td className="px-6 py-4 text-left whitespace-nowrap w-1/4">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">
//                         {user.name.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-semibold text-gray-900">
//                           {user.name}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Email (Left Aligned) */}
//                   <td className="px-6 py-4 text-left text-sm text-gray-600 whitespace-nowrap w-1/4">
//                     {user.email}
//                   </td>

//                   {/* Role (Centered) */}
//                   <td className="px-6 py-4 text-center whitespace-nowrap w-1/6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold 
//                       ${
//                         user.role === "SUPER_ADMIN"
//                           ? "bg-purple-100 text-purple-800"
//                           : user.role === "SELLER"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>

//                   {/* Status (Centered) */}
//                   <td className="px-6 py-4 text-center whitespace-nowrap w-1/6">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         user.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {user.isApproved ? "Approved" : "Pending"}
//                     </span>
//                   </td>

//                   {/* Balance (Right Aligned) */}
//                   <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800 whitespace-nowrap w-1/6">
//                     ${user.amount.toFixed(2)}
//                   </td>

//                   {/* Points (Right Aligned) */}
//                   <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800 whitespace-nowrap w-1/6">
//                     {user.points}
//                   </td>

//                   {/* Manage Button (Right Aligned) */}
//                   <td className="px-6 py-4 text-right whitespace-nowrap w-1/6">
//                     <Link
//                       href={`/admin/users/${user.id}`}
//                       className="px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 ease-in-out rounded-full shadow-md"
//                     >
//                       Manage
//                     </Link>
//                   </td>
//                 </motion.tr>
//               ))}
//               {filteredUsers.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-6 text-gray-500">
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
