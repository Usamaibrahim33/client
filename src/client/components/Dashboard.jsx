import axios from 'axios';
import { useEffect, useState } from 'react';

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [errorSpace, setErrorSpace] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [fileError, setFileError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [editedBalances, setEditedBalances] = useState({});
    const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

    const url = 'http://localhost:4090/admin/getAllTransaction';

    const fetchTransactionData = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(data.result);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchTransactionData();
    }, []);

    const handleSearch = async () => {
        console.log('Starting search for:', searchTerm);
        try {
            const response = await axios.get(`http://localhost:4090/admin/balance/${searchTerm}`);
            console.log('Response received:', response);
    
            if (response.status !== 200) {
                console.log('User not found');
                setSearchError('User not found.');
                setUserSearchResults([]);
                return;
            }
    
            const data = response.data;
            console.log('Data received:', data);
            if(data.user.length === 0) {
                setUserSearchResults('No user found');
            }

            console.log(data.user.length)
            setUserSearchResults(data.user);
            console.log('british', userSearchResults);
        } catch (error) {
            setSearchError('An error occurred while searching for the user. Please try again later.');
            console.error('Error searching user:', error);
        }
    };

    const handleEditBalanceChange = (id, newBalance) => {
        setEditedBalances({
            ...editedBalances,
            [id]: newBalance,
        });
    };

    const handleSaveBalance = async (id) => {
        const user = userSearchResults.find(user => user.id === id);
        if (!user) return;

        const { username, user_id } = user;
        const amount = editedBalances[id];

        try {
            const response = await axios.put(`http://localhost:4090/admin/editUserBalance`, { username, user_id, amount });
            console.log(`Balance updated for user ${id}`);

            if(response.status !== 200){
                console.log('balance nor updated');
                return;
            }

            const data = response.json();
            console.log(data);
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const handleFilter = () => {
        console.log('Filtering transactions by type:', transactionType);
        if (transactionType === 'deposit') {
            setContent('Displaying all deposits');
        } else if (transactionType === 'topup') {
            setContent('Displaying all top-ups');
        } else if (transactionType === 'purchase') {
            setContent('Displaying all purchases');
        } else {
            setContent('Main content');
        }
    };

    const handleFileUpload =  (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleFileSubmit = async () => {
        console.log('Uploading file:', file);
        if (!file) {
            setFileError('Please select a file');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        console.log('this is the formData', formData);
    
        try {
            const response = await axios.post('http://localhost:4090/admin/upload-cards', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                console.log('File uploaded successfully:', response.data);
                setUploadedFiles([...uploadedFiles, file.name]);  // Update uploaded files list
                setFile(null);  // Reset file input
                setFileError('');  // Clear any previous errors
                setUploadSuccessMessage(response.data.message); // Update success message
            } else {
                console.log('File upload failed:', response);
                setFileError('Failed to upload file. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileError('An error occurred during file upload. Please try again.');
        }
    };
    
    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8">
            <h1 className="bg-gradient-to-r from-blue-500 to-green-500 text-3xl md:text-5xl text-white font-bold text-center py-6 shadow-lg">Admin Dashboard</h1>
            <div className="flex flex-wrap">
                <div className="w-full md:w-60 border-r-4 shadow-xl border-gray-300 h-full p-4 md:p-6 bg-white mb-4 md:mb-0">
                    <div className="mb-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-full"
                            onClick={fetchTransactionData}
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Search Users</h2>
                        <div className="flex items-center mb-2">
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-full"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
                    </div>
                    <hr className="mb-4 md:mb-8" />
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Filter Transactions</h2>
                        <div className="flex items-center mb-2">
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                            >
                                <option value="">Select transaction type</option>
                                <option value="deposit">Deposit</option>
                                <option value="topup">Top-up</option>
                                <option value="purchase">Purchase</option>
                            </select>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-full"
                            onClick={handleFilter}
                        >
                            Filter
                        </button>
                    </div>
                    <hr className="mb-4 md:mb-8" />
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Upload Fullz</h2>
                        <div className="mb-2">
                            <input
                                type="file"
                                className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none"
                                onChange={handleFileUpload}
                            />
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none w-full"
                            onClick={handleFileSubmit}
                        >
                            Upload
                        </button>
                        {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
                        {uploadSuccessMessage && <p className="text-green-500 mt-2">{uploadSuccessMessage}</p>}
                    </div>
                </div>
                <div className="flex-1 p-4 md:p-6 bg-gray-50">
                    {errorSpace && <p>{errorSpace}</p>}
                    {userSearchResults.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">User Search Results</h2>
                            {userSearchResults.map((user) => (
                                <div key={user.id} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
                                    <p><strong>Username:</strong> {user.username}</p>
                                    <p><strong>User ID:</strong> {user.user_id}</p>
                                    <div className="flex items-center">
                                        <label className="w-1/4 text-gray-700 font-medium">Balance:</label>
                                        <input
                                            type="number"
                                            value={editedBalances[user.id] ?? user.balance}
                                            onChange={(e) => handleEditBalanceChange(user.id, e.target.value)}
                                            className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md"
                                        />
                                        <button
                                            className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                                            onClick={() => handleSaveBalance(user.id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-center pb-3">All Transaction History</h1>
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="mb-6 p-4 border rounded-lg bg-gray-100 shadow-inner">
                                    {Object.entries(transaction).map(([key, value]) => (
                                        <div key={key} className="flex items-center mb-2">
                                            <label className="w-1/4 text-gray-700 font-medium">{key}:</label>
                                            <p className="w-3/4 px-3 py-2 bg-white border border-gray-300 rounded-md">{value}</p>
                                        </div>
                                    ))}
                                    <hr className="mt-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;