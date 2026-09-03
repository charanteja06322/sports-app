"""
Database Wrapper for Neon
Provides Supabase-like interface for backward compatibility
"""
from app.core.database import Database
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)


class Table:
    """Table wrapper to mimic Supabase table interface"""
    
    def __init__(self, table_name: str):
        self.table_name = table_name
        self._data = None
        self._filters = []
    
    def select(self, columns: str = "*"):
        """SELECT columns"""
        self._data = columns
        return self
    
    def insert(self, data):
        """INSERT operation"""
        self._data = data
        self.operation = "insert"
        return self
    
    def update(self, data):
        """UPDATE operation"""
        self._data = data
        self.operation = "update"
        return self
    
    def delete(self):
        """DELETE operation"""
        self.operation = "delete"
        return self
    
    def eq(self, column: str, value: Any):
        """WHERE column = value"""
        self._filters.append(("eq", column, value))
        return self
    
    def in_(self, column: str, values: List[Any]):
        """WHERE column IN values"""
        self._filters.append(("in", column, values))
        return self
    
    async def execute(self):
        """Execute the query"""
        try:
            if self.operation == "insert":
                if isinstance(self._data, list):
                    results = []
                    for item in self._data:
                        result = await Database.insert(self.table_name, item)
                        results.append(result)
                    return TableResponse(results)
                else:
                    result = await Database.insert(self.table_name, self._data)
                    return TableResponse([result] if result else [])
            
            elif self.operation == "update":
                # Build WHERE clause
                where_sql = self._build_where_clause()
                where_args = self._build_where_args()
                await Database.update(self.table_name, self._data, where_sql, *where_args)
                return TableResponse([])
            
            elif self.operation == "delete":
                where_sql = self._build_where_clause()
                where_args = self._build_where_args()
                await Database.delete(self.table_name, where_sql, *where_args)
                return TableResponse([])
            
            else:  # select
                where_sql, where_args = "", []
                if self._filters:
                    where_sql = "WHERE " + self._build_where_clause()
                    where_args = self._build_where_args()
                
                query = f"SELECT {self._data} FROM {self.table_name} {where_sql}"
                results = await Database.fetch_all(query, *where_args)
                return TableResponse(results)
        
        except Exception as e:
            logger.error(f"Database error: {e}")
            raise
    
    def _build_where_clause(self) -> str:
        """Build WHERE clause from filters"""
        clauses = []
        for i, (op, col, val) in enumerate(self._filters):
            if op == "eq":
                clauses.append(f"{col} = ${i+1}")
            elif op == "in":
                placeholders = ", ".join([f"${i+j+1}" for j in range(len(val))])
                clauses.append(f"{col} IN ({placeholders})")
        
        return " AND ".join(clauses)
    
    def _build_where_args(self) -> list:
        """Build WHERE arguments from filters"""
        args = []
        for op, col, val in self._filters:
            if op == "eq":
                args.append(val)
            elif op == "in":
                args.extend(val)
        return args


class TableResponse:
    """Response wrapper to mimic Supabase response"""
    
    def __init__(self, data: List[Dict[str, Any]]):
        self.data = data
    
    async def execute(self):
        """Already executed, return self"""
        return self


class Database_Wrapper:
    """Main database wrapper mimicking Supabase"""
    
    def table(self, table_name: str) -> Table:
        """Get table reference"""
        return Table(table_name)


# Global instance
db = Database_Wrapper()


def get_supabase_compatible_db():
    """Get Supabase-compatible database interface"""
    return db
