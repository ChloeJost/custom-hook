import Section from "../UI/Section";
import TaskForm from "./TaskForm";

import useHttp from "../../hooks/useHttp";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    sendTaskRequest(
      {
        url: "https://custom-hooks-820e5-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        method: "POST",
        body: { text: taskText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      // bind allows us to 'pre-configure' a function. It does NOT execute the function right away. Here, it will pre-configure createTask. The first argument in the bind function allows you to set the 'this' keyword in the to-be-executed function. Here, it doesn't matter so we set it to "null".
      // The second argument we pass will then be the first argument received by that to-be-called function.
      // createTask will STILL receive the taskData argument, because bellow is only our pre-configured function. Any other argument which might be passed by the place where the function is then actually being called (here it happends in useHttp, line 22 : applyData(data)), will simply be appended to the end of the parameter list.
      // So the data we pass to applyData as the only argument (applyData(data)) in the custom hook will be appended as a second argument on createTask because of us calling bind.
      createTask.bind(null, taskText)
    ); 
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
