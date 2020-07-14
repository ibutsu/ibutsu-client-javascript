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

/**
 * The HealthInfo model module.
 * @module model/HealthInfo
 * @version 1.0.0
 */
class HealthInfo {
    /**
     * Constructs a new <code>HealthInfo</code>.
     * @alias module:model/HealthInfo
     */
    constructor() { 
        
        HealthInfo.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>HealthInfo</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/HealthInfo} obj Optional instance to populate.
     * @return {module:model/HealthInfo} The populated <code>HealthInfo</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new HealthInfo();

            if (data.hasOwnProperty('frontend')) {
                obj['frontend'] = ApiClient.convertToType(data['frontend'], 'String');
            }
            if (data.hasOwnProperty('backend')) {
                obj['backend'] = ApiClient.convertToType(data['backend'], 'String');
            }
            if (data.hasOwnProperty('api_ui')) {
                obj['api_ui'] = ApiClient.convertToType(data['api_ui'], 'String');
            }
        }
        return obj;
    }


}

/**
 * The URL of the frontend
 * @member {String} frontend
 */
HealthInfo.prototype['frontend'] = undefined;

/**
 * The URL of the backend
 * @member {String} backend
 */
HealthInfo.prototype['backend'] = undefined;

/**
 * The URL to the UI for the API
 * @member {String} api_ui
 */
HealthInfo.prototype['api_ui'] = undefined;






export default HealthInfo;

