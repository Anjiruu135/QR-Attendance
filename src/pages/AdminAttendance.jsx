import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';

function AdminAttendance() {
    const data = useMemo(() => [
        { date: '2024/06/04', section: 'BSCS 1', instructor: 'Gitalan, Tedd Angelo', present: '1', percentage: '33%', remarks: 'Poor', },
        { date: '2024/06/05', section: 'BSCS 2', instructor: 'Catalan, Wilfredo',  present: '2', percentage: '67%', remarks: 'Fair', },
        { date: '2024/06/06', section: 'BSCS 3', instructor: 'Cadiz, Eugine Bryan',  present: '3', percentage: '100%', remarks: 'Excellent', },
      ], []);
    
      const columns = useMemo(() => [
        { Header: 'Date', accessor: 'date' },
        { Header: 'Section', accessor: 'section' },
        { Header: 'Instructor', accessor: 'instructor' },
        { Header: 'Present Count', accessor: 'present' },
        { Header: 'Attendance Percentage',
          accessor: 'percentage',
          Cell: ({ value }) => {
            const percentage = parseInt(value, 10);
            return (
              <div style={{ position: 'relative', width: '100%', color: 'white', backgroundColor: 'rgb(225,225,225)', borderRadius: '12px' }}>
                <div style={{
                  width: `${percentage}%`,
                  backgroundColor: percentage > 50 ? 'rgb(10,110,250)' : 'rgb(235,30,30)',
                  height: '100%',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {value}
                </div>
              </div>
            );
          }
        },
        { Header: 'Remarks', accessor: 'remarks' },
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
                        <h5 className="card-title">
                            Attendance Record List
                        </h5>
                        <input
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        />
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

export default AdminAttendance
