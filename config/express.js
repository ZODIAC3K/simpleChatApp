import express from 'express';
// import session from 'express-session';
import path from 'path';
import { setTimeout } from 'timers/promises';

import {ROOT_DIR, renderViews} from '../globals.js';
import * as Views from './route-handler.js';
import * as Middlewares from './middlewares.js';

import {isAuthenticated, checkLogin} from '../controllers/isAuthenticated.js';
import logoutController from '../controllers/logout-controller.js';
import {userLogin, dummyLogin} from '../controllers/login-controller.js';
import {userRegister} from '../controllers/register-controller.js';

import * as chatroomControllers from '../controllers/chatroom/chatroom-controllers.js';

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const app = express();

// console.log(app)

// SET STATIC FOLDER using a MIDDLEWARE
app.use(express.static(path.join(ROOT_DIR, 'public')));

// to deal with formData in (json or string)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// get URL MIDDLEWARE
app.use(Middlewares.getURL);

// SET Session settings MIDDLEWARE
app.use(Middlewares.sessionMiddleware);

// console.log('Session Details', Middlewares.sessionMiddleware)


// VIEWS

    // HOME
    app.get('/', isAuthenticated, Views.getHomepage);
    app.get('/home', isAuthenticated, Views.getHomepage);

    // Chatroom Views
    app.get('/chatroom', isAuthenticated, Views.getChatroom);
    app.get('/chatroom/:room_id', isAuthenticated, Views.getChatroom);
    
    // OLD Chatroom View
    app.get('/chatroom-old', Views.getOldChatroom);
    app.get('/chatroom-ui-demo', Views.getOldChatroomUI);

    // Create Chatroom
    app.get('/create-chatroom', isAuthenticated, Views.getCreateChatroom);

    // Login, Register, Forgot-Password
    app.get('/login', checkLogin, Views.getLoginPage);
    app.get('/register', checkLogin, Views.getRegisterPage);
    app.get('/forgot-password', Views.getRecoverPasswordPage);

    // About Me
    app.get('/about-me', Views.getAboutMe);
// VIEWS END

// CONTROLLERS
    
    // Login User (DUMMY LOGIN)
    app.get('/dummy-login', dummyLogin);
    
    app.post('/login-user', userLogin);

    // create chatroom
    app.post('/create-chatroom', chatroomControllers.createNewChatroom);

    // get chatroom list
    app.get('/get-chatroom-list', chatroomControllers.getChatroomList);
    
    // Register User
    app.post('/register-user', userRegister);

    // Logout
    app.get('/logout', logoutController);
// CONTROLLERS


// 404 Page Not Found MIDDLEWARE
app.use(Middlewares.pageNotFound);



export default app;



// app.listen(PORT, ()=>{
//     console.log('Express started on port', PORT);
// });

// app.get('/', (client_request, server_response)=>{
//     let return_view = path.join(ROOT_DIR, 'views', 'index.html');
//     server_response.sendFile(return_view);
// });