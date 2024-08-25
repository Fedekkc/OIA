from .baseDao import BaseDAO

class FacturaDAO(BaseDAO):
    def create_factura(self, id_carrito, total, estado="pendiente"):
        query = "INSERT INTO factura (id_carrito, total, estado) VALUES (%s, %s, %s)"
        self.execute_query(query, (id_carrito, total, estado))

    def get_factura_by_id(self, id_factura):
        query = "SELECT * FROM factura WHERE id_factura = %s"
        return self.fetch_one(query, (id_factura,))

    def update_estado_factura(self, id_factura, estado):
        query = "UPDATE factura SET estado = %s WHERE id_factura = %s"
        self.execute_query(query, (estado, id_factura))

    def delete_factura(self, id_factura):
        query = "DELETE FROM factura WHERE id_factura = %s"
        self.execute_query(query, (id_factura,))
