
var $       = require('jquery');
// Events  = require('events-es5'),
// Objects = require('object-es5'),
// Fns     = require('function-es5');

require('./wait-state.css!');

/**
* WaitState is used for showing a waiting layer, to
* let users aware that website is wait for some operation to finish,
* it also prevent from unexpected user operation while processing.
*
* @param parentElm {DOM Node or jQuery} - the element that WaitState instance will be appended to.
* @return {WaitState}
*/
var WaitState = function (parentElm) {

    if (   typeof parentElm === 'undefined'
        || parentElm === null )
        throw "IllegalArgumentException: parentElm must be specified";

    if (typeof parentElm.nodeName === 'string')
        parentElm = $(parentElm);

    // We do this so that repositioning works correctly.
    if (parentElm.css('position') === 'static')
        parentElm.css('position', 'relative');
    
    this._parent   = parentElm;
    this._span     = null;
    this._isActive = false;
    this._adjW     = 0;
    this._adjH     = 0;
    this._cnt      = 0;

    Fns.setInContext(this, '_click');
    this.events = new Events('click');
};

WaitState.prototype = {
    constructor: WaitState,

    /**
     * Destroy the instance.
     * @return <em>undefined</em>
     */
    destroy: function () {
        if (this._span !== null)
            this._span.unbind('click', this._click)
                      .remove();

        Objects.destroy(this);
    },
    
    /**
     * Returns whether the wait layer is currently visible.
     * @returns {Boolean}
     */
    isActive: function () {
        return this._isActive;
    },
    
    /**
     * Activates wait layer, indicating that objects below are waiting for something.
     * @return {WaitState}
     */
    setWait: function () {
        this._cnt++;

        if (this._cnt > 0) {
            if (this._span === null) {
                this._span = $('<span>').appendTo(this._parent)
                                        .addClass('waitstate')
                                        .bind('click', this._click);
            }
            this._isActive = true;
            this._resize().show();
        }
        
        return this;
    },
    
    /**
     * When data is ready to display we call this method to stop progress bar
     * @return {WaitState}
     */
    setReady: function () {
        this._cnt--;

        if (this._cnt <= 0) {
            if (this._isActive) {
                this._span.hide();
                this._isActive = false;
            }

            if (this._cnt < 0) {
                this._cnt = 0;
            }
        }
        
        return this;
    },
    
    /**
     * Resize the instance based on the new parent's dimensions.
     * @return {WaitState}
     */
    resize: function () {
        if (this._isActive) {
            this._resize();
        }
        
        return this;
    },
    
    _resize: function () {
        var parentElm = this._parent;
        
        return this._span.width (parentElm.innerWidth()  + this._adjW)
                         .height(parentElm.innerHeight() + this._adjH);
    },

    /**
     * <p>
     *  Gets or sets the width adjustment.
     * </p>
     * 
     * <p>
     *  By default, WaitState takes the full width of its parent element.
     *  Use this method to modify the default behaviour.
     * </p>
     * @param widthAdj {Number} A positive number increases the width; a negative
     *                          number decreases the width.
     * @returns {Number} or {WaitState}
     */
    widthAdj: function (widthAdj) {
        return this._adj(widthAdj, '_adjW');
    },
    
    /**
     * <p>
     *  Gets or sets the height adjustment.
     * </p>
     * 
     * <p>
     *  By default, WaitState takes the full height of its parent element.
     *  Use this method to modify the default behaviour.
     * </p>
     * @param heightAdj {Number} A positive number increases the height; a negative
     *                           number decreases the height.
     * @returns {Number} or {WaitState}
     */
    heightAdj: function (heightAdj) {
        return this._adj(heightAdj, '_adjH');
    },
    
    _adj: function (adj, prop) {
        
        if (typeof adj === 'undefined') {
            return this[prop];
        }
        else if (typeof adj !== 'number') {
            throw "IllegalArgumentException: adj must be a Number.";
        }
        
        this[prop] = adj;
        
        if (this._isActive) {
            this._resize();
        }
        
        return this;
    },

    _click: function (event) {
        this.events.send('click', this);
    }
};

module.exports = WaitState;
