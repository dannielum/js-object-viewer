(function JSObjViewer(global) {

    var JSObjViewer = function (options) {
        return new JSObjViewer.init(options);
    };

    JSObjViewer.prototype = {
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
            return this.objectList = this.parse(this.obj, 'root');
        },
        
        render: function () {
            // TODO: render
        },
        
        parse: function (obj, name) {
            if (!obj && typeof obj !== 'object') {
                return null;
            }
            
            var parsedObj = {
                name: name,
                properties: [],
                inherit: null
            };
            
            for (var attr in obj) {
                var prop = parsedProp = {
                    name: null,
                    type: null,
                    value: null
                };
                if (obj.hasOwnProperty(attr)) {
                    prop.name = attr;
                    prop.value = obj[attr];
                    prop.type = typeof obj[attr];
                }
                parsedObj.properties.push(prop);
            }
            
            if (obj.__proto__) {
                parsedObj.inherit = this.parse(obj.__proto__, 'Child of ' + name);
            }
            
            return parsedObj;
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
