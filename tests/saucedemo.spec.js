const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';

let loginCredentials;
const loginPassword = 'secret_sauce'; // Static password

// Extract credentials
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);

    // Extract usernames listed under #login_credentials
    loginCredentials = await page.$eval('#login_credentials', (element) => {
        // Get the raw HTML content and clean it
        const content = element.innerHTML;
    
        // Remove the <h4> tag (heading) from the content
        const cleanedContent = content.replace(/<h4>.*?<\/h4>/, '');
    
        // Split by <br> tags, clean up, and exclude empty entries
        const users = cleanedContent.split(/<br\s*\/?>/)
            .map(item => item.trim()) // Trim whitespace
            .filter(item => item && item !== 'Accepted usernames are:'); // Remove empty items and the heading
    
        return users;
    });

    // Fallback for missing credentials
    if (!loginCredentials || loginCredentials.length < 2) {
        loginCredentials = ['standard_user', 'locked_out_user']; // Default credentials
    }

    await context.close();
});

// Test 1: Successful Login
test('Successful login with valid credentials', async ({ page }) => {
    const username = loginCredentials[0]; // First user
    const password = loginPassword;

    await page.goto(BASE_URL);
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    console.log('Login successful.');
});

// Test 2: Failed Login
test('Failed login with invalid credentials', async ({ page }) => {
    const username = loginCredentials[1]; // Second user
    const password = loginPassword;

    await page.goto(BASE_URL);
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    const errorMsg = await page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText(/Epic sadface/);
    console.log('Failed login error message displayed correctly.');
});

// Test 3: Cart operations and checkout
test('Cart operations and checkout', async ({ page }) => {
    const username = loginCredentials[0]; // First user
    const password = loginPassword;

    await page.goto(BASE_URL);
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');

    // Sort items by price (high to low)
    await page.selectOption('.product_sort_container', 'hilo');

    // Add first two items to cart (most expensive)
    await page.locator('.inventory_item').nth(0).locator('.btn_primary').click();
    await page.locator('.inventory_item').nth(1).locator('.btn_primary').click();

    // Sort items by price (low to high)
    await page.selectOption('.product_sort_container', 'lohi');

    // Add first two items to cart (least expensive)
    await page.locator('.inventory_item').nth(0).locator('.btn_primary').click();
    await page.locator('.inventory_item').nth(1).locator('.btn_primary').click();

    // Navigate to cart
    await page.click('.shopping_cart_link');

    // Remove the second most expensive and second least expensive items
    await page.locator('.cart_item').nth(1).locator('.cart_button').click();
    await page.locator('.cart_item').nth(2).locator('.cart_button').click();

    // Checkout process
    await page.click('#checkout');
    await page.fill('#first-name', 'TestFirstName');
    await page.fill('#last-name', 'TestLastName');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await page.click('#finish');

    // Verify checkout complete
    const confirmationMessage = await page.locator('.complete-header');
    const textContent = await confirmationMessage.textContent();
    await expect(textContent?.toLowerCase()).toBe('thank you for your order!');
    console.log('Checkout process completed successfully.');
});
