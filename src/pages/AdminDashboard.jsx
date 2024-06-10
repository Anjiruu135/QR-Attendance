import React, { useMemo, useState } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

function AdminDashboard() {
  const data = useMemo(
    () => [
      {
        studentID: "2021-03666",
        lastname: "Gitalan",
        firstname: "Tedd Angelo",
        middlename: "Jamorol",
        section: "BSCS 3",
      },
      {
        studentID: "2021-01091",
        lastname: "Catalan",
        firstname: "Wilfred",
        middlename: "Dumon",
        section: "BSCS 3",
      },
      {
        studentID: "2021-03667",
        lastname: "Cadiz",
        firstname: "Eugine Bryan",
        middlename: "Son",
        section: "BSCS 3",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      { Header: "Student ID", accessor: "studentID" },
      { Header: "Last Name", accessor: "lastname" },
      { Header: "First Name", accessor: "firstname" },
      { Header: "Middle Name", accessor: "middlename" },
      { Header: "Section", accessor: "section" },
    ],
    []
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
                          <h6>145</h6>
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
                          <h6>99</h6>
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
                          <h6>45</h6>
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
                          <h6>67%</h6>
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
