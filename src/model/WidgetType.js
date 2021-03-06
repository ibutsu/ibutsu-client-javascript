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
import WidgetParam from './WidgetParam';

/**
 * The WidgetType model module.
 * @module model/WidgetType
 * @version 1.0.0
 */
class WidgetType {
    /**
     * Constructs a new <code>WidgetType</code>.
     * @alias module:model/WidgetType
     */
    constructor() { 
        
        WidgetType.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>WidgetType</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/WidgetType} obj Optional instance to populate.
     * @return {module:model/WidgetType} The populated <code>WidgetType</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new WidgetType();

            if (data.hasOwnProperty('id')) {
                obj['id'] = ApiClient.convertToType(data['id'], 'String');
            }
            if (data.hasOwnProperty('title')) {
                obj['title'] = ApiClient.convertToType(data['title'], 'String');
            }
            if (data.hasOwnProperty('description')) {
                obj['description'] = ApiClient.convertToType(data['description'], 'String');
            }
            if (data.hasOwnProperty('params')) {
                obj['params'] = ApiClient.convertToType(data['params'], [WidgetParam]);
            }
        }
        return obj;
    }


}

/**
 * A unique identifier for this widget type
 * @member {String} id
 */
WidgetType.prototype['id'] = undefined;

/**
 * The title of the widget, for users to see
 * @member {String} title
 */
WidgetType.prototype['title'] = undefined;

/**
 * A helpful description of this widget type
 * @member {String} description
 */
WidgetType.prototype['description'] = undefined;

/**
 * A dictionary or map of parameters to values
 * @member {Array.<module:model/WidgetParam>} params
 */
WidgetType.prototype['params'] = undefined;






export default WidgetType;

