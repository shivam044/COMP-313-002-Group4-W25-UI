import React, { useState, useEffect } from 'react';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from '../api/user';
import {
  createGrade,
  getGradeById,
  updateGrade,
  deleteGrade,
  getAllGrades,
} from '../api/grade';
import {
  createAssignment,
  getAssignmentById, 
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
} from '../api/assignment';
import {
  createSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getAllSubjects,
} from '../api/subject';
import {
  getAllTeachers,
} from '../api/teacher';
import {
  getAllSemesters,
} from '../api/semester';

function CrudTestingPage () {
  const [users, setUsers] = useState([]);
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [newUser, setNewUser] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [newGrade, setNewGrade] = useState({
    grade: '',
    s_id: '',
    uid: '',
  });

  const [newAssignment, setNewAssignment] = useState({
    name: '',
    s_id: '',
    uid: '',
    due_date: '',
  });

  const [newSubject, setNewSubject] = useState({
    subjectTitle: '',
    targetGrade: '',
    uid: '',
    t_uid: '',
    semester_id: '',
    room: '',
  });

  // Fetch All Data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const usersData = await getAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      const gradesData = await getAllGrades();
      setGrades(Array.isArray(gradesData) ? gradesData : []);
  
      const assignmentsData = await getAllAssignments();
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
  
      const subjectsData = await getAllSubjects();
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);

      const teachersData = await getAllTeachers();
      setTeachers(Array.isArray(teachersData) ? teachersData : []);

      const semestersData = await getAllSemesters();
      setSemesters(Array.isArray(semestersData) ? semestersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  // Handle CRUD Actions
  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      fetchAllData();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateGrade = async () => {
    try {
      await createGrade(newGrade);
      fetchAllData();
    } catch (error) {
      console.error('Error creating grade:', error);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    try {
      await deleteGrade(gradeId);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await createAssignment(newAssignment);
      fetchAllData();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleCreateSubject = async () => {
    try {
      await createSubject(newSubject);
      fetchAllData();
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await deleteSubject(subjectId);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

    return (
      
    <div>
      <h1>CRUD Testing Page</h1>

      <div>
        <h2>Users</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
          <input type="text" placeholder="Username" value={newUser.userName} onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })} />
          <input type="text" placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
          <input type="text" placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
          <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <button type="submit">Create User</button>
        </form>
        {users.map((user) => (
          <div key={user._id}>
            <p>
              Name: {user.firstName} {user.lastName} <br />
              Email: {user.email} <br />
              Username: {user.userName}
            </p>
            <button onClick={() => handleDeleteUser(user._id)}>Delete User</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Grades</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateGrade(); }}>
          <input type="number" placeholder="Grade" value={newGrade.grade} onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })} />
          <input type="text" placeholder="Subject ID" value={typeof newGrade.s_id === 'object' ? newGrade.s_id?._id : newGrade.s_id} onChange={(e) => setNewGrade({ ...newGrade, s_id: e.target.value })} />
          <input type="text" placeholder="User ID" value={typeof newGrade.uid === 'object' ? newGrade.uid?._id : newGrade.uid} onChange={(e) => setNewGrade({ ...newGrade, uid: e.target.value })} />
          <button type="submit">Create Grade</button>
        </form>
        {grades.map((grade) => (
          <div key={grade._id}>
            <p>Grade: {grade.grade} <br />
            Subject ID: {typeof grade.s_id === 'object' ? grade.s_id?._id : grade.s_id} <br />
            User ID: {typeof grade.uid === 'object' ? grade.uid?._id : grade.uid}
            </p>
            <button onClick={() => handleDeleteGrade(grade._id)}>Delete Grade</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Assignments</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateAssignment(); }}>
          <input type="text" placeholder="Assignment Name" value={newAssignment.name} onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })} />
          <input type="text" placeholder="Subject ID" value={typeof newAssignment.s_id === 'object' ? newAssignment.s_id?._id : newAssignment.s_id} onChange={(e) => setNewAssignment({ ...newAssignment, s_id: e.target.value })} />
          <input type="text" placeholder="User ID" value={typeof newAssignment.uid === 'object' ? newAssignment.uid?._id : newAssignment.uid} onChange={(e) => setNewAssignment({ ...newAssignment, uid: e.target.value })} />
          <input type="date" placeholder="Due Date" value={newAssignment.due_date} onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} />
          <button type="submit">Create Assignment</button>
        </form>
        {assignments.map((assignment) => (
          <div key={assignment._id}>
            <p>Assignment: {assignment.name} <br />
            Subject ID: {typeof assignment.s_id === 'object' ? assignment.s_id?._id : assignment.s_id} <br />
            User ID: {typeof assignment.uid === 'object' ? assignment.uid?._id : assignment.uid} <br />
            Due Date: {assignment.due_date}
            </p>
            <button onClick={() => handleDeleteAssignment(assignment._id)}>Delete Assignment</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Subjects</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateSubject(); }}>
          <input type="text" placeholder="Subject Title" value={newSubject.subjectTitle} onChange={(e) => setNewSubject({ ...newSubject, subjectTitle: e.target.value })} />
          <input type="number" placeholder="Target Grade" value={newSubject.targetGrade} onChange={(e) => setNewSubject({ ...newSubject, targetGrade: e.target.value })} />
          <input type="text" placeholder="User ID" value={typeof newSubject.uid === 'object' ? newSubject.uid?._id : newSubject.uid} onChange={(e) => setNewSubject({ ...newSubject, uid: e.target.value })} />
          <input type="text" placeholder="Teacher ID" value={typeof newSubject.t_uid === 'object' ? newSubject.t_uid?._id : newSubject.t_uid} onChange={(e) => setNewSubject({ ...newSubject, t_uid: e.target.value })} />
          <input type="text" placeholder="Semester ID" value={typeof newSubject.semester_id === 'object' ? newSubject.semester_id?._id : newSubject.semester_id} onChange={(e) => setNewSubject({ ...newSubject, semester_id: e.target.value })} />
          <input type="text" placeholder="Room" value={newSubject.room} onChange={(e) => setNewSubject({ ...newSubject, room: e.target.value })} />
          <button type="submit">Create Subject</button>
        </form>
        {subjects.map((subject) => (
          <div key={subject._id}>
            <p>Subject: {subject.subjectTitle} <br />
            Target Grade: {subject.targetGrade} <br />
            Student ID: {typeof subject.uid === 'object' ? subject.uid?._id : subject.uid} <br />
            Teacher ID: {typeof subject.t_uid === 'object' ? subject.t_uid?._id : subject.t_uid} <br />
            Semester ID: {subject.semester_id ? (typeof subject.semester_id === 'object' ? subject.semester_id?._id : subject.semester_id) : 'N/A'} <br />
            Room: {subject.room}
            </p>
            <button onClick={() => handleDeleteSubject(subject._id)}>Delete Subject</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrudTestingPage;
