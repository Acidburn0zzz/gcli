/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {


var oop = require('pilot/oop');
var lang = require('pilot/lang');
var console = require('pilot/console');
var EventEmitter = require('pilot/event_emitter').EventEmitter;

var Argument = require('pilot/argument').Argument;
var ArrayArgument = require('pilot/argument').ArrayArgument;

var Conversion = require('pilot/types').Conversion;
var ArrayConversion = require('pilot/types').ArrayConversion;

var StringType = require('pilot/types/basic').StringType;
var NumberType = require('pilot/types/basic').NumberType;
var BooleanType = require('pilot/types/basic').BooleanType;
var BlankType = require('pilot/types/basic').BlankType;
var SelectionType = require('pilot/types/basic').SelectionType;
var DeferredType = require('pilot/types/basic').DeferredType;
var ArrayType = require('pilot/types/basic').ArrayType;


/**
 * On startup we need to:
 * 1. Add 3 sets of elements to the DOM for:
 * - command line output
 * - input hints
 * - completion
 * 2. Attach a set of events so the command line works
 */
exports.startup = function(data, reason) {
    addField(StringField);
    addField(NumberField);
    addField(BooleanField);
    addField(SelectionField);
    addField(DeferredField);
    addField(BlankField);
    addField(ArrayField);
};

/**
 * A Field is a way to get input for a single parameter
 * @param doc The document we use in calling createElement
 */
function Field(doc, param) {
}

oop.implement(Field.prototype, EventEmitter);

Field.prototype.element = undefined;

Field.prototype.destroy = function() {
    throw new Error('Field should not be used directly');
};

Field.prototype.setConversion = function(conversion) {
    throw new Error('Field should not be used directly');
};

Field.prototype.getConversion = function() {
    throw new Error('Field should not be used directly');
};

Field.prototype.setMessageElement = function(element) {
    this.messageElement = element;
};

Field.prototype.setMessage = function(message) {
    if (this.messageElement) {
        if (message == null) {
            message = '';
        }
        this.messageElement.innerHTML = message;
    }
};

Field.prototype.onFieldChange = function() {
    var conversion = this.getConversion();
    this._dispatchEvent('change', { conversion: conversion });
    this.setMessage(conversion.message);
};

/**
 *
 */
Field.claim = function() {
    throw new Error('Field should not be used directly');
};
Field.MATCH = 5;
Field.DEFAULT_MATCH = 4;
Field.IF_NOTHING_BETTER = 1;
Field.NO_MATCH = 0;


/**
 * Managing the current list of Fields
 */
var fieldCtors = [];
function addField(fieldCtor) {
    if (typeof fieldCtor !== 'function') {
        console.error('addField erroring on ', fieldCtor);
        throw new Error('addField requires a Field constructor');
    }
    fieldCtors.push(fieldCtor);
}

function removeField(field) {
    if (typeof field !== 'string') {
        lang.arrayRemove(fields, field);
        delete fields[field];
    }
    else if (field instanceof Field) {
        removeField(field.name);
    }
    else {
        console.error('removeField erroring on ', field);
        throw new Error('removeField requires an instance of Field');
    }
}

function getField(doc, type, requ) {
    var ctor;
    var highestClaim = -1;
    fieldCtors.forEach(function(fieldCtor) {
        var claim = fieldCtor.claim(type);
        if (claim > highestClaim) {
            highestClaim = claim;
            ctor = fieldCtor;
        }
    });

    if (!ctor) {
        console.error('Can\'t find field for ', type, ' in ', fieldCtors);
    }

    return new ctor(doc, type, requ);
}

exports.Field = Field;
exports.addField = addField;
exports.removeField = removeField;
exports.getField = getField;


/**
 *
 */
function StringField(doc, type, requ) {
    this.doc = doc;
    this.type = type;
    this.arg = new Argument();

    this.element = this.doc.createElement('input');
    this.element.type = 'text';

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('keyup', this.onFieldChange, false);
}

oop.inherits(StringField, Field);

StringField.claim = function(type) {
    return type instanceof StringType ? Field.MATCH : Field.IF_NOTHING_BETTER;
};

StringField.prototype.destroy = function() {
    this.element.removeEventListener('keyup', this.onKeyup, false);
};

StringField.prototype.setConversion = function(conversion) {
    this.arg = conversion.arg;
    this.element.value = conversion.arg.text;
    this.setMessage(conversion.message);
};

StringField.prototype.getConversion = function() {
    // This tweaks the prefix/suffix of the argument to fit
    this.arg = this.arg.beget(this.element.value, { prefixSpace: true });
    return this.type.parse(this.arg);
};

exports.StringField = StringField;


/**
 *
 */
function NumberField(doc, type, requ) {
    this.doc = doc;
    this.type = type;
    this.arg = new Argument();

    this.element = this.doc.createElement('input');
    this.element.type = 'number';
    if (this.type.max) {
        this.element.max = this.type.max;
    }
    if (this.type.min) {
        this.element.min = this.type.min;
    }
    if (this.type.step) {
        this.element.step = this.type.step;
    }

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('keyup', this.onFieldChange, false);
}

oop.inherits(NumberField, Field);

NumberField.claim = function(type) {
    return type instanceof NumberType ? Field.MATCH : Field.NO_MATCH;
};

NumberField.prototype.destroy = function() {
    this.element.removeEventListener('keyup', this.onKeyup, false);
};

NumberField.prototype.setConversion = function(conversion) {
    this.arg = conversion.arg;
    this.element.value = conversion.arg.text;
    this.setMessage(conversion.message);
};

NumberField.prototype.getConversion = function() {
    this.arg = this.arg.beget(this.element.value, { prefixSpace: true });
    return this.type.parse(this.arg);
};

exports.NumberField = NumberField;


/**
 *
 */
function BooleanField(doc, type, requ) {
    this.doc = doc;
    this.type = type;

    this.element = this.doc.createElement('input');
    this.element.type = 'checkbox';

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('change', this.onFieldChange, false);
}

oop.inherits(BooleanField, Field);

BooleanField.claim = function(type) {
    return type instanceof BooleanType ? Field.MATCH : Field.NO_MATCH;
};

BooleanField.prototype.destroy = function() {
    this.element.removeEventListener('change', this.onChange, false);
};

BooleanField.prototype.setConversion = function(conversion) {
    this.element.checked = conversion.value;
    this.setMessage(conversion.message);
};

BooleanField.prototype.getConversion = function() {
    return new Conversion(this.element.checked);
};

exports.BooleanField = BooleanField;


/**
 * Model an instanceof SelectionType as a select input box.
 * <p>There are 3 slightly overlapping concepts to be aware of:
 * <ul>
 * <li>value: This is the (probably non-string) value, known as a value by the
 *     assignment
 * <li>optValue: This is the text value as known by the DOM option element, as
 *     in &lt;option value=XXX%gt...
 * <li>optText: This is the contents of the DOM option element.
 * </ul>
 */
function SelectionField(doc, type, requ) {
    this.doc = doc;
    this.type = type;
    this.opts = {};
    this.defaultText = 'Select a ' + this.type.name + ' ...';

    this.element = this.doc.createElement('select');
    this._addOption(null, this.defaultText, SelectionField.DEFAULT_VALUE);
    this.type.getData().forEach(function(item) {
        var optText = typeof item === 'string' ? item : item.name;
        this._addOption(item, optText);
    }, this);

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('change', this.onFieldChange, false);
}

oop.inherits(SelectionField, Field);

SelectionField.claim = function(type) {
    return type instanceof SelectionType ? Field.DEFAULT_MATCH : Field.NO_MATCH;
};

SelectionField.prototype.destroy = function() {
    this.element.removeEventListener('change', this.onChange, false);
};

SelectionField.prototype.setConversion = function(conversion) {
    var optValue = SelectionField.DEFAULT_VALUE;
    Object.keys(this.opts).some(function(key) {
        var opt = this.opts[key];
        if (opt.value === conversion.value) {
            optValue = opt.optValue;
            return true;
        }
        return false;
    }, this);
    this.element.value = optValue;
    this.setMessage(conversion.message);
};

SelectionField.prototype.getConversion = function() {
    var value = this.element.value === SelectionField.DEFAULT_VALUE ?
            null :
            this.opts[this.element.value].value;
    var arg = new Argument(this.type.stringify(value), ' ');
    return new Conversion(value, arg);
};

SelectionField.prototype._addOption = function(value, optText, optValue) {
    optValue = optValue || optText;
    this.opts[optValue] = {
        value: value,
        optText: optText,
        optValue: optValue
    };
    var option = this.doc.createElement('option');
    option.innerHTML = optText;
    option.value = optValue;
    this.element.appendChild(option);
};

SelectionField.DEFAULT_VALUE = '__SelectionField.DEFAULT_VALUE';

exports.SelectionField = SelectionField;


/**
 *
 */
function DeferredField(doc, type, requ) {
    this.doc = doc;
    this.type = type;
    this.requ = requ;

    this.onCliChange = function() {
        this.update();
    }.bind(this);
    this.requ.addEventListener('assignmentChange', this.onCliChange);

    this.element = this.doc.createElement('div');
    this.update();
}

oop.inherits(DeferredField, Field);

DeferredField.prototype.update = function() {
    var subtype = this.type.defer();
    if (subtype === this.subtype) {
        return;
    }

    if (this.field) {
        this.field.destroy();
    }

    this.subtype = subtype;
    this.field = getField(this.doc, this.subtype);
    this.field.addEventListener('change', function(ev) {
        this._dispatchEvent('change', ev);
    }.bind(this));

    this.element.innerHTML = '';
    this.element.appendChild(this.field.element);
};

DeferredField.claim = function(type) {
    return type instanceof DeferredType ? Field.MATCH : Field.NO_MATCH;
};

DeferredField.prototype.destroy = function() {
    this.requ.removeEventListener('assignmentChange', this.onCliChange);
};

DeferredField.prototype.setConversion = function(conversion) {
    this.field.setConversion(conversion);
};

DeferredField.prototype.getConversion = function() {
    return this.field.getConversion();
};

exports.DeferredField = DeferredField;


/**
 *
 */
function BlankField(doc, type, requ) {
    this.doc = doc;
    this.type = type;
    this.element = this.doc.createElement('div');
}

oop.inherits(BlankField, Field);

BlankField.claim = function(type) {
    return type instanceof BlankType ? Field.MATCH : Field.NO_MATCH;
};

BlankField.prototype.destroy = function() { };
BlankField.prototype.setConversion = function() { };
BlankField.prototype.getConversion = function() {
    return new Conversion(null);
};


exports.BlankField = BlankField;


/**
 *
 */
function ArrayField(doc, type, requ) {
    this.doc = doc;
    this.type = type;

    this._onAdd = this._onAdd.bind(this);
    this.members = [];

    // <div class=cptArrayParent save="${element}">
    this.element = this.doc.createElement('div');
    this.element.className = 'cptArrayParent';

    // <div class=cptArrayMbrAdd onclick="${_onAdd}" save="${addButton}">
    this.addButton = this.doc.createElement('button');
    this.addButton.className = 'cptArrayMbrAdd';
    this.addButton.addEventListener('click', this._onAdd, false);
    this.addButton.innerHTML = 'Add';
    this.element.appendChild(this.addButton);

    // <div class=cptArrayMbrs save="${mbrElement}">
    this.container = this.doc.createElement('div');
    this.container.className = 'cptArrayMbrs';
    this.element.appendChild(this.container);

    this.onFieldChange = this.onFieldChange.bind(this);
}

oop.inherits(ArrayField, Field);

ArrayField.claim = function(type) {
    return type instanceof ArrayType ? Field.MATCH : Field.NO_MATCH;
};

ArrayField.prototype.destroy = function() {
    this.addButton.removeEventListener('click', this._onAdd, false);
};

ArrayField.prototype.setConversion = function(conversion) {
    // TODO: do the members need any de-reg?
    // TODO: this is too brutal - it removes focus from any the current field
    this.container.innerHTML = '';
    this.members = [];

    conversion.conversions.forEach(function(subConversion) {
        this._onAdd(null, subConversion);
    }, this);
};

ArrayField.prototype.getConversion = function() {
    var conversions = [];
    var arrayArg = new ArrayArgument();
    for (var i = 0; i < this.members.length; i++) {
        var conversion = this.members[i].field.getConversion();
        conversions.push(conversion);
        arrayArg.addArgument(conversion.arg);
    }
    return new ArrayConversion(conversions, arrayArg);
};

ArrayField.prototype._onAdd = function(ev, subConversion) {

    // <div class=cptArrayMbr save="${element}">
    var element = this.doc.createElement('div');
    element.className = 'cptArrayMbr';
    this.container.appendChild(element);

    // ${field.element}
    var field = getField(this.doc, this.type.subtype);
    field.addEventListener('change', function() {
        var conversion = this.getConversion();
        this._dispatchEvent('change', { conversion: conversion });
        this.setMessage(conversion.message);
    }.bind(this));
    if (subConversion) {
        field.setConversion(subConversion);
    }
    element.appendChild(field.element);

    // <div class=cptArrayMbrDel onclick="${_onDel}">
    var delButton = this.doc.createElement('button');
    delButton.className = 'cptArrayMbrDel';
    delButton.addEventListener('click', this._onDel, false);
    delButton.innerHTML = 'Del';
    element.appendChild(delButton);

    var member = {
        element: element,
        field: field,
        parent: this
    };
    member.onDelete = function() {
        this.parent.container.removeChild(this.element);
        lang.arrayRemove(this.parent.members, this);
        this.parent.onFieldChange();
    }.bind(member);
    delButton.addEventListener('click', member.onDelete, false);

    this.members.push(member);
};

exports.ArrayField = ArrayField;


});