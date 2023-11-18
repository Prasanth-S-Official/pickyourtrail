import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../Components/Login";
import axios from "axios";
import { BrowserRouter , useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "@testing-library/jest-dom"; // Import the extended matchers
import Signup from "../Components/Signup";
import { act } from "react-dom/test-utils";
import UserHomePage from "../UserComponents/UserHomePage";
import HomePage from "../AdminComponents/Home";
import LoanForm from "../AdminComponents/LoanForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AppliedLoansPage from "../UserComponents/AppliedLoans";
import LoanApplicationForm from "../UserComponents/LoanApplicationForm";
import MockAdapter from "axios-mock-adapter";
import LoanRequests from "../AdminComponents/LoanRequest";

jest.mock("axios");
jest.mock("react-redux");

describe("Login Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("login_renders_the_input_field", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    // expect(getByText("Login")).toBeInTheDocument();
    const loginButton = screen.getByText("Login", { selector: "button" });
    expect(loginButton).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Username", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Password", { selector: "input" })
    ).toBeInTheDocument();
  });

  it("login_required_validation_for_input_fields", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButton = screen.getByText("Login", { selector: "button" });
    fireEvent.click(loginButton);
    // Write expectations to verify error messages for empty fields
    expect(getByText(/Username is required/i)).toBeInTheDocument();
    expect(getByText(/Password is required/i)).toBeInTheDocument();
  });

  it("login_no_required_validation_for_input_fields_with_valid_data", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Username", {
      selector: "input",
    });
    const passwordInput = screen.getByPlaceholderText("Password", {
      selector: "input",
    });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    const loginButton = screen.getByText("Login", { selector: "button" });
    fireEvent.click(loginButton);
    // Write expectations to verify error messages for empty fields
    let userNameError = screen.queryByText(/Username is required/i);
    let passwordError = screen.queryByText(/Password is required/i);

    expect(userNameError).toBeNull(); // Null means the element was not found
    expect(passwordError).toBeNull();
  });
  it("login_regular_expression_validation_for_input_fields", () => {
    const { getByText } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Username", {
      selector: "input",
    });
    const passwordInput = screen.getByPlaceholderText("Password", {
      selector: "input",
    });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "pa3" } });
    const loginButton = screen.getByText("Login", { selector: "button" });
    fireEvent.click(loginButton);
    // Write expectations to verify error messages for empty fields
    let userNameError = screen.queryByText(/Username is required/i);
    let passwordError = screen.queryByText(/Password is required/i);
    let passwordError2 = screen.queryByText(
      /Password must be at least 6 characters/i
    );

    expect(userNameError).toBeNull(); // Null means the element was not found
    expect(passwordError).toBeNull();

    expect(passwordError2).toBeInTheDocument();
  });
  test("login_should_make_an_axios_call_to_the_login_endpoint", () => {
    // Mock the Axios post method
    const mockAxiosPost = jest.spyOn(axios, "post");
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login", { selector: "button" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);
    // Check if Axios was called with a URL that includes the expected endpoint
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining("/user/login"),
      // expect.objectContaining({
      //   username:"testuser" ,
      //   Password:"password123"
      // })
      expect.any(Object)
    );
    // Make sure to clear the mock to avoid affecting other tests
    mockAxiosPost.mockRestore();
  });
});
describe("signup_component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("signup_should_render_the_signup_form_with_fields", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Check if the Signup header is rendered
    const signupHeader = screen.getByText("Signup", { selector: "h2" });
    expect(signupHeader).toBeInTheDocument();

    // Check if the user name, password, confirm password, and role input fields are present
    const userNameInput = screen.getByPlaceholderText("UserName");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const roleSelect = screen.getByLabelText("Role");
    expect(userNameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();

    // Check if the Submit button is present
    const submitButton = screen.getByText("Submit", { selector: "button" });
    expect(submitButton).toBeInTheDocument();

    // Check if the Login button is present
    const loginButton = screen.getByText("Already have an Account?");
    expect(loginButton).toBeInTheDocument();
  });

  test("signup_should_show_an_error_message_when_attempting_to_submit_the_form_with_empty_fields", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const submitButton = screen.getByText("Submit", { selector: "button" });
    fireEvent.click(submitButton);

    // Check if error messages for user name, password, confirm password are displayed
    const userNameError = screen.getByText("Username is required");
    const passwordError = screen.getByText("Password is required");
    const confirmPasswordError = screen.getByText(
      "Confirm Password is required"
    );
    expect(userNameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
    expect(confirmPasswordError).toBeInTheDocument();
  });

  test("signup_should_validate_password_length_when_entering_a_password", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "123" } });

    // Check if the error message for password length is displayed
    const passwordError = screen.getByText(
      "Password must be at least 6 characters"
    );
    expect(passwordError).toBeInTheDocument();
  });

  test("signup_should_show_an_error_message_when_passwords_do_not_match", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });

    // Check if the error message for password match is displayed
    const confirmPasswordError = screen.getByText("Passwords do not match");
    expect(confirmPasswordError).toBeInTheDocument();
  });

  test("signup_make_an_axios_call_to_the_endpoint_with_valid_data", () => {
    const mockAxiosPost = jest.spyOn(axios, "post");

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Typing in the user name field should clear the error message
    const userNameInput = screen.getByPlaceholderText("UserName");
    fireEvent.change(userNameInput, { target: { value: "testuser" } });

    // Typing in the password field should clear the error message
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Typing in the confirm password field should clear the error message
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    const submitButton = screen.getByText("Submit", { selector: "button" });
    fireEvent.click(submitButton);

    // Use screen.queryByText to check if the elements are not present
    const userNameError = screen.queryByText("User Name is required");
    const passwordError = screen.queryByText("Password is required");
    const confirmPasswordError = screen.queryByText(
      "Confirm Password is required"
    );

    expect(userNameError).toBeNull(); // Null means the element was not found
    expect(passwordError).toBeNull(); // Null means the element was not found
    expect(confirmPasswordError).toBeNull(); // Null means the element was not found
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining("user/signup"),
      expect.any(Object)
    );

    // Make sure to clear the mock to avoid affecting other tests
    mockAxiosPost.mockRestore();
  });
});
describe("LoanForm Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("loanform_should_render_all_input_fields", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    const loanTypeInput = screen.getByPlaceholderText("Loan Type");
    const descriptionInput = screen.getByPlaceholderText("Loan Description");
    const interestRateInput = screen.getByPlaceholderText("Interest Rate");
    const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
    const addLoanButton = screen.getByText("Add Loan");

    expect(loanTypeInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(interestRateInput).toBeInTheDocument();
    expect(maxAmountInput).toBeInTheDocument();
    expect(addLoanButton).toBeInTheDocument();

    // You can add more specific assertions for each input field if needed
  });

  test("loanform_should_handle_adding_a_new_loan_with_validation", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    // Simulate user input for adding a new loan
    const loanTypeInput = screen.getByPlaceholderText("Loan Type");
    fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });

    const descriptionInput = screen.getByPlaceholderText("Loan Description");
    fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });

    const interestRateInput = screen.getByPlaceholderText("Interest Rate");
    fireEvent.change(interestRateInput, { target: { value: "5" } });

    const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
    fireEvent.change(maxAmountInput, { target: { value: "2000" } });

    const addLoanButton = screen.getByText("Add Loan");
    fireEvent.click(addLoanButton);

    // Your test assertions for adding a new loan with validation
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching("/loan/addLoan"),
      expect.any(Object)
    );
  });
  test("loanform_should_handle_adding_a_new_loan_with_successmessage", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    // Simulate user input for adding a new loan
    const loanTypeInput = screen.getByPlaceholderText("Loan Type");
    fireEvent.change(loanTypeInput, { target: { value: "Car Loan" } });

    const descriptionInput = screen.getByPlaceholderText("Loan Description");
    fireEvent.change(descriptionInput, { target: { value: "Loan for cars" } });

    const interestRateInput = screen.getByPlaceholderText("Interest Rate");
    fireEvent.change(interestRateInput, { target: { value: "5" } });

    const maxAmountInput = screen.getByPlaceholderText("Maximum Amount");
    fireEvent.change(maxAmountInput, { target: { value: "2000" } });

    const addLoanButton = screen.getByText("Add Loan");
    fireEvent.click(addLoanButton);

    // Your test assertions for adding a new loan with validation
   
    const successMessage = await screen.findByText("Successfully Added!");
    expect(successMessage).toBeInTheDocument();

  });
  test("loanform_should_handle_validation_errors_when_adding_a_new_loan", async () => {
    // Mock Axios to resolve as an error (status 400) to simulate validation error

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanForm />
        </BrowserRouter>
      );
    });

    // Simulate user input for adding a new loan with missing fields
    const addLoanButton = screen.getByText("Add Loan");
    fireEvent.click(addLoanButton);

    // Your test assertions for handling validation errors
    // For example, you can expect to find error messages on the screen
    const loanTypeError = screen.getByText("Loan Type is required");
    const descriptionError = screen.getByText("Description is required");
    const interestRateError = screen.getByText("Interest Rate is required");
    const maxAmountError = screen.getByText("Maximum Amount is required");
    expect(maxAmountError).toBeInTheDocument();
    expect(interestRateError).toBeInTheDocument();
    expect(descriptionError).toBeInTheDocument();
    expect(loanTypeError).toBeInTheDocument();
  });
});
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
  };
});

