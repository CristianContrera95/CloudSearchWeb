import Contact from '../components/Contact';
import HomePage from "../components/HomePage";
import Indexes from "../components/Indexes";

const routes = [
    // { path: '/login', name: 'Login', component: LoginForm },
    { path: '/home', name: 'Home', component: HomePage },
    { path: '/indexes', exact: true, name: 'Indexes', component: Indexes },
    { path: '/contact', exact: true, name: 'Contact', component: Contact }
];

export default routes;
