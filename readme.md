# Ubicacion

A Javascript Location helper class

This class keeps location on session storage so you don't need to call location service each time.

It also have a fallback function (less accurate) using ip location.

## Usage

Just create new variable

	var u = new Ubicacion();

And get the position. Uutput is {lat,lon} object

	var pos = u.get();
	console.log(pos);
 
Because location is async you can specify a success function

	var u = new Ubicacion({
			success: function(p) {
	        	console.log(p);
	        }
		});

Ubicacion uses sessionStorage, so if multiple times called it just ask for Location once per session. To force clean you can set force param to true
	
	var u = new Ubicacion({
			force: true
		});

## Other helper functions

getImage, returns image for a specific latitude, logitude.

	var image = Ubicacion.image(latitude, longitude);
	$('#my_div').html(image);
