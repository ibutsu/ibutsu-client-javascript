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
 * The ModelImport model module.
 * @module model/ModelImport
 * @version 1.0.0
 */
class ModelImport {
    /**
     * Constructs a new <code>ModelImport</code>.
     * @alias module:model/ModelImport
     */
    constructor() { 
        
        ModelImport.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ModelImport</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ModelImport} obj Optional instance to populate.
     * @return {module:model/ModelImport} The populated <code>ModelImport</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ModelImport();

            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
            if (data.hasOwnProperty('status')) {
                obj['status'] = ApiClient.convertToType(data['status'], 'String');
            }
            if (data.hasOwnProperty('filename')) {
                obj['filename'] = ApiClient.convertToType(data['filename'], 'String');
            }
            if (data.hasOwnProperty('format')) {
                obj['format'] = ApiClient.convertToType(data['format'], 'String');
            }
            if (data.hasOwnProperty('run_id')) {
                obj['run_id'] = ApiClient.convertToType(data['run_id'], 'String');
            }
        }
        return obj;
    }


}

/**
 * The database ID of the import
 * @member {String} id
 */
ModelImport.prototype['id'] = undefined;

/**
 * The current status of the import, can be one of \"pending\", \"running\", \"done\"
 * @member {String} status
 */
ModelImport.prototype['status'] = undefined;

/**
 * The name of the file that was uploaded
 * @member {String} filename
 */
ModelImport.prototype['filename'] = undefined;

/**
 * The format of the file uploaded
 * @member {String} format
 */
ModelImport.prototype['format'] = undefined;

/**
 * The ID of the run from the import
 * @member {String} run_id
 */
ModelImport.prototype['run_id'] = undefined;






export default ModelImport;

