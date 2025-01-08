#### **Project Setup**

**Clone the repository:** git clone

**Install dependencies:** npm install

**Run the development server:** npm start

This will start the frontend in development mode, usually available at http://localhost:3000.

#### **Environment Configuration**

- No specific environment variables are required for the frontend. However, ensure the backend URL is set correctly in the environment for API calls.

#### **Testing Permissions (Development Mode)**

- By default, the IS_DEVELOPMENT_MODE variable is set to true during development. This disables role-based permissions.
- To test role-based permissions, set IS_DEVELOPMENT_MODE to false and ensure that the backend URL is correct.

#### **Additional Notes**

- Ensure that you have access to the backend, and that both the frontend and backend are running properly for testing all features.
