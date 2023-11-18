const LoanApplication = require('../models/loanApplicationModel');

const getAllLoanApplications = async (req, res) => {
  try {
    const loanApplications = await LoanApplication.find({});
    res.status(200).json(loanApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanApplicationByUserId = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming userId is provided as a parameter
  console.log("userId",userId)
      const loanApplication = await LoanApplication.find({ userId }); // Find by userId
  console.log("loanApplication",loanApplication)
      if (loanApplication) {
        res.status(200).json(loanApplication);
      } else {
        res.status(404).json({ message: 'Loan application not found for the provided userId' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const getLoanApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findById(id);
    res.status(200).json(loanApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLoanApplication = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.create(req.body);
    res.status(200).json(loanApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findByIdAndUpdate(id, req.body);
    if (!loanApplication) {
      return res.status(404).json({ message: `Cannot find any loan application with ID ${id}` });
    }
    const updatedLoanApplication = await LoanApplication.findById(id);
    res.status(200).json(updatedLoanApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const loanApplication = await LoanApplication.findByIdAndDelete(id);
    if (!loanApplication) {
      return res.status(404).json({ message: `Cannot find any loan application with ID ${id}` });
    }
    res.status(200).json(loanApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLoanApplications,
  getLoanApplicationById,
  addLoanApplication,
  updateLoanApplication,
  deleteLoanApplication,
  getLoanApplicationByUserId
};
