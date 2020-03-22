exports.getNumericIpRange = function(cidr) {
	const sizeReg = /.*\/(\d+)$/;
	var significantBits = parseInt(sizeReg.exec(cidr)[1]);

	// console.log("Significant bits - " + significantBits);
	var IpInteger = this.ipToDec(cidr);

	// block start
	let blockStart = IpInteger - IpInteger % Math.pow(2, 32 - significantBits);

	// block end
	let blockEnd = blockStart + Math.pow(2, 32 - significantBits) - 1

	let range = [blockStart, blockEnd, significantBits];
	// console.log("ip ranges", range[0], range[1])
	return range;
}

exports.getReadableIpRange = function(cidr) {
	let numericRange = this.getNumericIpRange(cidr);
	let range = [this.decToIp(numericRange[0]), this.decToIp(numericRange[1]), ...numericRange];
	// console.log("ip ranges", range[0], range[1])
	return range;
}

exports.ipToDec = function(ip) {
	var parts = ip.split(".");
	var num = 0;
	// parseInt will discard the block size
	for (var i = 0; i < 4; i++) {
		num += parseInt(parts[i]) * Math.pow(2, 8 * (3 - i));
	}
	return num;
}

exports.decToIp = function(dec) {
	var decoded = [];

	for (var i = 0; i < 4; i++) {
		decoded.push(dec % Math.pow(2, 8));
		dec = parseInt(dec / Math.pow(2, 8))
	}
	return decoded.reverse().join(".");
}

console.log(this.ipToDec("106.51.232.79"))