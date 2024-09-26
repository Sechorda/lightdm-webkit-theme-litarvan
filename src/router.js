import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/Login.vue';
import Base from './views/Base.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'base',
            component: Base,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: Login
                }
            ]
        }
    ]
});
