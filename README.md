<div align=center>
  <img width =256 src="https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/d791f893-5773-4dd9-b2ad-94e0f721e5b8"/>
  <h3>ELIMT</h3>
  <p>Simple and easy to use Electronic Laboratory Info Mangement System.</p>
  <br><br>

</div>



## Structure 
  Express combined with ReactJS to form a simple, no-installation web application that uses SQLite to store basic user and file information, and Google Cloud API to connect to a cloud hard disk to store files in the cloud, reducing storage-related equipment costs. The front-end page uses MUI (Material UI) to reduce the development difficulty and can be changed to your favorite display style.
  
  ![project](https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/987ebe11-90a0-4d03-b816-3cd93b66f3bd)

<div>
  <br>
</div>

## Functions
  
  - [x] Front-end and Database System Architecture
  - [x] Web Content Module Switching
  - [x] Program Functions
    - [x] Personal Account Interface
    - [x] Common Links
    - [x] System Settings
    - [x] User Management
    - [x] Labbook
      - [x] Experiment Upload
        - [x] Upload Function
        - [x] Upload History
      - [x] Lab Record Signing
        - [x] Signature Function
        - [x] Signature History

    
<div>
  <br>
</div>

## Download & Use
  ### Notice
  * If you encounter any problems, please feel free to report them using [ issues ](https://github.com/JRay9487/ELIMT/issues).
  * This project is developed under Node.js v18.16.0, compatibility with other versions is not known.
  * The system will use 3000 (ReactJS), 3001 (Express) ports, if there is any occupation may need to manually adjust.
  * First time users must go to [localhost:3000/oauth](localhost:3000/oauth) for Google Cloud Authorization verification.
  * The system is defaulted to get the latest 200 uploads, if you want to increase or decrease, you need to go to `settings.json` to set it.
  * **ELIMT electronic system is a proprietary software (Proprietary software) protected by the Republic of China Copyright Law, the purchaser is only authorized to change some of the contents of the program, including the type of items, functions, display methods and system settings, etc., and is prohibited from removing all content that may contain copyright notices, any violation of the contract, I will retain the right to legal recourse. **



  ### Bugs
  * Under macOS Sonoma 14.2.1, Safari 17.2.1 (19617.1.17.11.12), ``@google-cloud/local-auth`` may not be able to authenticate locally, Chrome is recommended.

  ### Requirement.
  1. Node.js >v18.16.0
  2. Google account for system.
  3. Internet connection.


  ### Install
  1. Download [node.js v18.16.0](https://nodejs.org/en)
  2. If you have successfully installed Node.js, type ``node -v`` and the version information should appear.  
  3. Clone the project to your device.
  4. Use the System Google account to create a folder inside Google Drive and copy the folder ID into `settings.json`.
  5. Create an app login password for your system google account.
  6. Fill your system Google account info and a random password for the session to the `.env` file.
  7. Go to [Google Cloud Console](https://console.cloud.google.com) and enable API service.
  8. Setup your API credentials which have `https://www.googleapis.com/auth/drive` scope and redirect URL `http://localhost:3000/oauth2callback`.
  9. Place your `credentilas.json` inside `./functions/auth`.
  10. Use the CLI to access the project folder and type ``npm install`` to download the project requirements module.
  11. Use ``node index.js`` to start the local system.
  12. The default login account is admin, and the password is lab12345, you can use this account to add other users, or use [DB Browser for SQLite](https://sqlitebrowser.org/) to edit the `users` table in the database.
  13. You must authorize the Google Drive API for the first login, by switching to ``localhost:3000/oauth``.


