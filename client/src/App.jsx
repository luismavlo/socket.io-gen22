import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { StudentList } from "./components/StudentList";

const connectSocketServer = () => {
  const socket = io.connect("http://localhost:4000", {
    transports: ["websocket"],
  });

  return socket;
};

export const App = () => {
  const [socket] = useState(connectSocketServer());
  const [online, setOnline] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("disconnect", () => {
      setOnline(false);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("current-students", (students) => {
      setStudents(students);
    });
  }, [socket]);

  return (
    <section className="container">
      <header className="alert">
        <h4>Services Status</h4>
        {online ? (
          <span className="text-success">Online</span>
        ) : (
          <span className="text-danger">Offline</span>
        )}
        <h1>Students Node.js</h1>
        <hr />
      </header>

      <div className="row">
        <div className="col-8">
          <StudentList data={students} />
        </div>
        <div className="col-4">Agregar Estudiante</div>
      </div>
    </section>
  );
};
