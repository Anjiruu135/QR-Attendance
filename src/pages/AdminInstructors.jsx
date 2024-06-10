import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";

function AdminInstructors() {
  // Fetching
  const [instructorData, setInstructorData] = useState([]);

  const getInstructorData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/instructors`
      );
      setInstructorData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getInstructorData();
  }, []);

  // Datatable
  const data = useMemo(() => instructorData, [instructorData]);

  const columns = useMemo(
    () => [
      { Header: "Instructor ID", accessor: "instructor_id" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Middle Name", accessor: "middle_name" },
      { Header: "Contact", accessor: "contact" },
      { Header: "Section", accessor: "section" },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div>
            <button
              type="button"
              class="btn btn-secondary mx-2 btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#Modal-Edit"
              onClick={() => handleEdit(row.index)}
            >
              <i class="bi bi-info-circle" /> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              onClick={() => handleRemove(row.index)}
            >
              <i class="bi bi-trash" /> Delete
            </button>
          </div>
        ),
      },
    ],
    [instructorData]
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
  const [file, setFile] = useState();

  const [formData, setFormData] = useState({
    instructor_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    section: "",
    instructor_pic: null,
    address: "",
    contact: "",
    email: "",
    password: "",
  });

  const initialInstructorData = {
    instructor_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    section: "",
    instructor_pic: null,
    address: "",
    contact: "",
    email: "",
    password: "",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitting form, please wait...");

    const formDataToSend = new FormData();
    formDataToSend.append("instructor_id", formData.instructor_id);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("middle_name", formData.middle_name);
    formDataToSend.append("section", formData.section);
    formDataToSend.append("instructor_pic", file);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/add_instructor`,
        formDataToSend
      )
      .then((response) => {
        console.log(response.data);
        alert("Form submitted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error occurred while submitting the form. Please try again.");
      });
  };

  const handleEdit = (index) => {
    const selectedInstructor = instructorData[index];
    setFormData(selectedInstructor);
  };

  const handleAdd = () => {
    setFormData(initialInstructorData);
  };

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Instructors</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Instructors</li>
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
                    <h5 className="card-title mb-0">Instructor List</h5>
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
                        <i class="bi bi-person-plus" /> Add Instructor
                      </button>
                    </span>

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
                                    placeholder="Instructor ID"
                                    name="instructor_id"
                                    value={formData.instructor_id}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="floatingInstructorID">
                                    Instructor ID
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-floating">
                                  <input
                                    type="section"
                                    className="form-control"
                                    id="floatingSection"
                                    placeholder="Section"
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="floatingSection">
                                    Section
                                  </label>
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
                                  Upload Instructor Picture
                                </label>
                                <div className="col-sm-6">
                                  <input
                                    className="form-control"
                                    type="file"
                                    id="formFile"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
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
                                  />
                                  <label htmlFor="floatingAddress">
                                    Address
                                  </label>
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
                                  />
                                  <label htmlFor="floatingContact">
                                    Contact
                                  </label>
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
                                  />
                                  <label htmlFor="floatingPassword">
                                    Password
                                  </label>
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
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                >
                                  Add Instructor
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
                            <h5 className="modal-title">Edit Instructor</h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            />
                          </div>

                          <div className="text-center pt-3">
                            <img src={formData.instructor_pic} className="rounded w-25 img-thumbnail" alt="..." />
                          </div>
                          <div className="modal-body">
                            <form className="row g-3" onSubmit={handleSubmit}>
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
                                  />
                                  <label htmlFor="floatingInstructorID">
                                    Instructor ID
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="form-floating">
                                  <input
                                    type="section"
                                    className="form-control"
                                    id="floatingSection"
                                    placeholder="Section"
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="floatingSection">
                                    Section
                                  </label>
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
                                  />
                                  <label htmlFor="floatingAddress">
                                    Address
                                  </label>
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
                                  />
                                  <label htmlFor="floatingContact">
                                    Contact
                                  </label>
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
                                  />
                                  <label htmlFor="floatingPassword">
                                    Password
                                  </label>
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
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  data-bs-dismiss="modal"
                                >
                                  Update Instructor Info
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Edit Instructor Modal*/}
                  </div>

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
      {/* End #main */}
    </>
  );
}

export default AdminInstructors;
