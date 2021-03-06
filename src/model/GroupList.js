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
import Group from './Group';
import Pagination from './Pagination';

/**
 * The GroupList model module.
 * @module model/GroupList
 * @version 1.0.0
 */
class GroupList {
    /**
     * Constructs a new <code>GroupList</code>.
     * @alias module:model/GroupList
     */
    constructor() { 
        
        GroupList.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>GroupList</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GroupList} obj Optional instance to populate.
     * @return {module:model/GroupList} The populated <code>GroupList</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new GroupList();

            if (data.hasOwnProperty('groups')) {
                obj['groups'] = ApiClient.convertToType(data['groups'], [Group]);
            }
            if (data.hasOwnProperty('pagination')) {
                obj['pagination'] = Pagination.constructFromObject(data['pagination']);
            }
        }
        return obj;
    }


}

/**
 * @member {Array.<module:model/Group>} groups
 */
GroupList.prototype['groups'] = undefined;

/**
 * @member {module:model/Pagination} pagination
 */
GroupList.prototype['pagination'] = undefined;






export default GroupList;

