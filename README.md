# Frontend development asignment

Here you can find the [live demo](https://frontend-assignment.herokuapp.com/) of the project.

## Getting Started

The following instructions will explain how to:
* install the project
* run the tests
* build the project
* run the project on your pc

### Prerequisites

First of all you need Node and npm tools installed on your pc.

### Installing

After that you can download and install the project's dependences with the follow command:

```
npm i
```

## Running the tests

The command to run the tests is the following:

```
npm run test
```

## Building the project

The project build command will run before the tests. To build the project the command is the following.

```
npm run build
```

## Starting the application

The start command will serve on your pc the last build you run. 

The application will be available [here](http://localhost:8080) after the following command.

```
npm run start
```

## Build and start all in one

If you want to serve the last changes you made, you can run the following command.

```
npm run start-dev
```

This one will run tests, will build the project and in the end will serve to you.

## API used

In this project I used:

* [ChartJS](https://www.chartjs.org) for the charts.
* [The cat api](https://thecatapi.com/) to get a random set of images because all the images in the json aren't reachable.
* [Open layer](https://openlayers.org) to show the map on the detail.