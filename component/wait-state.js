
// TODO add -webkit-transform;
// TODO resize ROTATE-SCALE animation element.

if (module && module.exports) {

    var $ = require('jquery');

    require('velocity');    // TODO test if $.velocity is added to jquery by "require('velocity')";

    module.exports = WaitState;
}
else {
    window.WaitState = WaitState;
}


// Events  = require('events-es5'),
// Objects = require('object-es5'),
// Fns     = require('function-es5');
// require('./wait-state.css!');



/**
* WaitState is used for showing a waiting layer, to
* let users aware that website is wait for some operation to finish,
* it also prevent from unexpected user operation while processing.
*
* @param parentElm {DOM Node or jQuery} - the element that WaitState instance will be appended to.
* @return {WaitState}
*/
function WaitState (parentElm) {

    if (   typeof parentElm === 'undefined'
        || parentElm === null )
        throw "IllegalArgumentException: parentElm must be specified";

    if (typeof parentElm.nodeName === 'string')
        parentElm = $(parentElm);

    // We do this so that repositioning works correctly.
    if (parentElm.css('position') === 'static')
        parentElm.css('position', 'relative');
    
    this._parent   = parentElm;
    this._dom      = {};
    this._options  = {};
    this._config   = {};
    this._type     = WaitState.types[0];
    this._isActive = false;
    this._adjW     = 0;
    this._adjH     = 0;
    this._cnt      = 0;

    // Fns.setInContext(this, '_click');
    // this.events = new Events('click');
}

WaitState.types = ['ROTATE-SCALE'];

