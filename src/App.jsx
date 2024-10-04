import React, { useState, useEffect } from 'react';
import { AlertCircle, Send, Users, MessageSquare, ChevronDown } from 'lucide-react';

// API Config
const APIs = [
  {
    name: "Get Users List",
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    icon: Users,
    description: "Fetch a list of all users"
  },
  {
    name: "Create New Post",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    icon: Send,
    description: "Create a new post with title and body"
  },
  {
    name: "Get Comments by Post",
    url: "https://jsonplaceholder.typicode.com/comments",
    method: "GET",
    icon: MessageSquare,
    description: "Retrieve comments for a specific post"
  },
];

const APIDropdown = ({ selectedAPI, setSelectedAPI, users, postData, setPostData, isDropdownOpen, setIsDropdownOpen }) => (
  <div>
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm flex justify-between items-center hover:bg-gray-50"
      >
        <span className="text-gray-700">{selectedAPI || "Select API"}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {APIs.map(api => (
            <button
              key={api.name}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
              onClick={() => {
                setSelectedAPI(api.name);
                setIsDropdownOpen(false);
                setPostData({ title: '', body: '', userId: '' }); // Reset post data
              }}
            >
              {React.createElement(api.icon, { className: "mr-2 h-4 w-4 text-gray-500" })}
              {api.name}
            </button>
          ))}
        </div>
      )}
    </div>

    {selectedAPI === "Create New Post" && (
      <div className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          onChange={(e) => setPostData({ ...postData, body: e.target.value })}
        />
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setPostData({ ...postData, userId: e.target.value })}
        >
          <option value="">Select User ID</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
    )}
  </div>
);

const ResponseDisplay = ({ response, error, loading, selectedApiData }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-900">Response</h2>
    <div className="mt-1">
      {selectedApiData ? (
        <div className="flex items-center">
          <span className={`mr-2 px-2 py-1 rounded-full text-xs ${selectedApiData.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {selectedApiData.method}
          </span>
          <span className="text-sm text-gray-500">{selectedApiData.description}</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Select an API to see the response</p>
      )}
    </div>
    <div className="mt-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="flex p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : response ? (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md h-screen overflow-scroll">
          {JSON.stringify(response, null, 2)}
        </pre>
      ) : null}
    </div>
  </div>
);

const App = () => {
  const [selectedAPI, setSelectedAPI] = useState('');
  const [response, setResponse] = useState(null);
  const [postData, setPostData] = useState({ title: '', body: '', userId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [createdPostId, setCreatedPostId] = useState(null);

  // Fetch API based on the selected API
  const fetchAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;

      if (selectedAPI === "Get Users List") {
        res = await fetch(APIs[0].url);
        const data = await res.json();
        setUsers(data); // Store fetched users
        setResponse(data); // Show response in UI
      } else if (selectedAPI === "Create New Post") {
        res = await fetch(APIs[1].url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
        const data = await res.json();
        setCreatedPostId(data.id); // Store the post ID for chaining
        setResponse(data); // Show new post response
      } else if (selectedAPI === "Get Comments by Post") {
        if (!createdPostId) {
          setError("No post available to fetch comments. Create a post first.");
          setLoading(false);
          return;
        }
        res = await fetch(`${APIs[2].url}?postId=${createdPostId}`);
        const data = await res.json();
        setResponse(data); // Show comments response
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const selectedApiData = APIs.find(api => api.name === selectedAPI);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">API Selection</h2>
              <p className="text-sm text-gray-500 mt-1">Choose an API endpoint to test</p>
            </div>
            <div className="px-6 pb-6">
              <APIDropdown
                selectedAPI={selectedAPI}
                setSelectedAPI={setSelectedAPI}
                users={users}
                postData={postData}
                setPostData={setPostData}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
              />
            </div>
            <div className="px-6 pb-6">
              <button
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={fetchAPI}
                disabled={loading}
              >
                {loading ? "Loading..." : "Send Request"}
              </button>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
            <ResponseDisplay
              response={response}
              error={error}
              loading={loading}
              selectedApiData={selectedApiData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
