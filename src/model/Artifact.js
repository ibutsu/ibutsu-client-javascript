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
 * The Artifact model module.
 * @module model/Artifact
 * @version 1.0.0
 */
class Artifact {
    /**
     * Constructs a new <code>Artifact</code>.
     * @alias module:model/Artifact
     */
    constructor() { 
        
        Artifact.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>Artifact</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Artifact} obj Optional instance to populate.
     * @return {module:model/Artifact} The populated <code>Artifact</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Artifact();

            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
            if (data.hasOwnProperty('resultId')) {
                obj['resultId'] = ApiClient.convertToType(data['resultId'], 'String');
            }
            if (data.hasOwnProperty('filename')) {
                obj['filename'] = ApiClient.convertToType(data['filename'], 'String');
            }
            if (data.hasOwnProperty('additionalMetadata')) {
                obj['additionalMetadata'] = ApiClient.convertToType(data['additionalMetadata'], Object);
            }
        }
        return obj;
    }


}

/**
 * Unique ID of the artifact
 * @member {String} id
 */
Artifact.prototype['id'] = undefined;

/**
 * ID of test result to attach artifact to
 * @member {String} resultId
 */
Artifact.prototype['resultId'] = undefined;

/**
 * ID of pet to update
 * @member {String} filename
 */
Artifact.prototype['filename'] = undefined;

/**
 * Additional data to pass to server
 * @member {Object} additionalMetadata
 */
Artifact.prototype['additionalMetadata'] = undefined;






export default Artifact;

