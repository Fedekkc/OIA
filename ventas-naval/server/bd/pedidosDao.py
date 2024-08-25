from .baseDao import BaseDAO

class PedidosEntregadosDAO(BaseDAO):
    def create_pedido_entregado(self, id_factura):
        query = "INSERT INTO pedidosentregados (id_factura) VALUES (%s)"
        self.execute_query(query, (id_factura,))

    def get_pedido_entregado_by_id(self, id_pedido_entregado):
        query = "SELECT * FROM pedidosentregados WHERE id_pedido_entregado = %s"
        return self.fetch_one(query, (id_pedido_entregado,))


class PedidosPendientesDAO(BaseDAO):
    def create_pedido_pendiente(self, id_factura):
        query = "INSERT INTO pedidospendientes (id_factura) VALUES (%s)"
        self.execute_query(query, (id_factura,))

    def get_pedido_pendiente_by_id(self, id_pedido_pendiente):
        query = "SELECT * FROM pedidospendientes WHERE id_pedido_pendiente = %s"
        return self.fetch_one(query, (id_pedido_pendiente,))
