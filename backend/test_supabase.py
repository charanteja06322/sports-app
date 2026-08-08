"""
Test Supabase Connection
Verify FastAPI can connect to Supabase database
"""
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.supabase_client import get_supabase
from app.core.config import settings


def test_connection():
    """Test Supabase connection"""
    print("=" * 60)
    print("Testing Supabase Connection from FastAPI Backend")
    print("=" * 60)
    
    print(f"\n✓ Supabase URL: {settings.SUPABASE_URL}")
    print(f"✓ Anon Key: {settings.SUPABASE_ANON_KEY[:20]}...")
    
    try:
        # Get Supabase client
        supabase = get_supabase()
        print("\n✓ Supabase client initialized successfully")
        
        # Test database connection - fetch teams
        print("\n📊 Testing database query (teams table)...")
        response = supabase.table('teams').select('*').limit(5).execute()
        
        print(f"✓ Query successful!")
        print(f"✓ Found {len(response.data)} teams")
        
        if response.data:
            print("\n📋 Sample teams:")
            for team in response.data:
                print(f"   - {team.get('name', 'N/A')} ({team.get('id', 'N/A')})")
        else:
            print("   (No teams in database yet)")
        
        # Test other tables
        print("\n📊 Testing other tables...")
        tables = ['tournaments', 'matches', 'profiles']
        
        for table_name in tables:
            try:
                resp = supabase.table(table_name).select('id').limit(1).execute()
                count = len(resp.data)
                print(f"✓ {table_name}: {count} record(s)")
            except Exception as e:
                print(f"✗ {table_name}: Error - {str(e)[:50]}")
        
        print("\n" + "=" * 60)
        print("✅ SUCCESS: FastAPI → Supabase connection working!")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env")
        print("2. Verify Supabase project is running")
        print("3. Check RLS policies allow anon access")
        print("=" * 60)
        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
