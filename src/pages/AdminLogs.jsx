import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import axios from "axios";

function AdminLogs() {
  const [logsData, setLogsData] = useState([]);
  const [logsData_timein, setLogsData_timein] = useState([]);
  const [logsData_timeout, setLogsData_timeout] = useState([]);

  // Fetch Logs
  const getlogsData = async () => {
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/logs`,
        {
          params: { date: date },
        }
      );
      setLogsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getlogsData();
  }, []);

  // Fetch Logs Time In
  const getlogsData_timein = async () => {
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/logs/timein`,
        {
          params: { date: date },
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
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/logs/timeout`,
        {
          params: { date: date },
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

  // Logs Datatable
  const historyData = useMemo(() => logsData, [logsData]);

  const historyColumns = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "Name", accessor: "fullname" },
      { Header: "Section", accessor: "section" },
      { Header: "Time In", accessor: "time_in" },
      { Header: "Time Out", accessor: "time_out" },
    ],
    [logsData]
  );

  const {
    getTableProps: getHistoryTableProps,
    getTableBodyProps: getHistoryTableBodyProps,
    headerGroups: historyHeaderGroups,
    rows: historyRows,
    prepareRow: prepareHistoryRow,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    { columns: historyColumns, data: historyData },
    useGlobalFilter,
    useSortBy
  );

  // Logs Datatable Time In
  const data = useMemo(() => logsData_timein, [logsData_timein]);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullname" },
      { Header: "Section", accessor: "section" },
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
      { Header: "Section", accessor: "section" },
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
            <div className="col-lg-12">
              <div className="row">
                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 pb-0">Log Records</h5>
                        <span>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm mt-3"
                            data-bs-toggle="modal"
                            data-bs-target="#Modal-Add"
                          >
                            <i class="bi bi-clock-history" /> View History
                          </button>
                        </span>
                      </div>
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

            {/* Start Add Instructor Modal*/}
            <div className="modal fade" id="Modal-Add" tabIndex={-1}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" style={{ marginRight: '20px' }}>Logs History</h5>
                    <input
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                      />
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <table
                      {...getHistoryTableProps()}
                      className="table table datatable"
                    >
                      <thead>
                        {historyHeaderGroups.map((headerGroup) => (
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
                      <tbody {...getHistoryTableBodyProps()}>
                        {historyRows.map((row) => {
                          prepareHistoryRow(row);
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
            {/* End Add Instructor Modal*/}
          </div>
        </section>
      </main>
    </>
  );
}

export default AdminLogs;
