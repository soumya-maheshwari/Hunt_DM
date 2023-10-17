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

  const handleCalculate = () => {
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
    const endDateObj = new Date(endDate);
    // const excludedDatesArray = excludeDates
    //   .split(",")
    //   .map((date) => date.trim());
    const numDaysExcluded = excludeDates.filter(
      (date) => date >= startDate && date <= endDate
    ).length;
    const numDaysSelected =
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24) - numDaysExcluded;

    setNumDays(numDaysSelected);
    console.log(numDays);

    // Calculate expected lead count
    if (numDaysSelected > 0) {
      setExpectedLeadCount((leadCount / numDaysSelected).toFixed(2));
    } else {
      setExpectedLeadCount("0");
    }
    console.log(expectedLeadCount);
    const newData = {
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
    axios
      .post("https://hunt-m16y.onrender.com/add", newData)
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
        window.location.reload();
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get("https://hunt-m16y.onrender.com/entries")
      .then((response) => {
        console.log(response.data);
        setEntries(response.data);
        console.log(entries);
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
    setExcludeDates("");
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
                          <TableCell style={{ border: "1px solid #000" }}>
                            Action
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            ID
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            Start Date
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            End Date
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            Month, Year
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            Dates Excluded
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            No of Days
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            Lead Count
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            Expected DRR
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
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
                          <TableCell style={{ border: "1px solid #000" }}>
                            N/A
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            {id}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            <TextField
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            <TextField
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            {month}, {year}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
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
                          <TableCell style={{ border: "1px solid #000" }}>
                            {numDays}
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            <TextField
                              type="text"
                              value={leadCount}
                              onChange={(e) => setLeadCount(e.target.value)}
                            />
                          </TableCell>
                          <TableCell style={{ border: "1px solid #000" }}>
                            {expectedLeadCount}
                          </TableCell>
                          <TableCell
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
                            <TableCell style={{ border: "1px solid #000" }}>
                              N/A
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {id + index + 1}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {
                                new Date(entry.startDate)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {
                                new Date(entry.endDate)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {entry.month}, {entry.year}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {entry.excludeDates
                                .map(
                                  (date, index) =>
                                    new Date(date).toISOString().split("T")[0]
                                )
                                .reduce((acc, date, index) => {
                                  if (index % 2 === 0) {
                                    acc.push(
                                      <div key={index}>
                                        {date} -{" "}
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
                            <TableCell style={{ border: "1px solid #000" }}>
                              {entry.numDays}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {entry.leadCount}
                            </TableCell>
                            <TableCell style={{ border: "1px solid #000" }}>
                              {entry.expectedLeadCount}
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
