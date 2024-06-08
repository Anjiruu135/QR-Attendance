import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';

function Students() {
  const data = useMemo(() => [
    { studentID: '2021-03666', lastname: 'Gitalan', firstname: 'Tedd Angelo', middlename: 'Jamorol', contact: '09150124529' },
    { studentID: '2021-01091', lastname: 'Catalan', firstname: 'Wilfred', middlename: 'Dumon', contact: '09054100152' },
    { studentID: '2021-03667', lastname: 'Cadiz', firstname: 'Eugine Bryan', middlename: 'Son', contact: '09490161595' },
  ], []);

  const columns = useMemo(() => [
    { Header: 'Student ID', accessor: 'studentID' },
    { Header: 'Last Name', accessor: 'lastname' },
    { Header: 'First Name', accessor: 'firstname' },
    { Header: 'Middle Name', accessor: 'middlename' },
    { Header: 'Contact', accessor: 'contact' },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter }
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

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
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    />

                    <button
                      type="button"
                      className="btn btn-primary btn-sm mx-3"
                      data-bs-toggle="modal"
                      data-bs-target="#Modal"
                    >
                      Add Student
                    </button>
                  </span>
                  <div className="modal fade" id="Modal" tabIndex={-1}>
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
                          <form className="row g-3">
                            <div className="col-md-8">
                              <div className="form-floating">
                                <input
                                  type="studentID"
                                  className="form-control"
                                  id="floatingStudentID"
                                  placeholder="Student ID"
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
                                />
                                <label htmlFor="floatingSection">Section</label>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-floating">
                                <input
                                  type="lastname"
                                  className="form-control"
                                  id="floatingLastname"
                                  placeholder="Last Name"
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
                                />
                                <label htmlFor="floatingMiddlename">
                                  Middle Name
                                </label>
                              </div>
                            </div>
                            <div className="row mb-2 mt-4">
                              <label
                                htmlFor="inputNumber"
                                className="col-sm-4 col-form-label"
                              >
                                Upload Student Picture
                              </label>
                              <div className="col-sm-6">
                                <input
                                  className="form-control"
                                  type="file"
                                  id="formFile"
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
                                />
                                <label htmlFor="floatingContact">Contact</label>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button type="button" className="btn btn-primary">
                            Add Students
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Extra Large Modal*/}
                </div>

                <table {...getTableProps()} className="table table datatable">
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? '\u00A0\u00A0↓\u00A0\u00A0'
                                  : '\u00A0\u00A0↑\u00A0\u00A0'
                                  : '\u00A0\u00A0↑↓'}
                            </span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
  )
}

export default Students
