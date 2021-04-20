# todo-app

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Required services

1. Install MongoDB
2. Install Camunda Modeler
3. Run Camunda with Docker or install it on your computer

## Running camunda proccess

Make sure that camunda is running, if you changed the port of this service change it in the `camunda.observer.ts`. Now open the file `./diagrams/todo.bpmn` in Camunda Modeler. Click on "Start current diagram". Check in your [cockpit](http://localhost:8080/camunda/app/cockpit/default/#/processes) if the proccess is running.

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

## Run the application

First let's configure your local variables. Execute the command below, open the new file and change it's values

```sh
cp .env.example .env
```

```sh
npm start
```

Open http://127.0.0.1:3000 in your browser.

## Calling camunda api rest

Open postman, and paste this request

```sh
curl --location --request POST 'http://localhost:8080/engine-rest/process-definition/key/create-todo/start' \
--header 'Content-Type: application/json' \
--data-raw '{
    "variables": {
        "description": {
            "value": "Come and have fun!"
        },
        "title": {
            "value": "Amanda'\''s birthday party"
        },
        "sendEmail": {
            "value": true
        },
        "guests": {
            "value": "[\"allanhorstwillig@gmail.com\", \"allan.horst@emergn.com\" ]"
        },"start": {
            "value": "2021-11-05 19:00:00 +0300"
        },"duration": {
            "value": "[4, \"hour\"]"
        },
        "allDay": {
            "value": false
        }
    }
}'
```
