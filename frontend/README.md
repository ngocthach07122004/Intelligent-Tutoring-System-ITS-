# Clone Achromatic

Clone Achromatic is a modern web application built with Next.js, designed to provide a clean and functional user interface for managing dashboards, user authentication, and more.

## Features

- User authentication (signup, signin, logout)
- Sidebar navigation with collapsible functionality
- Theme selector for light/dark mode
- API integration for backend communication

## File Structure

Below is an overview of the project structure up to the third folder level, with explanations for each folder:

```
/src
├── app
│   ├── api          # Contains API functions for backend communication
│   └── pages        # Next.js pages and API routes
├── components
│   ├── blocks       # Reusable UI blocks like SideBar and Logout
│   ├── icons        # Icon components used throughout the app
│   ├── layouts      # Layout components for structuring pages
│   ├── ui           # Small reusable UI components (e.g., buttons, popovers)
│   └── widgets      # Widgets like ThemeSelector for additional functionality
├── context          # React context for managing global state
├── screens          # Page-level components for specific screens
├── types            # TypeScript type definitions and interfaces
├── lib              # Utility functions and libraries (e.g., API interfaces)
```

## How to Run

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/clone-achromatic.git
   cd clone-achromatic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and configure the required environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

   ```
   Note: the url was hard coded

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Notes

- Ensure the backend server is running at `http://localhost:8000` for API integration.
- Customize the `BASE_URL` in `/src/app/api/auth.ts` if the backend URL changes.


## License

This project is licensed under the MIT License.
