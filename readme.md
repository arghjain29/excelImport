# Excel Data Importer

An intuitive Excel Data Importer app built with React and Vite. This app allows users to upload, preview, and import Excel (.xlsx) files. It is optimized for handling large datasets with thousands of rows and provides an easy-to-use interface for file validation, data preview, and import functionality.

## Features

- **File Upload**: Supports drag-and-drop file upload functionality using react-dropzone.
- **File Validation**: Ensures that only valid .xlsx files can be uploaded.
- **Data Preview**: Displays a preview of the uploaded data in a paginated table format with editable rows for quick inspection.
- **Import Data**: Allows users to import the data after reviewing and confirming the preview.
- **Data Manipulation**: You can delete rows from the preview table before importing.
- **Toast Notifications**: Provides stylish notifications (success, error) using react-toastify.
- **Responsive UI**: Optimized UI for all devices, built with Tailwind CSS.
- **Glassmorphism Theme**: Features a sleek, modern aesthetic with glassmorphic UI elements (gradient background, glass effect containers, and neon glow text).

## Tech Stack

### Frontend:
- **React.js**: Frontend framework for building the user interface.
- **Vite**: Fast build tool and development server for React.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **react-dropzone**: For drag-and-drop file upload functionality.
- **axios**: For making HTTP requests to the backend.
- **react-toastify**: For displaying stylish toast notifications.
- **date-fns**: For date formatting (e.g., converting date formats).

### Backend:
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB Atlas**: Cloud database for storing data.
- **Mongoose**: ODM for MongoDB, making it easier to interact with the database.

### Other:
- **Glassmorphism Theme**: Custom theme with gradient backgrounds, glass effect containers, and neon glow text.

## Getting Started

To get the app up and running on your local machine, follow these steps:

### Prerequisites
- Node.js (>=14.x)
- npm or yarn
- MongoDB Atlas account (for the backend database)

### Frontend Setup (React with Vite)

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/excelImport.git
    ```

2. Navigate into the frontend directory:
    ```bash
    cd excelImport/excel-data-importer
    ```

3. Install the required dependencies using npm or yarn:
    ```bash
    npm install
    # or
    yarn install
    ```

4. Create a `.env` file in the root of the excel-data-importer folder with the following content:
    ```ini
    VITE_BACKEND_URL=http://localhost:5000
    ```

5. Run the frontend app using Vite:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd excelImport/backend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root of the backend folder with the following content:
    ```ini
    MONGODB_URI=your-mongodb-uri-here
    PORT=5000
    ```

4. Run the backend app:
    ```bash
    npm start
    # or
    yarn start
    ```
    The backend will be running at [http://localhost:5000](http://localhost:5000).

## API Endpoints

- **POST /api/upload**
  - **Description**: Uploads an Excel file and returns the parsed data.
  - **Request**: Form-data with the file.
  - **Response**: JSON object with the parsed data from the Excel sheet.

- **POST /api/import**
    - **Description**: Imports the modified Excel file data into the database. Compares the modified data with the existing data and deletes the non-matching entries, leaving only the modified ones.
    - **Request**: JSON object with the parsed data from the modified Excel file.
    - **Response**: JSON object confirming that the data has been imported successfully and non-matching entries have been deleted.

- **DELETE /api/flush-data**
  - **Description**: Deletes all data from the database.
  - **Response**: JSON object confirming data deletion.

## Contributing

Feel free to fork this repo and open pull requests for any improvements or bug fixes. Ensure all pull requests are made to the main branch.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
