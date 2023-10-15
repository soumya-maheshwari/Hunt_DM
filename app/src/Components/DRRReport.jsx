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
      .post("http://localhost:5000/add", newData)
      .then((response) => {
        console.log("Data saved:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/all")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching entries:", error);
      });
  }, []);
  return (
    <>
      <Container style={{ marginTop: "10vh", maxWidth: "90vw" }}>
        <Paper elevation={3}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Add New
              </Button>
            </Grid> */}
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
                        <Button size="small" variant="contained" color="error">
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
    </>
  );
};

export default DRRReport;
