# Testing Best Practices for LLMs

## Overview

This document provides comprehensive testing best practices for Large Language Models (LLMs) when writing, reviewing, or generating code. Follow these guidelines to ensure robust, maintainable, and reliable software.

## Testing Pyramid & Strategy

### 1. Test Distribution (70/20/10 Rule)

- **70% Unit Tests**: Fast, isolated, focused on single units of code
- **20% Integration Tests**: Test component interactions and data flow
- **10% End-to-End Tests**: Full system workflows and user journeys

### 2. Test-Driven Development (TDD)

Always follow the Red-Green-Refactor cycle:

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve code while keeping tests green

## Unit Testing

### Core Principles

- **Single Responsibility**: Each test should verify one specific behavior
- **Isolation**: Tests should not depend on external systems or other tests
- **Fast Execution**: Unit tests should run in milliseconds
- **Deterministic**: Same input should always produce same output

### Best Practices

#### Test Structure (AAA Pattern)

```ruby
# Arrange: Set up test data and conditions
let(:user) { create(:user, email: 'test@example.com') }

# Act: Execute the behavior being tested
result = user.validate_email

# Assert: Verify the expected outcome
expect(result).to be_truthy
```

#### Naming Conventions

- Use descriptive test names that explain the scenario
- Follow the pattern: `context "when [condition]" do it "should [expected behavior]" end`
- Be explicit about edge cases and error conditions

```ruby
describe UserValidator do
  context "when email is valid" do
    it "returns true for properly formatted email" do
      # test implementation
    end
  end

  context "when email is invalid" do
    it "returns false for malformed email address" do
      # test implementation
    end
  end
end
```

#### Mock and Stub Guidelines

- **Mock external dependencies**: APIs, databases, file systems
- **Don't mock the system under test**: Only mock collaborators
- **Use stubs for queries**: When you need specific return values
- **Use mocks for commands**: When you need to verify interactions

```ruby
# Good: Mock external service
allow(EmailService).to receive(:send).and_return(true)

# Good: Stub for specific return value
allow(user).to receive(:premium?).and_return(true)

# Bad: Mocking the object under test
allow(user).to receive(:validate).and_return(true)
```

#### Edge Cases to Always Test

- **Null/nil values**: How does code handle missing data?
- **Empty collections**: Arrays, hashes, strings
- **Boundary conditions**: Min/max values, first/last elements
- **Invalid inputs**: Wrong types, malformed data
- **Error conditions**: Network failures, permission denied

## Integration Testing

### Purpose

Test how multiple components work together without testing the entire system.

### Focus Areas

- **Database interactions**: CRUD operations, transactions, constraints
- **API integrations**: HTTP clients, message queues, external services
- **Module boundaries**: How different parts of your application communicate
- **Configuration**: Environment-specific settings and dependencies

### Best Practices

#### Database Testing

```ruby
describe UserRepository do
  context "when saving user with duplicate email" do
    it "raises unique constraint violation" do
      create(:user, email: 'test@example.com')

      expect {
        described_class.create(email: 'test@example.com')
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
```

#### API Integration Testing

```ruby
describe WeatherApiClient do
  it "handles API timeout gracefully" do
    stub_request(:get, /weather-api/)
      .to_timeout

    result = described_class.get_weather('London')

    expect(result).to be_nil
    expect(Rails.logger).to have_received(:error)
  end
end
```

## End-to-End (E2E) Testing

### Purpose

Validate complete user workflows and system behavior from the user's perspective.

### When to Write E2E Tests

- **Critical user journeys**: Registration, payment, core features
- **Cross-system workflows**: Multi-service interactions
- **UI/UX validation**: Visual and interaction testing
- **Deployment verification**: Smoke tests for production releases

### Best Practices

#### Focus on User Stories

```gherkin
Feature: User Registration
  Scenario: New user signs up successfully
    Given I am on the registration page
    When I fill in valid user details
    And I submit the registration form
    Then I should see a welcome message
    And I should receive a confirmation email
```

#### Keep Tests Stable

