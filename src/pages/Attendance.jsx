import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const auth = useAuthUser();

  // Fetch Attendance
  const getAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/attendance`,
        { 
          params: { uid: auth?.uid }
        }
      );
      const dataWithPercentage = response.data.map((item) => {
        const percentage = (item.present / item.total_students) * 100;let remarks;
        if (percentage < 50) {
          remarks = "Poor";
        } else if (percentage <= 75) {
          remarks = "Fair";
        } else if (percentage <= 100) {
          remarks = "Excellent";
        }
        return {
          ...item,
          percentage: percentage.toFixed(2),
          remarks: remarks,
        };
      });
      setAttendanceData(dataWithPercentage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAttendanceData();
  }, []);

  // Fetch Attendance Details
  const [attendanceDetailsData, setAttendanceDetailsData] = useState([]);

  const getAttendanceDetailsData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/attendance/students`,
        { 
          params: { 
            date: selectedAttendance.date, 
            uid: auth?.uid 
          }
        }
      );
      setAttendanceDetailsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAttendanceDetailsData();
  }, [selectedAttendance]);

  // Attendance Datatable
  const data = useMemo(() => attendanceData, [attendanceData]);

  const columns = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "Present Count", accessor: "present" },
      {
        Header: "Attendance Percentage",
        accessor: "percentage",
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
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({ cell: { value } }) => {
          let badgeClass = 'bg-success';
          let badgeText = 'Excellent';
    
          if (value === 'Excellent') {
            badgeClass = 'bg-success';
            badgeText = 'Excellent';
          } else if (value === 'Fair') {
            badgeClass = 'bg-warning';
            badgeText = 'Fair';
          }
          else if (value === 'Poor') {
            badgeClass = 'bg-danger';
            badgeText = 'Poor';
          }
    
          return <h5><span className={`badge ${badgeClass}`}>{badgeText}</span></h5>;
        },
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#Modal-View"
              onClick={() => handleView(row.index)}
            >
              <i className="bi bi-info-circle" /> Details
            </button>
          </div>
        ),
      },
    ],
    [attendanceData]
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

  const handleView = (index) => {
    const selectedAttendance = attendanceData[index];
    setSelectedAttendance(selectedAttendance);
  };

  // Attendance Details Datatable
  const additionalData = useMemo(() => attendanceDetailsData, [attendanceDetailsData]);

  const additionalColumns = useMemo(
    () => [
      { Header: "Student ID", accessor: "student_id" },
      { Header: "Student Name", accessor: "fullname" },
      { Header: "Time", accessor: "time" },
    ],
    []
  );

  const {
    getTableProps: getAdditionalTableProps,
    getTableBodyProps: getAdditionalTableBodyProps,
    headerGroups: additionalHeaderGroups,
    rows: additionalRows,
    prepareRow: prepareAdditionalRow,
  } = useTable({ columns: additionalColumns, data: additionalData });

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Attendance Records</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Attendance Records</li>
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
                    <h5 className="card-title">Attendance Record List</h5>
                    <input
                      value={globalFilter || ""}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search..."
                    />
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

                {/* Start Modal*/}
                <div className="modal fade" id="Modal-View" tabIndex={-1}>
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          Attendance Record Details
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>

                      <div className="modal-body">
                        {selectedAttendance && (
                          <>
                            <div className="d-flex justify-content-between">
                              <div className="flex-fill text-center">
                                <strong>Date:</strong> {selectedAttendance.date}
                              </div>
                              <div className="flex-fill text-center">
                                <strong>Present Count:</strong>{" "}
                                {selectedAttendance.present} of{" "}
                                {selectedAttendance.total_students}
                              </div>
                              <div className="flex-fill text-center">
                                <strong>Attendance Percentage:</strong>{" "}
                                {selectedAttendance.percentage}%
                              </div>
                              <div className="flex-fill text-center">
                                <strong>Remarks:</strong>{" "}
                                {selectedAttendance.remarks}
                              </div>
                            </div>

                            <div className="mt-2">
                              <h5 className="card-title">Students: </h5>
                              <table {...getAdditionalTableProps()} className="table table-bordered">
                                <thead>
                                  {additionalHeaderGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                      {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>
                                          {column.render("Header")}
                                        </th>
                                      ))}
                                    </tr>
                                  ))}
                                </thead>
                                <tbody {...getAdditionalTableBodyProps()}>
                                  {additionalRows.map((row) => {
                                    prepareAdditionalRow(row);
                                    return (
                                      <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => (
                                          <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Modal*/}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* End #main */}
    </>
  );
}

export default Attendance;
