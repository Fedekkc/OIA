from .baseDao import BaseDAO

class ListaProductosDAO(BaseDAO):
    def create_producto(self, codigo_producto, descripcion, precio_unitario):
        query = """
        INSERT INTO listaproductos (codigo_producto, descripcion, precio_unitario)
        VALUES (%s, %s, %s)
        """
        self.execute_query(query, (codigo_producto, descripcion, precio_unitario))

    def get_producto_by_id(self, id_producto):
        query = "SELECT * FROM listaproductos WHERE id_producto = %s"
        return self.fetch_one(query, (id_producto,))

    def update_producto(self, id_producto, descripcion=None, precio_unitario=None):
        query = "UPDATE listaproductos SET descripcion = %s, precio_unitario = %s WHERE id_producto = %s"
        self.execute_query(query, (descripcion, precio_unitario, id_producto))

    def delete_producto(self, id_producto):
        query = "DELETE FROM listaproductos WHERE id_producto = %s"
        self.execute_query(query, (id_producto,))