- **Use reliable selectors**: Prefer data attributes over CSS classes
- **Add explicit waits**: Don't rely on implicit timing
- **Make tests independent**: Each test should set up its own data
- **Clean up after tests**: Reset state between test runs

#### Data Management

```javascript
// Good: Use test-specific data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  name: 'Test User'
}

// Bad: Hard-coded data that might conflict
const testUser = {
  email: 'test@example.com',
  name: 'Test User'
}
```

## Contract Testing

### Purpose

Verify that APIs and services meet their documented contracts and that consumers can integrate successfully.

### Types of Contract Testing

#### Provider Contracts

Test that your API provides what it promises:

```ruby
describe "GET /users/:id" do
  it "returns user data in expected format" do
    user = create(:user)

    get "/users/#{user.id}"

    expect(response).to have_http_status(:ok)
    expect(response.body).to match_json_schema('user')
    expect(parsed_response).to include(
      'id' => user.id,
      'email' => user.email,
      'created_at' => be_present
    )
  end
end
```

#### Consumer Contracts (Pact Testing)

Verify that your service can consume external APIs correctly:

```ruby
describe PaymentServiceClient, pact: true do
  before do
    PaymentService.given('payment exists')
      .upon_receiving('a request for payment details')
      .with(method: :get, path: '/payments/123')
      .will_respond_with(
        status: 200,
        body: { id: 123, amount: 1000, status: 'paid' }
      )
  end

  it 'can retrieve payment details' do
    payment = PaymentServiceClient.get_payment(123)
    expect(payment.amount).to eq(1000)
  end
end
```

### Schema Validation

Always validate API responses against schemas:

```json
{
  "type": "object",
  "required": ["id", "email", "created_at"],
  "properties": {
    "id": { "type": "integer" },
    "email": { "type": "string", "format": "email" },
    "created_at": { "type": "string", "format": "date-time" }
  }
}
```

## Performance Testing

### Load Testing

Verify system behavior under expected traffic:

```ruby
describe "API performance" do
  it "handles 100 concurrent requests within acceptable time" do
    threads = []
    start_time = Time.now

    100.times do
      threads << Thread.new do
        get '/api/users'
        expect(response).to have_http_status(:ok)
      end
    end

    threads.each(&:join)
    total_time = Time.now - start_time

    expect(total_time).to be < 5.seconds
  end
end
```

### Stress Testing

Test system limits and failure modes:

- **Memory usage**: Monitor for memory leaks
- **Database connections**: Test connection pool limits
- **Response times**: Ensure graceful degradation under load

## Security Testing

### Input Validation

```ruby
describe "SQL injection protection" do
  it "sanitizes user input in search queries" do
    malicious_input = "'; DROP TABLE users; --"

    expect {
      UserService.search(malicious_input)
    }.not_to change { User.count }
  end
end
```

### Authentication & Authorization

```ruby
describe "access control" do
  context "when user is not authenticated" do
    it "redirects to login page" do
      get '/admin/dashboard'
      expect(response).to redirect_to(login_path)
    end
  end

  context "when user lacks required permissions" do
    it "returns 403 forbidden" do
      login_as(create(:user, role: :basic))
      get '/admin/dashboard'
      expect(response).to have_http_status(:forbidden)
    end
  end
end
```

## Test Data Management

### Test Data Locality

**Test Data Locality** is the principle that test data should be defined as close as possible to where it's used, making tests self-contained and easier to understand.

#### Core Principles

1. **Data Near Usage**: Define test data in the same test or test block where it's used
2. **Explicit Dependencies**: Make data dependencies obvious and traceable
3. **Minimal Scope**: Limit data visibility to only where it's needed
4. **Self-Documenting**: Test data should explain the test scenario

#### Good Examples

```ruby
# Good: Data defined locally in the test
describe UserService do
  describe '#send_welcome_email' do
    it 'sends email to newly registered users' do
      # Data is local and explains the test scenario
      new_user = create(:user,
        email: 'newbie@example.com',
        registration_date: 1.day.ago,
        email_verified: true
      )

      expect(EmailService).to receive(:send_welcome_email).with(new_user)
      UserService.send_welcome_email(new_user)
    end

    it 'skips email for unverified users' do
      # Different scenario, different data - locally defined
      unverified_user = create(:user,
        email: 'unverified@example.com',
        email_verified: false
      )

      expect(EmailService).not_to receive(:send_welcome_email)
      UserService.send_welcome_email(unverified_user)
    end
  end
end
```

