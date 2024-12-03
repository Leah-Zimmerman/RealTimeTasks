import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab } from "bootstrap";
import { useAuth } from "./AuthContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

const Home = () => {

    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    const getTasks = async () => {
        const { data } = await axios.get('/api/tasks/getTasks');
        setTasks(data);
    }

    const connectToHub = async()=>{
        var connection = new HubConnectionBuilder().withUrl("/api/taskHub").build();
        await connection.start();

        connection.on("addTask",task=>{
            setTasks(prevTasks=>[...prevTasks,task]);
        })
        
        connection.on("taskTaken", (updatedTask) => {
            setTasks((prevTasks) => {
                return prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            });
        });

        connection.on("taskCompleted", (updatedTask) => {
            setTasks((prevTasks) => {
                return prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            });
        });
    }

    useEffect(() => {
        connectToHub();
        getTasks();
    }, [])

    const onAddTask = async () => {
        await axios.post(`/api/tasks/addTask?title=${title}`);
        setTitle('');
        getTasks();
    }

    const AcceptTask = async (id) => {
        await axios.post(`/api/tasks/acceptTask?id=${id}`);
        getTasks();
    }

    const CompleteTask = async (id) => {
        await axios.post(`/api/tasks/completeTask?id=${id}`);
        getTasks();
    }

    return (<>
        <div className="container">
            <div className="row">
                <div className="col-md-10">
                    <input type="text" className="form-control" value={title} placeholder="Task Title" onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary" onClick={onAddTask}>Add Task</button>
                </div>
            </div>
            <table className="table table-striped table-bordered mt-2 col-md-12">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {!!tasks.length && tasks.map(t => (
                        t.status != 'Done' && <tr key={t.id}>
                            <td>{t.title}</td>
                            {t.status == 'Available' &&
                                <td>
                                    <button className="btn btn-dark" onClick={() => AcceptTask(t.id)}>I'm doing this one!</button>
                                </td>
                            }
                            {t.status == 'Taken' &&
                                <td>
                                    {t.user.id == user.id ?
                                        <button className="btn btn-success" onClick={() => CompleteTask(t.id)}>I'm done!</button>
                                        :
                                        <button className="btn btn-warning" disabled>
                                            {t.user.firstName} {t.user.lastName} is doing this
                                        </button>
                                    }
                              </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>)
}
export default Home;