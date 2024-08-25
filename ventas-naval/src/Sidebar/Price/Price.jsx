import Input from "../../components/Input";
import "./Price.css";

const Price = ({ handleChange }) => {
  return (
    <div className="ml">
      <h2 className="sidebar-title price-title">Precio</h2>

      <label className="sidebar-label-container">
        <input onChange={handleChange} type="radio" value="" name="priceFilter" />
        <span className="checkmark"></span>Todos
      </label>

      <Input
        handleChange={handleChange}
        value={50}
        title="$0 - 50"
        name="priceFilter"
      />

      <Input
        handleChange={handleChange}
        value={100}
        title="$50 - $100"
        name="priceFilter"
      />

      <Input
        handleChange={handleChange}
        value={150}
        title="$100 - $150"
        name="priceFilter"
      />

      <Input
        handleChange={handleChange}
        value={200}
        title="Más de $150"
        name="priceFilter"
      />
    </div>
  );
};

export default Price;
