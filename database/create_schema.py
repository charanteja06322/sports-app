#!/usr/bin/env python3
"""
Create Neon database schema
"""
import asyncio
import asyncpg
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_file = Path(__file__).parent.parent / "backend" / ".env"
load_dotenv(env_file)

async def create_schema():
    """Create database schema from neon-schema.sql"""
    
    # Get connection string from environment
    dsn = os.getenv('DATABASE_URL')
    
    if not dsn:
        print("✗ DATABASE_URL not set in .env file")
        return False
    
    print(f"Connecting to Neon with URL: {dsn[:50]}...")
    
    # Try to parse the DSN
    try:
        # asyncpg.connect() expects the DSN directly
        conn = await asyncpg.connect(dsn)
        print("✓ Connected to Neon PostgreSQL")
        
        # Read SQL file
        schema_file = Path(__file__).parent / "neon-schema.sql"
        with open(schema_file, 'r') as f:
            sql = f.read()
        
        # Execute SQL
        await conn.execute(sql)
        print("✓ Schema created successfully")
        
        # Check tables
        tables = await conn.fetch(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
        )
        print(f"\n✓ Created {len(tables)} tables:")
        for table in tables:
            print(f"  - {table['tablename']}")
        
        # Check sample data
        users = await conn.fetch("SELECT COUNT(*) as count FROM public.users")
        teams = await conn.fetch("SELECT COUNT(*) as count FROM public.teams")
        matches = await conn.fetch("SELECT COUNT(*) as count FROM public.matches")
        posts = await conn.fetch("SELECT COUNT(*) as count FROM public.posts")
        
        print(f"\n✓ Sample data loaded:")
        print(f"  - {users[0]['count']} users")
        print(f"  - {teams[0]['count']} teams")
        print(f"  - {matches[0]['count']} matches")
        print(f"  - {posts[0]['count']} posts")
        
        await conn.close()
        print("\n✓ Schema creation complete!")
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(create_schema())
    sys.exit(0 if success else 1)
