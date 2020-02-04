import * as React from "react";

const apiUrl = "https://jsonplaceholder.typicode.com/todos";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TODOS": {
      return { ...state, todos: action.payload };
    }
    case "UPDATE_TODO_COMPLETED": {
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed
            };
          } else {
            return todo;
          }
        })
      };
    }
  }
};

const middleware = dispatch => action => {
  switch (action.type) {
    case "FETCH_TODOS": {
      console.log("fetching");
      fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
          const todos = json.slice(0, 9);
          console.log("done fetching");
          dispatch({ type: "UPDATE_TODOS", payload: todos });
        })
        .catch(error => console.log("error", error));
      break;
    }
    case "UPDATE_TODO_COMPLETED": {
      dispatch(action);
      break;
    }
  }
};

const App = () => {
  const [state, dispatch_] = React.useReducer(reducer, {
    todos: []
  });
  const dispatch = middleware(dispatch_);
  const todos = state.todos;
  React.useEffect(() => {
    dispatch({ type: "FETCH_TODOS" });
  }, []);
  return (
    <>
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <button onClick={_ => dispatch({ type: "FETCH_TODOS" })}>
          {" "}
          Refetch todos{" "}
        </button>
      </div>
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <ul>
          {todos.map(todo => (
            <li key={todo.id} style={{ marginBottom: "15px" }}>
              Title: {todo.title} <br />
              Completed:{" "}
              <input
                checked={todo.completed}
                type="checkbox"
                onChange={_ => {
                  dispatch({ type: "UPDATE_TODO_COMPLETED", payload: todo.id });
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;
