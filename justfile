install:
    npm install

build:
    npm run build

test:
    npm test

test-watch:
    npm run test:watch

check:
    npm run build
    npm test
    npm run test:consumer
