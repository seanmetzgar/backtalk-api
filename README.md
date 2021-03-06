![Test](https://github.com/ClickPop/survey-app-server/workflows/Test/badge.svg?branch=master)

## Installation

### Prerequesites

- [Node.JS](https://nodejs.org/)
- Preferrably an IDE/Code editor that supports an ESLint plugin
- Git (Obviously)
- [Postgres](https://www.postgresql.org/download/) (Installed, setup script will create database if you haven't already)

### Instructions

- Clone this repository `git clone https://github.com/clickpop/survey_app_server.git`
- Enter repository `cd survey_app_server`
- Make sure Postgres is installed / running
- Update `.env` file with appropriate Postgres settings
- Setup the project using one of the following:
  - **DON'T HAVE THE DATABASE YET** (you'll still need Postgres running)
    - `npm run setup`
  - **HAVE A DATABASE AND WANT TO WIPE IT OUT**:
    - `npm run setup:clean`
  - **HAVA A DATABASE AND WANT TO KEEP THE DATA INTACT** (will add new migrations)
    - `npm run setup:keep`
- Start the server `npm start`
