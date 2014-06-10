var map;
var athlone = new google.maps.LatLng(53.42423836,-7.94311523); //this is the EXACT centre of Ireland!
var towns = new Array();
var userTowns;
var routeLine;
var attemps = 0;
var linesDrawn = false;

//called when google is ready
function initialize(){
	var mapOptions = {
		zoom: 7,
		center: athlone,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	//LoadFile();
	ajaxLoad();
}

function ajaxLoad(){
	$.ajax({
		"url": "alltowns.txt",
		"success": function(data, status, jqxhr){
			var arrLines = data.split("\n");//split at new line
			towns[0] = 0; //to mimic a 1-indexed array
			for (var i = 0; i < arrLines.length; i++) {
				town = arrLines[i].split(",");
				towns [i+1] = new google.maps.LatLng(parseFloat(town[2]),parseFloat(town[3]));
			}
			
			//for local tests comment out the above and uncomment line below 
			//towns=[0, athlone, new google.maps.LatLng(52.334,-6.458 ), new google.maps.LatLng(53.8, -9.533), new google.maps.LatLng(53.348,-6.26)];
			
			//draw circles

			for (var i = 1; i < towns.length; i++) {

				townCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
			      	strokeOpacity: 0.8,
			      	strokeWeight: 2,
			      	fillColor: '#FF0000',
			      	fillOpacity: 0.35,
			      	map: map,
			      	center: towns[i],
			      	radius: 2000
				});
				townCircle.setMap(map);
			}
		}
	});
}

function validatePath(until, problems){

	var visited = new Array(towns.length);
	visited [0] = true; //to keep the index matching the towns index

	//doesn't return to its origin - ALLOW & CORRECT THIS
	if(userTowns[0] != userTowns[userTowns.length-1]){
		userTowns.push(userTowns[0]);
	}

	//check all towns apart from the last
	for (var i = 0; i < userTowns.length-1; i++) {
		if(userTowns[i] < 1 || userTowns[i] >= towns.length){
			problems.push("number out of range: "+userTowns[i]);
			if(until === -1){
				until = i;
			}
		}else{
			if(visited[userTowns[i]]){
				problems.push("town "+userTowns[i]+" visited twice");
			}else{
				visited[userTowns[i]] = true; //mark as visited
			}
		}
	}

	//check last number range - this one is allowed to be visited twice
	if(userTowns[userTowns.length-1] < 1 || userTowns[userTowns.length-1] >= towns.length){

		//will already be marked as invalid and undrawable
		problems.push("number out of range: "+userTowns[userTown.length-1]);
		if(until === -1){
			until = i;
		}
	}

	//found unvisited town
	for (var i = 0; i < visited.length; i++) {
		if(!visited[i]){
			problems.push("town "+i+" not visited");
		}
	}
	//finished all checks
	drawPath(until, problems);


}

function submit(){

	//only reset if it has been drawn already
	if(attemps>0){
		reset();	
	}
	attemps++;

	//get path from text box and store as a string array
	var userNums = document.getElementById('pass').value.split("\.");

	//to allow paths ending a dot - remove last element
	if(userNums[userNums.length-1].length === 0){
		userNums.pop();
	}

	var problems = new Array(); //error messages for alert box
	var until = -1; //where (if) to stop drawing paths

	userTowns = new Array(); //array to store parsed numbers
	for(var i=0; i<userNums.length; i++){

		if(isNaN(parseInt(userNums[i].trim(),10) )){ //catch non-numbers, security

			problems.push("non-integer found at node "+(i+1));
			if(until === -1){
				until = i;
			}
		}else{
			userTowns[i]=parseInt(userNums[i].trim(),10);
		}
	}

	validatePath(until, problems);
}

function giveResult(valid, until, problems){

	var message = "";

	if(valid){
		$(".colorMe").css("background-color","#34cb3f");//green
		message += "valid route: "+calcDistance(until)+" km";
	}else{
		$(".colorMe").css("background-color","#f70834");//red
		alert(problems.join("\n"));
		message += "invalid route: "+calcDistance(until)+" km";
	}

	document.getElementById("myh1").innerHTML = '<a href="#" title="reset map" onclick="reset();">'+message+'</a>';

}

//only called on valid paths - returns total distance
function calcDistance(until){

	var dist = 0;
	for(var i=0; i<until-1; i++){
		var adding = distanceBetween(towns[userTowns[i]], towns[userTowns[i+1]]);
		dist += adding;
	}

	return dist;
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function distanceBetween(town1, town2){
	//haversine function using 6378.1km as the Earth's radius

	var fromLat = degreesToRadians(town1.lat());
	var fromLong = degreesToRadians(town1.lng());	
	var toLat = degreesToRadians(town2.lat());
	var toLong = degreesToRadians(town2.lng());	

	return (2 * 6371 * Math.asin(Math.sqrt(Math.pow(Math.sin((fromLat-toLat)/2.0),2)+(Math.cos(fromLat)*Math.cos(toLat)*Math.pow(Math.sin((toLong-fromLong)/2.0),2)))));
}

//clears old paths, mainly
function reset(){

	if(linesDrawn){ //but only if they were drawn in the first place
		routeLine.setVisible(false);
	}
	document.getElementById("myh1").innerHTML = "TSP route checker";
	$(".colorMe").css("background-color","#E0EFEF");//light blue

}

//draws path if possible
function drawPath(until, problems){

	if(until === -1){
		until = userTowns.length; //change back to the max
	}

	var route = new Array();
	for (var i = 0; i < until; i++) {
		route[i] = towns[userTowns[i]];
	}

	routeLine = new google.maps.Polyline({
		path: route,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeWeight: 2,
		visible: true
	});

	routeLine.setMap(map);
	linesDrawn = (until>0);
	giveResult((problems.length === 0), until, problems);

}

google.maps.event.addDomListener(window, 'load', initialize);