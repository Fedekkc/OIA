from .baseDao import BaseDAO

class VentasDAO(BaseDAO):
    def create_venta(self, id_factura, total):
        query = "INSERT INTO ventas (id_factura, total) VALUES (%s, %s)"
        self.execute_query(query, (id_factura, total))

    def get_venta_by_id(self, id_venta):
        query = "SELECT * FROM ventas WHERE id_venta = %s"
        return self.fetch_one(query, (id_venta,))
