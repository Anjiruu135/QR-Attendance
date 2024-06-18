import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import axios from "axios";
import Swal from "sweetalert2";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import ReactDOMServer from "react-dom/server";

function Students() {
  const auth = useAuthUser();
  // Fetching
  const [studentData, setStudentData] = useState([]);

  const getStudentData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/students`,
        {
          params: { uid: auth?.uid },
        }
      );
      const dataWithPercentage = response.data.map(student => {
        const present = student.present || 0;
        const totalDays = student.total_days || 0;
        const attendancePercentage = totalDays > 0 ? ((present / totalDays) * 100).toFixed(2) : '0.00';
        return { ...student, attendancePercentage };
      });
      setStudentData(dataWithPercentage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getStudentData();
  }, []);

  // Datatable
  const data = useMemo(() => studentData, [studentData]);

  const columns = useMemo(
    () => [
      { Header: "Student ID", accessor: "student_id" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Middle Name", accessor: "middle_name" },
      {
        Header: "Attendance Percentage",
        accessor: "attendancePercentage",
        Cell: ({ value }) => {
          const percentage = parseFloat(value);
          return (
            <div
              style={{
                position: "relative",
                width: "100%",
                color: "white",
                backgroundColor: "rgb(225,225,225)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                  percentage < 50
                    ? "rgb(235,30,30)"
                    : percentage < 75
                    ? "rgb(255,193,7)"
                    : "rgb(10,110,250)",
                  height: "100%",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {value}%
              </div>
            </div>
          );
        },
      },
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
    [studentData]
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

  //Download
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${formData.student_id}-${formData.last_name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  //Form Handling
  const [file, setFile] = useState();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [formData, setFormData] = useState({
    student_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    student_pic: null,
    address: "",
    contact: "",
  });

  const initialStudentData = {
    student_id: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    student_pic: null,
    address: "",
    contact: "",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateQRBlob = () => {
    const qrValue = `${formData.student_id}`;
    const svgString = ReactDOMServer.renderToString(
      <QRCodeSVG value={qrValue} />
    );
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    return svgBlob;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("student_id", formData.student_id);
    formDataToSend.append("instructor_id", auth?.uid);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("middle_name", formData.middle_name);
    formDataToSend.append("student_pic", file);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact", formData.contact);

    const qrBlob = generateQRBlob();
    formDataToSend.append("qr_code", qrBlob, `${formData.student_id}.svg`);

    const form = e.target;
    if (form.checkValidity()) {
      axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/student/add`,
        formDataToSend
      )
      .then((response) => {
        const { message } = response.data;
        if (message === "Valid ID") {
          Swal.fire({
            title: "Success!",
            text: "Student successfully added!",
            icon: "success",
          });
          getStudentData();
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
      
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
    } else {
      console.log("Form validation failed");
    }
  };

  const handleEdit = (index) => {
    const selectedStudent = studentData[index];
    setSelectedIndex(index);
    setFormData(selectedStudent);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("student_id", formData.student_id);
    formDataToSend.append("instructor_id", auth?.uid);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("middle_name", formData.middle_name);
    formDataToSend.append("student_pic", file);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact", formData.contact);

    const qrBlob = generateQRBlob();
    formDataToSend.append("qr_code", qrBlob, `${formData.student_id}.svg`);

    const selectedStudent = studentData[selectedIndex];
    formDataToSend.append("studentToUpdate", selectedStudent.student_id);
    formDataToSend.append("studentPicToUpdate", selectedStudent.student_pic);
    formDataToSend.append("studentQRToUpdate", selectedStudent.qr_code);

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/student/update`,
        formDataToSend
      )
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          title: "Success!",
          text: "Student info updated successfully!",
          icon: "success",
        });
        getStudentData();
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
  };

  const handleRemove = (index) => {
    const selectedStudent = studentData[index];
    const student_id = selectedStudent.student_id;
    const student_pic = selectedStudent.student_pic;
    const qr_code = selectedStudent.qr_code;

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
          text: "Student data has been deleted.",
          icon: "success",
        });

        axios
          .delete(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/api/student/${student_id}/delete`,
            { data: { student_pic, qr_code } }
          )
          .then((response) => {
            console.log(response.data);
            getStudentData();
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
          });
      }
    });
  };

  const handleAdd = () => {
    setFormData(initialStudentData);
  };

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Students</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Students</li>
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
                    <h5 className="card-title mb-0">Student List</h5>
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
                        <i class="bi bi-person-plus" /> Add Student
                      </button>
                    </span>

                    {/* Start Add Student Modal*/}
                    <div className="modal fade" id="Modal-Add" tabIndex={-1}>
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Add Student</h5>
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
                                    type="studentID"
                                    className="form-control"
                                    id="floatingStudentID"
                                    placeholder="Student ID"
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    required
                                  />
                                  <label htmlFor="floatingStudentID">
                                    Student ID
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
                                    value={auth?.section}
                                    readOnly
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
                                  Upload Student Picture
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
                                    required
                                    pattern="\d+"
                                    title="Please enter a valid number"
                                  />
                                  <label htmlFor="floatingContact">
                                    Contact
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
                                >
                                  Add Student
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Add Student Modal*/}

                    {/* Start Edit Student Modal*/}
                    <div className="modal fade" id="Modal-Edit" tabIndex={-1}>
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Update Student Info</h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            />
                          </div>

                          <div className="d-flex justify-content-center align-items-center pt-2">
                            <span className="me-2">
                              <img
                                src={formData.student_pic}
                                className="rounded img-thumbnail"
                                alt="Student"
                                style={{ width: "150px" }}
                              />
                            </span>
                            <span className="ms-2">
                              <div className="mx-2" ref={qrRef}>
                                <QRCodeCanvas
                                  value={`${formData.student_id}`}
                                />
                              </div>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm mt-2"
                                onClick={downloadQRCode}
                              >
                                Download QR Code
                              </button>
                            </span>
                          </div>

                          <div className="modal-body">
                            <form className="row g-3" onSubmit={handleUpdate}>
                              <div className="col-md-8">
                                <div className="form-floating">
                                  <input
                                    type="studentID"
                                    className="form-control"
                                    id="floatingStudentID"
                                    placeholder="Student ID"
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                  />
                                  <label htmlFor="floatingStudentID">
                                    Student ID
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
                                    value={auth?.section}
                                    readOnly
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
                                  Upload Student Picture
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
                                    required
                                    pattern="\d+"
                                    title="Please enter a valid number"
                                  />
                                  <label htmlFor="floatingContact">
                                    Contact
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
                                  Update Student Info
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Edit Student Modal*/}
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

export default Students;
