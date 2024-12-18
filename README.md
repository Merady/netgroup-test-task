# Playwright Test Automation for Saucedemo

This project contains automated tests for the [Saucedemo](https://www.saucedemo.com) website using Playwright. The tests cover scenarios such as logging in with valid and invalid credentials, performing cart operations, and completing the checkout process.

## Tools Used

- **Playwright**: A Node.js library to automate browsers for testing purposes.
- **Jest (via Playwright Test)**: Playwright Test is a built-in test runner for Playwright that provides rich assertions and test-running capabilities.
- **Node.js**: The JavaScript runtime used to execute the tests and manage dependencies.

## Prerequisites

Before running the tests, make sure you have the following installed on your system:

1. **Node.js** (version 16 or later)
   - [Download Node.js](https://nodejs.org/)
   
2. **Git** (optional, for cloning the repository)
   - [Download Git](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/Merady/netgroup-test-task.git
cd netgroup-test-task
```

### 2. Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

This will install Playwright and other required packages.

### 3. Running Tests

To run the tests, you can execute the following command:

```bash
npx playwright test
```

This will run all the tests in the project.

### 4. Running Specific Test

If you want to run a specific test, use the `--test` flag:

```bash
npx playwright test <test-name>.spec.js
```

For example, to run the test for successful login:

```bash
npx playwright test successful-login.spec.js
```

### 5. View Test Results

Once the tests complete, you will see the results in the terminal. Playwright will output detailed information about which tests passed and which failed.

### 6. Customizing Credentials

By default, the test extracts credentials (usernames) from the `#login_credentials` element on the Saucedemo login page. If the credentials extraction fails or you wish to change the default credentials, the script will use the fallback credentials: `['standard_user', 'locked_out_user']`.

If you want to modify the credentials for the test, you can do so directly in the test file, specifically in the `beforeAll` hook.

## Project Structure

```
/netgroup-test-task
  ├── /tests
  │   ├── saucedemo.spec.js
  ├── package.json
  ├── playwright.config.js
  └── README.md
```

- **/tests**: Contains all test files.
- **package.json**: Contains dependencies and scripts.
- **playwright.config.js**: Playwright configuration file (optional).


## Additional Commands

### Headless Mode

By default, Playwright runs in headless mode (without opening the browser window). To run tests in a visible browser window, add the `--headed` flag:

```bash
npx playwright test --headed
```

### Running Tests in Parallel

Playwright can run tests in parallel for faster execution. To run tests in parallel, simply run:

```bash
npx playwright test --workers=4
```

This will run tests across 4 workers in parallel.

## Troubleshooting

- **Error: "Browser not found"**:
  - Ensure you have installed the necessary browser binaries by running `npx playwright install`.
  
- **Error: "Test failed due to selector not found"**:
  - Make sure the selector you are targeting is correct and available on the page.