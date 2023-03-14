// Imports
const express = require('express');
const app = express();
// const parse_json = require('./utils/parse_json');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check route
app.get("/", (_, res) => {
	res.send("Welcome To Hell");
});

// Get dummy data
app.get("/dummy/:n/getInfo", (req, res) => {
	let n = req.params.n;
	if (!n || isNaN(n)) {
		res.status(400).send("invalid n");
	}
	fs.readFile(`db_${n}.json`, 'utf8', (err, data) => {
		if (err) {
			console.log("ERRORRRRR" + err);
			throw new Error('error reading file');
		}
		try {
			const json_data = JSON.parse(data);
			// console.log(json_data);
			res.json(json_data);

		} catch (error) {
			throw new Error('error sending file'); // <-- Throwing the error?!
		}
	});;
});


app.get("/dummy/:n/list", (req, res) => {
	let n = req.params.n;
	if (!n || isNaN(n)) {
		res.status(400).send("invalid n");
	}
	try {
		fs.readFile(`db_list_${n}.json`, 'utf8', (err, data) => {
			if (err) {
				console.log("ERRORRRRR" + err);
				throw new Error('error reading file');
			}
			try {
				const json_data = JSON.parse(data);
				// console.log(json_data);
				res.json(json_data);

			} catch (error) {
				throw new Error('error sending file');
			}
		});;
	} catch (error) {
		console.log("shit");
		res.status(500).send("shit");
	}
});

app.post("/dummy/:n/logAccess", (req, res) => {
	let n = req.params.n;
	if (!n || isNaN(n)) {
		res.status(400).send("invalid n");
	}

	console.log(req.body);

	const output_file = `db_${n}.json`;
	const data = fs.readFileSync(output_file);
	const jsonData = JSON.parse(data);

	const accessLogs = jsonData.accessLogs;

	accessLogs.push(req.body);

	const newData = JSON.stringify(jsonData);
	// console.log(newData);
	try {
		fs.writeFile(output_file, newData, (err) => {
			if (err) throw err;
			console.log('Data written to file');
		});
	} catch (error) {
		res.status(500).send("shit");
		console.log(error)
		return error;
	}
	res.status(200).send("Good Job");
});




app.post("/dummy/:n/updateNotes", (req, res) => {
	console.log(req.body);
	let n = req.params.n;
	if (!n || isNaN(n)) {
		res.status(400).send("invalid n");
	}

	// console.log(req.body.visitID);

	const output_file = `db_${n}.json`;
	const data = fs.readFileSync(output_file);
	const jsonData = JSON.parse(data);

	jsonData.notes = req.body;
	console.log(jsonData.notes);
	notes.push(req.body);
	console.log(req.body[0]);
	try {
		// jsonData.notes = req.body[0];
	} catch (error) {
		console.log("Please try and not do that");
		res.status(500).send("Dont fucking do that please");
		return error;
	}
	// console.log(jsonData.notes);
	// console.log(jsonData)
	const newData = JSON.stringify(jsonData);
	// // console.log(newData);
	try {
		fs.writeFile(output_file, newData, (err) => {
			if (err) throw err;
			console.log('Data written to file');
		});
	} catch (error) {
		res.status(500).send("shit");
		console.log(error)
		return error;
	}
	res.status(200).send("Good Job");
});

// Set up host to listen on provided port
let port = process.env.PORT;
if (port == null || !port) {
	port = 2023;
}
app.listen(port);
