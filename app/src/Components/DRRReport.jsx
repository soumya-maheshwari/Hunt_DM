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
  const [excludeDates, setExcludeDates] = useState("");
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
    const excludedDatesArray = excludeDates
      .split(",")
      .map((date) => date.trim());
    const numDaysExcluded = excludedDatesArray.filter(
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
      id: id,
      month: month,
      year: year,
      excludeDates: excludeDates,
      numDays: numDays,
      leadCount: leadCount,
      expectedLeadCount: expectedLeadCount,
    };

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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get("https://hunt-m16y.onrender.com/entries")
      .then((response) => {
        setEntries(response);
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
  return (
    <>
      <div className="start">
        <Container style={{ paddingTop: "16vh", maxWidth: "90vw" }}>
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
                        <TableCell>Action</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Month,Year</TableCell>
                        <TableCell>Dates Excluded</TableCell>
                        <TableCell>No of Days</TableCell>
                        <TableCell>Lead Count</TableCell>
                        <TableCell>Expected DRR</TableCell>
                        <TableCell>Last Updated</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>N/A</TableCell>
                        <TableCell>{id}</TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          {month}, {year}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            value={excludeDates}
                            onChange={(e) => setExcludeDates(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>{numDays}day</TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            value={leadCount}
                            onChange={(e) => setLeadCount(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>{expectedLeadCount}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            style={{
                              marginRight: "0.5vw",
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
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        <ToastContainer />
      </div>
    </>
  );
};

export default DRRReport;
