import urlJoin from "url-join";
import root from "window-or-global";
let envVars = root.env || {};

envVars.EXAMPLE_MAIN_URL = `${root.location.protocol}//${root.location.hostname}`;
// envVars.EXAMPLE_MAIN_URL = `${root.location.protocol}//${root.location.hostname}:${root.location.port}`;
if (
  root &&
  root.process &&
  root.process.env &&
  root.process.NODE_ENV == "test"
) {
  envVars.EXAMPLE_MAIN_URL = 'https://api.xyz.com';
}

const Endpoints = {
  GET_TEST_API() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, '/api/v1/test-api')
  },
  GET_ALL_APPLICATIONS() {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, '/api/v1/applications')
  },
  GET_APPLICATION_BY_ID(id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/application/${id}`)
  },
  GET_INJECTABLE_TAGS_BY_ID(id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/test/injection/${id}`)
  },
  POST_INJECTABLE_TAGS_BY_ID(id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/test/injection/${id}`)
  },
  DELETE_INJECTABLE_TAGS_BY_ID(id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/test/injection/${id}`)
  },
  GET_APPLICATION_PROXY(application_id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/proxy/${application_id}`)
  },
  ADD_APPLICATION_PROXY(application_id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/proxy/add/${application_id}`)
  },
  REMOVE_APPLICATION_PROXY(application_id) {
    return urlJoin(envVars.EXAMPLE_MAIN_URL, `/api/v1/proxy/remove/${application_id}`)
  }
};

export default Endpoints;