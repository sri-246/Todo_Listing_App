import {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';


function Dashboard({user}) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [completedAnimation, setCompletedAnimation] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
        });

        setTasks(res.data);
        }catch(err){
            console.error('Error fetching tasks:',err);
        }
    };

    const handleCreationOrUpdate = async (e)=>{
        e.preventDefault();
        try{
            if(editingTask){
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${editingTask._id}`,
                    {title, description, completed: editingTask.completed},
                    {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},}
                );

                setTasks(tasks.map((task) => (task._id === editingTask._id ? res.data : task)));
                setEditingTask(null);


            }else{
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`,
                    {title,description},
                    {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},}
                );
                setTasks([...tasks, res.data]);
            }

            setTitle('');
            setDescription('');
            
            
        }catch(err){
            console.error('Error saving task:',err);
        }
    };


    const handleEdit = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description);
    };

    const handleDelete = async (id) => {
       if(window.confirm('Are you sure you want to delete this task?')){
        try{
            await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`,
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},}
            );
            setTasks(tasks.filter((task) => task._id !== id));
        }catch(err){
            console.error('Error deleting task:',err);
        }
       } 
    };


    const handleToggleComplete = async (task) => {
        try{
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
                {...task, completed: !task.completed},
                {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });
            setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
            if(!task.completed){
                setCompletedAnimation(task._id);
                setTimeout(() => setCompletedAnimation(null), 1000);
            }
        }catch(err){
            console.error('Error updating task:',err);
        }
    };

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

  return (
    <>
    <div className = "dashboard-container">
        <h1>Welcome, {user.displayName}</h1>
        <form onSubmit = {handleCreationOrUpdate} className="task-form">
            <input
            type = "text"
            placeholder = "Task Title"
            value = {title}
            onChange = {(e) => setTitle(e.target.value)}
            required
            />
           <textarea
           placeholder = "Task Description"
           value = {description}
           onChange = {(e) => setDescription(e.target.value)}
           required
           />
           <button type = "submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
        {editingTask && (
            <button type = "button" onClick={() => {setEditingTask(null); setTitle(''); setDescription('')}}>
                Cancel
            </button>
        )}
        </form>

    <div className="task-section">
        <h2>Pending Tasks</h2>
        <div className="task-list">
          {pendingTasks.length === 0 && <p>No pending tasks.</p>}
          {pendingTasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${task.completed ? 'completed' : ''} ${
                completedAnimation === task._id ? 'completed-animation' : ''
              }`}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-actions">
                <button onClick={() => handleToggleComplete(task)}>
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="task-section">
        <h2>Completed Tasks</h2>
        <div className="task-list">
          {completedTasks.length === 0 && <p>No completed tasks.</p>}
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${task.completed ? 'completed' : ''} ${
                completedAnimation === task._id ? 'completed-animation' : ''
              }`}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-actions">
                <button onClick={() => handleToggleComplete(task)}>
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;