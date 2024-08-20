import "./Category.css";
import Input from "../../components/Input";

function Category({ handleChange }) {
  return (
    <div>
      <h2 className="sidebar-title">Categoria</h2>

      <div>
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="test" />
          <span className="checkmark"></span>Todos
        </label>
        <Input
          handleChange={handleChange}
          value="botines"
          title="Botines"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="zapatos"
          title="Zapatos"
          name="test"
        />
        <Input
          handleChange={handleChange}
          value="camperas"
          title="Camperas"
          name="test"
        />
      </div>
    </div>
  );
}

export default Category;