describe("LoanRequests Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockLoanRequestsData = [
    {
      _id: 1,
      userName: "User 1",
      loanType: "Loan 1",
      model: "2000-02-01",
      submissionDate: "2023-10-01",
      purchasePrice: 580000,
      income: 680000,
      address: "Address 1",
      loanStatus: 0,
      userId: 101,
    },
    {
      _id: 2,
      userName: "User 2",
      loanType: "Loan 2",
      model: "2002-02-01",
      submissionDate: "2023-10-02",
      purchasePrice: 60000,
      income: 70000,
      address: "Address 2",
      loanStatus: 1,
      userId: 102,
    },
    {
      _id: 3,
      userName: "User 3",
      loanType: "Loan 3",
      model: "2003-02-01",
      submissionDate: "2023-10-03",
      purchasePrice: 70000,
      income: 80000,
      address: "Address 3",
      loanStatus: 0,
      userId: 103,
    },
    {
      _id: 4,
      userName: "User 4",
      loanType: "Loan 4",
      model: "2004-02-01",
      submissionDate: "2023-10-04",
      purchasePrice: 80000,
      income: 90000,
      address: "Address 4",
      loanStatus: 1,
      userId: 104,
    },
    {
      _id: 5,
      userName: "User 5",
      loanType: "Loan 5",
      model: "2005-02-01",
      submissionDate: "2023-10-05",
      purchasePrice: 90000,
      income: 100000,
      address: "Address 5",
      loanStatus: 0,
      userId: 105,
    },
    {
      _id: 6,
      userName: "User 6",
      loanType: "Loan 6",
      model: "2006-02-01",
      submissionDate: "2023-10-06",
      purchasePrice: 100000,
      income: 110000,
      address: "Address 6",
      loanStatus: 1,
      userId: 106,
    },
    {
      _id: 7,
      userName: "User 7",
      loanType: "Loan 7",
      model: "2007-02-01",
      submissionDate: "2023-10-07",
      purchasePrice: 110000,
      income: 120000,
      address: "Address 7",
      loanStatus: 0,
      userId: 107,
    },
    {
      _id: 8,
      userName: "User 8",
      loanType: "Loan 8",
      model: "2008-02-01",
      submissionDate: "2023-10-08",
      purchasePrice: 120000,
      income: 130000,
      address: "Address 8",
      loanStatus: 1,
      userId: 108,
    },
  ];

  beforeAll(() => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should_render_loan_requests_component_with_loan_data", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("$580000")).toBeInTheDocument();
    expect(screen.getByText("$680000")).toBeInTheDocument();
    expect(screen.getByText("Loan 1")).toBeInTheDocument(); // Check for specific data
    expect(screen.getByText("User 1")).toBeInTheDocument(); // Check for specific data
    // Additional assertions for other headers and data rows
  });

  test('should_display_no_records_found_when_there_are_no_loan_requests', async () => {
    jest.spyOn(axios, "get").mockResolvedValue({ data: [], status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Oops! No records Found")).toBeInTheDocument();
  });

  test("loan_request_should_handle_loan_approval", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const approveButtons = screen.getByText("Approve", { selector: "button" });
    // const firstApproveButton = approveButtons[0];
    fireEvent.click(approveButtons);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringMatching(`/updateLoanApplication`),
      expect.any(Object)
    );
  });

  test("loan_request_should_handle_loan_reject", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const approveButtons = screen.getByText("Reject", { selector: "button" });
    // const firstApproveButton = approveButtons[0];
    fireEvent.click(approveButtons);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringMatching(`/updateLoanApplication`),
      expect.any(Object)
    );
  });

  test("loan_request_should_handle_search_input_change", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2023-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2023-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "User 3" } });

    expect(screen.getByText("User 3")).toBeInTheDocument();
    expect(screen.queryByText("User 1")).toBeNull(); // Check for specific data
    // Additional assertions for other rows
  });

  test("loan_request_should_handle_filter_change", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2023-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2023-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const filterSelect = screen.getByLabelText("Filter by Status:");
    fireEvent.change(filterSelect, { target: { value: "1" } });

    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 8")).toBeInTheDocument();
    expect(screen.queryByText("User 1")).toBeNull(); // Check for specific data
    // Additional assertions for other rows
  });

  test("loan_request_should_handle_sorting_ascending", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2020-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2024-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const ascendingSortButton = screen.getByText("⬆️");
    fireEvent.click(ascendingSortButton);
    expect(screen.getByText("Loan 5")).toBeInTheDocument();
    expect(screen.queryByText("User 8")).toBeNull(); // Check for specific data

    // Implement sorting assertions
    // Ensure data is sorted in ascending order
  });

  test("loan_request_should_handle_sorting_descending", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2020-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2024-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const ascendingSortButton = screen.getByText("⬇️");
    fireEvent.click(ascendingSortButton);
    expect(screen.getByText("Loan 8")).toBeInTheDocument();
    expect(screen.queryByText("User 5")).toBeNull(); // Check for specific data

    // Implement sorting assertions
    // Ensure data is sorted in ascending order
  });
  test("loan_request_should_show_address_on_button_click", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });
    expect(screen.queryByText("Address 1")).toBeNull(); // Check for specific data

    const ascendingSortButton = screen.getByText("Show Address");
    fireEvent.click(ascendingSortButton);
    expect(screen.getByText("Address: Address 1")).toBeInTheDocument();

    // Implement sorting assertions
    // Ensure data is sorted in ascending order
  });
  test("loan_request_pagination_next_button", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2020-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2024-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });
    expect(screen.getByText("User 5")).toBeInTheDocument();
    expect(screen.queryByText("User 6")).toBeNull(); // Check for specific data

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("User 6")).toBeInTheDocument();
    expect(screen.queryByText("User 5")).toBeNull();
  });
  test("loan_request_pagination_previous_button", async () => {
    const mockLoanRequestsData = [
      {
        _id: 1,
        userName: "User 1",
        loanType: "Loan 1",
        model: "2000-02-01",
        submissionDate: "2023-10-01",
        purchasePrice: 580000,
        income: 680000,
        address: "Address 1",
        loanStatus: 0,
        userId: 101,
      },
      {
        _id: 2,
        userName: "User 2",
        loanType: "Loan 2",
        model: "2002-02-01",
        submissionDate: "2023-10-02",
        purchasePrice: 60000,
        income: 70000,
        address: "Address 2",
        loanStatus: 1,
        userId: 102,
      },
      {
        _id: 3,
        userName: "User 3",
        loanType: "Loan 3",
        model: "2003-02-01",
        submissionDate: "2023-10-03",
        purchasePrice: 70000,
        income: 80000,
        address: "Address 3",
        loanStatus: 0,
        userId: 103,
      },
      {
        _id: 4,
        userName: "User 4",
        loanType: "Loan 4",
        model: "2004-02-01",
        submissionDate: "2023-10-04",
        purchasePrice: 80000,
        income: 90000,
        address: "Address 4",
        loanStatus: 1,
        userId: 104,
      },
      {
        _id: 5,
        userName: "User 5",
        loanType: "Loan 5",
        model: "2005-02-01",
        submissionDate: "2020-10-05",
        purchasePrice: 90000,
        income: 100000,
        address: "Address 5",
        loanStatus: 0,
        userId: 105,
      },
      {
        _id: 6,
        userName: "User 6",
        loanType: "Loan 6",
        model: "2006-02-01",
        submissionDate: "2023-10-06",
        purchasePrice: 100000,
        income: 110000,
        address: "Address 6",
        loanStatus: 1,
        userId: 106,
      },
      {
        _id: 7,
        userName: "User 7",
        loanType: "Loan 7",
        model: "2007-02-01",
        submissionDate: "2024-10-07",
        purchasePrice: 110000,
        income: 120000,
        address: "Address 7",
        loanStatus: 0,
        userId: 107,
      },
      {
        _id: 8,
        userName: "User 8",
        loanType: "Loan 8",
        model: "2008-02-01",
        submissionDate: "2023-10-08",
        purchasePrice: 120000,
        income: 130000,
        address: "Address 8",
        loanStatus: 1,
        userId: 108,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanRequests />
        </BrowserRouter>
      );
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("User 6")).toBeInTheDocument();
    expect(screen.queryByText("User 5")).toBeNull();

    const prevButton = screen.getByText("Prev");
    fireEvent.click(prevButton);

    expect(screen.getByText("User 5")).toBeInTheDocument();
    expect(screen.queryByText("User 6")).toBeNull(); // Check for specific data
  });
});

