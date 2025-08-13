"""
Supabase Service for Django Integration
Handles authentication, real-time features, and database operations
"""
import os
import logging
from typing import Dict, Any, Optional, List
from django.conf import settings
from django.core.cache import cache
import requests
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions

logger = logging.getLogger(__name__)

class SupabaseService:
    """
    Service class for handling Supabase operations in Django
    """
    
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.anon_key = settings.SUPABASE_ANON_KEY
        self.service_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        if not all([self.url, self.anon_key]):
            logger.warning("Supabase credentials not configured")
            self.client = None
        else:
            try:
                self.client = create_client(self.url, self.anon_key)
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.client = None
    
    def is_available(self) -> bool:
        """Check if Supabase is properly configured and available"""
        return self.client is not None
    
    # Authentication Methods
    def sign_up(self, email: str, password: str, user_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Sign up a new user with Supabase
        
        Args:
            email: User's email address
            password: User's password
            user_data: Additional user metadata
            
        Returns:
            Dict containing user data and session info
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": user_data or {}
                }
            })
            
            logger.info(f"User signed up successfully: {email}")
            return {
                "user": response.user,
                "session": response.session,
                "success": True
            }
        except Exception as e:
            logger.error(f"Sign up failed for {email}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """
        Sign in a user with Supabase
        
        Args:
            email: User's email address
            password: User's password
            
        Returns:
            Dict containing user data and session info
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            logger.info(f"User signed in successfully: {email}")
            return {
                "user": response.user,
                "session": response.session,
                "success": True
            }
        except Exception as e:
            logger.error(f"Sign in failed for {email}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def sign_out(self, access_token: str) -> Dict[str, Any]:
        """
        Sign out a user
        
        Args:
            access_token: User's access token
            
        Returns:
            Dict containing success status
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            self.client.auth.sign_out()
            logger.info("User signed out successfully")
            return {"success": True}
        except Exception as e:
            logger.error(f"Sign out failed: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Get user data from access token
        
        Args:
            access_token: User's access token
            
        Returns:
            User data or None if invalid
        """
        if not self.is_available():
            return None
        
        try:
            # Set the access token for this request
            self.client.auth.set_session(access_token, None)
            user = self.client.auth.get_user()
            return user.user if user else None
        except Exception as e:
            logger.error(f"Failed to get user: {e}")
            return None
    
    def reset_password(self, email: str) -> Dict[str, Any]:
        """
        Send password reset email
        
        Args:
            email: User's email address
            
        Returns:
            Dict containing success status
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            self.client.auth.reset_password_email(email)
            logger.info(f"Password reset email sent to: {email}")
            return {"success": True}
        except Exception as e:
            logger.error(f"Password reset failed for {email}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    # Database Operations
    def insert_data(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Insert data into Supabase table
        
        Args:
            table: Table name
            data: Data to insert
            
        Returns:
            Dict containing inserted data
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            response = self.client.table(table).insert(data).execute()
            logger.info(f"Data inserted into {table}")
            return {
                "data": response.data,
                "success": True
            }
        except Exception as e:
            logger.error(f"Failed to insert data into {table}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def get_data(self, table: str, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Get data from Supabase table
        
        Args:
            table: Table name
            filters: Optional filters
            
        Returns:
            Dict containing retrieved data
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            query = self.client.table(table).select("*")
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            response = query.execute()
            logger.info(f"Data retrieved from {table}")
            return {
                "data": response.data,
                "success": True
            }
        except Exception as e:
            logger.error(f"Failed to get data from {table}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def update_data(self, table: str, data: Dict[str, Any], filters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update data in Supabase table
        
        Args:
            table: Table name
            data: Data to update
            filters: Filters to identify records
            
        Returns:
            Dict containing updated data
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            query = self.client.table(table).update(data)
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            logger.info(f"Data updated in {table}")
            return {
                "data": response.data,
                "success": True
            }
        except Exception as e:
            logger.error(f"Failed to update data in {table}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def delete_data(self, table: str, filters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Delete data from Supabase table
        
        Args:
            table: Table name
            filters: Filters to identify records
            
        Returns:
            Dict containing success status
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            query = self.client.table(table).delete()
            
            for key, value in filters.items():
                query = query.eq(key, value)
            
            response = query.execute()
            logger.info(f"Data deleted from {table}")
            return {
                "data": response.data,
                "success": True
            }
        except Exception as e:
            logger.error(f"Failed to delete data from {table}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    # Real-time Features
    def subscribe_to_changes(self, table: str, callback: callable) -> str:
        """
        Subscribe to real-time changes in a table
        
        Args:
            table: Table name
            callback: Function to call when changes occur
            
        Returns:
            Subscription ID
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            subscription = self.client.table(table).on('*', callback).subscribe()
            logger.info(f"Subscribed to changes in {table}")
            return subscription
        except Exception as e:
            logger.error(f"Failed to subscribe to {table}: {e}")
            raise
    
    def unsubscribe(self, subscription_id: str) -> bool:
        """
        Unsubscribe from real-time changes
        
        Args:
            subscription_id: Subscription ID
            
        Returns:
            Success status
        """
        if not self.is_available():
            return False
        
        try:
            self.client.remove_subscription(subscription_id)
            logger.info(f"Unsubscribed from {subscription_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to unsubscribe from {subscription_id}: {e}")
            return False
    
    # File Storage
    def upload_file(self, bucket: str, path: str, file_data: bytes, content_type: str = None) -> Dict[str, Any]:
        """
        Upload file to Supabase storage
        
        Args:
            bucket: Storage bucket name
            path: File path in bucket
            file_data: File data as bytes
            content_type: File content type
            
        Returns:
            Dict containing file URL and metadata
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            response = self.client.storage.from_(bucket).upload(
                path=path,
                file=file_data,
                file_options={"content-type": content_type} if content_type else None
            )
            
            # Get public URL
            public_url = self.client.storage.from_(bucket).get_public_url(path)
            
            logger.info(f"File uploaded to {bucket}/{path}")
            return {
                "url": public_url,
                "path": path,
                "success": True
            }
        except Exception as e:
            logger.error(f"Failed to upload file to {bucket}/{path}: {e}")
            return {
                "error": str(e),
                "success": False
            }
    
    def delete_file(self, bucket: str, path: str) -> Dict[str, Any]:
        """
        Delete file from Supabase storage
        
        Args:
            bucket: Storage bucket name
            path: File path in bucket
            
        Returns:
            Dict containing success status
        """
        if not self.is_available():
            raise Exception("Supabase not configured")
        
        try:
            self.client.storage.from_(bucket).remove([path])
            logger.info(f"File deleted from {bucket}/{path}")
            return {"success": True}
        except Exception as e:
            logger.error(f"Failed to delete file from {bucket}/{path}: {e}")
            return {
                "error": str(e),
                "success": False
            }

# Global instance
supabase_service = SupabaseService() 