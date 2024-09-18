import { BsFillBagFill } from "react-icons/bs";

const Card = ({ codigo_producto, descripcion, precio_unitario }) => {
  return (
    <>
      <section className="card">
        <div className="card-details">
          <h3 className="card-title">{descripcion}</h3>
          <p className="card-code">Código: {codigo_producto}</p>
          <section className="card-price">
            <div className="price">{precio_unitario}</div>
            <div className="bag">
              <BsFillBagFill className="bag-icon" />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Card;
