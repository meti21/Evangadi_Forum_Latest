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
- **Example**: `https://evangadi-forum-frontend-o8f8tg6jc-metis-projects-cc5af67c.vercel.app`
- **Required**: No (CORS now handles all Vercel domains automatically)

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
- **Fixed**: CORS now automatically allows all Vercel domains
- If still having issues, set FRONTEND_URL to your exact Vercel domain
- Check backend logs for CORS debugging information

### Database Connection Issues
- Verify DATABASE_URL format
- Check if database is accessible from Render
- Ensure database tables exist 