```javascript
// Good: Test-specific data that explains the scenario
describe('Shopping Cart', () => {
  it('calculates total with discount for premium users', () => {
    // Data is local and self-explanatory
    const premiumUser = {
      id: 1,
      type: 'premium',
      discountRate: 0.15
    }

    const cartItems = [
      { name: 'Laptop', price: 1000 },
      { name: 'Mouse', price: 50 }
    ]

    const cart = new ShoppingCart(premiumUser, cartItems)
    expect(cart.getTotal()).toBe(892.5) // 1050 - 15% discount
  })

  it('calculates total without discount for regular users', () => {
    // Different scenario, different local data
    const regularUser = {
      id: 2,
      type: 'regular',
      discountRate: 0
    }

    const cartItems = [
      { name: 'Book', price: 25 },
      { name: 'Pen', price: 5 }
    ]

    const cart = new ShoppingCart(regularUser, cartItems)
    expect(cart.getTotal()).toBe(30)
  })
})
```

#### Bad Examples (Anti-Patterns)

```ruby
# Bad: Shared data defined far from usage
describe UserService do
  # Data defined at top level - unclear what it's for
  let(:user) { create(:user, email: 'test@example.com') }
  let(:admin) { create(:user, role: :admin) }
  let(:product) { create(:product, price: 100) }

  describe '#send_welcome_email' do
    it 'sends email to users' do
      # Unclear why we're using this specific user
      # What properties matter for this test?
      UserService.send_welcome_email(user)
    end
  end

  describe '#calculate_discount' do
    it 'applies admin discount' do
      # Using admin user but test is about discounts
      # The relationship is unclear
      result = UserService.calculate_discount(admin, product)
      expect(result).to eq(90)
    end
  end
end
```

```javascript
// Bad: Global test data that creates dependencies
const GLOBAL_USER = { id: 1, name: 'Test User' }
const GLOBAL_PRODUCT = { id: 1, price: 100 }

describe('Order Processing', () => {
  it('creates order for user', () => {
    // Unclear what properties of GLOBAL_USER matter
    // Test becomes brittle if global data changes
    const order = new Order(GLOBAL_USER, GLOBAL_PRODUCT)
    expect(order.userId).toBe(1)
  })

  it('calculates order total', () => {
    // Dependency on global data makes test fragile
    const order = new Order(GLOBAL_USER, GLOBAL_PRODUCT)
    expect(order.total).toBe(100)
  })
})
```

#### Advanced Patterns

##### Builder Pattern for Complex Data

```ruby
# Good: Local builder that creates exactly what's needed
describe PaymentProcessor do
  it 'processes payment for valid credit card' do
    # Builder creates only the data needed for this specific test
    payment_request = PaymentRequestBuilder.new
      .with_amount(100.00)
      .with_currency('USD')
      .with_valid_credit_card
      .with_billing_address
      .build

    result = PaymentProcessor.process(payment_request)
    expect(result).to be_successful
  end

  it 'rejects payment for expired card' do
    # Different scenario, different builder configuration
    payment_request = PaymentRequestBuilder.new
      .with_amount(50.00)
      .with_expired_credit_card  # Only this aspect matters for the test
      .build

    result = PaymentProcessor.process(payment_request)
    expect(result).to be_failed
    expect(result.error).to eq('Card expired')
  end
end
```

##### Object Mother Pattern

```ruby
# Good: Semantic factory methods that explain intent
class UserMother
  def self.new_premium_user
    create(:user,
      subscription_type: 'premium',
      subscription_expires_at: 1.year.from_now,
      features_enabled: ['advanced_analytics', 'priority_support']
    )
  end

  def self.expired_trial_user
    create(:user,
      subscription_type: 'trial',
      subscription_expires_at: 1.day.ago,
      trial_ended: true
    )
  end
end

describe SubscriptionService do
  it 'allows premium features for premium users' do
    # Intent is clear from the method name
    user = UserMother.new_premium_user

    expect(SubscriptionService.can_access_feature?(user, :advanced_analytics)).to be true
  end

  it 'blocks premium features for expired trial users' do
    # Clear what type of user we're testing
    user = UserMother.expired_trial_user

    expect(SubscriptionService.can_access_feature?(user, :advanced_analytics)).to be false
  end
end
```

