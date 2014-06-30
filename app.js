//TODO: redo this completely first with recursion if it ever needs to be extended

var parse = require('csv-parse'),
	fs = require('fs'),
	_ = require('underscore'),
	data,
	result = {};

data = fs.readFileSync('./data/np-gadm-adm4.csv').toString();



parse(data, {columns:true}, function(err, parsedData) {
	
	_.each(parsedData, function(obj) {
	
		var adms = [];

		var adm1, adm2, adm3, adm4, newAdm;

		// adms[0] = obj.NAME_1;
		// adms[1] = obj.NAME_2;
		// adms[2] = obj.NAME_3;
		// adms[4] = obj.NAME_4;

		adm1 = obj.NAME_1;
		adm2 = obj.NAME_2;
		adm3 = obj.NAME_3;
		adm4 = obj.NAME_4;

		//this gives a nice nested structure
		// result[adm1] = result[adm1] || {level:1, name:adm1, children:{}};
		// result[adm1].children[adm2] = result[adm1].children[adm2] || {level:2, name:adm2, children:{}, parent:adm1};
		// result[adm1].children[adm2].children[adm3] = result[adm1].children[adm2].children[adm3] || {level:3, name:adm3, children:{}, parent:adm2};
		// result[adm1].children[adm2].children[adm3].children[adm4] = result[adm1].children[adm2].children[adm3].children[adm4] || {level:4, name:adm4, parent:adm3};

		doIt('adm1', adm1);
		doIt('adm2',adm2,adm1);
		doIt('adm3',adm3,adm2);
		doIt('adm4',adm4,adm3);


	});
	fs.writeFileSync('./test.json', JSON.stringify(result));

});



function doIt(level, name, parent) {

		var currentValue = {level:level, name:name},
			newArr;
		if (parent) {
			currentValue.parent = parent;
		}

		result[level] = result[level] || {};

			//empty
		if (!result[level][name] && !Array.isArray(result[level][name])) {
			result[level][name] = _.clone(currentValue);
		}
		//already exists
		else if ( _.isEqual(result[level][name],currentValue) ) {
			//do nothing
		}
		//multiple
		else if (Array.isArray(result[level][name])) {
			result[level][name].push(currentValue);
		}
		else {
			newArr = [];
			newArr.push(result[level][name]); //add old value
			newArr.push(currentValue); //add new value
			result[level][name] = _.clone(newArr);
		}

}

//PID	ID_0	ISO	NAME_0	ID_1	NAME_1	ID_2	NAME_2	ID_3	NAME_3	ID_4	NAME_4	VARNAME_4	TYPE_4	ENGTYPE_4
