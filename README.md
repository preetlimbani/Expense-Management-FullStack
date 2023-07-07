# Expense Management Project

This project is an expense management system that allows users to track their expenses, schedule repeated expenses, and manage their monthly budget. It utilizes the following technologies: Django, Django REST Framework, PostgreSQL, Stripe, FETCHAPI, HTML, CSS, Bootstrap, and JavaScript.

## Setup

To set up the project on your local machine, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/preetlimbani/Expense-Management-FullStack.git
```

2. Navigate to the project directory:

```shell
cd expense-management
```

3. Install the required dependencies. It is recommended to use a virtual environment:

```shell
pip install -r requirements.txt
```

4. Create a new `.env` file in the project's root directory and populate it with the following variables:

```plaintext
SECRET_KEY=<your_secret_key>
DB_NAME=<your_db_name>
DB_USER=<your_db_usernaem>
DB_PASSWORD=<your_db_password>
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST_USER=<your_email_username>
EMAIL_HOST_PASSWORD=<your_email_password>
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

Make sure to replace the placeholder values with your own configurations. The `SECRET_KEY` should be a secure random string, and the database credentials should match your local PostgreSQL setup.

5. Set up the database by running the migrations:

```shell
python manage.py migrate
```

6. (Optional) Load sample data (e.g., categories, initial expenses) into the database:

```shell
python manage.py loaddata sample_data.json
```

7. Start the development server:

```shell
python manage.py runserver
```

8. Access the application by opening your browser and navigating to `http://localhost:8000`.

## Usage

Once the application is set up and running, you can perform the following actions:

- Register a new user account.
- Log in using your credentials.
- Track your expenses by adding them to the system.
- Schedule repeated expenses on a daily, weekly, or monthly basis.
- Set a monthly budget to track your savings.
- Manage your profile settings, including changing your password and email address.

## Contributing

Contributions to the Expense Management project are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue in the project repository.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as needed.