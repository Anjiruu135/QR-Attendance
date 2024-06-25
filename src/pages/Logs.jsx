import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function Logs() {
  const [logsData_timein, setLogsData_timein] = useState([]);
  const [logsData_timeout, setLogsData_timeout] = useState([]);

  const auth = useAuthUser()

  // Fetch Logs Time In
  const getlogsData_timein = async () => {
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/logs/timein`,
        {
          params: { 
            date: date,
            uid: auth?.uid
         },
        }
      );
      setLogsData_timein(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch Logs Time Out
  const getlogsData_timeout = async () => {
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/logs/timeout`,
        {
          params: { 
            date: date,
            uid: auth?.uid
         },
        }
      );
      setLogsData_timeout(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getlogsData_timein();
    getlogsData_timeout();
  }, []);

  // Logs Datatable Time In
  const data = useMemo(() => logsData_timein, [logsData_timein]);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullname" },
      { Header: "Time", accessor: "time_in" },
    ],
    [logsData_timein]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useGlobalFilter, useSortBy);

  // Logs Datatable Time Out
  const additionalData = useMemo(() => logsData_timeout, [logsData_timeout]);

  const additionalColumns = useMemo(
    () => [
      { Header: "Name", accessor: "fullname" },
      { Header: "Time", accessor: "time_out" },
    ],
    [logsData_timeout]
  );

  const {
    getTableProps: getAdditionalTableProps,
    getTableBodyProps: getAdditionalTableBodyProps,
    headerGroups: additionalHeaderGroups,
    rows: additionalRows,
    prepareRow: prepareAdditionalRow,
  } = useTable(
    { columns: additionalColumns, data: additionalData },
    useGlobalFilter,
    useSortBy
  );
  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Logs</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Logs</li>
            </ol>
          </nav>
        </div>
        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <h5 className="card-title mb-0 pb-0">Time In</h5>
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
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <h5 className="card-title mb-0 pb-0">Time Out</h5>
                      <table
                        {...getAdditionalTableProps()}
                        className="table table datatable"
                      >
                        <thead>
                          {additionalHeaderGroups.map((headerGroup) => (
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Logs;
