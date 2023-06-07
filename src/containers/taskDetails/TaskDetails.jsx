import React, {useState, useEffect} from 'react';
import * as S from "./taskDetailsStyles";

import brain_simplify from '../../assets/brain_simplify.jpg'

import { API } from '@aws-amplify/api'
import { allTaskActionItems, taskDetails } from '../../graphql/queries'

async function fetch_task_details(id) {
    try {
      console.log("Requesting data for task : ", id);

      const response = await API.graphql({
        query: taskDetails,
        variables: {
          taskId: id
        },
      })
      // For local testing.
      if (typeof response.data.taskDetails === "undefined") {
        console.log("Task data not recieved. Sending mock task data now");
        return {
            name: "MockprojectTask101",
            id:101,
            title: "Mock task title 101.",
            description: "This is the mock description of the mock task 101. This field will describe the task. It will show the importance",
        };
      }
      console.log("Sending task data received from backend");
      return response.data.taskDetails;
    } catch (error) {
      console.error(`Cought error in function : ${error}`);
      console.log("Sending mock data since the error received");
      return {
        name: "MockprojectTask101",
        id:101,
        title: "Mock task title 101.",
        description: "This is the mock description of the mock task 101. This field will describe the task. It will show the importance",
    };
    }
  }

  async function fetch_actionItem_details(id) {
    try {
      console.log("Requesting data for task : ", id);

      const response = await API.graphql({
        query: allTaskActionItems,
        variables: {
          taskId:id
        },
      })
      // For local testing.
      if (response.data.allTaskActionItems.length === 0) {
        console.log("Task data not recieved. Sending mock task data now");
        return [
                {
                    name: "Have you played with an e2e test setup?",
                    type: "bool",
                    rank: "1"},
                {
                    name: "Add links to the e2e setup with any other required information.",
                    type: "details",
                    rank: "2"},
            ];
      }
      console.log("Sending task data received from backend");
      return response.data.allTaskActionItems;
    } catch (error) {
      console.error(`Cought error in function : ${error}`);
      console.log("Sending mock data since the error received");
      return [
        {
            name: "Have you played with an e2e test setup?",
            type: "bool",
            rank: "1"},
        {
            name: "Add links to the e2e setup with any other required information.",
            type: "details",
            rank: "2"},
    ];
    }
  }

function FetchTaskDetailsFunc(taskId, setSelectedLocalTask, setSelectedLocalActionItems) {
    console.log("Request to fetch task details received.");
    fetch_task_details(taskId).then((task_details_from_async) => {
      setSelectedLocalTask(task_details_from_async);
      fetch_actionItem_details(taskId).then((actionItem_details_from_async) => {
        setSelectedLocalActionItems(actionItem_details_from_async);
      });
    });
}

function FormatQuestions(props) {
  const result = [];

  if (Array.isArray(props.subtasks)) {
    props.subtasks.forEach((task, index) => {
      result.push(
        <p><br></br></p>,
        <p key={index}>{task.description}</p>
      );
      switch (task.actionType) {
        case 'Tick': 
          result.push(<div class="buttons">
          <input type="radio" name={task.name + "_choice"} value="yes" />  Yes 
          <input type="radio" name={task.name + "_choice"} value="no" />  No 
          <input type="radio" name={task.name + "_choice"} value="na" />  NA
        </div>);
        break;
        case 'details':
          result.push(<S.TextInput type="text" placeholder="Enter link to the documents .."></S.TextInput>);
      }
    });
  }

  return (
    <div className="dashboard_dropdown">
      {result}
    </div>
  );
}

export default function FetchTaskDetails({selectedTask}) {

  const [selectedLocalTask, setSelectedLocalTask] = useState([{name: "Initialized value",
  id:1,
  description: "Description default task set in the local function."}]);
  
  const [selectedLocalActionItems, setSelectedLocalActionItems] = useState([{name: "Initialized value",
  id:1,
  description: "Description default task set in the local function.",
  actionType: "Tick"}]);

  useEffect( () => {
    FetchTaskDetailsFunc(selectedTask.id, setSelectedLocalTask, setSelectedLocalActionItems);
  }, [selectedTask.id]);

return (
  <S.Container>
    <S.TopImage src={brain_simplify} alt="brain_simplify" />
    <h1> {selectedLocalTask[0].name} </h1>
    <p> {selectedLocalTask[0].description} </p>
    
    <p> <br></br> </p>
    <FormatQuestions subtasks={selectedLocalActionItems} />
    <p> <br></br> </p>
  </S.Container>
);
}