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

import ApiClient from '../ApiClient';
import Pagination from './Pagination';
import Project from './Project';

/**
 * The ProjectList model module.
 * @module model/ProjectList
 * @version 1.0.0
 */
class ProjectList {
    /**
     * Constructs a new <code>ProjectList</code>.
     * @alias module:model/ProjectList
     */
    constructor() { 
        
        ProjectList.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ProjectList</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ProjectList} obj Optional instance to populate.
     * @return {module:model/ProjectList} The populated <code>ProjectList</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ProjectList();

            if (data.hasOwnProperty('projects')) {
                obj['projects'] = ApiClient.convertToType(data['projects'], [Project]);
            }
            if (data.hasOwnProperty('pagination')) {
                obj['pagination'] = Pagination.constructFromObject(data['pagination']);
            }
        }
        return obj;
    }


}

/**
 * @member {Array.<module:model/Project>} projects
 */
ProjectList.prototype['projects'] = undefined;

/**
 * @member {module:model/Pagination} pagination
 */
ProjectList.prototype['pagination'] = undefined;






export default ProjectList;

