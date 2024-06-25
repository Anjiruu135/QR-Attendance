import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";
import Swal from "sweetalert2";

function AdminUserManagement() {
  const [userData, setUserData] = useState([]);

  // Fetching
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/users`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Datatable
  const data = useMemo(() => userData, [userData]);

  const columns = useMemo(
    () => [
      { Header: "User ID", accessor: "instructor_id" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Middle Name", accessor: "middle_name" },
      { Header: "Role", accessor: "position" },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#Modal-Edit"
              onClick={() => handleEdit(row.index)}
            >
              <i class="bi bi-info-circle" /> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger mx-2 btn-sm"
              onClick={() => handleRemove(row.index)}
            >
              <i class="bi bi-trash" /> Delete
            </button>
          </div>
        ),
      },
    ],
    [userData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  // Form Handling
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [file, setFile] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    instructor_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    position: "",
    instructor_pic: null,
    address: "",
    contact: "",
    email: "",
    password: "",
  });

  const initialUserData = {
    instructor_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    position: "",
    instructor_pic: null,
    address: "",
    contact: "",
    email: "",
    password: "",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [status, setStatus] = useState("");

  const handleSendEmail = async (instructorData) => {
    setStatus("Sending...");

    try {
      const email = instructorData.email;
      const subject = "QR Attendance Account";
      const message = `
            Dear Instructor,

            Your QR Attendance Account has been created successfully. Here are your account details:

            User ID: ${instructorData.instructor_id}
            Password: ${instructorData.password}

            Please use these credentials to log in to the system.

            Best regards,
            QR Attendance Team
        `;

      const response = await axios.post("http://localhost:3002/send-email", {
        email,
        subject,
        message,
      });

      if (response.status === 200) {
        setStatus("Email sent successfully!");
      } else {
        setStatus("Failed to send email.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error sending email.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("instructor_id", formData.instructor_id);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("middle_name", formData.middle_name);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("instructor_pic", file);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("section", "N/A");
    formDataToSend.append("user_type", "Admin");

    const form = e.target;
    if (form.checkValidity()) {
      axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/instructor/add`,
          formDataToSend
        )
        .then((response) => {
          const { message } = response.data;
          if (message === "Valid ID") {
            Swal.fire({
              title: "Success!",
              text: "User successfully added!",
              icon: "success",
            });
            getUserData();
            handleSendEmail(formData);
          } else if (message === "Invalid ID") {
            Swal.fire({
              icon: "error",
              title: "Add Error!",
              text: "ID Already Taken!",
              showConfirmButton: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });

      const modal = document.getElementById("Modal-Add");
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        console.error("Bootstrap modal instance not found");
      }

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, password: randomPassword });
  };

  const handleAdd = () => {
    setFormData(initialUserData);
  };

  const handleRemove = (index) => {
    const selectedUser = userData[index];
    const instructor_id = selectedUser.instructor_id;
    const instructor_pic = selectedUser.instructor_pic;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "User data has been deleted.",
          icon: "success",
        });

        axios
          .delete(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/api/instructor/${instructor_id}/delete`,
            { data: { instructor_pic } }
          )
          .then((response) => {
            console.log(response.data);
            getUserData();
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("instructor_id", formData.instructor_id);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("middle_name", formData.middle_name);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("instructor_pic", file);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("section", "N/A");
    formDataToSend.append("user_type", "Admin");

    const selectedUser = userData[selectedIndex];
    formDataToSend.append("instructorToUpdate", selectedUser.instructor_id);
    formDataToSend.append("instructorPicToUpdate", selectedUser.instructor_pic);

    const form = e.target;
    if (form.checkValidity()) {
      axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/instructor/update`,
          formDataToSend
        )
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            title: "Success!",
            text: "User info updated successfully!",
            icon: "success",
          });
          getUserData();
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            showConfirmButton: true,
          });
        });

      const modal = document.getElementById("Modal-Edit");
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      } else {
        console.error("Bootstrap modal instance not found");
      }

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const handleEdit = (index) => {
    const selectedUser = userData[index];
    setSelectedIndex(index);
    setFormData(selectedUser);
  };

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>User Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">User Management</li>
            </ol>
          </nav>
        </div>
        {/* End Page Title */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Manage Users</h5>
                    <span>
                      <input
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                      />

                      <button
                        type="button"
                        className="btn btn-primary btn-sm mx-3"
                        data-bs-toggle="modal"
                        data-bs-target="#Modal-Add"
                        onClick={handleAdd}
                      >
                        <i class="bi bi-person-plus" /> Add Users
                      </button>
                    </span>
                  </div>

                  {/* Start Add Instructor Modal*/}
                  <div className="modal fade" id="Modal-Add" tabIndex={-1}>
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Add Instructor</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <form className="row g-3" onSubmit={handleSubmit}>
                            <div className="col-md-8">
                              <div className="form-floating">
                                <input
                                  type="instructorID"
                                  className="form-control"
                                  id="floatingInstructorID"
                                  placeholder="User ID"
                                  name="instructor_id"
                                  value={formData.instructor_id}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingInstructorID">
                                  User ID
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <select
                                  className="form-select"
                                  id="floatingSelect"
                                  aria-label="Role"
                                  placeholder="Role"
                                  name="position"
                                  value={formData.position}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="" disabled>
                                    Select a role
                                  </option>
                                  <option value="Admin">Admin</option>
                                  <option value="Encoder">Encoder</option>
                                  <option value="Scanner">Scanner</option>
                                </select>
                                <label htmlFor="floatingSelect">Role</label>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="lastname"
                                  className="form-control"
                                  id="floatingLastname"
                                  placeholder="Last Name"
                                  name="last_name"
                                  value={formData.last_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingLastname">
                                  Last Name
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="firstname"
                                  className="form-control"
                                  id="floatingFirstname"
                                  placeholder="First Name"
                                  name="first_name"
                                  value={formData.first_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingFirstname">
                                  First Name
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="middlename"
                                  className="form-control"
                                  id="floatingMiddlename"
                                  placeholder="Middle Name"
                                  name="middle_name"
                                  value={formData.middle_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingMiddlename">
                                  Middle Name
                                </label>
                              </div>
                            </div>
                            <div className="row mb-2 mt-4">
                              <label
                                htmlFor="formFile"
                                className="col-sm-4 col-form-label"
                              >
                                Upload User Picture
                              </label>
                              <div className="col-sm-6">
                                <input
                                  className="form-control"
                                  type="file"
                                  id="formFile"
                                  accept="image/*"
                                  onChange={(e) => setFile(e.target.files[0])}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="form-floating">
                                <input
                                  type="address"
                                  className="form-control"
                                  id="floatingAddress"
                                  placeholder="Address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingAddress">Address</label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="contact"
                                  className="form-control"
                                  id="floatingContact"
                                  placeholder="Contact"
                                  name="contact"
                                  value={formData.contact}
                                  onChange={handleChange}
                                  required
                                  pattern="\d+"
                                  title="Please enter a valid number"
                                />
                                <label htmlFor="floatingContact">Contact</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  type="email"
                                  className="form-control"
                                  id="floatingEmail"
                                  placeholder="Email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingEmail">Email</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  type="password"
                                  className="form-control"
                                  id="floatingPassword"
                                  placeholder="Password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                  readOnly
                                />
                                <label htmlFor="floatingPassword">
                                  Password
                                </label>
                                <button
                                  type="button"
                                  onClick={generateRandomPassword}
                                  className="btn btn-secondary position-absolute"
                                  style={{
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                  }}
                                >
                                  Generate
                                </button>
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Add User
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Add Instructor Modal*/}

                  {/* Start Edit Instructor Modal*/}
                  <div className="modal fade" id="Modal-Edit" tabIndex={-1}>
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Update User Info</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>

                        <div className="text-center pt-3">
                          <img
                            src={formData.instructor_pic}
                            className="rounded w-25 img-thumbnail"
                            alt="..."
                          />
                        </div>
                        <div className="modal-body">
                          <form className="row g-3" onSubmit={handleUpdate}>
                            <div className="col-md-8">
                              <div className="form-floating">
                                <input
                                  type="instructorID"
                                  className="form-control"
                                  id="floatingInstructorID"
                                  placeholder="Instructor ID"
                                  name="instructor_id"
                                  value={formData.instructor_id}
                                  onChange={handleChange}
                                  required
                                  readOnly
                                />
                                <label htmlFor="floatingInstructorID">
                                  Instructor ID
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <select
                                  className="form-select"
                                  id="floatingSelect"
                                  aria-label="Role"
                                  placeholder="Role"
                                  name="position"
                                  value={formData.position}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value="" disabled>
                                    Select a role
                                  </option>
                                  <option value="Admin">Admin</option>
                                  <option value="Encoder">Encoder</option>
                                  <option value="Scanner">Scanner</option>
                                </select>
                                <label htmlFor="floatingSelect">Role</label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="lastname"
                                  className="form-control"
                                  id="floatingLastname"
                                  placeholder="Last Name"
                                  name="last_name"
                                  value={formData.last_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingLastname">
                                  Last Name
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="firstname"
                                  className="form-control"
                                  id="floatingFirstname"
                                  placeholder="First Name"
                                  name="first_name"
                                  value={formData.first_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingFirstname">
                                  First Name
                                </label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="middlename"
                                  className="form-control"
                                  id="floatingMiddlename"
                                  placeholder="Middle Name"
                                  name="middle_name"
                                  value={formData.middle_name}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingMiddlename">
                                  Middle Name
                                </label>
                              </div>
                            </div>
                            <div className="row mb-2 mt-4">
                              <label
                                htmlFor="formFile"
                                className="col-sm-4 col-form-label"
                              >
                                Change Instructor Picture
                              </label>
                              <div className="col-sm-6">
                                <input
                                  className="form-control"
                                  type="file"
                                  id="formFile"
                                  accept="image/*"
                                  onChange={(e) => setFile(e.target.files[0])}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="form-floating">
                                <input
                                  type="address"
                                  className="form-control"
                                  id="floatingAddress"
                                  placeholder="Address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingAddress">Address</label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="contact"
                                  className="form-control"
                                  id="floatingContact"
                                  placeholder="Contact"
                                  name="contact"
                                  value={formData.contact}
                                  onChange={handleChange}
                                  required
                                  pattern="\d+"
                                  title="Please enter a valid number"
                                />
                                <label htmlFor="floatingContact">Contact</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  type="email"
                                  className="form-control"
                                  id="floatingEmail"
                                  placeholder="Email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingEmail">Email</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  className="form-control"
                                  id="floatingPassword"
                                  placeholder="Password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                                <label htmlFor="floatingPassword">
                                  Password
                                </label>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 2,
                                  }}
                                  onClick={toggleShowPassword}
                                >
                                  {showPassword ? "Hide" : "Show"}
                                </button>
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Update User Info
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Edit Instructor Modal*/}

                  <table {...getTableProps()} className="table table datatable">
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? "\u00A0\u00A0↓\u00A0\u00A0"
                                    : "\u00A0\u00A0↑\u00A0\u00A0"
                                  : "\u00A0\u00A0↑↓"}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminUserManagement;
