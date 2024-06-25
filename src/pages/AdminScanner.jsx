import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Swal from "sweetalert2";
import axios from "axios";

function AdminScanner() {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);
  const [scannerPaused, setScannerPaused] = useState(false);

  const startScanner = () => {
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 500,
          height: 500,
        },
        fps: 5,
        cameraConstraints: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      scanner.render(
        (result) => {
          if (!scannerPaused) {
            setScanResult(result);

            const now = new Date();
            const date = now.toISOString().split("T")[0];
            const time = now.toTimeString().split(" ")[0];

            const dataToSend = {
              date: date,
              student_id: result,
              time: time,
            };

            scanner.pause();

            axios
              .post(
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/admin/scan`,
                dataToSend,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                const { message } = response.data;
                if (message === "Valid ID Time In") {
                  Swal.fire({
                    title: "Time In - Success!",
                    text: `${result}`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                } else if (message === "Valid ID Time Out") {
                  Swal.fire({
                    title: "Time Out - Success!",
                    text: `${result}`,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                } else if (message === "Invalid ID") {
                  Swal.fire({
                    icon: "error",
                    title: "Scan Error!",
                    text: "Invalid ID!",
                    showConfirmButton: false,
                    timer: 3000,
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
          }
          setTimeout(() => {
            scanner.resume();
          }, 3000);
        },
        (err) => {
          console.warn(err);
        }
      );
      scannerRef.current = scanner;
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
      }
    };
  }, []);

  return (
    <>
      <main className="container mt-5 pt-4">
        <div className="pagetitle">
          <h1>Entry Scanner</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Entry Scanner</li>
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
                      <h5 className="card-title">
                        EntryScan <span>| QR Code</span>
                      </h5>
                      <div id="reader"></div>
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

export default AdminScanner;