describe("Adminhomepage", () => {
  const queryClient = new QueryClient();
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("admin_home_page_displaying_data_in_the_grid", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    for (const loan of mockLoanRequestsData) {
      expect(screen.getByText(loan.loanType)).toBeInTheDocument();
      expect(screen.getByText("$" + loan.maximumAmount)).toBeInTheDocument();
      expect(screen.getByText(`${loan.interestRate}%`)).toBeInTheDocument();
      expect(screen.getByText(loan.description)).toBeInTheDocument();
    }
  });
  test("admin_home_page_filters_loans_based_on_search_input", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
      {
        _id: "6",
        loanType: "Mortgage Loan",
        maximumAmount: 100000,
        interestRate: 3.5,
        description: "Your dream home awaits.",
      },
      {
        _id: "7",
        loanType: "Credit Card Loan",
        maximumAmount: 5000,
        interestRate: 15,
        description: "Convenient credit card loan.",
      },
      {
        _id: "8",
        loanType: "Emergency Loan",
        maximumAmount: 1000,
        interestRate: 10,
        description: "Get quick financial help.",
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Type 'Car' into the search input
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Car" } });

    // Assert that 'Car Loan' should be displayed, but 'Home Loan' should not
    expect(screen.getByText("Car Loan")).toBeInTheDocument();
    expect(screen.queryByText("Home Loan")).toBeNull();
  });
  test("admin_home_page_displaying_the_required_buttons", async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Assert that the "Create New" button is present
    const createNewButton = screen.getByText("Create New", {
      selector: "button",
    });
    expect(createNewButton).toBeInTheDocument();

    // Assert that the "Loans Requested" button is present
    const loansRequestedButton = screen.getByText("Loans Requested", {
      selector: "button",
    });
    expect(loansRequestedButton).toBeInTheDocument();

    // Assert that the "Logout" button is present
    const logoutButton = screen.getByText("Logout", { selector: "button" });
    expect(logoutButton).toBeInTheDocument();
  });
  test("admin_home_page_sort_loans_in_ascending_order", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 13,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 1,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 27,
        description: "Grow your business.",
      },
      // Add more data here...
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Click the ascending sort button
    const ascendingSortButton = screen.getByText("⬆️");
    fireEvent.click(ascendingSortButton);

    // Check if the data is sorted in ascending order
    // Check if the data is sorted in ascending order
    const sortedLoanTypes = screen.getAllByRole("cell");
    expect(sortedLoanTypes[0]).toHaveTextContent("Education Loan");
    // Add more assertions for other data fields as needed...
  });

  test("admin_home_page_sort_loans_in_descending_order", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 13,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 1,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 27,
        description: "Grow your business.",
      },
      // Add more data here...
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Click the ascending sort button
    const ascendingSortButton = screen.getByText("⬇️");
    fireEvent.click(ascendingSortButton);

    // Check if the data is sorted in ascending order
    // Check if the data is sorted in ascending order
    const sortedLoanTypes = screen.getAllByRole("cell");
    expect(sortedLoanTypes[0]).toHaveTextContent("Business Loan");
    // Add more assertions for other data fields as needed...
  });

  test("admin_home_page_pagination_next_button", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
      {
        _id: "6",
        loanType: "Mortgage Loan",
        maximumAmount: 100000,
        interestRate: 3.5,
        description: "Your dream home awaits.",
      },
      {
        _id: "7",
        loanType: "Credit Card Loan",
        maximumAmount: 5000,
        interestRate: 15,
        description: "Convenient credit card loan.",
      },
      {
        _id: "8",
        loanType: "Emergency Loan",
        maximumAmount: 1000,
        interestRate: 10,
        description: "Get quick financial help.",
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Type 'Car' into the search input
    expect(screen.getByText("Business Loan")).toBeInTheDocument();
    expect(screen.queryByText("Mortgage Loan")).toBeNull(); // Check for specific data

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Mortgage Loan")).toBeInTheDocument();
    expect(screen.queryByText("Business Loan")).toBeNull();
  });

  test("admin_home_page_pagination_previous_button", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
      {
        _id: "6",
        loanType: "Mortgage Loan",
        maximumAmount: 100000,
        interestRate: 3.5,
        description: "Your dream home awaits.",
      },
      {
        _id: "7",
        loanType: "Credit Card Loan",
        maximumAmount: 5000,
        interestRate: 15,
        description: "Convenient credit card loan.",
      },
      {
        _id: "8",
        loanType: "Emergency Loan",
        maximumAmount: 1000,
        interestRate: 10,
        description: "Get quick financial help.",
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Type 'Car' into the search input
    expect(screen.getByText("Business Loan")).toBeInTheDocument();
    expect(screen.queryByText("Mortgage Loan")).toBeNull(); // Check for specific data

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Mortgage Loan")).toBeInTheDocument();
    expect(screen.queryByText("Business Loan")).toBeNull();

    const prevButton = screen.getByText("Prev");
    fireEvent.click(prevButton);

    expect(screen.getByText("Business Loan")).toBeInTheDocument();
    expect(screen.queryByText("Mortgage Loan")).toBeNull();
  });
  it("should_trigger_edit_action_when_edit_button_is_clicked", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
      {
        _id: "6",
        loanType: "Mortgage Loan",
        maximumAmount: 100000,
        interestRate: 3.5,
        description: "Your dream home awaits.",
      },
      {
        _id: "7",
        loanType: "Credit Card Loan",
        maximumAmount: 5000,
        interestRate: 15,
        description: "Convenient credit card loan.",
      },
      {
        _id: "8",
        loanType: "Emergency Loan",
        maximumAmount: 1000,
        interestRate: 10,
        description: "Get quick financial help.",
      },
    ];
    const navigate = jest.fn();

    axios.get.mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    // Mock the useNavigate function
 
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Click the "Edit" button for the first loan
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
  

    // Check if it navigated to the correct URL
  });
  it("should_trigger_delete_action_when_delete_button_is_clicked", async () => {
    let mockLoanRequestsData = [
      {
        _id: "1",
        loanType: "Car Loan",
        maximumAmount: 10000,
        interestRate: 5,
        description: "Low-interest car loan.",
      },
      {
        _id: "2",
        loanType: "Home Loan",
        maximumAmount: 50000,
        interestRate: 3,
        description: "Affordable home loan.",
      },
      {
        _id: "3",
        loanType: "Personal Loan",
        maximumAmount: 15000,
        interestRate: 6,
        description: "Flexible personal loan.",
      },
      {
        _id: "4",
        loanType: "Education Loan",
        maximumAmount: 25000,
        interestRate: 4,
        description: "Support your education.",
      },
      {
        _id: "5",
        loanType: "Business Loan",
        maximumAmount: 75000,
        interestRate: 7,
        description: "Grow your business.",
      },
      {
        _id: "6",
        loanType: "Mortgage Loan",
        maximumAmount: 100000,
        interestRate: 3.5,
        description: "Your dream home awaits.",
      },
      {
        _id: "7",
        loanType: "Credit Card Loan",
        maximumAmount: 5000,
        interestRate: 15,
        description: "Convenient credit card loan.",
      },
      {
        _id: "8",
        loanType: "Emergency Loan",
        maximumAmount: 1000,
        interestRate: 10,
        description: "Get quick financial help.",
      },
    ];

    axios.get.mockResolvedValue({ data: mockLoanRequestsData, status: 200 });

    // Create a mock function for axios.delete
    const mockDelete = jest.fn();
    axios.delete.mockImplementation(mockDelete);

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      );
    });

    // Click the "Delete" button for the first loan
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    
    expect(
      screen.getByText("Are you sure you want to delete?")
    ).toBeInTheDocument();
    const deletbutton = screen.getByText("Yes, Delete");
    fireEvent.click(deletbutton);
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringMatching(`loan/deleteLoan`),
    );
  });
});
describe("LoanApplicationForm Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loan_application_should_render_the_form_correctly", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanApplicationForm />
        </BrowserRouter>
      );
    });
  
    const incomeInput = screen.getByLabelText("Income:");
    const modelInput = screen.getByLabelText("Model:");
    const purchasePriceInput = screen.getByLabelText("Purchase Price:");
    const addressInput = screen.getByLabelText("Address:");
    const submitButton = screen.getByText("Submit");
  
    expect(incomeInput).toBeInTheDocument();
    expect(modelInput).toBeInTheDocument();
    expect(purchasePriceInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  test("loan_application_should_display_error_messages_on_form_submission_with_empty_fields", async () => {

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanApplicationForm />
        </BrowserRouter>
      );
    });    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const incomeError = screen.getByText("Income is required");
    const modelError = screen.getByText("Model is required");
    const purchasePriceError = screen.getByText("Purchase Price is required");
    const addressError = screen.getByText("Address is required");

    expect(incomeError).toBeInTheDocument();
    expect(modelError).toBeInTheDocument();
    expect(purchasePriceError).toBeInTheDocument();
    expect(addressError).toBeInTheDocument();
  });

  test("loan_application_should_handle_successful_form_submission", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanApplicationForm />
        </BrowserRouter>
      );
    });
    const incomeInput = screen.getByLabelText("Income:");
    const modelInput = screen.getByLabelText("Model:");
    const purchasePriceInput = screen.getByLabelText("Purchase Price:");
    const addressInput = screen.getByLabelText("Address:");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(incomeInput, { target: { value: "50000" } });
    fireEvent.change(modelInput, { target: { value: "2023-11-15" } });
    fireEvent.change(purchasePriceInput, { target: { value: "60000" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching("/loanApplication/addLoanApplication"),
      expect.any(Object)
    );
  });
  test("loan_application_should_handle_successful_message_after_form_submission", async () => {
    axios.post.mockResolvedValue({ status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <LoanApplicationForm />
        </BrowserRouter>
      );
    });
    const incomeInput = screen.getByLabelText("Income:");
    const modelInput = screen.getByLabelText("Model:");
    const purchasePriceInput = screen.getByLabelText("Purchase Price:");
    const addressInput = screen.getByLabelText("Address:");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(incomeInput, { target: { value: "50000" } });
    fireEvent.change(modelInput, { target: { value: "2023-11-15" } });
    fireEvent.change(purchasePriceInput, { target: { value: "60000" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if the success message is displayed
    const successMessage = await screen.findByText("Successfully Added!");
    expect(successMessage).toBeInTheDocument();
  });
 test('loan_application_should_handle_navigation_to_availableloan_page', async () => {
    // const navigateMock = jest.fn();
    // jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    // Create a promise to wait for the state update
    const promise = Promise.resolve();
    await act(async () => {
      render(
        <BrowserRouter>
          <LoanApplicationForm />
        </BrowserRouter>
      );
    });

    // Simulate clicking the "Back" button
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    // expect(navigateMock).toHaveBeenCalledWith('/availableloan');
  });



});

