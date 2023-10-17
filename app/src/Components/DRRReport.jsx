import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Grid,
  TableCell,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const DRRReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [excludeDates, setExcludeDates] = useState([]);
  const [leadCount, setLeadCount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [numDays, setNumDays] = useState("");
  const [expectedLeadCount, setExpectedLeadCount] = useState("");
  const [id, setId] = useState(1);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Update month and year when the start date changes
    if (startDate) {
      const startDateTime = new Date(startDate);
      // Set the month as the numerical value (0-11) of the month in the Date object.
      setMonth(startDateTime.getMonth());
      setYear(startDateTime.getFullYear());
    }
  }, [startDate]);

  let newData = {};
  // const newData = {
  //   startDate: startDate,
  //   endDate: endDate,
  //   month: month,
  //   year: year,
  //   excludeDates: excludeDates,
  //   numDays: numDays,
  //   leadCount: leadCount,
  //   expectedLeadCount: expectedLeadCount,
  // };

  useEffect(() => {
    newData = {
      startDate: startDate,
      endDate: endDate,
      month: month,
      year: year,
      excludeDates: excludeDates,
      numDays: numDays,
      leadCount: leadCount,
      expectedLeadCount: expectedLeadCount,
    };

    console.log(newData);
  });

  const handleCalculate = async () => {
    if (!startDate) {
      toast.error(`Please select start date`, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!endDate) {
      toast.error(`Please select end date`, {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!leadCount) {
      toast.error(`Please add Lead count`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "dark",
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    // Calculate the number of days between selected dates
    const startDateObj = new Date(startDate);
    console.log(startDateObj);

    const endDateObj = new Date(endDate);
    console.log(endDateObj);

    // const excludedDatesArray = excludeDates
    //   .split(",")
    //   .map((date) => date.trim());
    const numDaysExcluded = excludeDates.filter(
      (date) => date >= startDate && date <= endDate
    ).length;

    console.log(numDaysExcluded);
    const numDaysSelected =
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24) - numDaysExcluded;

    console.log(numDaysSelected);
    setNumDays(numDaysSelected);
    console.log(numDays);

    // Calculate expected lead count
    if (numDaysSelected > 0) {
      setExpectedLeadCount((leadCount / numDaysSelected).toFixed(2));
    } else {
      setExpectedLeadCount("0");
    }
    console.log(expectedLeadCount);

    axios
      .post("http://localhost:5000/", newData)
      .then((response) => {
        console.log("Data saved:", response);
        toast.success(`Entry added successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "dark",
          pauseOnHover: true,
          draggable: true,
        });
        // window.location.reload();
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get("https://hunt-m16y.onrender.com/entries")
      .then((response) => {
        // console.log(response.data);
        setEntries(response.data);
        // console.log(entries);
      })
      .catch((error) => {
        console.error("Error fetching entries:", error);
      });
  }, []);

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setMonth("");
    setYear("");
    setLeadCount("");
    setNumDays("");
    setExcludeDates([]);
    setExpectedLeadCount("");
  };

  const handleDate = (e) => {
    const date = e.target.value;
    // Ensure the date is not empty and not already in the excludeDates array
    if (date && !excludeDates.includes(date)) {
      setExcludeDates([...excludeDates, date]);
    }
    console.log(excludeDates);
  };

  return (
    <>
      <>
        <div className="start">
          <Container
            style={{
              paddingTop: "15vh",
              maxWidth: "90vw",
              paddingBottom: "99vh",
            }}
          >
            <Paper elevation={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCancel}
                  >
                    Add New
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                              fontWeight: 700,
                            }}
                          >
                            Action
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            ID
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Start Date
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            End Date
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Month, Year
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Dates Excluded
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            No of Days
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Lead Count
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Expected DRR
                          </TableCell>
                          <TableCell
                            className="table-cell2"
                            style={{
                              border: "1px solid #000",
                              fontWeight: 700,
                              fontSize: "20px",
                            }}
                          >
                            Last Updated
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow
                          style={{
                            backgroundColor: "rgb(187, 183, 183",
                          }}
                        >
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            N/A
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            {id}
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            <TextField
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            <TextField
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            {month}, {year}
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            {excludeDates
                              .map(
                                (date, index) =>
                                  new Date(date).toISOString().split("T")[0]
                              )
                              .reduce((acc, date, index) => {
                                if (index % 2 === 0) {
                                  acc.push(
                                    <div key={index}>
                                      {date} -{" "}
                                      {excludeDates[index + 1]
                                        ? excludeDates[index + 1].split("T")[0]
                                        : ""}
                                    </div>
                                  );
                                }
                                return acc;
                              }, [])}
                            <TextField
                              type="date"
                              value={excludeDates.join(", ")} // Display excluded dates as a comma-separated string
                              onChange={handleDate}
                            />
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            {numDays}
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            <TextField
                              type="text"
                              value={leadCount}
                              onChange={(e) => setLeadCount(e.target.value)}
                            />
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              border: "1px solid #000",
                              fontSize: "20px",
                            }}
                          >
                            {expectedLeadCount}
                          </TableCell>
                          <TableCell
                            className="table-cell"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              style={{
                                marginBottom: "0.6vh",
                              }}
                              onClick={handleCalculate}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableBody>
                        {entries.map((entry, index) => (
                          <TableRow key={entry._id}>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              N/A
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {id + index + 1}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {
                                new Date(entry.startDate)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {
                                new Date(entry.endDate)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {entry.month}, {entry.year}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {entry.excludeDates
                                .map(
                                  (date, index) =>
                                    new Date(date).toISOString().split("T")[0]
                                )
                                .reduce((acc, date, index) => {
                                  if (index % 2 === 0) {
                                    acc.push(
                                      <div key={index}>
                                        {date} ,{" "}
                                        {entry.excludeDates[index + 1]
                                          ? entry.excludeDates[index + 1].split(
                                              "T"
                                            )[0]
                                          : ""}
                                      </div>
                                    );
                                  }
                                  return acc;
                                }, [])}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {entry.numDays}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {entry.leadCount}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {entry.expectedLeadCount}
                            </TableCell>
                            <TableCell
                              className="table-cell"
                              style={{
                                border: "1px solid #000",
                                fontSize: "20px",
                              }}
                            >
                              {/* {entry.updatedAt.toISOString().split("T")[0]} */}

                              <p
                                style={{
                                  fontWeight: 700,
                                }}
                              >
                                {
                                  new Date(entry.updatedAt)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </p>

                              {/* <br /> */}

                              <p
                                style={{
                                  fontWeight: 300,
                                }}
                              >
                                {new Date(entry.updatedAt)
                                  .toISOString()
                                  .split("T")[1]
                                  .slice(0, 8)}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Container>
          <ToastContainer />
        </div>
      </>
    </>
  );
};

export default DRRReport;
