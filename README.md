# InvoiceApp


## Features
- Create, read, update, delete invoices
- Filter by status (Draft/Pending/Paid)
- Form validation
- Responsive design

## Setup
```bash
npm install
ng serve

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Component Structure

InvoiceListComponent: Main view with filtering
InvoiceItemComponent: Individual invoice cards
NewInvoiceFormComponent: Shared form for create/edit
InvoiceDetailsComponent: Detailed invoice view
DeleteModalComponent: Confirmation dialog


Routing

Path	---->>  Component
/ ---->> 	Redirects to /invoices
/invoices	---->> InvoiceListComponent
/invoices/new ---->> 	NewInvoiceFormComponent
/invoices/:id	---->> InvoiceDetailsComponent
/invoices/:id/edit	---->> EditInvoiceFormComponent
/invoices/:id/delete---->> 	DeleteModalComponent

Git Workflow:
Feature Branch of each major task (UI/new-invoic;  UI/Invoice-List; functionalities; main)


