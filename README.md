# Welcome to Secure Sync Doc Vault!
The platform is a prototype document sharing solution that simplifies the creation of Residence Forms. Users fill in details, and the application automatically generates and converts these into PDFs. Administrators can approve or reject submissions, with options for feedback. Additionally, users can download, delete, or share documents within the system.


## Motivation
The primary reason behind this application was to demonstrate the role based authentication and authorization controls, alongside PDF generating and Emailing capabilities.

## Quick Start
#### For Normal Usage
- Make sure you have [docker](https://www.docker.com/products/docker-desktop/) installed.
- Start docker by running the docker desktop application.
- Just download the [docker-compose.yaml](https://github.com/shreyans-codes/secure-sync/blob/main/docker-compose.yaml) file, in the parent directory.
- Open cmd to the downloaded file's location
- Write the following command:
```bash
docker-compose up
```
>Note: The backend will restart a couple of times, let it. 
>It waits for the MySQL to start

The application runs on `localhost:5173`
