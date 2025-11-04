import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Search, Plus, Edit2, Trash2 } from "lucide-react";
import AccountModal from "./Components/AdminCreateModal";
import { useAccountCRUD } from "./UserAccounts";
import { supabase } from "../../supabase";

// --- temporary placeholder while loading ---
const loadingPlaceholder = [
  {
    id: "l1",
    name: "Loading...",
    email: "loading...",
    role: "User",
    joined: "",
  },
];

const AccountManagement = () => {
  // start with empty list; we'll fetch on mount
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Hook that uses CRUD functions (we'll update this file next)
  const { handleAddUser, handleUpdateUser, handleDeleteUser } = useAccountCRUD(
    users,
    setUsers,
    setIsModalOpen,
    setSelectedUser
  );

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setErrorMsg("");

    try {
      // Select columns from public.user.
      // We intentionally select id, email, role, created_at.
      const { data, error } = await supabase
        .from("user")
        .select(
          `
    id,
    email,
    role,
    created_at,
    user_details (
      first_name,
      last_name
    )
  `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Map DB rows to UI-friendly objects
      const mapped = (data || []).map((row) => {
        const details = row.user_details || {};

        const first = details.first_name || "";
        const last = details.last_name || "";
        const fullName = `${first} ${last}`.trim();

        return {
          id: row.id,
          name: fullName || "No Name",
          email: row.email,
          role: row.role || "User",
          joined: row.created_at
            ? new Date(row.created_at).toISOString().split("T")[0]
            : "",
        };
      });

      setUsers(mapped.length ? mapped : []);
    } catch (err) {
      console.error("fetchUsers error", err);
      setErrorMsg(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter users based on search term (defensive to missing fields)
  const filteredUsers = (loading ? loadingPlaceholder : users).filter(
    (user) => {
      const name = (user.name || "").toString().toLowerCase();
      const email = (user.email || "").toString().toLowerCase();
      const role = (user.role || "").toString().toLowerCase();
      const term = searchTerm.toLowerCase().trim();
      if (!term) return true;
      return name.includes(term) || email.includes(term) || role.includes(term);
    }
  );

  const openAddModal = () => {
    setModalType("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setModalType("delete");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl  w-full">
        <div className="mb-8 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage user accounts and permissions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={openAddModal}
                className="flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                <Plus size={20} className="mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* show error */}
        {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    User Directory
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {loading
                      ? "Loading..."
                      : `${filteredUsers.length} ${
                          filteredUsers.length === 1 ? "user" : "users"
                        } found`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.joined}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit2 size={16} className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 size={16} className="mr-2" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50/30 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Users size={16} className="text-cyan-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Joined: {user.joined}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-2.5 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit2 size={12} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 size={12} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search term"
                    : "Get started by creating a new user"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Plus size={16} className="mr-2" /> Add First User
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={openAddModal}
        className="fixed bottom-4 right-4 md:hidden bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-600/20 transition-colors duration-200 z-10"
      >
        <Plus size={20} />
      </button>

      {/* Account Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        user={selectedUser}
        onAdd={handleAddUser}
        onEdit={handleUpdateUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default AccountManagement;
