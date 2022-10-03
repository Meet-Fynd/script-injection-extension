/* eslint-disable */
"use strict";

import URLS from './endpoint.service';
import axios from 'axios';
import { getCompany }  from '../helper/utils';

axios.interceptors.request.use(config => {
    config.headers['x-company-id'] = getCompany();
    return config;
});

const MainService = {
    getTestApi(params = {}) {
        return axios.get(URLS.GET_TEST_API());
    },
    getAllApplications(params = {}) {
        return axios.get(URLS.GET_ALL_APPLICATIONS());
    },
    getAllApplicationById(id){
        return axios.get(URLS.GET_APPLICATION_BY_ID(id));
    },
    getInjectableTagsById(id) {
        return axios.get(URLS.GET_INJECTABLE_TAGS_BY_ID(id))
    },
    addInjecttableTagsById(id) {
        return axios.post(URLS.POST_INJECTABLE_TAGS_BY_ID(id))
    },
    removeInjectableTagsById(id) {
        return axios.delete(URLS.DELETE_INJECTABLE_TAGS_BY_ID(id))
    }
}

export default MainService;