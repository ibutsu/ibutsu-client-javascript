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


import ApiClient from './ApiClient';
import Artifact from './model/Artifact';
import ArtifactList from './model/ArtifactList';
import Group from './model/Group';
import GroupList from './model/GroupList';
import Health from './model/Health';
import HealthInfo from './model/HealthInfo';
import InlineObject from './model/InlineObject';
import InlineObject1 from './model/InlineObject1';
import InlineResponse200 from './model/InlineResponse200';
import ModelImport from './model/ModelImport';
import Pagination from './model/Pagination';
import Project from './model/Project';
import ProjectList from './model/ProjectList';
import Report from './model/Report';
import ReportList from './model/ReportList';
import ReportParameters from './model/ReportParameters';
import Result from './model/Result';
import ResultList from './model/ResultList';
import Run from './model/Run';
import RunList from './model/RunList';
import WidgetConfig from './model/WidgetConfig';
import WidgetConfigList from './model/WidgetConfigList';
import WidgetParam from './model/WidgetParam';
import WidgetType from './model/WidgetType';
import WidgetTypeList from './model/WidgetTypeList';
import ArtifactApi from './api/ArtifactApi';
import GroupApi from './api/GroupApi';
import HealthApi from './api/HealthApi';
import ImportApi from './api/ImportApi';
import ProjectApi from './api/ProjectApi';
import ReportApi from './api/ReportApi';
import ResultApi from './api/ResultApi';
import RunApi from './api/RunApi';
import WidgetApi from './api/WidgetApi';
import WidgetConfigApi from './api/WidgetConfigApi';


/**
* A Javascript client for the Ibutsu API.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var @IbutsuClient = require('index'); // See note below*.
* var xxxSvc = new @IbutsuClient.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new @IbutsuClient.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new @IbutsuClient.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new @IbutsuClient.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 0.1
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The Artifact model constructor.
     * @property {module:model/Artifact}
     */
    Artifact,

    /**
     * The ArtifactList model constructor.
     * @property {module:model/ArtifactList}
     */
    ArtifactList,

    /**
     * The Group model constructor.
     * @property {module:model/Group}
     */
    Group,

    /**
     * The GroupList model constructor.
     * @property {module:model/GroupList}
     */
    GroupList,

    /**
     * The Health model constructor.
     * @property {module:model/Health}
     */
    Health,

    /**
     * The HealthInfo model constructor.
     * @property {module:model/HealthInfo}
     */
    HealthInfo,

    /**
     * The InlineObject model constructor.
     * @property {module:model/InlineObject}
     */
    InlineObject,

    /**
     * The InlineObject1 model constructor.
     * @property {module:model/InlineObject1}
     */
    InlineObject1,

    /**
     * The InlineResponse200 model constructor.
     * @property {module:model/InlineResponse200}
     */
    InlineResponse200,

    /**
     * The ModelImport model constructor.
     * @property {module:model/ModelImport}
     */
    ModelImport,

    /**
     * The Pagination model constructor.
     * @property {module:model/Pagination}
     */
    Pagination,

    /**
     * The Project model constructor.
     * @property {module:model/Project}
     */
    Project,

    /**
     * The ProjectList model constructor.
     * @property {module:model/ProjectList}
     */
    ProjectList,

    /**
     * The Report model constructor.
     * @property {module:model/Report}
     */
    Report,

    /**
     * The ReportList model constructor.
     * @property {module:model/ReportList}
     */
    ReportList,

    /**
     * The ReportParameters model constructor.
     * @property {module:model/ReportParameters}
     */
    ReportParameters,

    /**
     * The Result model constructor.
     * @property {module:model/Result}
     */
    Result,

    /**
     * The ResultList model constructor.
     * @property {module:model/ResultList}
     */
    ResultList,

    /**
     * The Run model constructor.
     * @property {module:model/Run}
     */
    Run,

    /**
     * The RunList model constructor.
     * @property {module:model/RunList}
     */
    RunList,

    /**
     * The WidgetConfig model constructor.
     * @property {module:model/WidgetConfig}
     */
    WidgetConfig,

    /**
     * The WidgetConfigList model constructor.
     * @property {module:model/WidgetConfigList}
     */
    WidgetConfigList,

    /**
     * The WidgetParam model constructor.
     * @property {module:model/WidgetParam}
     */
    WidgetParam,

    /**
     * The WidgetType model constructor.
     * @property {module:model/WidgetType}
     */
    WidgetType,

    /**
     * The WidgetTypeList model constructor.
     * @property {module:model/WidgetTypeList}
     */
    WidgetTypeList,

    /**
    * The ArtifactApi service constructor.
    * @property {module:api/ArtifactApi}
    */
    ArtifactApi,

    /**
    * The GroupApi service constructor.
    * @property {module:api/GroupApi}
    */
    GroupApi,

    /**
    * The HealthApi service constructor.
    * @property {module:api/HealthApi}
    */
    HealthApi,

    /**
    * The ImportApi service constructor.
    * @property {module:api/ImportApi}
    */
    ImportApi,

    /**
    * The ProjectApi service constructor.
    * @property {module:api/ProjectApi}
    */
    ProjectApi,

    /**
    * The ReportApi service constructor.
    * @property {module:api/ReportApi}
    */
    ReportApi,

    /**
    * The ResultApi service constructor.
    * @property {module:api/ResultApi}
    */
    ResultApi,

    /**
    * The RunApi service constructor.
    * @property {module:api/RunApi}
    */
    RunApi,

    /**
    * The WidgetApi service constructor.
    * @property {module:api/WidgetApi}
    */
    WidgetApi,

    /**
    * The WidgetConfigApi service constructor.
    * @property {module:api/WidgetConfigApi}
    */
    WidgetConfigApi
};