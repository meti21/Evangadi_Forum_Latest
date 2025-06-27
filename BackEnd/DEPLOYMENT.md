# Backend Deployment Guide

## Required Environment Variables

Set these environment variables in your Render dashboard:

### 1. JWT_SECRET
- **Description**: Secret key for JWT token generation and verification
- **Example**: `your-super-secret-jwt-key-here`
- **Required**: Yes

### 2. DATABASE_URL
- **Description**: PostgreSQL database connection string
- **Example**: `postgresql://username:password@host:port/database`
- **Required**: Yes (for full functionality)

### 3. FRONTEND_URL (Optional)
- **Description**: Your frontend deployment URL for CORS
- **Example**: `https://your-frontend-app.vercel.app`
- **Required**: No (has fallbacks)

### 4. PORT (Optional)
- **Description**: Port number for the server
- **Default**: 2112
- **Required**: No (Render sets this automatically)

## Setting Environment Variables in Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add each variable with its value
5. Click "Save Changes"
6. Redeploy your service

## Testing Deployment

1. **Health Check**: Visit `https://your-backend-url.onrender.com/health`
2. **Expected Response**: 
   ```json
   {
     "status": "OK",
     "message": "Server is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## Common Issues

### "Exited with status 1"
- Check if all required environment variables are set
- Verify DATABASE_URL is correct and accessible
- Check Render logs for specific error messages

### CORS Errors
- Ensure FRONTEND_URL is set correctly
- Check that your frontend domain is in the allowed origins list

### Database Connection Issues
- Verify DATABASE_URL format
- Check if database is accessible from Render
- Ensure database tables exist 