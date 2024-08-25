from .baseDao import BaseDAO

class CarritoProductoDAO(BaseDAO):
    def create_carrito_producto(self, id_carrito, id_producto, cantidad, precio_subtotal):
        query = """
        INSERT INTO carritoproducto (id_carrito, id_producto, cantidad, precio_subtotal)
        VALUES (%s, %s, %s, %s)
        """
        self.execute_query(query, (id_carrito, id_producto, cantidad, precio_subtotal))

    def get_carrito_producto_by_id(self, id_carrito_producto):
        query = "SELECT * FROM carritoproducto WHERE id_carrito_producto = %s"
        return self.fetch_one(query, (id_carrito_producto,))

    def update_carrito_producto(self, id_carrito_producto, cantidad, precio_subtotal):
        query = "UPDATE carritoproducto SET cantidad = %s, precio_subtotal = %s WHERE id_carrito_producto = %s"
        self.execute_query(query, (cantidad, precio_subtotal, id_carrito_producto))

    def delete_carrito_producto(self, id_carrito_producto):
        query = "DELETE FROM carritoproducto WHERE id_carrito_producto = %s"
        self.execute_query(query, (id_carrito_producto,))
