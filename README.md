# Instant Chat

This project is a full-stack application that consists of a client-side Angular application and a server-side Laravel application with a Socket.IO server.

## Client-side Application

The client-side application is built with Angular and is located in the `client/` directory. It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3. The application can be served locally for development purposes by running `ng serve` and navigating to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. The build artifacts will be stored in the `dist/` directory when you run `ng build`. Unit tests can be executed with `ng test` via [Karma](https://karma-runner.github.io). For more information, refer to the [client/README.md](client/README.md) file.

## Server-side Application

The server-side application is built with Laravel and is located in the `server/` directory. It includes a Socket.IO server for real-time communication, as seen in [server-socket.js](server/server-socket.js). The server can be started with `nodemon server-socket.js` as specified in the [server/package.json](server/package.json) file. The application also includes a Docker setup, as seen in the [docker-compose.yml](server/docker-compose.yml) file. Unit tests can be executed with PHPUnit, as configured in the [phpunit.xml](server/phpunit.xml) file.

## Getting Started

To get started with this project, you need to install the dependencies for both the client-side and server-side applications. Navigate to the `client/` directory and run `npm install` to install the client-side dependencies. Then, navigate to the `server/` directory and run `composer install` to install the server-side dependencies.

After installing the dependencies, you can start the client-side application by running `ng serve` in the `client/` directory and the server-side application by running `nodemon server-socket.js` in the `server/` directory.

## Contributing

Contributions are welcome. Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)