# API Testing Dashboard

This project is an interactive API testing dashboard where users can select different API endpoints, send requests, and view responses. It demonstrates how to manage API requests, handle API chaining, and display responses in a clear and user-friendly interface.

## Features

1. **API Endpoints Selection**: 
   - Users can select from three different APIs to interact with:
     - **Get Users List**: Fetches a list of all users.
     - **Create New Post**: Allows the user to create a new post by submitting a title, body, and selecting a user ID.
     - **Get Comments by Post**: Fetches comments for a specific post (uses post ID from the created post).
   
2. **API Chaining**:
   - After creating a post, the app automatically fetches comments associated with that post using the post ID. This demonstrates API chaining.

3. **Live Response Display**:
   - Real-time feedback is shown for each API request, displaying either the fetched data or any errors encountered during the request.
   
4. **Loading and Error States**:
   - Shows a loading spinner while fetching data and error messages when something goes wrong.

5. **User-Friendly Interface**:
   - Built with **React** and **Tailwind CSS** for styling, ensuring a responsive and clean design.
   - Icons from **Lucide-react** provide a modern, aesthetic touch.

## Setup Instructions

Follow these steps to set up the project on your local machine:

### 1. Clone the repository:
First, clone the repository from GitHub or another version control system.
```bash
git clone <repository-link>
