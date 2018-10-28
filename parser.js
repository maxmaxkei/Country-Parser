const fs = require('fs');

const sourceFolder = './source/';

const countryFilesEn = [];
const countryFilesRu = [];
const regionFilesEn = [];
const regionFilesRu = [];
const countries = [];
const regions = [];
const formatRegions = [];

fs.readdirSync(`${sourceFolder}regions_en/`).forEach(file => {
	regionFilesEn.push(file);
});

fs.readdirSync(`${sourceFolder}regions_ru/`).forEach(file => {
	regionFilesRu.push(file);
});

fs.readdirSync(`${sourceFolder}countries_en/`).forEach(file => {
	countryFilesEn.push(file);
});

fs.readdirSync(`${sourceFolder}countries_ru/`).forEach(file => {
	countryFilesRu.push(file);
});

countryFilesEn.forEach((file) => {
	const fileData = JSON.parse(fs.readFileSync(`${sourceFolder}countries_en/${file}`, 'utf8'));

	for (var i = 0; i < fileData.length; i++) {
    	let newCountry = {};

    	newCountry.code = {
			countryId: fileData[i].ids.geonames,
			countryIsoCode: fileData[i].ids.iso_3166_1[0]
    	};

    	newCountry.names = {
    		en: fileData[i].long.default
    	};

    	countries.push(newCountry);

    };
});

countryFilesRu.forEach((file) => {
	const fileData = JSON.parse(fs.readFileSync(`${sourceFolder}countries_ru/${file}`, 'utf8'));

	for (var i = 0; i < fileData.length; i++) {
    	countries.forEach((item) => {
			if(fileData[i].code == item.code.countryIsoCode) {
				item.names.ru = fileData[i].long.default;
			}
    	});
    };
});

regionFilesEn.forEach((file) => {
    const fileData = JSON.parse(fs.readFileSync(`${sourceFolder}regions_en/${file}`, 'utf8'));

    for (var i = 0; i < fileData.length; i++) {
    	let newRegion = {};

    	newRegion.country = fileData[i].parent;
    	newRegion.code = {
    		regionId: fileData[i].ids.geonames,
    		regionIsoCode: fileData[i].ids.iso_3166_2
    	};
    	newRegion.regionNames = {
			en: fileData[i].long.default
    	};

    	regions.push(newRegion);

    };
});

regionFilesRu.forEach((file) => {
    const fileData = JSON.parse(fs.readFileSync(`${sourceFolder}regions_ru/${file}`, 'utf8'));

    for (var i = 0; i < fileData.length; i++) {
    	regions.forEach((item) => {
			if(fileData[i].code == item.code.regionId || fileData[i].code == item.code.regionIsoCode) {
				item.regionNames.ru = fileData[i].long.default;
			}
    	});
    };
});

regions.forEach((item) => {
	let names = item.regionNames;

	if(!("ru" in names)) {
		item.regionNames.ru = item.regionNames.en;
	};
});

const obj = {};

for (var i = 0; i < regions.length; i++) {
    
    if(i == 0) {

        let region = {};

        obj.country = regions[i].country;
        obj.countryRegions = [];

        region.code = regions[i].code;
        region.names = regions[i].regionNames;
        obj.countryRegions.push(region);

    } else if(obj.country == regions[i].country) {

        let region = {};

        region.code = regions[i].code;
        region.names = regions[i].regionNames;
        obj.countryRegions.push(region);

    } else {

        formatRegions.push(obj);
        obj = {};
        let region = {};

        obj.country = regions[i].country;
        obj.countryRegions = [];

        region.code = regions[i].code;
        region.names = regions[i].regionNames;
        obj.countryRegions.push(region);
    }
}

fs.writeFile('output/regions.json', JSON.stringify(formatRegions), function(err) {
    if(err) {
        return console.log(err);
    }
	console.log("Файл сохранён.");
}); 

fs.writeFile('output/countries.json', JSON.stringify(countries), function(err) {
    if(err) {
        return console.log(err);
    }
	console.log("Файл сохранён.");
});