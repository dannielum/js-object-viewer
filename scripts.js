(function JSObjViewer(global) {
    'use strict';

    var JSObjViewer = function (options) {
        return new JSObjViewer.init(options);
    };

    JSObjViewer.prototype = {
        count: 0,
        
        // dictionary list of parsed objects
        objectList: {},
        
        // JSObjViewer plugins
        plugins: {},
        
        // JSObjViewer config settings
        configSettings: {
            display: {
                levels: true
            }
        },
        
        // configure for JSObjViewer settings
        config: function (settings) {
            for (var attr in settings) {
                if (this.configSettings[attr]) {
                    this.configSettings[attr] = settings[attr];
                }
                else {
                    throw 'invalid setting name: ' + attr;
                }
            }
            return this;
        },
        
        // getters and setters for JSObjViewer properties
        setObj: function (newObj) {
            this.obj = newObj;
            return this;
        },
        
        getObj: function () {
            return this.obj;
        },

        // JSObjViewer's methods
        getParsedObject: function () {
            return this.objectList = this.parse(this.obj);
        },
        
        render: function () {
            // TODO: render
        },
        
        parse: function (obj) {
            if (!obj && typeof obj !== 'object') {
                return null;
            }
            
            var name = this.getObjectName(obj);
            var parsedObj = Object.create(null, {
                name: {
                    value: name
                },
                properties: {
                    value: []
                },
                inherit: {
                    value: null,
                    writable: true
                }
            });
            
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    parsedObj.properties.push(Object.create(null, {
                        name: {
                            value: attr
                        },
                        type: {
                            value: typeof obj[attr]
                        },
                        value: {
                            value: obj[attr]
                        }
                    }));
                }
            }
            
            if (obj.__proto__) {
                parsedObj.inherit = this.parse(obj.__proto__);
            }
            
            return parsedObj.inherit === null && parsedObj.properties.length === 0 ? null : parsedObj;
        },
        getObjectName: function (obj) {
            var stringified = obj.toString();
            stringified = stringified.substr('function '.length);
            stringified = stringified.substr(0, stringified.indexOf('('));
            return (stringified || obj.constructor.name)  + ' (' + (++this.count) + ')';
        }
    };

    // initialization method for JSObjViewer
    JSObjViewer.init = function (options) {
        var defaultOptions = {
            obj: {},
            config: {}
        };

        for (var attr in options) { 
            if (defaultOptions[attr]) {
                defaultOptions[attr] = options[attr];
            }
            else {
                throw 'invalid option name: ' + attr;
            }
        }

        var self = this;
        self.setObj(defaultOptions.obj)
            .config(defaultOptions.config);
        
        // initialize all plugins
        if (self.plugins) {
            for (var p in self.plugins) {
                self.plugins[p].init && typeof self.plugins[p].init === 'function' && self.plugins[p].init(); 
            }
        }
        
        return self;
    };
    
    JSObjViewer.plugins = {
        register: function (name, pluginObj) {
            if (typeof name !== 'string') {
                throw 'plugin name is invalid';
            }
            
            if (typeof pluginObj !== 'object') {
                throw 'invalid plugin';
            }
                
            JSObjViewer.prototype.plugins[name] = pluginObj;
        }
    };

    JSObjViewer.init.prototype = JSObjViewer.prototype;

    global.JSObjViewer = global.OV = JSObjViewer;

}(window));
