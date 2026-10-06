"use client";

// ============================================================
// SAFETALK AI
// USERS & ROLES
// REAL MONGODB DATA
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import {
  adminFetch,
} from "@/services/adminApi";


export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD USERS
  // ==========================================================

  const loadUsers =
    async () => {

      setLoading(true);

      setError("");


      try {

        const data =
          await adminFetch(
            `/api/admin/users?search=${encodeURIComponent(
              search
            )}&role=${role}&page=${page}&limit=10`
          );


        setUsers(
          data.users ||
          []
        );


        setPages(
          data.pagination?.pages ||
          1
        );

      } catch (error) {

        setError(
          error.message ||
          "Unable to load users."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // AUTO LOAD
  // ==========================================================

  useEffect(() => {

    const timer =
      setTimeout(
        loadUsers,
        300
      );


    return () =>
      clearTimeout(
        timer
      );

  }, [
    search,
    role,
    page,
  ]);


  // ==========================================================
  // DELETE USER
  // ==========================================================

  const deleteUser =
    async (id) => {

      if (
        !confirm(
          "Delete this user?"
        )
      ) {
        return;
      }


      try {

        await adminFetch(
          `/api/admin/users/${id}`,
          {
            method:
              "DELETE",
          }
        );


        await loadUsers();

      } catch (error) {

        alert(
          error.message ||
          "Unable to delete user."
        );

      }

    };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="admin-module-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="module-page-header">

        <div className="module-page-title">

          <div className="module-title-icon">

            <Users size={22} />

          </div>


          <div>

            <h1>
              Users & Roles
            </h1>


            <p>
              Manage MongoDB users and
              access roles.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="module-card">

        <div className="manage-filter-row">


          {/* SEARCH */}

          <div className="module-search-box manage-search">

            <Search size={16} />


            <input
              value={search}
              placeholder="Search name or email..."
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setPage(1);

              }}
            />

          </div>


          {/* ROLE FILTER */}

          <div className="module-select-wrapper">

            <ShieldCheck size={15} />


            <select
              value={role}
              onChange={(event) => {

                setRole(
                  event.target.value
                );

                setPage(1);

              }}
            >

              <option value="all">
                All Roles
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Analyst">
                Analyst
              </option>

              <option value="User">
                User
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* ======================================================
          USERS TABLE
      ====================================================== */}

      <section className="module-card">

        <div className="module-card-header">

          <div>

            <h2>
              System Users
            </h2>


            <p>
              Real users stored in MongoDB.
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="profile-message">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div className="profile-loading">

            <LoaderCircle
              className="analysis-spinner"
              size={24}
            />

            Loading users...

          </div>

        ) : (

          <div className="module-table-wrapper">

            <table className="module-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.length > 0 ? (

                  users.map(
                    (user) => (

                      <tr key={user._id}>


                        {/* USER */}

                        <td>

                          <div className="table-user-cell">

                            <div className="table-user-avatar">

                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}

                            </div>


                            <strong>
                              {user.name}
                            </strong>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>

                          {user.email}

                        </td>


                        {/* ROLE */}

                        <td>

                          <span
                            className={`user-role-badge ${
                              (
                                user.role ||
                                "User"
                              ).toLowerCase()
                            }`}
                          >

                            {user.role ||
                              "User"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`user-status-badge ${
                              (
                                user.status ||
                                "Active"
                              ).toLowerCase()
                            }`}
                          >

                            {user.status ||
                              "Active"}

                          </span>

                        </td>


                        {/* CREATED */}

                        <td>

                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "--"}

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="table-delete-button"
                            title="Delete User"
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                          >

                            <Trash2
                              size={15}
                            />

                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",

                        padding:
                          "35px",
                      }}
                    >

                      No users found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}


        {/* ====================================================
            PAGINATION
        ==================================================== */}

        <div className="module-pagination">

          <span>

            Page {page} of {pages}

          </span>


          <div>

            <button
              type="button"
              disabled={
                page <= 1
              }
              onClick={() =>
                setPage(
                  page - 1
                )
              }
            >

              <ChevronLeft
                size={16}
              />

            </button>


            <button
              type="button"
              className="active"
            >

              {page}

            </button>


            <button
              type="button"
              disabled={
                page >= pages
              }
              onClick={() =>
                setPage(
                  page + 1
                )
              }
            >

              <ChevronRight
                size={16}
              />

            </button>

          </div>

        </div>

      </section>

    </div>

  );
}