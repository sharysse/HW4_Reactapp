import axios from "axios";
import React, { useEffect } from "react";



function deleteStudent() {
  /**
   * DELETE /api/students/
   */
  return axios
    .delete(`http://localhost:8000/api/students/`,)
    .then(function (data) {
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data);
      return data.student;
    });
}

function getStudents() {
  /**
   * GET /api/students
   * */
  return fetch(`http://localhost:8000/api/students`)
    .then(response => {
      // Convert response body to JSON
      return response.json();
    })
    .then(json => {
      if (json.error) {
        throw new Error(json.error);
      }
      return json.students;
    });
}


function addStudentToQueue(adminNo) {
  /**
   * POST /api/students
   * Content-Type: application/json
   *
   * {
   *    
   *    "num": "p202643"
   * }
   */
  return axios
    .post(`http://localhost:8000/api/students/${adminNo}`,)
    .then(function (data) {
      if (data.error) {
        throw new Error(data.error);
      }
      console.log(data);
      return data.id;
    });
}





function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [adminNo, setAdminNo] = React.useState("");
  const [enterCode, setEnterCode] = React.useState("");
  const [studentlist, setStudentList] = React.useState([]);
  const [ats, setAts] = React.useState("");

  function Checkats() {
    setIsLoading(true);
    // var that = this;
    if (enterCode !== ats) {
      alert("incorrect ats code");
      return;
    }
    addStudentToQueue(adminNo)
      .catch(function (error) {
        alert(error.message);
      })
      .finally(function () {
        allStudents();
        setIsLoading(false);

      });
  }

  function allStudents() {
    setIsLoading(true);
    return getStudents()
      .then(function (students) {
        // students.forEach(function (student) {
        setStudentList(students);
        // });
        console.log(studentlist);
        setIsLoading(false);
      })
      .catch(function (error) {
        alert(error.message);
      })
  }

  function afterDelete() {
    return deleteStudent()
      .then(allStudents())
      .catch(function (error) {
        alert(error.message);
      })
  }

  function getAts() {
    setIsLoading(true);
    return fetch(`http://localhost:8000/api/students/generateAts`)
      .then(res => { return res.json(); })
      .then(json => {
        setAts(json.ats);
        setIsLoading(false);
      },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          alert(error.message);
        }
      )

  }

  return (
    <div>
      <div>
        <h1>ATS</h1>
        <h2>{ats}</h2>
        <button onClick={getAts}
        >Generate Code</button>
      </div>
      <div>
        <h1>Enter Admin Number</h1>
        <p>
          <label>Code: </label>
          <input type="number" value={enterCode}
            onChange={function (e) {
              setEnterCode(e.target.value);

            }} minLength="6" maxLength="6"></input>
          <br></br>
          <br></br>
          <label>Admin Number: </label>
          <input type="number" value={adminNo}
            onChange={function (e) {
              setAdminNo(e.target.value);

            }}
            minLength="7" maxLength="7" ></input>
          <br></br>
          <br></br>
          <button onClick={Checkats}>Enter</button>
        </p>
      </div>
      <div>
        <h1>List of  Students Present:</h1>
        <p>
          <button id="refresh" onClick={allStudents} >Refresh</button>
          <button id="delete" onClick={afterDelete} >Delete</button>
        </p>
        <ol>{studentlist.map((students) => (
          <li key={students.id}>{students.num}</li>
        ))}</ol>
      </div>
      {isLoading ? <Spinner /> : null}
    </div>
  );
}


const Spinner = () => (
  <div id="loading">
    <div id="spinner-wrapper">
      <span id="spinner-text">LOADING</span>
      <span id="spinner"></span>
    </div>
  </div>
)







export default App;