from  .baseDao import BaseDAO

class UsuarioDAO(BaseDAO):
    def create_usuario(self, nombre, email, contraseña, rol):
        query = """
        INSERT INTO usuario (nombre, email, contraseña, rol)
        VALUES (%s, %s, %s, %s)
        """
        self.execute_query(query, (nombre, email, contraseña, rol))

    def get_usuario_by_id(self, id_usuario):
        query = "SELECT * FROM usuario WHERE id_usuario = %s"
        return self.fetch_one(query, (id_usuario,))

    def get_usuario_by_email(self, email):
        query = "SELECT * FROM usuario WHERE email = %s"
        return self.fetch_one(query, (email,))

    def update_usuario(self, id_usuario, nombre=None, email=None, contraseña=None, rol=None):
        query = "UPDATE usuario SET nombre = %s, email = %s, contraseña = %s, rol = %s WHERE id_usuario = %s"
        self.execute_query(query, (nombre, email, contraseña, rol, id_usuario))

    def delete_usuario(self, id_usuario):
        query = "DELETE FROM usuario WHERE id_usuario = %s"
        self.execute_query(query, (id_usuario,))
