

https://user-images.githubusercontent.com/60439461/129234000-1ffc8fe5-d4c6-408c-8a35-440ee2484e29.mp4

# Medion
This is an simple text-editor app built using draftjs and nextjs

## How to start
### Client 
Open the terminal in the client folder and install  dependencies
```sh
yarn install
```
Start the client 
```sh
yarn dev
```
The client should be live on http://localhost:4000

## Server
Open the terminal in the server folder and install  dependencies
```sh
yarn install
```
Start the client 
```sh
yarn start
```
The server should be live on http://localhost:3000

## Move the provided .env file to server folder or ask for the .env file.

## Features

- Can save pages with basic text editing functionalites
- See other people pages if only subscribed to the medion ( dummy implementaion)
- Google Oauth Login
- added image support ( drag and drop the image)
- user can delete his/her page

## More Features to be added
- user can set a level (free or paid version) for a page

# Refactoring 
1. More usable UI.
2. Use global context.
3. Better DB logics
4. Save media seperately and retrieve it when page loads.

# BUGS
1. While deleting a page , syntax error is occuring
2. Warning: findDOMNode is deprecated in StrictMode
3. if the first line is lengthy, home page gets messy.
4. unequal size cards in home page.