WaitState.prototype = {
    constructor: WaitState,

    /**
     * Destroy the instance.
     */
    destroy: function () {
        var dom = this._dom;

        for (var type in dom)
            this.destroyOne(type);

        // Objects.destroy(this);
    },

    destroyOne: function (type) {
        var dom = this._dom;

        if (dom.hasOwnProperty(type)) {
            var wrap = dom[type].wrap;
            if (!this._isVoid(wrap)) {
                this._stopAnimation(type);
                wrap.remove();
            }
        }
    },

    _isVoid: function (value) {
        return (   value === null 
                || typeof value === 'undefined' );
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
            if (this._isVoid(this._dom[this._type]))
                this._initWrap();

            this._startAnimation();

            this._isActive = true;
            this._resize().show();
        }
        
        return this;
    },

    _initWrap: function () {

        var type = this._type;

        if (type === 'rotate-scale') {

            var wrap = $('<div>').appendTo(this._parent)
                                 .addClass('wait-state ' + type);
                                 // .bind('click', this._click);
                                 
            var layer = $('<div>').appendTo(wrap)
                                  .addClass('layer-blur');
            var inner = $('<div>').appendTo(wrap)
                                  .addClass('inner');
            var still = $('<div>').appendTo(wrap)
                                  .addClass('static');
            var outer = $('<div>').appendTo(wrap)
                                  .addClass('outer');
            var outer2 = $('<div>').appendTo(wrap)
                                   .addClass('outer another');

            this._dom[type] = {
                wrap:   wrap,
                layer:  layer,
                inner:  inner,
                still:  still,
                outer:  outer,
                outer2: outer2
            };
            this._config[type] = {};
        }
        else 
            throw "IllegalStateException: type " + type + " is not implemented yet.";
    },
    
    _startAnimation: function (type) {

        if (typeof type === 'undefined')
            type = this._type;

        var dom = this._getDom(type);
        var cfg = this._getConfig(type);

        // TODO clean code.
        if (type === 'ROTATE-SCALE') {

            var outerRotate    = 0;
            var outerRotateEnd = -360;

            var outerOpacity = 0;
            var outerOpacityEnd = 0.2;

            var outerScale = 4;
            var outerScaleEnd = 1;

            cfg.animating = true;

            var rotateOuter = function () {

                dom.outer.velocity({
                    opacity: [outerOpacityEnd, outerOpacity],
                    scale:   [outerScaleEnd, outerScale],
                    rotateZ: [outerRotateEnd, outerRotate]
                }, {
                    duration: 2500,
                    easing: 'ease',
                    // delay: 100,
                    complete: function (elements) {

                        if (cfg.animating) {

                            var tmp = outerRotateEnd;
                            outerRotateEnd = outerRotate;
                            outerRotate = tmp;

                            tmp = outerScale;
                            outerScale = outerScaleEnd;
                            outerScaleEnd = tmp;

                            tmp = outerOpacityEnd;
                            outerOpacityEnd = outerOpacity;
                            outerOpacity = tmp;

                            rotateOuter();
                        }
                    }
                });
            };

            var c2Opac = 0, c2OpacEnd = 0.1;
            var c2Scale = 4, c2ScaleEnd = 1;
            var c2Rotate1 = [90, 0];
            var c2Rotate2 = [-360, 90];
            var c2Rotate = c2Rotate1;

            var rotateOuter2 = function () {

                dom.outer2.velocity({
                    opacity: [c2OpacEnd, c2Opac],
                    scale:   [c2ScaleEnd, c2Scale],
                    rotateZ: c2Rotate
                }, {
                    duration: 2500,
                    easing: 'ease',
                    // delay: 100,
                    complete: function (elements) {

                        if (cfg.animating) {

                            var tmp = c2Opac;
                            c2Opac = c2OpacEnd;
                            c2OpacEnd = tmp;

                            tmp = c2Scale;
                            c2Scale = c2ScaleEnd;
                            c2ScaleEnd = tmp;

                            c2Rotate = c2Rotate[0] === 90 ? c2Rotate2 : c2Rotate1;

                            rotateOuter2();
                        }
                    }
                });
            };

            var innerOpac = 0, innerOpacEnd = 0.5;

            var rotateInner = function () {

                dom.inner.velocity({
                    opacity: [innerOpacEnd, innerOpac],
                    rotateZ: "+=75" 
                }, {
                    duration: 300,
                    delay: 200,
                    easing: 'ease',
                    complete: function (elements) {

                        if (cfg.animating) {

                            var tmp = innerOpac;
                            innerOpac = innerOpacEnd;
                            innerOpacEnd = tmp;

                            rotateInner();
                        }
                    }
                });
            };

            rotateOuter();
            cfg.outer2Timer = setTimeout(rotateOuter2, 1000);
            rotateInner();
        }

        return this;
    },

    _stopAnimation: function (type) {
        if (typeof type === 'undefined')
            type = this._type;

        var dom = this._getDom(type);
        var cfg = this._getConfig(type);

        if (type === 'ROTATE-SCALE') {
            cfg.animating = false;
            clearTimeout(cfg.outer2Timer);

            this._stopVelocityAnimation(dom.outer)
                ._stopVelocityAnimation(dom.outer2)
                ._stopVelocityAnimation(dom.inner);
        }

        return this;
    },

    _stopVelocityAnimation: function (elem) {
        elem.velocity('stop', true);

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
                this._dom[this._type].wrap.hide();
                this._stopAnimation();
                this._isActive = false;
            }

            if (this._cnt < 0) {
                this._cnt = 0;
            }
        }
        
        return this;
    },

    _validateType: function (type) {
        if (WaitState.types.indexOf(type) < 0)
            throw "IllegalArgumentException: type " + type + ' is not supported yet.';
    },

    type: function (type) {
        if (typeof type === 'undefined')
            return this._type;

        else {
            this._validateType(type);
            this._type = type;
            return this;
        }
    },

    setOptions: function (type, opts) {
        this._validateType(type);

        if (   typeof opts !== 'object' 
            || this._isVoid(opts) )
            throw "IllegalArgumentException: opts must be an object.";

        this._options[type] = opts;         // TODO validate options.
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

    _getDom: function (type) {
        if (typeof type === 'undefined')
            type = this._type;

        var dom = this._dom[type];
        if (this._isVoid(dom))
            throw "IllegalStateException: dom does not exist yet.";

        return dom;
    },

    _getConfig: function (type) {
        if (typeof type === 'undefined')
            type = this._type;

        var config = this._config[type];
        if (this._isVoid(config))
            throw "IllegalStateException: config does not exist yet.";

        return config;
    },

    _getWrap: function () {
        var dom = this._getDom();

        if (!this._isVoid(dom.wrap))
            return dom.wrap;

        throw "IllegalStateException: dom wrapper element does not exist yet.";
    },
    
    _resize: function () {
        var parentElm = this._parent;

        return this._getWrap().width (parentElm.innerWidth()  + this._adjW)
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

    /*
    _click: function (event) {
        this.events.send('click', this);
    }
    */
};
