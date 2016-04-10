var Ubicacion = (function() {
    //private
    var _lat;
    var _lon;
    var _actions = [];

    var cls = function(params) {
        this.constructor;
        var d = params || {};

        this.lat = d.lat || null;
        this.lon = d.lon || null;

        //private
        var _addAction = function(action) {
            _actions.push(action);
        };

        //public
        this.addAction = _addAction;

        if (d.success) {
            _addAction(d.success); //use private
            //this.addAction(d.success);    //use public
        }

        //public
        this.get = function() {
            return { "lat": _lat, "lon": _lon };
        };

        //private
        var _get = this.get;

        var save = function() {
            if (typeof(Storage) !== "undefined") {
                //localStorage.setItem("lat", _lat);
                //localStorage.setItem("lon", _lon);
                sessionStorage.setItem("lat", _lat);
                sessionStorage.setItem("lon", _lon);
            }
        };

        if (d.force) {
            //force reset stored data
            save();
        }

        var loadSaved = function() {
            if (typeof(Storage) !== "undefined") {
                //_lat = localStorage.getItem("lat");
                //_lon = localStorage.getItem("lon");
                _lat = sessionStorage.getItem("lat");
                _lon = sessionStorage.getItem("lon");
            }
        };

        if (!_lat) {
            loadSaved();
        }

        var onSuccess = function(position) {
            _lat = position.coords.latitude;
            _lon = position.coords.longitude;
            save();
            fireActions();
        };

        var ipLocation = function(error) {
            if (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.log("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("An unknown error occurred.");
                        break;
                }
            }
            console.log('using fallback location by ip');
            this.error = error;

            var callback = function(response) {
                console.log(response);
                var pos = response.loc.split(",");
                _lat = pos[0];
                _lon = pos[1];
                save();
                fireActions();
            };

            //just javascript
            function jsonp(url, callback) {
                var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
                window[callbackName] = function(data) {
                    delete window[callbackName];
                    document.body.removeChild(script);
                    callback(data);
                };

                var script = document.createElement('script');
                script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
                document.body.appendChild(script);
            }

            jsonp('http://ipinfo.io', callback);

            /*
            //the jquery way
            $.get("http://ipinfo.io", function(response) {
                var pos = response.pos.split(",");
                _lat = pos[0];
                _lon = pos[1];
                save();
                fireActions();
            }, "jsonp");
            */
        };

        //private
        var fireActions = function() {
            while (_actions.length > 0) {
                var e = _actions.pop();
                e(_get());
            }
        };

        if (!_lat) {
            if (navigator.geolocation) {
                console.log('init location');
                navigator.geolocation.getCurrentPosition(onSuccess, ipLocation);
            } else {
                console.log('location not supported, using ip');
                ipLocation();
            }
        }else{
            fireActions();
        }

        //private
        var _set = function(lt, lg) {
            this.lat = lt;
            this.lon = lg;
        };

    };

    cls.getData = function() {
        return { "lat": this.lat, "lon": this.lon };
    };
    cls.getImage = function() {
        return "http://maps.googleapis.com/maps/api/staticmap?center=" + _lat + "," + _lon + "&zoom=14&size=400x300&sensor=false";
    };
    cls.prototype = {
        //static functions

        //return image from latitude longitude
        image: function(lat, lon) {
            return "http://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=14&size=400x300&sensor=false";
        }
    };
    return cls;
})();