#### Test Data Isolation Strategies

##### Database Transaction Isolation

```ruby
RSpec.configure do |config|
  # Each test gets its own transaction
  config.use_transactional_fixtures = true

  # Alternative: Use database_cleaner for more control
  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
```

##### In-Memory Test Doubles

```ruby
describe UserNotificationService do
  it 'sends notification to active users' do
    # In-memory test double - no database dependency
    active_users = [
      double('User', id: 1, active: true, email: 'user1@example.com'),
      double('User', id: 2, active: true, email: 'user2@example.com')
    ]

    allow(User).to receive(:active).and_return(active_users)

    expect(EmailService).to receive(:send_notification).twice
    UserNotificationService.notify_all_active_users
  end
end
```

#### Parameterized Tests for Data Variations

```ruby
# Good: Testing multiple scenarios with local data
describe TaxCalculator do
  [
    { income: 30000, expected_tax: 3000, scenario: 'low income' },
    { income: 50000, expected_tax: 7500, scenario: 'middle income' },
    { income: 100000, expected_tax: 22000, scenario: 'high income' }
  ].each do |test_case|
    it "calculates correct tax for #{test_case[:scenario]}" do
      # Each iteration has its own local data
      result = TaxCalculator.calculate(test_case[:income])
      expect(result).to eq(test_case[:expected_tax])
    end
  end
end
```

```javascript
// Good: Table-driven tests with local data
describe('Password Validator', () => {
  const testCases = [
    { password: 'weak', expected: false, reason: 'too short' },
    { password: 'NoNumbers!', expected: false, reason: 'no numbers' },
    { password: 'Strong123!', expected: true, reason: 'meets all criteria' }
  ]

  testCases.forEach(({ password, expected, reason }) => {
    it(`${expected ? 'accepts' : 'rejects'} password: ${reason}`, () => {
      const result = PasswordValidator.isValid(password)
      expect(result).toBe(expected)
    })
  })
})
```

#### Benefits of Test Data Locality

1. **Readability**: Tests are self-contained and easy to understand
2. **Maintainability**: Changes to one test don't break others
3. **Debugging**: When a test fails, all relevant data is visible
4. **Parallelization**: Tests can run in parallel without data conflicts
5. **Reliability**: No hidden dependencies on shared state

#### Common Pitfalls to Avoid

##### The Mystery Guest Anti-Pattern

```ruby
# Bad: Data comes from unknown source
describe OrderService do
  it 'processes order successfully' do
    # Where does this data come from? What are its properties?
    order = OrderService.create_order(some_user, some_product)
    expect(order).to be_valid
  end
end

# Good: Explicit local data
describe OrderService do
  it 'processes order successfully' do
    customer = create(:user, email: 'customer@example.com', verified: true)
    product = create(:product, name: 'Laptop', price: 999, in_stock: true)

    order = OrderService.create_order(customer, product)
    expect(order).to be_valid
  end
end
```

##### Shared Mutable State

```ruby
# Bad: Tests can interfere with each other
describe UserService do
  let(:shared_user) { create(:user, email: 'shared@example.com') }

  it 'updates user email' do
    UserService.update_email(shared_user, 'new@example.com')
    expect(shared_user.email).to eq('new@example.com')
  end

  it 'validates user email format' do
    # This test might fail if previous test ran first
    result = UserService.validate_email(shared_user)
    expect(result).to be_truthy
  end
end

# Good: Each test has its own data
describe UserService do
  it 'updates user email' do
    user = create(:user, email: 'original@example.com')
    UserService.update_email(user, 'new@example.com')
    expect(user.reload.email).to eq('new@example.com')
  end

  it 'validates user email format' do
    user = create(:user, email: 'valid@example.com')
    result = UserService.validate_email(user)
    expect(result).to be_truthy
  end
end
```

