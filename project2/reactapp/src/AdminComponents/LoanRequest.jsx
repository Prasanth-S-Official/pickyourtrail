import React, { useState, useEffect } from 'react';
import './LoanRequest.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loanTypeFilter, setLoanTypeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [purchasePriceFilter, setPurchasePriceFilter] = useState("");
  const [loanTypes, setLoanTypes] = useState([]);
  const [modelFilterStartDate, setModelFilterStartDate] = useState(null);
  const [modelFilterEndDate, setModelFilterEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get('https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/getAllLoanApplications');
      setLoanRequests(response.data);
      setFilteredRequests(response.data);
      const types = [...new Set(response.data.map(request => request.loanType))];
      setLoanTypes(types);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const filterRequests = (search, requests, status) => {
    const searchLower = search.toLowerCase();
    if (searchLower === "" && status === "All") return requests;

    return requests.filter((request) => {
      const matchesSearch = request.userName.toLowerCase().includes(searchLower) ||
        request.loanType.toLowerCase().includes(searchLower);

      const matchesStatus = status === "All" || (request.loanStatus === parseInt(status));

      return matchesSearch && matchesStatus;
    });
  };

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
    setFilteredRequests(filterRequests(inputValue, loanRequests, statusFilter));
    setPage(1);
  };

  const toggleSort = (order) => {
    setSortValue(order);
    const sortedRequests = [...filteredRequests].sort((a, b) => {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return order === 1 ? dateA - dateB : dateB - dateA;
    });
    setFilteredRequests(sortedRequests);
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
   
  };

  const handlePagination = (newPage) => {
    const totalPages = Math.ceil(filteredRequests.length / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const applyAdvancedFilter = () => {
    const filtered = loanRequests.filter((request) => {
      const matchesLoanType =
        !loanTypeFilter || request.loanType.toLowerCase().includes(loanTypeFilter.toLowerCase());

      const matchesModelStartDate = !modelFilterStartDate || (request.model >= modelFilterStartDate);

      const matchesModelEndDate = !modelFilterEndDate || (request.model <= modelFilterEndDate);

      const matchesPurchasePrice = !purchasePriceFilter || request.purchasePrice >= parseInt(purchasePriceFilter);

      const matchesStatus = statusFilter === "All" || request.loanStatus.toString() === statusFilter;

      return matchesLoanType && matchesModelStartDate && matchesModelEndDate && matchesPurchasePrice && matchesStatus;
    });

    setPage(1);
    setFilteredRequests(filtered);
    setShowFilterModal(false);
  };


  const handleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const totalPages = Math.ceil(filteredRequests.length / limit);
  async function handleApprove(id, userName, userId) {
    let updatedRequest = {};
    loanRequests.forEach((request) => {
      if (request.loanApplicationID === id) {
        updatedRequest = request;
      }
    });
    let requestObject = {
      "userId": userId,
      "userName": userName,
      "loanType": updatedRequest.loanType,
      "submissionDate": updatedRequest.submissionDate,
      "income": updatedRequest.income,
      "purchasePrice": updatedRequest.purchasePrice,
      "model": updatedRequest.model,
      "address": updatedRequest.address,
      "loanStatus": 1
    };

    try {
      const response = await axios.put(
        `https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/updateLoanApplication/${id}`,
        requestObject
      );
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  }

  async function handleReject(id, userName, userId) {
    let updatedRequest = {};
    loanRequests.forEach((request) => {
      if (request.loanApplicationID === id) {
        updatedRequest = request;
      }
    });

    let requestObject = {
      "userId": userId,
      "userName": userName,
      "loanType": updatedRequest.loanType,
      "submissionDate": updatedRequest.submissionDate,
      "income": updatedRequest.income,
      "purchasePrice": updatedRequest.purchasePrice,
      "model": updatedRequest.model,
      "address": updatedRequest.address,
      "loanStatus": 2
    };
    try {
      const response = await axios.put(
        `https://8080-abfdabeabcbaed307483524dddffdfddftwo.premiumproject.examly.io/loanApplication/updateLoanApplication/${id}`,
        requestObject
      );
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} id='backButton'>Back</button>
      <h1>Loan Requests for Approval</h1>
      <div>
        <input
          id='searchBox'
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
       

      </div>
      <button id="AdvancedFilter" onClick={() => {
        setShowFilterModal(true)
      }}>Advanced Filter</button>
  {showFilterModal && (
  <div className="filter-modal">
    <label htmlFor="statusFilter">Filter by Status:</label>
    <select
      id="statusFilter"
      value={statusFilter}
      onChange={handleFilterChange}
    >
      <option value="All">All</option>
      <option value="0">Pending</option>
      <option value="1">Approved</option>
      <option value="2">Rejected</option>
    </select>

    <label htmlFor="loanTypeFilter">Loan Type:</label>
    <select
      id="loanTypeFilter"
      value={loanTypeFilter}
      onChange={(e) => setLoanTypeFilter(e.target.value)}
    >
      <option value="">All</option>
      {loanTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>

    <label htmlFor="modelStartDate">Model Start Date:</label>
    <input
      id="modelStartDate"
      type="date"
      value={modelFilterStartDate}
      onChange={(e) => setModelFilterStartDate(e.target.value)}
    />

    <label htmlFor="modelEndDate">Model End Date:</label>
    <input
      id="modelEndDate"
      type="date"
      value={modelFilterEndDate}
      onChange={(e) => setModelFilterEndDate(e.target.value)}
    />

    <label htmlFor="purchasePrice">Purchase Price:</label>
    <input
      id="purchasePrice"
      type="text"
      value={purchasePriceFilter}
      onChange={(e) => setPurchasePriceFilter(e.target.value)}
    />

    <button onClick={applyAdvancedFilter}>Apply</button>
    <button
      onClick={() => {
        setPurchasePriceFilter("");
        setModelFilterEndDate("");
        setModelFilterStartDate("");
        setLoanTypeFilter("");
        setShowFilterModal(false);
        setStatusFilter("All");

        fetchData();
      }}
    >
      Clear
    </button>
  </div>
)}

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Loan Type</th>
            <th>Model</th>
            <th>
              <div id="submissionDate">
                Submission Date
                <div
                  className="sortButtons"
                  onClick={() => toggleSort(1)}
                >
                  ⬆️
                </div>
                <div
                  className="sortButtons"
                  onClick={() => toggleSort(-1)}
                >
                  ⬇️
                </div>
              </div>
            </th>
            <th>purchasePrice</th>
            <th>Income</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        {filteredRequests.length ? <tbody>
          {filteredRequests
            .slice((page - 1) * limit, page * limit)
            .map((request, index) => (
              <React.Fragment key={request._id}>
                <tr>
                  <td>{request.userName}</td>
                  <td>{request.loanType}</td>
                  <td>{new Date(request.model).toLocaleDateString()}</td>
                  <td>{new Date(request.submissionDate).toLocaleDateString()}</td>
                  <td>${request.purchasePrice}</td>
                  <td>${request.income}</td>

                  <td >
                    <button
                      onClick={() => handleRowExpand(index)}
                    >
                      {expandedRow === index ? "Hide Address" : "Show Address"}
                    </button>
                  </td>
                  <td>
                    {request.loanStatus === 0
                      ? "Pending"
                      : request.loanStatus === 1
                        ? "Approved"
                        : "Rejected"}
                  </td>
                  <td>
                    {(request.loanStatus === 0 || request.loanStatus === 2) && (
                      <button
                        onClick={() => handleApprove(request._id, request.userName, request.userId)}
                      >
                        Approve
                      </button>
                    )}
                    {(request.loanStatus === 0 || request.loanStatus === 1) && (
                      <button
                        onClick={() => handleReject(request._id, request.userName, request.userId)}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr>
                    <td colSpan="8">
                      <div className="address-details">
                        Address: {request.address}
                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}


        </tbody> : (
          <tbody>
            <tr>

              <td colSpan={9} className="no-records-cell">
                Oops! No records Found
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {filteredRequests.length&& <div>
        <button onClick={() => handlePagination(page - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages === 0 ? 1 : totalPages}
        </span>
        <button onClick={() => handlePagination(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>}
    </div>
  );
};

export default LoanRequests;
