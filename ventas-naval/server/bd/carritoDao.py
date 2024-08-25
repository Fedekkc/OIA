from .baseDao import BaseDAO

class CarritoDAO(BaseDAO):
    def create_carrito(self, id_usuario):
        query = "INSERT INTO carrito (id_usuario) VALUES (%s)"
        self.execute_query(query, (id_usuario,))

    def get_carrito_by_id(self, id_carrito):
        query = "SELECT * FROM carrito WHERE id_carrito = %s"
        return self.fetch_one(query, (id_carrito,))

    def update_precio_total(self, id_carrito, precio_total):
        query = "UPDATE carrito SET precio_total = %s WHERE id_carrito = %s"
        self.execute_query(query, (precio_total, id_carrito))

    def delete_carrito(self, id_carrito):
        query = "DELETE FROM carrito WHERE id_carrito = %s"
        self.execute_query(query, (id_carrito,))
