# Cafe Employee Manager

This application is designed to manage employee data for a cafe. It provides functionalities to add, update, delete, and view employee details.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- Docker

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/cafe-employee-manager.git
    cd cafe-employee-manager
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the application locally:
```sh
npm start
```
This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building the Application

To create a production build:
```sh
npm run build
```
This will create an optimized build of the app in the `build` directory.

### Docker

#### Building the Docker Image

To build the Docker image:
```sh
docker build -t cafe-employee-manager .
```

#### Running the Docker Container

To run the Docker container:
```sh
docker run -p 3000:80 cafe-employee-manager
```
This will start the application inside a Docker container and map port 3000 of the container to port 3000 on your host machine.

## Application Functionality

### Employee Management

- **Add Employee**: Allows you to add a new employee to the system.
- **Update Employee**: Enables you to update the details of an existing employee.
- **Delete Employee**: Provides the functionality to remove an employee from the system.
- **View Employees**: Displays a list of all employees with their details.

### Cafe Management

- **Add Menu Item**: Allows you to add a new item to the cafe menu.
- **Update Menu Item**: Enables you to update the details of an existing menu item.
- **Delete Menu Item**: Provides the functionality to remove an item from the cafe menu.
- **View Menu**: Displays a list of all menu items with their details.

