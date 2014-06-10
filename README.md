# TSP Route Verifier
__For the Travelling Salesman assignment, Data Structures & Algorithms, NUIM, Spring 2014__
[http://www.andrewhealy.com/tsp_checker/verifier.html](http://www.andrewhealy.com/tsp_checker/verifier.html) (live site)
##Why?
The old Java applet supplied by the lecturer would not work on many of the student's computers (or even the university computers, for security reasons). I thought it would be a fun little project to learn a little more Javascript while also creating something useful for my peers.

##The Project:
We were given the task of finding the shortest route visiting all the given towns only once and returning to the origin (specifically the [symmetric TSP](http://en.wikipedia.org/wiki/Travelling_salesman_problem#Asymmetric_and_symmetric)). The list of sample towns was supplied like so: _town number_ , _town name_ , _latitude_ , _longitude_ : `5,Athlone,53.433,-7.95` etc.

The verifier should take in the user's path as a string of numbers (1-80 inclusive as this was how the sample towns were numbered) separated by a dot. It doesn't matter if there is trailing white space (as each number is trimmed) or if the route does not join up (as this is done by the verifier if needed) but an error _will_ be produced by any non-integer character (including linebreaks) where a number is expected.

###Setup
I wanted to use Google Maps as a flexible method of visualising the routes. It was really helpful that the towns were supplied as Latitude/Longitude pairs (or LatLng objects in Google Maps parlance) for this purpose. I drew them as red circles which looks nice on the satellite image of Ireland.

![no route entered](http://37.media.tumblr.com/24b94fe6932ab573cf52a7bf7513ff69/tumblr_n4i7mbDeof1tsfl4xo1_1280.png "setup")

###Verification
If a supplied route meets the criteria stated above the background turns green and the total distance for the route is given (this distance is calculated using the [Haversine function](http://en.wikipedia.org/wiki/Haversine_formula) to allow for the curvature of the Earth). The route is drawn using the Google Maps [Polyline](https://developers.google.com/maps/documentation/javascript/reference#Polyline) object.

![valid route entered](http://31.media.tumblr.com/1a0fb5422e84313f54c151cdc2afe2f9/tumblr_n4i7mbDeof1tsfl4xo2_1280.png "valid")

If a supplied route is not valid however, the route is still drawn (or at least an attempt is made), the backround turns red and the user is informed of all the problems found with their route. Some of problems cound be:
* Town not visited
* Town visited more than once
* Supplied number outside the range 1-80
* Non-numeric character supplied between `.` characters

![invalid route dialog](http://www.andrewhealy.com/tsp_checker/smallscreenshot.png "invalid dialog")
![invalid route](http://www.andrewhealy.com/tsp_checker/bigscreenshot.png "invalid")  

##Wrap-up
The site was successful and was supplied to all students of the module as a more portable alternative to the "official" Java applet. Hopefully it will be used in years to come as this is an annual assignment for the module. If you are interested in _my_ approach to the TSP problem: [check this out](https://github.com/stubbedtoe/Travelling-Salesman--a-Genetic-Algorithm).