describe("userhomepage_component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should_render_userhomepage_component_with_loan_data", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();

    // Check if the table is rendered
    const availableLoansTable = screen.getByRole("table");
    expect(availableLoansTable).toBeInTheDocument();

    // Check if the loan data is displayed
    const loanTypeCell = screen.getByText("Flight");
    const loanDescriptionCell = screen.getByText("Loan 1");
    const maximumAmountCell = screen.getByText("$1000");
    const interestRateCell = screen.getByText("5%");
    // const applyButton = screen.getByText('Apply');
    expect(loanTypeCell).toBeInTheDocument();
    expect(loanDescriptionCell).toBeInTheDocument();
    expect(maximumAmountCell).toBeInTheDocument();
    expect(interestRateCell).toBeInTheDocument();
  });
  test("userhomepage_component_displayed_only_5_data", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();

    // Check if the table is rendered
    const availableLoansTable = screen.getByRole("table");
    expect(availableLoansTable).toBeInTheDocument();
    const sixthelem = screen.queryByText("Loan 6");
    const fifthele = screen.queryByText("Loan 5");

    expect(sixthelem).toBeNull();
    expect(fifthele).toBeInTheDocument();
  });
  test("userhomepage_component_descending_sort", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
      {
        id: 9,
        description: "Loan 9",
        maximumAmount: 12000,
        interestRate: 1,
        loanType: "Cycle",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });
    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();
    const sixthelem = screen.queryByText("16%");
    expect(sixthelem).toBeNull();
    const descendingButton = screen.getByText("⬇️");
    fireEvent.click(descendingButton);
    expect(descendingButton).toBeInTheDocument();
    const sixthelem2 = screen.getByText("16%");
    expect(sixthelem2).toBeInTheDocument();
    const element = screen.queryByText("1%");
    expect(element).toBeNull();
  });
  test("userhomepage_component_ascending_sort", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
      {
        id: 9,
        description: "Loan 9",
        maximumAmount: 12000,
        interestRate: 1,
        loanType: "Cycle",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });
    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();
    const sixthelem = screen.queryByText("1%");
    expect(sixthelem).toBeNull();
    const descendingButton = screen.getByText("⬆️");
    fireEvent.click(descendingButton);
    expect(descendingButton).toBeInTheDocument();
    const sixthelem2 = screen.getByText("1%");
    expect(sixthelem2).toBeInTheDocument();
    const element = screen.queryByText("16%");
    expect(element).toBeNull();
  });
  test("userhomepage_component_pagination_next_button", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
      {
        id: 9,
        description: "Loan 9",
        maximumAmount: 12000,
        interestRate: 1,
        loanType: "Cycle",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });
    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();
    const sixthelem = screen.queryByText("Loan 9");
    expect(sixthelem).toBeNull();
    const pagination = screen.getByText("Next");
    fireEvent.click(pagination);
    expect(pagination).toBeInTheDocument();
    const sixthelem2 = screen.getByText("Loan 9");
    expect(sixthelem2).toBeInTheDocument();
    const pageDisplay = screen.getByText("Page 2 of 2");
    expect(pageDisplay).toBeInTheDocument();
  });
  test("userhomepage_component_pagination_previous_button", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
      {
        id: 9,
        description: "Loan 9",
        maximumAmount: 12000,
        interestRate: 1,
        loanType: "Cycle",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });
    // Check if the component renders successfully
    expect(screen.getByText("Available Vechile Loans")).toBeInTheDocument();
    const sixthelem = screen.queryByText("Loan 9");
    expect(sixthelem).toBeNull();
    const pagination = screen.getByText("Next");
    fireEvent.click(pagination);
    expect(pagination).toBeInTheDocument();
    const sixthelem2 = screen.getByText("Loan 9");
    expect(sixthelem2).toBeInTheDocument();
    const pageDisplay = screen.getByText("Page 2 of 2");
    expect(pageDisplay).toBeInTheDocument();
    const pagination2 = screen.getByText("Prev");
    fireEvent.click(pagination2);
    const sixthelem3 = screen.getByText("Loan 1");
    expect(sixthelem3).toBeInTheDocument();
    const pageDisplay1 = screen.getByText("Page 1 of 2");
    expect(pageDisplay1).toBeInTheDocument();
  });
  test("userhomepage_component_search_functionality", async () => {
    // Mock data for available loans
    const mockAvailableLoansData = [
      {
        id: 1,
        description: "Loan 1",
        maximumAmount: 1000,
        interestRate: 9,
        loanType: "Flight",
      },
      {
        id: 2,
        description: "Loan 2",
        maximumAmount: 29000,
        interestRate: 5,
        loanType: "Car",
      },

      {
        id: 3,
        description: "Loan 3",
        maximumAmount: 21000,
        interestRate: 3,
        loanType: "Boat",
      },
      {
        id: 4,
        description: "Loan 4",
        maximumAmount: 16000,
        interestRate: 2,
        loanType: "Motorcycle",
      },
      {
        id: 5,
        description: "Loan 5",
        maximumAmount: 14000,
        interestRate: 4,
        loanType: "Bike",
      },
      {
        id: 6,
        description: "Loan 6",
        maximumAmount: 13000,
        interestRate: 8,
        loanType: "Bus",
      },
      {
        id: 7,
        description: "Loan 7",
        maximumAmount: 11000,
        interestRate: 7,
        loanType: "Train",
      },
      {
        id: 8,
        description: "Loan 8",
        maximumAmount: 12000,
        interestRate: 16,
        loanType: "Truck",
      },
      {
        id: 9,
        description: "Loan 9",
        maximumAmount: 12000,
        interestRate: 1,
        loanType: "Cycle",
      },
    ];

    // Mock the axios.get function for fetching loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAvailableLoansData, status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <UserHomePage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });
    // Check if the component renders successfully
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Car" } });

    // Assertions for filtered loans based on search value
    const carLoanTypeCell = screen.getByText("Car");
    expect(carLoanTypeCell).toBeInTheDocument();
    const flightLoanTypeCell = screen.queryByText("Flight");
    expect(flightLoanTypeCell).not.toBeInTheDocument();
  });
  test("should_render_userhomepage_component_with_buttons", () => {
    render(
      <BrowserRouter>
        <UserHomePage />
      </BrowserRouter>
    );

    // Check if the "View Applied Loan" button is present
    const viewAppliedLoanButton = screen.getByText("View Applied Loan");
    expect(viewAppliedLoanButton).toBeInTheDocument();

    // Check if the "Logout" button is present
    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();
  });
});
describe("AppliedLoansPage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockAppliedLoansData = [
    {
      _id: 1,
      loanType: "Loan 1",
      submissionDate: "2023-10-01",
      loanStatus: 0,
    },
    {
      _id: 2,
      loanType: "Loan 2",
      submissionDate: "2023-10-02",
      loanStatus: 1,
    },
    {
      _id: 3,
      loanType: "Loan 3",
      submissionDate: "2023-10-03",
      loanStatus: 0,
    },
    {
      _id: 4,
      loanType: "Loan 4",
      submissionDate: "2023-10-04",
      loanStatus: 1,
    },
    {
      _id: 5,
      loanType: "Loan 5",
      submissionDate: "2023-10-05",
      loanStatus: 0,
    },
    {
      _id: 6,
      loanType: "Loan 6",
      submissionDate: "2023-10-09",
      loanStatus: 1,
    },
    {
      _id: 7,
      loanType: "Loan 7",
      submissionDate: "2023-10-09",
      loanStatus: 1,
    },
  ];

  beforeAll(() => {
    // Mock the axios.get function for fetching applied loan data
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });
  });

  afterAll(() => {
    // Restore the original axios.get implementation
    jest.restoreAllMocks();
  });

  test("should_render_applied_loans_page_component_with_loan_data", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Applied Loans")).toBeInTheDocument();
    expect(screen.getByText("Loan 1")).toBeInTheDocument();
    expect(screen.getByText("Loan 2")).toBeInTheDocument();
    // Additional assertions for other rows
  });

  test('should_display_no_records_found_when_there_are_no_applied_loans', async () => {
    // Mock data for applied loans (empty)
    jest.spyOn(axios, "get").mockResolvedValue({ data: [], status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("No Records Found")).toBeInTheDocument();
  });

  test("should_sort_applied_loans_in_ascending_order", async () => {
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    const ascendingButton = screen.getByText("⬆️");
    fireEvent.click(ascendingButton);

    expect(screen.getByText("Loan 1")).toBeInTheDocument();
    expect(screen.queryByText("Loan 6")).toBeNull();
    // Additional assertions for other rows in ascending order
  });

  test("should_sort_applied_loans_in_descending_order", async () => {
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 8,
        loanType: "Loan 8",
        submissionDate: "2023-10-12",
        loanStatus: 0,
      },
    ];
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    const descendingButton = screen.getByText("⬇️");
    fireEvent.click(descendingButton);

    expect(screen.getByText("Loan 8")).toBeInTheDocument();
    expect(screen.queryByText("Loan 1")).toBeNull();

    // Additional assertions for other rows in descending order
  });

  test("should_navigate_to_the_next_page_in_pagination", async () => {
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("Loan 6")).toBeInTheDocument();
    // Additional assertions for other rows on the next page
  });

  test("should_navigate_to_the_previous_page_in_pagination", async () => {
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.queryByText("Loan 1")).toBeNull();

    const previousButton = screen.getByText("Prev");
    fireEvent.click(previousButton);

    expect(screen.getByText("Loan 1")).toBeInTheDocument();
    // Additional assertions for other rows on the previous page
  });

  test("should_filter_applied_loans_based_on_search_input", async () => {
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Loan 3" } });

    expect(screen.getByText("Loan 3")).toBeInTheDocument();
    expect(screen.queryByText("Loan 1")).toBeNull();
    // Additional assertions for other rows
  });



  test("should_handle_applied_loan_deletion", async () => {
    // Mock the axios.get function for fetching loan data
    const mockAppliedLoansData = [
      {
        _id: 1,
        loanType: "Loan 1",
        submissionDate: "2023-10-01",
        loanStatus: 0,
      },
      {
        _id: 2,
        loanType: "Loan 2",
        submissionDate: "2023-10-02",
        loanStatus: 1,
      },
      {
        _id: 3,
        loanType: "Loan 3",
        submissionDate: "2023-10-03",
        loanStatus: 0,
      },
      {
        _id: 4,
        loanType: "Loan 4",
        submissionDate: "2023-10-04",
        loanStatus: 1,
      },
      {
        _id: 5,
        loanType: "Loan 5",
        submissionDate: "2023-10-05",
        loanStatus: 0,
      },
      {
        _id: 6,
        loanType: "Loan 6",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
      {
        _id: 7,
        loanType: "Loan 7",
        submissionDate: "2023-10-09",
        loanStatus: 1,
      },
    ];

    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: mockAppliedLoansData, status: 200 });

    // Mock the axios.delete function for deleting a loan
    jest.spyOn(axios, "delete").mockResolvedValue({ status: 200 });

    // Create a promise to wait for the state update
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <BrowserRouter>
          <AppliedLoansPage />
        </BrowserRouter>
      );
      await promise; // Wait for the promise to resolve
    });

    // Simulate clicking the "Delete" button for the first loan
    const deleteButtons = screen.getAllByText("Delete", { exact: false });
    const firstDeleteButton = deleteButtons[0];
    fireEvent.click(firstDeleteButton);

    // Check if the delete confirmation popup is displayed
    const deletePopup = screen.getByText("Are you sure you want to delete?");
    expect(deletePopup).toBeInTheDocument();

    // Simulate confirming the delete
    const confirmDeleteButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmDeleteButton);

    // Check if the axios.delete function was called with the correct URL
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringMatching(`loanApplication/deleteLoanApplication/`)
    );
  });
});
