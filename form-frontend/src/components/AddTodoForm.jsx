import React, { useState } from "react";
import { useDispatch } from "react-redux";

const AddTodoForm = () => {
  const dispatch = useDispatch();
  const [todoTitle, setTodoTitle] = useState("");
  return (
    <div>
      <form className="App-form">
        <input
          type="text"
          name="text"
          value={todoTitle}
          className="input w-8 m-2"
          autoComplete="false"
          placeholder="What do you want to do?"
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button className="submit-button m-3">
          <span>ADD</span>{" "}
        </button>
      </form>
    </div>
  );
};

export default AddTodoForm;
