const fs = require('fs');

const csv = require('csvtojson');

const csvFilePath = './sample_blocks.csv';

const readStream = fs.createReadStream(csvFilePath);

const parse = require('./parse');

const writeFileName = "sample_blocks.json";

let count = 0;

fs.writeFile(writeFileName, '[\r\n', 'utf8', (err, data) => {
	if (err) {
		console.log(`Error creating file`, err)
	} else {
		csv()
			.fromStream(readStream)
			.subscribe((jsonObj) => {
				return new Promise((resolve, reject) => {
					// Async operation on the json

					count++;
					console.log("Computing line", count);
					// sample json obj
					// {
					// 	network: '1.0.216.0/22',
					// 	geoname_id: '1605651',
					// 	registered_country_geoname_id: '1605651',
					// 	represented_country_geoname_id: '',
					// 	is_anonymous_proxy: '0',
					// 	is_satellite_provider: '0',
					// 	postal_code: '',
					// 	latitude: '13.7442',
					// 	longitude: '100.4608',
					// 	accuracy_radius: '500'
					// }
					let range = parse.getReadableIpRange(jsonObj.network)

					// create desired object
					let toWrite = {
						_id: jsonObj.network,
						start: range[2],
						end: range[3],
						bits: range[4],
						geoname_id: jsonObj.geoname_id,
						postal_code: jsonObj.postal_code,
						latitude: jsonObj.latitude,
						longitude: jsonObj.longitude,
						accuracy: jsonObj.accuracy
					};

					fs.appendFile(writeFileName, JSON.stringify(toWrite) + ",\r\n", (err) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				})
			}, (err) => {
				console.log("error", err)
			}, (done) => {
				console.log("Done")
				fs.appendFileSync(writeFileName, "{}]");
			})
	}
});