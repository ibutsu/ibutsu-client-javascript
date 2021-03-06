/**
 * Ibutsu API
 * A system to store and query test results
 *
 * The version of the OpenAPI document: 1.9.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import InlineResponse200 from '../model/InlineResponse200';
import Report from '../model/Report';
import ReportList from '../model/ReportList';
import ReportParameters from '../model/ReportParameters';

/**
* Report service.
* @module api/ReportApi
* @version 1.0.0
*/
export default class ReportApi {

    /**
    * Constructs a new ReportApi. 
    * @alias module:api/ReportApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * Create a new report
     * @param {module:model/ReportParameters} reportParameters The parameters for the report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Report} and HTTP response
     */
    addReportWithHttpInfo(reportParameters) {
      let postBody = reportParameters;
      // verify the required parameter 'reportParameters' is set
      if (reportParameters === undefined || reportParameters === null) {
        throw new Error("Missing the required parameter 'reportParameters' when calling addReport");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = Report;
      return this.apiClient.callApi(
        '/report', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Create a new report
     * @param {module:model/ReportParameters} reportParameters The parameters for the report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Report}
     */
    addReport(reportParameters) {
      return this.addReportWithHttpInfo(reportParameters)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Delete a report
     * @param {String} id ID of report to delete
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    deleteReportWithHttpInfo(id) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteReport");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;
      return this.apiClient.callApi(
        '/report/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Delete a report
     * @param {String} id ID of report to delete
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */
    deleteReport(id) {
      return this.deleteReportWithHttpInfo(id)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Download a report
     * @param {String} id The ID of the report
     * @param {String} filename The file name of the downloadable report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link File} and HTTP response
     */
    downloadReportWithHttpInfo(id, filename) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling downloadReport");
      }
      // verify the required parameter 'filename' is set
      if (filename === undefined || filename === null) {
        throw new Error("Missing the required parameter 'filename' when calling downloadReport");
      }

      let pathParams = {
        'id': id,
        'filename': filename
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/csv', 'application/json', 'text/html', 'application/zip'];
      let returnType = File;
      return this.apiClient.callApi(
        '/report/{id}/download/{filename}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Download a report
     * @param {String} id The ID of the report
     * @param {String} filename The file name of the downloadable report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link File}
     */
    downloadReport(id, filename) {
      return this.downloadReportWithHttpInfo(id, filename)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get a report
     * @param {String} id The ID of the report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Report} and HTTP response
     */
    getReportWithHttpInfo(id) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getReport");
      }

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Report;
      return this.apiClient.callApi(
        '/report/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Get a report
     * @param {String} id The ID of the report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Report}
     */
    getReport(id) {
      return this.getReportWithHttpInfo(id)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get a list of reports
     * @param {Object} opts Optional parameters
     * @param {Number} opts.page Set the page of items to return, defaults to 1
     * @param {Number} opts.pageSize Set the number of items per page, defaults to 25
     * @param {String} opts.project Filter reports by project ID
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/ReportList} and HTTP response
     */
    getReportListWithHttpInfo(opts) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'page': opts['page'],
        'pageSize': opts['pageSize'],
        'project': opts['project']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ReportList;
      return this.apiClient.callApi(
        '/report', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Get a list of reports
     * @param {Object} opts Optional parameters
     * @param {Number} opts.page Set the page of items to return, defaults to 1
     * @param {Number} opts.pageSize Set the number of items per page, defaults to 25
     * @param {String} opts.project Filter reports by project ID
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ReportList}
     */
    getReportList(opts) {
      return this.getReportListWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get a list of report types
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/InlineResponse200>} and HTTP response
     */
    getReportTypesWithHttpInfo() {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [InlineResponse200];
      return this.apiClient.callApi(
        '/report/types', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * Get a list of report types
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/InlineResponse200>}
     */
    getReportTypes() {
      return this.getReportTypesWithHttpInfo()
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * View a report
     * @param {String} id The ID of the report
     * @param {String} filename The file name of the downloadable report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link File} and HTTP response
     */
    viewReportWithHttpInfo(id, filename) {
      let postBody = null;
      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling viewReport");
      }
      // verify the required parameter 'filename' is set
      if (filename === undefined || filename === null) {
        throw new Error("Missing the required parameter 'filename' when calling viewReport");
      }

      let pathParams = {
        'id': id,
        'filename': filename
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/csv', 'application/json', 'text/html', 'application/zip'];
      let returnType = File;
      return this.apiClient.callApi(
        '/report/{id}/view/{filename}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * View a report
     * @param {String} id The ID of the report
     * @param {String} filename The file name of the downloadable report
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link File}
     */
    viewReport(id, filename) {
      return this.viewReportWithHttpInfo(id, filename)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
