import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";

function AdminDashboard() {
  // Fetch Dashboard Data
  const [dashboardData, setDashboardData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const getDashboardData = async () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/dashboard/info`,
        { params: { date: date } }
      );

      const data = response.data[0];
      const attendancePercentage =
        data.total_students > 0
          ? (data.present * 100) / data.total_students
          : 0;

      setDashboardData({
        ...data,
        attendance_percentage: attendancePercentage.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Fetch Attendance
  const getAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/attendance`
      );
      const dataWithPercentage = response.data.map((item) => {
        const percentage = (item.present / item.total_students) * 100;
        let remarks;
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

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Admin Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Admin Dashboard</li>
            </ol>
          </nav>
        </div>
        {/* End Page Title */}
        <section className="section dashboard">
          <div className="row">
            {/* Columns */}
            <div className="col-lg-12">
              <div className="row">
                {/* Card 1 */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Students <span>| Total</span>
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-people" />
                        </div>
                        <div className="ps-3">
                          <h6>{dashboardData.total_students}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Card 1 */}
                {/* Card 2 */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Attendance <span>| Today</span>
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-calendar-check" />
                        </div>
                        <div className="ps-3">
                          <h6>{dashboardData.present}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Card 2 */}
                {/* Card 3 */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Instructors <span>| Total</span>
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-person" />
                        </div>
                        <div className="ps-3">
                          <h6>{dashboardData.total_instructors}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Card 3 */}
                {/* Card 4 */}
                <div className="col-xxl-6 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Attendance Percentage <span>| Today</span>
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-percent" />
                        </div>
                        <div className="ps-3">
                          <h6>{dashboardData.attendance_percentage}%</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Card 4 */}
                {/* Recent Sales */}
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title">
                          Recent Time In <span>| Today</span>
                        </h5>
                      </div>

                      <table
                        {...getTableProps()}
                        className="table table datatable"
                      >
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
                {/* End Recent Sales */}
              </div>
            </div>
            {/* End Columns */}
          </div>
        </section>
      </main>
      {/* End #main */}
    </>
  );
}

export default AdminDashboard;
