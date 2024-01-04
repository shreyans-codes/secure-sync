import { useDispatch } from "react-redux";
import { deleteTodoAsync, toggleCompleteAsync } from "../redux/todoSlice";
import { FaTrashAlt } from "react-icons/fa";

const TodoItem = ({ userId, id, title, completed }) => {
  const dispatch = useDispatch();
  const markCompleted = (check) => {
    dispatch(
      toggleCompleteAsync({
        userId: userId,
        todo: { id: id, title: title, completed: !check },
      })
    );
  };
  const deleteAction = () => {
    dispatch(deleteTodoAsync({ userId: userId, id: id }));
  };
  return (
    <>
      <section className="flex justify-between">
        <span className="flex align-center">
          <input
            type="checkbox"
            checked={completed}
            onClick={() => {
              markCompleted(completed);
            }}
          />
          <p className="m-2 self-center">{title}</p>
        </span>
        <button
          className="m-2"
          onClick={() => {
            deleteAction();
          }}
        >
          <FaTrashAlt />
        </button>
      </section>
    </>
  );
};

export default TodoItem;
