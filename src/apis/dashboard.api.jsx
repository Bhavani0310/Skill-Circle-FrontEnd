// Importing constants
import apiPath from "../constants/api-path.constant";

import axios from "../configs/axios-instances";

const dashBoardApi = {
    AllServices: ({ payload, success, error }) => {
        const {
          services: { getAllServices },
        } = apiPath;
    
        axios.getRequest({ path: getAllServices, payload, success, error });
      },
      updateCustomerProfile:({payload,success,error})=>{
        const {
          dashBoardUser:{updateProfile}
        } =apiPath;
        axios.putRequest({path:updateProfile,payload,success,error})
      },
      onBoarding:({payload,success,error})=>{
        const {
          services:{onBoarding}
        } =apiPath;
        axios.postRequest({path:onBoarding,payload,success,error})
      },
      services: ({ payload, success, error }) => {
        const {
          services: { allServices},
        } = apiPath;
    
        axios.getRequest({ path: allServices, payload, success, error });
      },
      provider: ({ payload, service,success, error }) => {
        const {
          services: { providerList},
        } = apiPath;
    
        axios.getRequest({ path: `${providerList}?serviceName=${service}`, payload, success, error });
      },
};

export default dashBoardApi;
