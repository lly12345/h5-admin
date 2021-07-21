// router/index.js
import Login from '../pages/login'
import Index from '../pages'


const routes = [
  {
    path: "/login",
    component: Login
  }, {
    path: "/",
    component: Index,
  }
];

export default routes
