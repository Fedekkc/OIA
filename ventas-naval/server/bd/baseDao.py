import mysql.connector

class BaseDAO:
    def __init__(self, host, database, user, password):
        self.connection = mysql.connector.connect(
            host=host,
            database=database,
            user=user,
            password=password
        )
        self.cursor = self.connection.cursor(dictionary=True)

    def execute_query(self, query, params=None):
        self.cursor.execute(query, params or [])
        self.connection.commit()
        return self.cursor

    def fetch_one(self, query, params=None):
        self.cursor.execute(query, params or [])
        return self.cursor.fetchone()

    def fetch_all(self, query, params=None):
        self.cursor.execute(query, params or [])
        return self.cursor.fetchall()

    def close(self):
        self.cursor.close()
        self.connection.close()

