#!/usr/bin/env python3
"""
Test script to verify that the registration endpoint works correctly
and actually writes to the database.
"""

import asyncio
from fastapi.testclient import TestClient
from src.main import app
from database.config import engine, Base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from src.users.repository import PosgresUserRepository
import uuid


def test_registration_writes_to_database():
    """Test that registration actually writes to the database"""
    client = TestClient(app)
    
    # Register a new user
    user_data = {
        "email": "test@example.com",
        "password": "securepassword123",
        "username": "testuser"
    }
    
    response = client.post("/api/v1/auth/register", json=user_data)
    
    print(f"Registration response status: {response.status_code}")
    print(f"Registration response data: {response.json()}")
    
    # Check that the response is successful
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    # Extract user data from response
    response_data = response.json()
    user_id = response_data.get('id')
    
    assert user_id is not None, "User ID should be present in response"
    
    # Now verify the user was actually saved to the database
    # We'll need to query the database directly to verify
    import asyncio
    
    async def verify_user_in_db():
        # Create a new async session
        async with AsyncSession(engine) as session:
            repo = PosgresUserRepository(session)
            
            # Try to retrieve the user by email
            retrieved_user = await repo.get_by_email("test@example.com")
            
            print(f"Retrieved user from DB: {retrieved_user}")
            
            assert retrieved_user is not None, "User should exist in database after registration"
            assert retrieved_user.email == "test@example.com", "Email should match"
            assert retrieved_user.username == "testuser", "Username should match"
            assert retrieved_user.id is not None, "User ID should be assigned"
            
            print("SUCCESS: User was successfully saved to the database!")
    
    # Run the async verification
    asyncio.run(verify_user_in_db())


if __name__ == "__main__":
    test_registration_writes_to_database()