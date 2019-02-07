// Code goes here
var app = angular.module("myCashRegister", []); 
app.controller("myCtrl", function($scope) {
  
  $scope.output = [];
  $scope.fileContent = null;
  $scope.lineSeparator = "\n"
  
  //Selectable separator for different file definitions
  //useful for other currencies where "," is used between "dollars" and "cents"
  $scope.separator = ","
  $scope.separatorOpts = [",", ".", "|", ";"];
  
  //Could extend the denominations dictionary to include other names to denominations 
    //(or build other currency dictionaries)
  //Could create a <select> for currency (i.e. USD, FRF, EUR)
  //Then in the change functions, build using the appropriate currency names
  var denominations = [ //in cents
    {value: 10000, name: "hundreds", used: false}
    , {value: 5000, name: "fifties", used: false}
    , {value: 2000, name: "twenties", used: false}
    , {value: 1000, name: "tens", used: false}
    , {value: 500, name: "fives", used: false}
    , {value: 100, name: "ones", used: false}
    , {value: 25, name: "quarters", used: false}
    , {value: 10, name: "dimes", used: false}
    , {value: 5, name: "nickels", used: false}
    , {value: 1, name: "pennies", used: false}
  ];
  
  //Define Twist cases here
  //You could extend the twist cases by assigning new constants here 
    //and implementing the check for them in checkForTwist
    //and implementing the twist with a new "Change" function and adding it into convertChange  
  var divBy3 = 1;
  
  //Read file, call main function, set view from model return from main function: makeChange
  //takes: a file selected by the user
  //"returns": sets the model variable $scope.output 
  $scope.processFile = function($fileContent){
    var fileLines = $fileContent.split($scope.lineSeparator);
    $scope.fileContent = $fileContent;
    $scope.output = [];
    for (var i = 0; i < fileLines.length; i++){
      $scope.output.push(makeChange(fileLines[i]));
    }
  };
  
  //Main function
  //takes: a line of the file
  //returns: textual representation of the change for that line
  var makeChange = function(fileLine){
    var changeTotal = 0;
    var amts = fileLine.split($scope.separator);
    var specialCase = 0; //for determining "twist"
    if (amts.length > 1) {
      var a0 = Number(amts[0]);
      var a1 = Number(amts[1]);
      specialCase = checkForTwist(a0, a1)
      changeTotal = round(a1-a0);
      return convertChange(changeTotal, specialCase);
    }
  }
  
  //Function to test if there is a Twist/specialCase to take into account
  //takes: the total and payment of a line
  //returns: 0 or the specialCase (i.e. divBy3)
  var checkForTwist = function (total, payment){
    var spCase = 0;
    if ((total*100)%3 === 0){
      spCase = divBy3;
    }
    return spCase
  }
  
  //Rounding function to nearest 2 decimal places
  //takes: a number
  //returns: the number rounded to the nearest 2 decimal places
  var round = function(number){
    var result = Math.round(number*100)
    return result/100
  }
  
  //Function that calls the appropriate change function based on the specialCase
  //takes: changeTotal, and specialCase (i.e. divBy3)
  //returns: string representation of 
  var convertChange = function(changeTotal, specialCase){
    //check for specialCases
    switch (specialCase){
      case divBy3: //twist: divisible by three
        return randomChange(changeTotal);
      default:
        return normalChange(changeTotal);
    }
  }
  
  //Change function that gives "normal" change
  //takes: the total to give to the customer
  //returns: the textual representation of the change to give back
  var normalChange = function(total){
    var array = [];
    var change = total*100; //First multiply by 100 to let % work
    var check = 0;
    var rem = 0;
    
    for (var i = 0; i < denominations.length; i++){
      var value = denominations[i].value;
      rem = change%value;
      if ((rem > 0 && rem !==change) || value === 1){
        check = Math.floor(change/value);
        array.push(check + " " + denominations[i].name);
        change = change - (check*value);
      }
    }
    return array.join(",");
  }
  
  //Change function that randomizes the denominations to make change
  //takes: the total to give to the customer
  //returns: the textual representation of the randomized change to give back
  var randomChange = function (total){
    var array = [];
    var change = total*100; //First multiply by 100 to let % work
    var check = 0;
    var rem = 0;
    var value = 0;
    
    while (value != 1){//pennies is the end case
      var idx = Math.floor(Math.random() * denominations.length);
      if(!denominations[idx].used){
        denominations[idx].used = true;
        value = denominations[idx].value;
        rem = change%value;
        if ((rem > 0 && rem !==change) || value === 1){
          check = Math.floor(change/value);
          array.push([value, check + " " + denominations[idx].name]);
          change = change - (check*value);
        }
      }
    }
    //order array by value
    array.sort(function(a, b) {
      return b[0] - a[0];
    });
    //join the array[].str
    return array.map(e => e[1]).join(",");
  }
  
  
});

//angularjs 1.6 doesn't seem to have a native file reader via input tag (at least not a good one)
//So this directive is to convert the default <input type="file"> into something I can use
//this directive isn't mine; I found it here: http://jsfiddle.net/alexsuch/6aG4x/
app.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