### Factories vs Fixtures

- **Use factories**: For dynamic, customizable test data
- **Use fixtures**: For static reference data that rarely changes

```ruby
# Factory for flexible test data
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { Faker::Name.full_name }
    role { :user }

    trait :admin do
      role { :admin }
    end

    trait :with_posts do
      after(:create) do |user|
        create_list(:post, 3, author: user)
      end
    end
  end
end
```

### Database Cleaning Strategies

```ruby
RSpec.configure do |config|
  config.use_transactional_fixtures = false

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  config.before(:each, js: true) do
    DatabaseCleaner.strategy = :truncation
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
```

## Testing Anti-Patterns to Avoid

### The Test Ice Cream Cone

- **Problem**: Too many E2E tests, few unit tests
- **Solution**: Follow the testing pyramid

### Brittle Tests

- **Problem**: Tests break with minor code changes
- **Solution**: Test behavior, not implementation details

### Happy Path Only

- **Problem**: Only testing success scenarios
- **Solution**: Test edge cases and error conditions

### Slow Test Suite

- **Problem**: Tests take too long to run
- **Solution**: Optimize database usage, parallel execution

### Mystery Guest

- **Problem**: Test setup is hidden or unclear
- **Solution**: Make test data explicit and local

## Testing Tools & Libraries

### Ruby/Rails

- **RSpec**: BDD testing framework
- **FactoryBot**: Test data generation
- **VCR**: Record and replay HTTP interactions
- **Capybara**: Integration and E2E testing
- **Shoulda Matchers**: Rails-specific matchers

### JavaScript/TypeScript

- **Jest**: Unit testing framework
- **Cypress**: E2E testing
- **Testing Library**: Component testing
- **Supertest**: API testing
- **Playwright**: Cross-browser testing

### General Tools

- **Pact**: Contract testing
- **JMeter**: Load testing
- **Newman**: API testing with Postman collections
- **Docker**: Test environment isolation

## Continuous Integration Best Practices

### Test Pipeline Structure

1. **Fast feedback loop**: Run unit tests first
2. **Parallel execution**: Run independent test suites in parallel
3. **Fail fast**: Stop pipeline on critical test failures
4. **Test reporting**: Generate coverage and test reports
5. **Artifact management**: Store test results and logs

### Test Environment Management

```yaml
# Example CI pipeline
stages:
  - lint
  - unit_tests
  - integration_tests
  - security_tests
  - e2e_tests
  - deploy

unit_tests:
  script:
    - bundle exec rspec spec/unit --format progress
  coverage: '/\(\d+\.\d+\%\) covered/'

integration_tests:
  services:
    - postgres:13
    - redis:6
  script:
    - bundle exec rspec spec/integration

e2e_tests:
  script:
    - docker-compose up -d
    - npm run test:e2e
  after_script:
    - docker-compose down
```

## Metrics & Monitoring

### Code Coverage

- **Target**: 80-90% coverage for critical paths
- **Focus**: Quality over quantity - meaningful coverage
- **Tools**: SimpleCov (Ruby), Istanbul (JavaScript)

### Test Health Metrics

- **Test execution time**: Monitor for performance degradation
- **Flaky test detection**: Track intermittent failures
- **Test maintenance burden**: Time spent fixing vs writing tests

### Quality Gates

```ruby
# Coverage threshold
if SimpleCov.result.covered_percent < 80
  puts "Coverage is below threshold: #{SimpleCov.result.covered_percent}%"
  exit(1)
end
```

## Documentation & Communication

### Test Documentation

- **README**: How to run tests locally
- **Test conventions**: Team-specific patterns and practices
- **Troubleshooting guide**: Common issues and solutions

### Code Reviews

- **Test coverage**: Ensure new code includes appropriate tests
- **Test quality**: Review test readability and maintainability
- **Edge cases**: Verify critical scenarios are covered

## Conclusion

Effective testing is crucial for software quality and team productivity. Follow these practices to create a robust testing strategy that catches bugs early, provides confidence in changes, and supports rapid development cycles.

Remember: **Good tests are an investment in your future self and your team.**
