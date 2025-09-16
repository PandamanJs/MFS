# Vercel Deployment Guide

This guide will help you deploy the School Fees Management System to Vercel with Supabase and QuickBooks integration.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Supabase Project**: Set up as described in `SUPABASE_SETUP.md`
3. **QuickBooks App**: Created as described in `SUPABASE_SETUP.md`
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Prepare Your Repository

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add QuickBooks integration and Vercel deployment config"
   git push origin main
   ```

2. **Verify Files**: Ensure these files are in your repository:
   - `vercel.json`
   - `.vercelignore`
   - `package.json` with correct build script
   - All source files

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up project settings
   - Deploy

## Step 3: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

### Required Variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_QB_CLIENT_ID=your_quickbooks_client_id
VITE_QB_CLIENT_SECRET=your_quickbooks_client_secret
```

### Optional Variables:
```
VITE_API_URL=https://your-backend-url.com (if you have a separate backend)
```

## Step 4: Update QuickBooks App Settings

1. Go to https://developer.intuit.com
2. Open your QuickBooks app
3. Go to "Keys & OAuth"
4. Update the **Redirect URI** to:
   ```
   https://your-app-name.vercel.app/qb-callback
   ```
   Replace `your-app-name` with your actual Vercel app name

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`
2. **Test the flow**:
   - Search for a student using `+260 97 999 9999`
   - Connect to QuickBooks
   - Make a test payment
   - Verify QuickBooks sync

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update QuickBooks redirect URI to use your custom domain
4. Update DNS records as instructed by Vercel

## Environment-Specific Configuration

### Development
- Uses `http://localhost:5173/qb-callback` for QuickBooks
- Local Supabase connection
- Hot reload enabled

### Production (Vercel)
- Uses `https://your-app.vercel.app/qb-callback` for QuickBooks
- Production Supabase connection
- Optimized build

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure build script is correct: `"build": "vite build"`
   - Check Vercel build logs for specific errors

2. **Environment Variables Not Working**:
   - Verify variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding new variables

3. **QuickBooks OAuth Errors**:
   - Verify redirect URI matches exactly in QuickBooks app
   - Check that Client ID and Secret are correct
   - Ensure you're using production QuickBooks (not sandbox)

4. **Supabase Connection Issues**:
   - Verify Supabase URL and key are correct
   - Check Supabase project is active
   - Ensure RLS policies allow your Vercel domain

5. **CORS Issues**:
   - Supabase handles CORS automatically
   - QuickBooks API handles CORS automatically
   - If you have custom APIs, add Vercel domain to CORS settings

### Build Optimization

The app is optimized for Vercel with:
- Static file serving for React app
- Client-side routing with fallback to `index.html`
- Environment variables for configuration
- Proper build output directory

### Performance

- **Vite Build**: Optimized production build
- **Static Assets**: Served from Vercel CDN
- **React Router**: Client-side routing
- **Supabase**: Real-time database with CDN
- **QuickBooks**: External API calls

## Monitoring

1. **Vercel Analytics**: Built-in performance monitoring
2. **Supabase Dashboard**: Database performance and usage
3. **QuickBooks API**: Monitor API usage and limits
4. **Error Tracking**: Check Vercel function logs

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **Supabase RLS**: Implement proper row-level security
3. **QuickBooks OAuth**: Use secure token storage
4. **HTTPS**: Vercel provides automatic HTTPS
5. **CORS**: Properly configured for production domains

## Scaling

- **Vercel**: Automatically scales with traffic
- **Supabase**: Scales database automatically
- **QuickBooks**: API rate limits apply
- **CDN**: Global content delivery

## Backup and Recovery

1. **Code**: Stored in GitHub
2. **Database**: Supabase automatic backups
3. **Environment**: Stored in Vercel dashboard
4. **QuickBooks**: Data stored in QuickBooks

## Next Steps After Deployment

1. **Set up monitoring** and alerts
2. **Configure custom domain** if needed
3. **Set up staging environment** for testing
4. **Implement CI/CD** for automatic deployments
5. **Add error tracking** (Sentry, LogRocket, etc.)
6. **Set up analytics** (Google Analytics, Mixpanel, etc.)

Your school fees management system is now live on Vercel with full Supabase and QuickBooks integration! 🚀
